import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { logToSheet } from "@/lib/sheetsWebhook";
import { rateLimit } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/site";
import { currentOrNextConvention, activePricing, priceForCategory, type RegistrantCategory } from "@/lib/conventions";
import { encodeSummary, chunkForMetadata, type RegistrationSummary } from "@/lib/checkoutSummary";
import { sendRegistrationConfirmationEmail } from "@/lib/registrationEmail";

type RegisterRequestBody = {
  registrationType: "individual" | "group";
  churchName: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  registrants: { fullName: string; category: RegistrantCategory }[];
  isComplimentary?: boolean;
  staffPasscode?: string;
};

const VALID_CATEGORIES: RegistrantCategory[] = ["adult", "young_adult", "child"];
const VALID_REGISTRATION_TYPES: RegisterRequestBody["registrationType"][] = ["individual", "group"];

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
  if (!Array.isArray(b.registrants) || b.registrants.length === 0) {
    return "registrants must be a non-empty array";
  }
  for (const registrant of b.registrants) {
    if (!registrant || typeof registrant !== "object") {
      return "Each registrant must be an object";
    }
    const r = registrant as Partial<{ fullName: string; category: RegistrantCategory }>;
    if (typeof r.fullName !== "string" || r.fullName.trim() === "") {
      return "Each registrant must have a non-empty fullName";
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

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validationError = validateRequestBody(rawBody);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const body = rawBody as RegisterRequestBody;
  const isComplimentary = body.isComplimentary === true;

  // The Complimentary tab (RegisterForm's third tab) is staff/comp-only --
  // unlike Individual/Group, it isn't meant to be publicly self-selectable,
  // so it's gated behind a shared passcode staff enter into the form rather
  // than being reachable by anyone who inspects the request body. An unset
  // STAFF_PASSCODE disables the tab entirely rather than silently accepting
  // any value.
  if (isComplimentary) {
    const staffPasscode = process.env.STAFF_PASSCODE;
    if (!staffPasscode || body.staffPasscode !== staffPasscode) {
      return NextResponse.json({ error: "Invalid staff passcode" }, { status: 403 });
    }
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
    if (isComplimentary || registrant.category === "child") {
      pricedRegistrants.push({ fullName: registrant.fullName, category: registrant.category, priceCents: 0 });
      continue;
    }
    const price = priceForCategory(tiers, registrant.category);
    if (price === null) {
      return NextResponse.json({ error: `No active price for category ${registrant.category}` }, { status: 400 });
    }
    pricedRegistrants.push({ fullName: registrant.fullName, category: registrant.category, priceCents: price });
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

  // If every registrant is free (a child-only registration, or the whole
  // submission is Complimentary), there's nothing for Stripe to charge and
  // no async payment step whose outcome is still pending -- log it now
  // instead of waiting on a webhook, and send the visitor straight to their
  // confirmation (with its check-in QR).
  if (totalAmountCents === 0) {
    logToSheet(`Registration — CACNA ${cy.year}`, {
      "Registration Type": body.registrationType,
      "Church Name": body.churchName ?? "",
      "Contact Name": body.contactName,
      "Contact Email": body.contactEmail,
      "Contact Phone": body.contactPhone || "",
      "Registrants": summary.registrants.map((r) => `${r.n} (${r.c})`).join("; "),
      "Total": "$0.00",
      "Stripe Session": "",
      "Status": isComplimentary ? "complimentary" : "paid",
    });
    const checkoutUrl = `${SITE_URL}/events/cacna-${cy.year}/register/confirmation?status=free&d=${encoded}`;
    await sendRegistrationConfirmationEmail(summary, checkoutUrl, true);
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
      success_url: `${SITE_URL}/events/cacna-${cy.year}/register/confirmation?session_id={CHECKOUT_SESSION_ID}&d=${encoded}`,
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
