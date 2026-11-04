// Field checks shared by the two online-giving endpoints (card/bank checkout
// and the Zelle pledge), so a gift is judged the same way on either rail.
// Kept free of imports so scripts/check-giving-zelle.mjs can load it under
// plain Node; the caller passes the campaign slugs.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_FIELD_LENGTH = 120;
export const MAX_EMAIL_LENGTH = 254;
export const MIN_CENTS = 100; // $1
export const MAX_CENTS = 5_000_000; // $50,000 -- generous ceiling against a typo/abuse, not a real donation cap

/** A key that stays the same across the ways one inbox can be written, so a
 *  per-address limit can't be dodged with a +tag or (for Gmail) dots. */
export function emailLimitKey(email: string): string {
  const [rawLocal = "", rawDomain = ""] = email.trim().toLowerCase().split("@");
  const domain = rawDomain === "googlemail.com" ? "gmail.com" : rawDomain;
  let local = rawLocal.split("+")[0];
  if (domain === "gmail.com") local = local.replace(/\./g, "");
  return `${local}@${domain}`;
}

/** How often a gift repeats. "once" is the default and the only one Zelle takes. */
export const GIFT_FREQUENCIES = ["once", "monthly", "biweekly"] as const;
export type GiftFrequency = (typeof GIFT_FREQUENCIES)[number];
export type RecurringFrequency = Exclude<GiftFrequency, "once">;

/** Stripe's recurring-price terms for each frequency. Every 2 weeks is every
 *  14 days, so a year holds 26 or 27 gifts. */
export const RECURRING_INTERVALS: Record<RecurringFrequency, { interval: "month" | "week"; interval_count: number }> = {
  monthly: { interval: "month", interval_count: 1 },
  biweekly: { interval: "week", interval_count: 2 },
};

export function isRecurring(frequency: unknown): frequency is RecurringFrequency {
  return frequency === "monthly" || frequency === "biweekly";
}

// A recurring gift repeats with nobody present, so its caps sit well below the
// one-time ones: a typo costs the donor every cycle, and a bank debit can be
// disputed for 60 days. Starting values, to be confirmed by the church.
export const RECURRING_MIN_CENTS = 500; // $5
export const RECURRING_MAX_CARD_CENTS = 500_000; // $5,000 per charge
export const RECURRING_MAX_BANK_CENTS = 100_000; // $1,000 per charge

/** An error message when a recurring amount is outside the caps for the
 *  payment method, or null. One-time gifts are not checked here. */
export function validateRecurringAmount(amountCents: number, method: "card" | "bank", frequency: GiftFrequency): string | null {
  if (!isRecurring(frequency)) return null;
  const max = method === "bank" ? RECURRING_MAX_BANK_CENTS : RECURRING_MAX_CARD_CENTS;
  if (amountCents < RECURRING_MIN_CENTS || amountCents > max) {
    return `A recurring gift must be between $${RECURRING_MIN_CENTS / 100} and $${max / 100} each time`;
  }
  return null;
}

export type GiftBasics = {
  contactName: string;
  contactEmail: string;
  campaignSlug: string;
  amountCents: number;
  /** Optional: what the gift is for, one of the campaign's purposes. */
  purpose?: string;
  /** Optional: how often the gift repeats. Absent means once. */
  frequency?: GiftFrequency;
};

/** An error message for the first problem found, or null when the body has a
 *  valid name, email, known campaign and amount. */
export function validateGiftBasics(
  body: unknown,
  campaignSlugs: readonly string[],
  purposesBySlug: Readonly<Record<string, readonly string[]>> = {},
  /** Recurring gifts are refused unless the caller (the card/bank checkout) allows them. */
  options: { allowRecurring?: boolean } = {},
): string | null {
  if (!body || typeof body !== "object") {
    return "Request body must be a JSON object";
  }
  const b = body as Partial<GiftBasics>;

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
  if (typeof b.campaignSlug !== "string" || !campaignSlugs.includes(b.campaignSlug)) {
    return "Unknown campaign";
  }
  if (b.purpose !== undefined && (typeof b.purpose !== "string" || !(purposesBySlug[b.campaignSlug] ?? []).includes(b.purpose))) {
    return "Unknown gift type";
  }
  if (b.frequency !== undefined) {
    if (typeof b.frequency !== "string" || !GIFT_FREQUENCIES.includes(b.frequency)) {
      return "Unknown gift frequency";
    }
    if (b.frequency !== "once" && !options.allowRecurring) {
      return "Recurring gifts are not available for this payment method";
    }
  }
  if (typeof b.amountCents !== "number" || !Number.isInteger(b.amountCents) || b.amountCents < MIN_CENTS || b.amountCents > MAX_CENTS) {
    return `amountCents must be an integer between ${MIN_CENTS} and ${MAX_CENTS}`;
  }
  return null;
}
