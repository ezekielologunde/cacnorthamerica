import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { logToSheet } from "@/lib/sheetsWebhook";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/site";
import { currentOrNextConvention, activePricing, priceForCategory, type RegistrantCategory } from "@/lib/conventions";
import { encodeSummary, chunkForMetadata, fitsStripeMetadata, type RegistrationSummary } from "@/lib/checkoutSummary";
import { sealRegistrationToken } from "@/lib/registrationToken";
import { checkinCodesFor, checkinCodeSheetCell } from "@/lib/checkinCode";
import { recordCheckinPeople } from "@/lib/checkinStore";
import { zelleReferenceFor } from "@/lib/zelleReference";
import { sendRegistrationConfirmationEmail } from "@/lib/registrationEmail";
import { FORM_HEADER, HONEYPOT_FIELD, looksLikeSpam } from "@/lib/spam";
import { processingFeeLineItem, processingFeeMetadata } from "@/lib/processingFee";
import { adultSheetExtras, categoryForAge, EMAIL_RE, encodeMeals, parseMealsAndAllergies, parseYouthRegistration, youthSheetName, youthSheetRows } from "@/lib/youthRegistration";

type RegisterRequestBody = {
  registrationType: "individual" | "group";
  churchName: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  /** Required, one per registration (both modes). */
  dccZone: string;
  /** Individual mode also sends meals / noMeals / allergies per person
   *  (parsed by parseMealsAndAllergies); group mode's are ignored. */
  registrants: { firstName: string; lastName: string; category: RegistrantCategory }[];
  isComplimentary?: boolean;
  staffPasscode?: string;
  /** Absent means "card". Ignored when the total is $0. */
  paymentMethod?: PaymentMethod;
};

type PaymentMethod = "zelle" | "card";

const VALID_CATEGORIES: RegistrantCategory[] = ["adult", "young_adult", "child"];
const VALID_REGISTRATION_TYPES: RegisterRequestBody["registrationType"][] = ["individual", "group"];
const MAX_REGISTRANTS = 30;
const MAX_FIELD_LENGTH = 120;
/** Free Youth & Child confirmation emails per recipient address per day. */
const YOUTH_CONFIRM_MAX = 3;
const DAY_MS = 24 * 60 * 60 * 1000;
/** A per-address confirmation cap key: one allowance per address however it
 *  was padded or cased. */
const confirmCapKey = (prefix: string, email: string) => `${prefix}:${email.trim().toLowerCase()}`;
const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;
/** Sheet Status for a Zelle registration until staff mark it paid. */
const ZELLE_STATUS = "awaiting Zelle (unverified email)";

/** The body's paymentMethod ("card" when absent), or null if it is invalid. */
function parsePaymentMethod(body: unknown): PaymentMethod | null {
  const value = (body as Record<string, unknown>).paymentMethod;
  if (value === undefined) return "card";
  return value === "zelle" || value === "card" ? value : null;
}

// Zelle (either track, total > 0): no Stripe session and no processing fee,
// so the amount due is the subtotal. Like the free paths, the visitor goes
// straight to a confirmation page carrying a sealed token, here with
// pay: "zelle" and the registration's Zelle reference (lib/zelleReference.ts)
// so the page can show what to send and the memo to use. Nobody has proven
// they own contactEmail, the same risk as the free youth path, so the same
// per-address daily cap (own key) decides whether `emailed` is sealed.
// `logRows` writes the track's own sheet row(s) with the reference.
async function confirmByZelle(
  summary: RegistrationSummary,
  sealedRegistrants: RegistrationSummary["registrants"],
  logRows: (zelleRef: string) => void
): Promise<Response> {
  const emailed =
    !!process.env.RESEND_API_KEY &&
    rateLimit(confirmCapKey("zelle-confirm", summary.contactEmail), YOUTH_CONFIRM_MAX, DAY_MS);
  let zelleRef: string;
  let token: string;
  try {
    zelleRef = zelleReferenceFor(summary.ref);
    token = sealRegistrationToken({
      ...summary,
      registrants: sealedRegistrants,
      pay: "zelle",
      zelleRef,
      ...(emailed ? { emailed: true } : {}),
    });
  } catch {
    return NextResponse.json({ error: "Registration is temporarily unavailable" }, { status: 500 });
  }
  logRows(zelleRef);
  // Awaited, never throws, never fails the registration (as on the free paths).
  await recordCheckinPeople(summary, { paymentStatus: "awaiting_zelle", zelleRef });
  const checkoutUrl = `${SITE_URL}/events/cacna-${summary.year}/register/confirmation?t=${token}`;
  if (emailed) {
    // Awaited like the free youth path so the function cannot be suspended
    // mid-send. The helper never throws; a failed send is only logged.
    const sent = await sendRegistrationConfirmationEmail(summary, checkoutUrl, false, undefined, 0, { zelleRef });
    if (!sent) console.error(`[register] Zelle confirmation email failed for ref ${summary.ref}`);
  }
  return NextResponse.json({ checkoutUrl });
}

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
  // Same label and rule as the youth track's DCC / Zone.
  if (typeof b.dccZone !== "string" || b.dccZone.trim() === "") {
    return "DCC / Zone is required";
  }
  for (const value of [b.contactName, b.contactEmail, b.churchName ?? "", b.contactPhone ?? "", b.dccZone]) {
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
    // Everyone under 30 registers through the youth track, which derives the
    // fee category from their age on the server.
    if (r.category !== "adult") {
      return "This form is for adults 30 and over. Please register anyone under 30 through Youth & Child registration.";
    }
  }
  if (b.isComplimentary !== undefined && typeof b.isComplimentary !== "boolean") {
    return "isComplimentary must be a boolean";
  }
  if (parsePaymentMethod(b) === null) {
    return "paymentMethod must be 'zelle' or 'card'";
  }
  return null;
}

