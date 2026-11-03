import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/site";
import { GIVING_CAMPAIGNS } from "@/lib/giving";
import { BANK_MAX_CENTS, feeLineItems, feeMetadataFor, type PaymentMethod } from "@/lib/processingFee";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MIN_CENTS = 100; // $1
const MAX_CENTS = 5_000_000; // $50,000 -- generous ceiling against a typo/abuse, not a real donation cap

type CheckoutRequestBody = {
  contactName: string;
  contactEmail: string;
  campaignSlug: string;
  amountCents: number;
  paymentMethod?: PaymentMethod;
};

function validateRequestBody(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return "Request body must be a JSON object";
  }
  const b = body as Partial<CheckoutRequestBody>;

  if (typeof b.contactName !== "string" || b.contactName.trim() === "") {
    return "contactName is required";
  }
  if (b.contactName.length > MAX_FIELD_LENGTH) {
    return `contactName must be ${MAX_FIELD_LENGTH} characters or fewer`;
  }
  if (typeof b.contactEmail !== "string" || b.contactEmail.trim() === "") {
    return "contactEmail is required";
  }
  if (b.contactEmail.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(b.contactEmail.trim())) {
    return "Please enter a valid email address";
  }
  if (typeof b.campaignSlug !== "string" || !GIVING_CAMPAIGNS.some((c) => c.slug === b.campaignSlug)) {
    return "Unknown campaign";
  }
  if (typeof b.amountCents !== "number" || !Number.isInteger(b.amountCents) || b.amountCents < MIN_CENTS || b.amountCents > MAX_CENTS) {
    return `amountCents must be an integer between ${MIN_CENTS} and ${MAX_CENTS}`;
  }
  if (b.paymentMethod !== undefined && b.paymentMethod !== "card" && b.paymentMethod !== "bank") {
    return "Unknown payment method";
  }
  if (b.paymentMethod === "bank" && b.amountCents > BANK_MAX_CENTS) {
    return "Bank gifts are limited to $10,000. For a larger gift, please use Zelle or wire, or contact us.";
  }
  return null;
}

export async function POST(request: Request) {
  if (!rateLimit(clientIp(request.headers), 5, 60_000)) {
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

  const body = rawBody as CheckoutRequestBody;
  const campaign = GIVING_CAMPAIGNS.find((c) => c.slug === body.campaignSlug)!;

  const method: PaymentMethod = body.paymentMethod === "bank" ? "bank" : "card";
  const stripe = getStripeClient();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Pinned to the chosen method so the fee below always matches what the
      // payer actually uses.
      payment_method_types: [method === "bank" ? "us_bank_account" : "card"],
      // Instant bank login only: the bank fee is sized for it, and a manual
      // account entry would leave the gift waiting on micro-deposits.
      ...(method === "bank"
        ? { payment_method_options: { us_bank_account: { verification_method: "instant" as const } } }
        : {}),
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: body.amountCents,
          product_data: { name: `Gift — ${campaign.title}` },
        },
        quantity: 1,
      // The gift line stays exactly the amount the donor chose; the fee is
      // a separate line after it.
      }, ...feeLineItems(body.amountCents, method)],
      customer_email: body.contactEmail.trim(),
      success_url: `${SITE_URL}/giving/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/giving`,
      metadata: { kind: "giving", contact_name: body.contactName, campaign_slug: campaign.slug, campaign_title: campaign.title, ...feeMetadataFor(body.amountCents, method) },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
