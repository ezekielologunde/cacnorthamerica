import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { logToSheet } from "@/lib/sheetsWebhook";
import { rateLimit } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/site";
import { currentOrNextConvention, activePricing, priceForCategory, type RegistrantCategory } from "@/lib/conventions";
import { encodeSummary, chunkForMetadata, type RegistrationSummary } from "@/lib/checkoutSummary";
import { sealRegistrationToken } from "@/lib/registrationToken";
import { FORM_HEADER, HONEYPOT_FIELD, looksLikeSpam } from "@/lib/spam";

type RegisterRequestBody = {
  registrationType: "individual" | "group";
  churchName: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  registrants: { firstName: string; lastName: string; category: RegistrantCategory }[];
  isComplimentary?: boolean;
  staffPasscode?: string;
};

const VALID_CATEGORIES: RegistrantCategory[] = ["adult", "young_adult", "child"];
const VALID_REGISTRATION_TYPES: RegisterRequestBody["registrationType"][] = ["individual", "group"];
const MAX_REGISTRANTS = 30;
const MAX_FIELD_LENGTH = 120;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Plain, explicit checks rather than a schema library -- matches
// app/api/contact/route.ts's existing hand-rolled validation style.
function validateRequestBody(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return "Request body must be a JSON object";
  }

  const b = body as Partial<RegisterRequestBody>;

  if (typeof b.registrationType !== "string" || !VALID_REGISTRATION_TYPES.includes(b.registrationType)) {
    return "registrationType must be 'individual' or 'group'";
  }
  if (typeof b.contactName !== "string" || b.contactName.trim() === "") {
    return "contactName is required";
  }
  if (typeof b.contactEmail !== "string" || b.contactEmail.trim() === "") {
    return "contactEmail is required";
  }
  if (!EMAIL_RE.test(b.contactEmail.trim())) {
    return "Please enter a valid email address";
  }
  if (b.churchName != null && typeof b.churchName !== "string") {
    return "churchName must be a string";
  }
  if (b.contactPhone != null && typeof b.contactPhone !== "string") {
    return "contactPhone must be a string";
  }
  for (const value of [b.contactName, b.contactEmail, b.churchName ?? "", b.contactPhone ?? ""]) {
    if (value.length > MAX_FIELD_LENGTH) {
      return `Each field must be ${MAX_FIELD_LENGTH} characters or fewer`;
    }
  }
  if (!Array.isArray(b.registrants) || b.registrants.length === 0) {
    return "registrants must be a non-empty array";
  }
  if (b.registrants.length > MAX_REGISTRANTS) {
    return `A registration can include at most ${MAX_REGISTRANTS} people. Please split larger groups into separate registrations.`;
  }
  for (const registrant of b.registrants) {
    if (!registrant || typeof registrant !== "object") {
      return "Each registrant must be an object";
    }
    const r = registrant as Partial<{ firstName: string; lastName: string; category: RegistrantCategory }>;
    if (typeof r.firstName !== "string" || r.firstName.trim() === "") {
      return "Each registrant must have a first name";
    }
    if (typeof r.lastName !== "string" || r.lastName.trim() === "") {
      return "Each registrant must have a last name (surname)";
    }
    if (r.firstName.length > MAX_FIELD_LENGTH || r.lastName.length > MAX_FIELD_LENGTH) {
      return `Each name must be ${MAX_FIELD_LENGTH} characters or fewer`;
    }
    if (typeof r.category !== "string" || !VALID_CATEGORIES.includes(r.category as RegistrantCategory)) {
      return `Invalid registrant category: ${String(r.category)}`;
    }
  }
  if (b.isComplimentary !== undefined && typeof b.isComplimentary !== "boolean") {
    return "isComplimentary must be a boolean";
  }
  return null;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Same bot guards as app/api/contact: a direct API post that skips our own
  // form code (no FORM_HEADER), a filled honeypot, or a link-stuffed
  // submission gets a normal-looking success and is never logged or priced.
  if (!request.headers.get(FORM_HEADER)) {
    return NextResponse.json({ success: true });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const honeypot = rawBody && typeof rawBody === "object" ? (rawBody as Record<string, unknown>)[HONEYPOT_FIELD] : undefined;
  if (typeof honeypot === "string" && honeypot !== "") {
    return NextResponse.json({ success: true });
  }

  const validationError = validateRequestBody(rawBody);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const body = rawBody as RegisterRequestBody;

  if (
    looksLikeSpam([
      body.contactName,
      body.contactEmail,
      body.churchName ?? "",
      body.contactPhone ?? "",
      ...body.registrants.flatMap((r) => [r.firstName, r.lastName]),
    ])
  ) {
    return NextResponse.json({ success: true });
  }
  const isComplimentary = body.isComplimentary === true;

  // Complimentary (zero-price) registrations were removed. Reject any request
  // that still asks for one rather than quietly pricing it as a normal booking.
  if (isComplimentary) {
    return NextResponse.json({ error: "Complimentary registration is not available" }, { status: 403 });
  }

  const cy = currentOrNextConvention();
  const tiers = activePricing(cy);

  if (!isComplimentary && tiers.length === 0) {
    return NextResponse.json({ error: "Registration is not open" }, { status: 409 });
  }

  // Re-price every registrant from the server-side tiers looked up above --
  // any price the client sent is read nowhere below and is discarded
  // entirely. Child is always free per the fixed business rule, and a
  // Complimentary submission zeroes every registrant regardless of
  // category, so neither ever goes through the tier lookup -- the
  // Complimentary tab still works even when a category has no active tier
  // configured yet (e.g. a staff member testing the flow before pricing
  // goes live).
  const pricedRegistrants: { fullName: string; category: RegistrantCategory; priceCents: number }[] = [];
  for (const registrant of body.registrants) {
    const fullName = `${registrant.firstName.trim()} ${registrant.lastName.trim()}`;
    if (isComplimentary || registrant.category === "child") {
      pricedRegistrants.push({ fullName, category: registrant.category, priceCents: 0 });
      continue;
    }
    const price = priceForCategory(tiers, registrant.category);
    if (price === null) {
      return NextResponse.json({ error: `No active price for category ${registrant.category}` }, { status: 400 });
    }
    pricedRegistrants.push({ fullName, category: registrant.category, priceCents: price });
  }

  const totalAmountCents = pricedRegistrants.reduce((sum, r) => sum + r.priceCents, 0);
  const ref = crypto.randomUUID();

  const summary: RegistrationSummary = {
    ref,
    year: cy.year,
    registrationType: body.registrationType,
    churchName: body.churchName ?? null,
    contactName: body.contactName,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone || "",
    registrants: pricedRegistrants.map((r) => ({ n: r.fullName, c: r.category })),
    totalAmountCents,
    isComplimentary,
  };
  const encoded = encodeSummary(summary);

  // If every registrant is a child there's nothing for Stripe to charge --
  // log it now instead of waiting on a webhook, and send the visitor
  // straight to their confirmation (with its check-in QR). The link carries
  // a server-sealed token (lib/registrationToken.ts), never the readable
  // summary, and the page re-verifies it.
  //
  // No email is sent on this path: nobody has proven they own contactEmail,
  // so emailing it would let anyone send church-branded mail to any address
  // for free. The confirmation page itself is the receipt, and the sheet row
  // is marked unverified so staff know the email was never confirmed.
  if (totalAmountCents === 0) {
    let token: string;
    try {
      token = sealRegistrationToken(summary);
    } catch {
      return NextResponse.json({ error: "Registration is temporarily unavailable" }, { status: 500 });
    }
    logToSheet(`Registration — CACNA ${cy.year}`, {
      "Registration Type": body.registrationType,
      "Church Name": body.churchName ?? "",
      "Contact Name": body.contactName,
      "Contact Email": body.contactEmail,
      "Contact Phone": body.contactPhone || "",
      "Registrants": summary.registrants.map((r) => `${r.n} (${r.c})`).join("; "),
      "Total": "$0.00",
      "Stripe Session": "",
      "Status": "free (email unverified)",
    });
    const checkoutUrl = `${SITE_URL}/events/cacna-${cy.year}/register/confirmation?t=${token}`;
    return NextResponse.json({ checkoutUrl });
  }

  const stripe = getStripeClient();
  // $0 line items (free child registrants mixed in with paid ones) aren't
  // sent to Stripe -- their names/categories travel in the encoded summary
  // instead, since they'd otherwise vanish once Stripe becomes the source
  // of truth for this registration.
  const payableRegistrants = pricedRegistrants.filter((r) => r.priceCents > 0);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: payableRegistrants.map((r) => ({
        price_data: {
          currency: "usd",
          unit_amount: r.priceCents,
          product_data: { name: `CACNA ${cy.year} Convention registration — ${r.fullName} (${r.category})` },
        },
        quantity: 1,
      })),
      customer_email: body.contactEmail,
      // Only the opaque session id travels in the URL; the confirmation page
      // reads the registration back from this session's own metadata.
      success_url: `${SITE_URL}/events/cacna-${cy.year}/register/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/events/cacna-${cy.year}/register`,
      metadata: {
        kind: "registration",
        convention_year: String(cy.year),
        ...chunkForMetadata("d", encoded),
      },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
