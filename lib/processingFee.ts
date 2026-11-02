// Card processing fee passed on to the payer as its own, disclosed line item
// on every Stripe Checkout the site creates (registration, store, giving).
//
// The fee grosses the charge up so that, after Stripe's standard US card fee
// is taken out of the total, what is left equals the subtotal:
//   total = ceil((subtotal + FIXED) / (1 - RATE)),  fee = total - subtotal.
// Rounding up means the church never nets less than the subtotal.
//
// The server computes the amount it charges; a form may call the same
// function to show an estimate, but the client never dictates the amount.

/** Stripe's standard US card percentage fee (2.9%). */
export const STRIPE_PERCENT_FEE = 0.029;
/** Stripe's standard US card fixed fee per charge, in cents (30¢). */
export const STRIPE_FIXED_FEE_CENTS = 30;

/** Name of the fee's Stripe line item, also used on every breakdown. */
export const PROCESSING_FEE_LABEL = "Processing fee";

/** The processing fee, in whole cents, for a subtotal in cents. A subtotal of
 *  zero or less (free registrations) has no fee. */
export function feeCents(subtotalCents: number): number {
  if (!Number.isFinite(subtotalCents) || subtotalCents <= 0) return 0;
  const total = Math.ceil((subtotalCents + STRIPE_FIXED_FEE_CENTS) / (1 - STRIPE_PERCENT_FEE));
  return total - subtotalCents;
}

/** The fee as a Checkout Session line item, added after the real lines. */
export function processingFeeLineItem(subtotalCents: number) {
  return {
    price_data: {
      currency: "usd",
      unit_amount: feeCents(subtotalCents),
      product_data: { name: PROCESSING_FEE_LABEL },
    },
    quantity: 1,
  };
}

/** Session metadata recording the split, written at checkout creation. */
export function processingFeeMetadata(subtotalCents: number): { subtotal_cents: string; processing_fee_cents: string } {
  return { subtotal_cents: String(subtotalCents), processing_fee_cents: String(feeCents(subtotalCents)) };
}

/** Splits a completed session's amount_total back into subtotal and fee using
 *  the processing_fee_cents metadata written at checkout. Sessions created
 *  before the fee existed (no metadata) read as all subtotal, no fee. */
export function splitCheckoutAmount(
  amountTotalCents: number,
  metadata: Record<string, string | null | undefined> | null | undefined
): { subtotalCents: number; processingFeeCents: number; totalCents: number } {
  const raw = Number(metadata?.processing_fee_cents);
  const fee = Number.isInteger(raw) && raw > 0 && raw <= amountTotalCents ? raw : 0;
  return { subtotalCents: amountTotalCents - fee, processingFeeCents: fee, totalCents: amountTotalCents };
}

/** True for the fee's own line item, so item lists can show it separately. */
export function isProcessingFeeLine(description: string | null | undefined): boolean {
  return description === PROCESSING_FEE_LABEL;
}
