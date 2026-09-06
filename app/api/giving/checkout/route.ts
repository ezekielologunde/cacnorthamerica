import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { rateLimit } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/site";
import { GIVING_CAMPAIGNS } from "@/lib/giving";

const MIN_CENTS = 100; // $1
const MAX_CENTS = 5_000_000; // $50,000 -- generous ceiling against a typo/abuse, not a real donation cap

type CheckoutRequestBody = {
  contactName: string;
  contactEmail: string;
  campaignSlug: string;
  amountCents: number;
};

function validateRequestBody(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return "Request body must be a JSON object";
  }
  const b = body as Partial<CheckoutRequestBody>;

  if (typeof b.contactName !== "string" || b.contactName.trim() === "") {
    return "contactName is required";
  }
  if (typeof b.contactEmail !== "string" || b.contactEmail.trim() === "") {
    return "contactEmail is required";
  }
  if (typeof b.campaignSlug !== "string" || !GIVING_CAMPAIGNS.some((c) => c.slug === b.campaignSlug)) {
    return "Unknown campaign";
  }
  if (typeof b.amountCents !== "number" || !Number.isInteger(b.amountCents) || b.amountCents < MIN_CENTS || b.amountCents > MAX_CENTS) {
    return `amountCents must be an integer between ${MIN_CENTS} and ${MAX_CENTS}`;
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

  const body = rawBody as CheckoutRequestBody;
  const campaign = GIVING_CAMPAIGNS.find((c) => c.slug === body.campaignSlug)!;

  const stripe = getStripeClient();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: body.amountCents,
          product_data: { name: `Gift — ${campaign.title}` },
        },
        quantity: 1,
      }],
      customer_email: body.contactEmail,
      success_url: `${SITE_URL}/giving/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/giving`,
      metadata: { kind: "giving", contact_name: body.contactName, campaign_slug: campaign.slug, campaign_title: campaign.title },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
