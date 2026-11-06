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

/** How a payer pays: the card path (fee above) or a US bank debit (ACH). */
export type PaymentMethod = "card" | "bank";

/** Stripe's US bank debit (ACH) pricing: 0.8% of the charge, capped at $5. */
export const BANK_PERCENT_FEE = 0.008;
export const BANK_FEE_CAP_CENTS = 500;
/** Stripe also bills $1.50 for each successful instant bank verification. */
export const BANK_VERIFICATION_FEE_CENTS = 150;
/** Largest gift taken by bank debit ($10,000). A consumer can dispute an ACH
 *  debit for up to 60 days, so a very large gift goes by Zelle or wire. */
export const BANK_MAX_CENTS = 1_000_000;

/** The processing fee, in whole cents, charged on top of a bank-debit gift.
 *  Card gifts pass their full cost on (feeCents above); this decides what a
 *  bank gift passes on. Stripe's cost to the church is
 *  min(BANK_PERCENT_FEE * charge, BANK_FEE_CAP_CENTS) plus
 *  BANK_VERIFICATION_FEE_CENTS, so pass-through is
 *  ceil((BANK_PERCENT_FEE * subtotal + verification) / (1 - BANK_PERCENT_FEE)),
 *  with the percentage part capped. */
export function bankFeeCents(subtotalCents: number): number {
  if (!Number.isFinite(subtotalCents) || subtotalCents <= 0) return 0;
  // Policy: the payer covers Stripe's whole cost, as with cards. Stripe takes
  // the percentage on the total charged (gift + fee), so gross the fee up. Once
  // that percentage reaches the cap the fee stops growing, so cap it too.
  const grossedUp = Math.ceil(
    (BANK_PERCENT_FEE * subtotalCents + BANK_VERIFICATION_FEE_CENTS) / (1 - BANK_PERCENT_FEE),
  );
  return Math.min(grossedUp, BANK_FEE_CAP_CENTS + BANK_VERIFICATION_FEE_CENTS);
}

/** The fee for a subtotal under the chosen payment method. */
export function feeCentsFor(subtotalCents: number, method: PaymentMethod = "card"): number {
  return method === "bank" ? bankFeeCents(subtotalCents) : feeCents(subtotalCents);
}

/** Fee line items for a method: none when the method carries no fee, because
 *  Checkout would reject a zero-amount line. Spread into line_items. */
export function feeLineItems(subtotalCents: number, method: PaymentMethod = "card") {
  const fee = feeCentsFor(subtotalCents, method);
  if (fee <= 0) return [];
  return [{
    price_data: {
      currency: "usd",
      unit_amount: fee,
      product_data: { name: PROCESSING_FEE_LABEL },
    },
    quantity: 1,
  }];
}

/** Session metadata for a method, same shape as processingFeeMetadata. */
export function feeMetadataFor(subtotalCents: number, method: PaymentMethod = "card"): { subtotal_cents: string; processing_fee_cents: string } {
  return { subtotal_cents: String(subtotalCents), processing_fee_cents: String(feeCentsFor(subtotalCents, method)) };
}

// ---- Recurring gifts (monthly / every 2 weeks) -----------------------------
// Not wired into any route yet. A subscription charges the same fee on every
// cycle, so the one-time bank verification cost ($1.50, billed once when the
// account is first verified) must not ride along in the recurring fee: it gets
// its own one-time line, which Stripe puts on the first invoice only.

/** Stripe Billing's fee on recurring invoices, as a fraction of volume. Stripe's
 *  pricing page lists 0.7% for its Billing plans, but whether it applies to this
 *  account is unconfirmed, so it stays 0 until read from the Dashboard. When
 *  set, the payer's fee covers it on top of the card or bank percentage. */
export const STRIPE_BILLING_PERCENT_FEE = 0;

/** Name of the one-time bank verification line on a first recurring invoice. */
export const BANK_SETUP_FEE_LABEL = "Bank account setup fee";

