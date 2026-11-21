// An optional gift added to a paid convention registration (card payments).
//
// The gift is its own Stripe line item, separate from the registration fee, so
// the donor's receipt shows exactly what they chose to give and the
// registration amount stays what it was. The processing fee is sized on the
// registration only (lib/processingFee.ts), so the gift is not grossed up: the
// church receives the gift less Stripe's percentage on it.
//
// The server decides what is charged. A form may send a requested amount, but
// it is validated here and never trusted beyond these limits.

/** Name of the gift's Stripe line item, also used to keep it out of registrant lists. */
export const GIFT_LINE_LABEL = "Gift to the CACNA Convention";

/** Smallest and largest gift taken with a registration, in cents ($1 to $5,000). */
export const GIFT_MIN_CENTS = 100;
export const GIFT_MAX_CENTS = 500_000;

/** Quick-pick amounts offered on the form, in dollars. */
export const GIFT_PRESETS_DOLLARS = [10, 25, 50, 100] as const;

/** Reads the requested gift from a request body.
 *  Absent, null or 0 means no gift. Anything else must be a whole number of
 *  cents inside the limits, or the request is rejected. */
export function parseGiftCents(value: unknown): { ok: true; cents: number } | { ok: false; error: string } {
  if (value === undefined || value === null || value === 0) return { ok: true, cents: 0 };
  if (typeof value !== "number" || !Number.isInteger(value)) {
    return { ok: false, error: "The gift amount must be a whole number of cents" };
  }
  if (value < GIFT_MIN_CENTS || value > GIFT_MAX_CENTS) {
    return { ok: false, error: `A gift must be between $${GIFT_MIN_CENTS / 100} and $${(GIFT_MAX_CENTS / 100).toLocaleString("en-US")}` };
  }
  return { ok: true, cents: value };
}

/** The gift as a Checkout Session line item. Spread into line_items; empty when there is no gift. */
export function giftLineItems(giftCents: number) {
  if (!(giftCents > 0)) return [];
  return [{
    price_data: {
      currency: "usd",
      unit_amount: giftCents,
      product_data: { name: GIFT_LINE_LABEL },
    },
    quantity: 1,
  }];
}

/** The gift recorded on a summary, or 0 when absent or malformed. */
export function giftOf(summary: { gift?: unknown }): number {
  const g = summary.gift;
  return typeof g === "number" && Number.isInteger(g) && g >= GIFT_MIN_CENTS && g <= GIFT_MAX_CENTS ? g : 0;
}

/** True for the gift's own line item, so registrant lists can leave it out. */
export function isGiftLine(description: string | null | undefined): boolean {
  return description === GIFT_LINE_LABEL;
}
