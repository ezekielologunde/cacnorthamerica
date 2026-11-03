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

export type GiftBasics = {
  contactName: string;
  contactEmail: string;
  campaignSlug: string;
  amountCents: number;
};

/** An error message for the first problem found, or null when the body has a
 *  valid name, email, known campaign and amount. */
export function validateGiftBasics(body: unknown, campaignSlugs: readonly string[]): string | null {
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
  if (typeof b.amountCents !== "number" || !Number.isInteger(b.amountCents) || b.amountCents < MIN_CENTS || b.amountCents > MAX_CENTS) {
    return `amountCents must be an integer between ${MIN_CENTS} and ${MAX_CENTS}`;
  }
  return null;
}
