import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/site";
import { embeddedCheckoutEnabled } from "@/lib/stripeEmbed";
import { GIVING_CAMPAIGNS, purposeValuesBySlug, withPurpose } from "@/lib/giving";
import { emailLimitKey, isRecurring, validateGiftBasics, validateRecurringAmount, type GiftBasics } from "@/lib/givingRequest";
import { BANK_MAX_CENTS, feeLineItems, feeMetadataFor, type PaymentMethod } from "@/lib/processingFee";
import { FORM_HEADER } from "@/lib/spam";
import { TURNSTILE_ERROR, verifyTurnstile } from "@/lib/turnstile";
import {
  RECURRING_CONSENT_ERROR,
  RECURRING_KIND_ERROR,
  RECURRING_OFF_ERROR,
  recurringAllowedForKind,
  recurringCheckoutParams,
  recurringEnabled,
} from "@/lib/givingRecurring";

type CheckoutRequestBody = GiftBasics & {
  paymentMethod?: PaymentMethod;
  /** Recurring only: the donor ticked the authorization box. */
  recurringConsent?: boolean;
  turnstileToken?: string;
};

const HOUR_MS = 60 * 60 * 1000;

function validateRequestBody(body: unknown): string | null {
  // Recurring is off until GIVING_RECURRING_ENABLED is "true"; say so plainly
  // rather than with the generic "not available for this payment method".
  const asked = body && typeof body === "object" ? (body as { frequency?: unknown }).frequency : undefined;
  if (isRecurring(asked) && !recurringEnabled()) return RECURRING_OFF_ERROR;

  const basicsError = validateGiftBasics(body, GIVING_CAMPAIGNS.map((c) => c.slug), purposeValuesBySlug(), { allowRecurring: recurringEnabled() });
  if (basicsError) return basicsError;

  const b = body as CheckoutRequestBody;
  if (b.paymentMethod !== undefined && b.paymentMethod !== "card" && b.paymentMethod !== "bank") {
    return "Unknown payment method";
  }
  if (b.paymentMethod === "bank" && b.amountCents > BANK_MAX_CENTS) {
    return "Bank gifts are limited to $10,000. For a larger gift, please use Zelle or wire, or contact us.";
  }
  if (isRecurring(b.frequency)) {
    const campaign = GIVING_CAMPAIGNS.find((c) => c.slug === b.campaignSlug)!;
    if (!recurringAllowedForKind(campaign.kind)) return RECURRING_KIND_ERROR;
    const amountError = validateRecurringAmount(b.amountCents, b.paymentMethod === "bank" ? "bank" : "card", b.frequency);
    if (amountError) return amountError;
    if (b.recurringConsent !== true) return RECURRING_CONSENT_ERROR;
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
  const giftTitle = withPurpose(campaign.title, campaign, body.purpose);

  const method: PaymentMethod = body.paymentMethod === "bank" ? "bank" : "card";
  const stripe = getStripeClient();
  // Hosted page by default; embedded only when opted in (see lib/stripeEmbed.ts).
  const embedded = embeddedCheckoutEnabled();
  const returnUrl = `${SITE_URL}/giving/confirmation?session_id={CHECKOUT_SESSION_ID}`;

  // A recurring gift keeps charging with nobody present, so it gets the guards
  // the one-time path does not have: the site's own form header, Turnstile
  // (a missing or rejected token is refused), and a per-inbox limit.
  const recurring = isRecurring(body.frequency) ? body.frequency : null;
  if (recurring) {
    if (!request.headers.get(FORM_HEADER)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (!(await verifyTurnstile(body.turnstileToken, clientIp(request.headers)))) {
      return NextResponse.json({ error: TURNSTILE_ERROR }, { status: 400 });
    }
    if (!rateLimit(`giving-recurring:${emailLimitKey(body.contactEmail)}`, 5, HOUR_MS)) {
      return NextResponse.json({ error: "Too many attempts for this email. Please try again in an hour." }, { status: 429 });
    }
  }

  try {
    const session = await stripe.checkout.sessions.create(
      recurring
        ? recurringCheckoutParams({
            amountCents: body.amountCents,
            method,
            frequency: recurring,
            giftTitle,
            contactName: body.contactName,
            contactEmail: body.contactEmail,
            campaignSlug: campaign.slug,
            campaignTitle: giftTitle,
            embedded,
            returnUrl,
            cancelUrl: `${SITE_URL}/giving`,
          })
        : {
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
          product_data: { name: `Gift — ${giftTitle}` },
        },
        quantity: 1,
      // The gift line stays exactly the amount the donor chose; the fee is
      // a separate line after it.
      }, ...feeLineItems(body.amountCents, method)],
      customer_email: body.contactEmail.trim(),
      ...(embedded
        ? { ui_mode: "embedded_page" as const, return_url: returnUrl }
        : { success_url: returnUrl, cancel_url: `${SITE_URL}/giving` }),
      metadata: { kind: "giving", contact_name: body.contactName, campaign_slug: campaign.slug, campaign_title: giftTitle, ...feeMetadataFor(body.amountCents, method) },
    },
    );

    if (embedded && session.client_secret) {
      return NextResponse.json({ clientSecret: session.client_secret });
    }
    return NextResponse.json({ checkoutUrl: session.url });
  } catch {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