/** How often a recurring price repeats, in Stripe's own terms. */
export type RecurringInterval = { interval: "month" | "week"; interval_count: number };

/** The per-cycle card fee: feeCents, plus Stripe Billing's share when it applies. */
export function recurringCardFeeCents(subtotalCents: number, billingPercent: number = STRIPE_BILLING_PERCENT_FEE): number {
  if (!Number.isFinite(subtotalCents) || subtotalCents <= 0) return 0;
  const total = Math.ceil((subtotalCents + STRIPE_FIXED_FEE_CENTS) / (1 - STRIPE_PERCENT_FEE - billingPercent));
  return total - subtotalCents;
}

/** The per-cycle bank fee, without the one-time verification cost. Stripe's ACH
 *  percentage stops at BANK_FEE_CAP_CENTS, so the fee stops growing there too. */
export function recurringBankFeeCents(subtotalCents: number, billingPercent: number = STRIPE_BILLING_PERCENT_FEE): number {
  if (!Number.isFinite(subtotalCents) || subtotalCents <= 0) return 0;
  const pct = BANK_PERCENT_FEE + billingPercent;
  const uncapped = Math.ceil((pct * subtotalCents) / (1 - pct));
  const capped = Math.ceil((BANK_FEE_CAP_CENTS + billingPercent * subtotalCents) / (1 - billingPercent));
  return Math.min(uncapped, capped);
}

/** The fee on every cycle of a recurring gift under the chosen method. */
export function recurringFeeCentsFor(subtotalCents: number, method: PaymentMethod = "card"): number {
  return method === "bank" ? recurringBankFeeCents(subtotalCents) : recurringCardFeeCents(subtotalCents);
}

/** The one-time fee added to the first invoice only: bank verification,
 *  grossed up for the percentage Stripe takes on it. Cards have none. */
export function setupFeeCentsFor(subtotalCents: number, method: PaymentMethod = "card", billingPercent: number = STRIPE_BILLING_PERCENT_FEE): number {
  if (method !== "bank" || !Number.isFinite(subtotalCents) || subtotalCents <= 0) return 0;
  return Math.ceil(BANK_VERIFICATION_FEE_CENTS / (1 - BANK_PERCENT_FEE - billingPercent));
}

/** Fee line items for a subscription Checkout: the recurring fee line, plus a
 *  one-time setup line for bank gifts. Spread into line_items. */
export function recurringFeeLineItems(subtotalCents: number, method: PaymentMethod, recurring: RecurringInterval) {
  const items: Array<{
    price_data: { currency: string; unit_amount: number; product_data: { name: string }; recurring?: RecurringInterval };
    quantity: number;
  }> = [];
  const fee = recurringFeeCentsFor(subtotalCents, method);
  if (fee > 0) {
    items.push({ price_data: { currency: "usd", unit_amount: fee, product_data: { name: PROCESSING_FEE_LABEL }, recurring }, quantity: 1 });
  }
  const setup = setupFeeCentsFor(subtotalCents, method);
  if (setup > 0) {
    items.push({ price_data: { currency: "usd", unit_amount: setup, product_data: { name: BANK_SETUP_FEE_LABEL } }, quantity: 1 });
  }
  return items;
}

/** Subscription metadata. Stripe does not copy Checkout Session metadata onto
 *  the subscription or its invoices, so the webhook reads the split from here
 *  when it splits an invoice's amount into gift, fee and setup fee. */
export function recurringFeeMetadataFor(subtotalCents: number, method: PaymentMethod, frequency: string): {
  subtotal_cents: string; processing_fee_cents: string; setup_fee_cents: string; frequency: string;
} {
  return {
    subtotal_cents: String(subtotalCents),
    processing_fee_cents: String(recurringFeeCentsFor(subtotalCents, method)),
    setup_fee_cents: String(setupFeeCentsFor(subtotalCents, method)),
    frequency,
  };
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
