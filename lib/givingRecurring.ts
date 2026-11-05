import type Stripe from "stripe";
import { RECURRING_INTERVALS, type RecurringFrequency } from "@/lib/givingRequest";
import { recurringFeeLineItems, recurringFeeMetadataFor, type PaymentMethod } from "@/lib/processingFee";
import type { GivingKind } from "@/lib/giving";

// Recurring gifts at checkout: the switch, who may use it, and the Stripe
// Checkout Session a monthly or every-2-weeks gift is created with. Pure, so
// scripts/check-giving-recurring-checkout.mjs can run it without Stripe.

/** Server-only switch. Recurring gifts stay off until this is "true", so the
 *  code can ship and be tested in Stripe test mode before any donor sees it. */
export function recurringEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.GIVING_RECURRING_ENABLED === "true";
}

/** Recurring is for the tithe and for projects (fundraising). A general
 *  offering, thanksgiving included, is given as the donor is led, not on a schedule. */
export function recurringAllowedForKind(kind: GivingKind): boolean {
  return kind === "tithe" || kind === "project";
}

export const RECURRING_KIND_ERROR = "Recurring gifts are available for the tithe and for projects.";
export const RECURRING_CONSENT_ERROR = "Please tick the box to authorize the recurring gift.";
export const RECURRING_OFF_ERROR = "Recurring gifts are not available yet.";

/** "every month" / "every 2 weeks", for sentences. */
export function cadencePhrase(frequency: RecurringFrequency): string {
  return frequency === "monthly" ? "every month" : "every 2 weeks";
}

export type RecurringCheckoutInput = {
  amountCents: number;
  method: PaymentMethod;
  frequency: RecurringFrequency;
  /** The gift's name as it should appear on the invoice and receipts. */
  giftTitle: string;
  contactName: string;
  contactEmail: string;
  campaignSlug: string;
  campaignTitle: string;
  embedded: boolean;
  returnUrl: string;
  cancelUrl: string;
};

/** The Checkout Session for a recurring gift. Three things matter here:
 *  - the gift line is exactly what the donor chose and repeats; the processing
 *    fee is a second repeating line (the donor pays it every cycle), and a bank
 *    gift adds a one-time setup line on the first invoice only;
 *  - Stripe does not copy session metadata onto the subscription, so the
 *    metadata the webhook reads (kind, campaign, the fee split) goes in
 *    subscription_data as well;
 *  - the method is pinned so the fee matches what the donor actually uses. */
export function recurringCheckoutParams(input: RecurringCheckoutInput): Stripe.Checkout.SessionCreateParams {
  const interval = RECURRING_INTERVALS[input.frequency];
  const metadata = {
    kind: "giving",
    contact_name: input.contactName,
    campaign_slug: input.campaignSlug,
    campaign_title: input.campaignTitle,
    ...recurringFeeMetadataFor(input.amountCents, input.method, input.frequency),
  };
  return {
    mode: "subscription",
    payment_method_types: [input.method === "bank" ? "us_bank_account" : "card"],
    // Instant bank login only: the bank fee is sized for it, and a manual
    // account entry would leave the gift waiting on micro-deposits.
    ...(input.method === "bank" ? { payment_method_options: { us_bank_account: { verification_method: "instant" as const } } } : {}),
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: input.amountCents,
          product_data: { name: `Gift — ${input.giftTitle}` },
          recurring: interval,
        },
        quantity: 1,
      },
      ...recurringFeeLineItems(input.amountCents, input.method, interval),
    ],
    customer_email: input.contactEmail.trim(),
    ...(input.embedded
      ? { ui_mode: "embedded_page" as const, return_url: input.returnUrl }
      : { success_url: input.returnUrl, cancel_url: input.cancelUrl }),
    metadata,
    subscription_data: { metadata },
  };
}

/** The gift/fee split of a subscription Checkout Session's first invoice. The
 *  session total includes a bank gift's one-time setup fee, so the gift comes
 *  from the metadata and everything else counts as fees. */
export function splitRecurringCheckout(
  amountTotalCents: number,
  metadata: Record<string, string | null | undefined> | null | undefined,
): { subtotalCents: number; processingFeeCents: number; totalCents: number } {
  const raw = metadata?.subtotal_cents ?? "";
  const gift = /^\d+$/.test(raw) ? Number(raw) : 0;
  const subtotal = gift > 0 && gift <= amountTotalCents ? gift : amountTotalCents;
  return { subtotalCents: subtotal, processingFeeCents: amountTotalCents - subtotal, totalCents: amountTotalCents };
}