export async function POST(request: Request) {
  if (!rateLimit(clientIp(request.headers), 5, 60_000)) {
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

  const track = rawBody && typeof rawBody === "object" ? ((rawBody as Record<string, unknown>).track ?? "adult") : "adult";
  if (track !== "adult" && track !== "youth") {
    return NextResponse.json({ error: "track must be 'adult' or 'youth'" }, { status: 400 });
  }
  if (track === "youth") {
    return registerYouth(rawBody);
  }

  const validationError = validateRequestBody(rawBody);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  // The contact fields are trimmed once here, as the youth track's parser
  // does, so every writer below (cap key, sheet, check-in rows, Stripe,
  // email) sees the address the validator checked.
  const raw = rawBody as RegisterRequestBody;
  const body: RegisterRequestBody = {
    ...raw,
    contactName: raw.contactName.trim(),
    contactEmail: raw.contactEmail.trim(),
    churchName: typeof raw.churchName === "string" ? raw.churchName.trim() : null,
    contactPhone: (raw.contactPhone ?? "").trim(),
  };
  const dccZone = body.dccZone.trim();

  // Individual mode: each person's meals (an explicit choice) and allergy
  // notes, under the youth track's rule. Group mode is a names-only list, so
  // anything sent there is ignored and its rows leave Meals / Allergies blank.
  const extras: { m: number; l?: string }[] = [];
  if (body.registrationType === "individual") {
    for (const [i, registrant] of body.registrants.entries()) {
      const who = body.registrants.length > 1 ? `Person ${i + 1}` : "This person";
      const choice = parseMealsAndAllergies(registrant as unknown as Record<string, unknown>, who);
      if (!choice.ok) return NextResponse.json({ error: choice.error }, { status: 400 });
      extras.push({ m: encodeMeals(choice.meals), ...(choice.allergies ? { l: choice.allergies } : {}) });
    }
  }

  if (
    looksLikeSpam([
      body.contactName,
      body.contactEmail,
      body.churchName ?? "",
      body.contactPhone ?? "",
      dccZone,
      ...body.registrants.flatMap((r) => [r.firstName, r.lastName]),
      ...extras.map((e) => e.l ?? ""),
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
    registrants: pricedRegistrants.map((r, i) => ({ n: r.fullName, c: r.category, ...extras[i] })),
    totalAmountCents,
    isComplimentary,
    dcc: dccZone,
  };
  const encoded = encodeSummary(summary);

  // If every registrant is a child there's nothing for Stripe to charge --
  // log it now instead of waiting on a webhook, and send the visitor
  // straight to their confirmation (with each person's check-in code). The link carries
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
      // Allergy notes stay out of the token (it lives in the URL), as on
      // the youth track; the sheet row has them.
      token = sealRegistrationToken({ ...summary, registrants: summary.registrants.map((r) => ({ n: r.n, c: r.c, ...(r.m !== undefined ? { m: r.m } : {}) })) });
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
      ...adultSheetExtras(summary, cy.startIso),
      "Check-in Code": checkinCodeSheetCell(summary),
    });
    // Awaited so the serverless function cannot be suspended mid-write; the
    // helper never throws, and a failed write never fails the registration.
    await recordCheckinPeople(summary, { paymentStatus: "free" });
    const checkoutUrl = `${SITE_URL}/events/cacna-${cy.year}/register/confirmation?t=${token}`;
    return NextResponse.json({ checkoutUrl });
  }

  if (parsePaymentMethod(body) === "zelle") {
    return confirmByZelle(
      summary,
      summary.registrants.map((r) => ({ n: r.n, c: r.c, ...(r.m !== undefined ? { m: r.m } : {}) })),
      (zelleRef) => logToSheet(`Registration — CACNA ${cy.year}`, {
        "Registration Type": body.registrationType,
        "Church Name": body.churchName ?? "",
        "Contact Name": body.contactName,
        "Contact Email": body.contactEmail,
        "Contact Phone": body.contactPhone || "",
        "Registrants": summary.registrants.map((r) => `${r.n} (${r.c})`).join("; "),
        "Total": dollars(totalAmountCents),
        "Processing Fee": dollars(0),
        "Amount Charged": "",
        "Stripe Session": "",
        "Status": ZELLE_STATUS,
        ...adultSheetExtras(summary, cy.startIso),
        // New columns go before "Check-in Code" so it stays last.
        "Zelle Reference": zelleRef,
        "Check-in Code": checkinCodeSheetCell(summary),
      })
    );
  }

  // The full summary (meals and allergies included) rides in the session
  // metadata for the webhook's sheet row and email. Refuse up front if it
  // cannot fit rather than let Stripe reject the session (4 = kind,
  // convention_year, subtotal_cents, processing_fee_cents).
  if (!fitsStripeMetadata(encoded, 4)) {
    return NextResponse.json(
      { error: "This registration has too many details to process in one payment. Please split it into two smaller registrations." },
      { status: 400 }
    );
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
      line_items: [...payableRegistrants.map((r) => ({
        price_data: {
          currency: "usd",
          unit_amount: r.priceCents,
          product_data: { name: `CACNA ${cy.year} Convention registration — ${r.fullName} (${r.category})` },
        },
        quantity: 1,
      })), processingFeeLineItem(totalAmountCents)],
      customer_email: body.contactEmail,
      // Only the opaque session id travels in the URL; the confirmation page
      // reads the registration back from this session's own metadata.
      success_url: `${SITE_URL}/events/cacna-${cy.year}/register/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/events/cacna-${cy.year}/register`,
      metadata: {
        kind: "registration",
        convention_year: String(cy.year),
        ...chunkForMetadata("d", encoded),
        // totalAmountCents (and the summary) stay the subtotal; the fee is
        // its own line item and recorded separately here.
        ...processingFeeMetadata(totalAmountCents),
      },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

// Youth & Child track (everyone under 30). POST has already applied the rate
// limit, FORM_HEADER and honeypot guards. Each person's fee category comes
// from their age (lib/youthRegistration.ts), never from the client.
async function registerYouth(rawBody: unknown): Promise<Response> {
  const parsed = parseYouthRegistration(rawBody, { maxRegistrants: MAX_REGISTRANTS, maxFieldLength: MAX_FIELD_LENGTH });
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const complimentary = (rawBody as Record<string, unknown>).isComplimentary;
  if (complimentary !== undefined && typeof complimentary !== "boolean") {
    return NextResponse.json({ error: "isComplimentary must be a boolean" }, { status: 400 });
  }
  const paymentMethod = parsePaymentMethod(rawBody);
  if (paymentMethod === null) {
    return NextResponse.json({ error: "paymentMethod must be 'zelle' or 'card'" }, { status: 400 });
  }
  const input = parsed.value;

  if (
    looksLikeSpam([
      input.contactName,
      input.contactEmail,
      input.contactPhone,
      input.churchName,
      input.youthLeaderName,
      input.dccZone,
      ...input.registrants.flatMap((r) => [r.firstName, r.lastName, r.allergies]),
    ])
  ) {
    return NextResponse.json({ success: true });
  }

  // Same rule as the adult track: complimentary registration was removed.
  if (complimentary === true) {
    return NextResponse.json({ error: "Complimentary registration is not available" }, { status: 403 });
  }

  const cy = currentOrNextConvention();
  const tiers = activePricing(cy);
  if (tiers.length === 0) {
    return NextResponse.json({ error: "Registration is not open" }, { status: 409 });
  }

  const priced: { registrant: RegistrationSummary["registrants"][number]; priceCents: number }[] = [];
  for (const r of input.registrants) {
    const category = categoryForAge(r.age);
    const price = category === "child" ? 0 : priceForCategory(tiers, category);
    if (price === null) {
      return NextResponse.json({ error: `No active price for category ${category}` }, { status: 400 });
    }
    priced.push({
      registrant: {
        n: `${r.firstName} ${r.lastName}`,
        c: category,
        a: r.age,
        m: encodeMeals(r.meals),
        ...(r.allergies ? { l: r.allergies } : {}),
      },
      priceCents: price,
    });
  }

  const totalAmountCents = priced.reduce((sum, p) => sum + p.priceCents, 0);
  const summary: RegistrationSummary = {
    ref: crypto.randomUUID(),
    year: cy.year,
    registrationType: priced.length > 1 ? "group" : "individual",
    churchName: input.churchName,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone,
    registrants: priced.map((p) => p.registrant),
    totalAmountCents,
    isComplimentary: false,
    youth: { leader: input.youthLeaderName, dcc: input.dccZone, guardian: input.guardianConfirmed },
  };

  // Everyone 19 or under: free -- one sheet row per person, straight to the
  // confirmation page, and a confirmation email to contactEmail. Nobody has
  // proven they own that address, so this path could make the site mail
  // anyone: each address gets at most YOUTH_CONFIRM_MAX free confirmations a
  // day (per instance, lib/rateLimit.ts), spam-looking submissions returned
  // above before reaching here, and the email carries only the names, age
  // groups, meals, length-capped allergy notes (all escaped) and the
  // church's fixed text. The sheet rows stay marked unverified. The sealed
  // token leaves allergy notes out (it lives in the URL); the sheet rows and
  // email have them.
  if (totalAmountCents === 0) {
    // Checked before sealing so the confirmation page can say an email was
    // attempted. Without Resend configured, skip silently (and spend no
    // slot), like every other optional integration here.
    const emailed =
      !!process.env.RESEND_API_KEY &&
      rateLimit(confirmCapKey("youth-confirm", input.contactEmail), YOUTH_CONFIRM_MAX, DAY_MS);
    let token: string;
    try {
      token = sealRegistrationToken({
        ...summary,
        registrants: summary.registrants.map((r) => ({ n: r.n, c: r.c, a: r.a, m: r.m })),
        ...(emailed ? { emailed: true } : {}),
      });
    } catch {
      return NextResponse.json({ error: "Registration is temporarily unavailable" }, { status: 500 });
    }
    for (const row of youthSheetRows(summary, { stripeSession: "", status: "free (email unverified)", startIso: cy.startIso, checkinCodes: checkinCodesFor(summary) })) {
      logToSheet(youthSheetName(cy.year), row);
    }
    // Awaited, never throws, never fails the registration (as above).
    await recordCheckinPeople(summary, { paymentStatus: "free" });
    const confirmationUrl = `${SITE_URL}/events/cacna-${cy.year}/register/confirmation?t=${token}`;
    if (emailed) {
      // Awaited so the serverless function cannot be suspended before the
      // send finishes. The helper never throws, and a failed send never fails
      // the registration, which is already logged.
      const sent = await sendRegistrationConfirmationEmail(summary, confirmationUrl, true);
      if (!sent) console.error(`[register] youth confirmation email failed for ref ${summary.ref}`);
    }
    return NextResponse.json({ checkoutUrl: confirmationUrl });
  }

  if (paymentMethod === "zelle") {
    return confirmByZelle(
      summary,
      summary.registrants.map((r) => ({ n: r.n, c: r.c, a: r.a, m: r.m })),
      (zelleRef) => {
        for (const row of youthSheetRows(summary, {
          stripeSession: "",
          status: ZELLE_STATUS,
          startIso: cy.startIso,
          feeColumns: { "Processing Fee": dollars(0), "Amount Charged": "" },
          zelleReference: zelleRef,
          checkinCodes: checkinCodesFor(summary),
        })) {
          logToSheet(youthSheetName(cy.year), row);
        }
      }
    );
  }

  // The full summary (allergies included) rides in the session metadata for
  // the webhook's sheet rows and email. Refuse up front if it cannot fit
  // rather than let Stripe reject the session (4 = kind, convention_year,
  // subtotal_cents, processing_fee_cents).
  const encoded = encodeSummary(summary);
  if (!fitsStripeMetadata(encoded, 4)) {
    return NextResponse.json(
      { error: "This registration has too many details to process in one payment. Please split it into two smaller registrations." },
      { status: 400 }
    );
  }

  const stripe = getStripeClient();
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        ...priced
          .filter((p) => p.priceCents > 0)
          .map((p) => ({
            price_data: {
              currency: "usd",
              unit_amount: p.priceCents,
              product_data: { name: `CACNA ${cy.year} Convention registration — ${p.registrant.n} (${p.registrant.c})` },
            },
            quantity: 1,
          })),
        processingFeeLineItem(totalAmountCents),
      ],
      customer_email: input.contactEmail,
      success_url: `${SITE_URL}/events/cacna-${cy.year}/register/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/events/cacna-${cy.year}/register/youth`,
      metadata: {
        kind: "registration",
        convention_year: String(cy.year),
        ...chunkForMetadata("d", encoded),
        // Same split as the adult track: the summary keeps the subtotal and
        // the fee is its own line item, recorded here.
        ...processingFeeMetadata(totalAmountCents),
      },
    });
    return NextResponse.json({ checkoutUrl: session.url });
  } catch {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
