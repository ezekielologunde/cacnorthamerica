// Self-service cancel for a recurring gift. Free of imports so
// scripts/check-giving-cancel.mjs can load it under plain Node; the routes pass
// in Stripe, the token sealer and the email sender.
//
// The flow:
//  1. The donor types the email they gave with. We always answer the same way,
//     whether or not a gift exists, so the form cannot be used to find out who
//     gives. Only when a gift exists is a link emailed to that address.
//  2. The link opens a page listing that donor's gifts. Opening it changes
//     nothing (mail scanners open links), so each gift has its own Cancel
//     button, which POSTs.
//  3. The cancel is tied to the customers the link was issued for, so a link
//     can only ever cancel its own donor's gifts.
// The ended-gift handler (lib/givingProblem.ts) then emails the donor a
// confirmation and tells the committee, because a donor's cancel is recorded
// by Stripe without the "auto:" comment the code's own cancels carry.

export type Gift = {
  subscriptionId: string;
  campaignTitle: string;
  /** "Monthly" or "Every 2 weeks", or "". */
  frequencyLabel: string;
  /** The gift, e.g. "$100.00", or "". */
  amountLabel: string;
};

export type CancelDeps = {
  /** Stripe customer ids for any of these spellings of the address. */
  findCustomers: (emails: string[]) => Promise<string[]>;
  /** The live recurring gifts of these customers (not one-time gifts). */
  listGifts: (customerIds: string[]) => Promise<Gift[]>;
  /** Cancels the gift, only if it belongs to one of these customers. */
  cancelGift: (subscriptionId: string, customerIds: string[]) => Promise<"cancelled" | "not_found">;
  sealToken: (customerIds: string[], now: number) => string;
  openToken: (token: string, now: number) => string[] | null;
  /** Emails the link. Resolves false on a send failure. */
  sendLink: (input: { email: string; token: string; gifts: Gift[] }) => Promise<boolean>;
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

type Metadata = Record<string, string | null | undefined>;

/** The gift a Stripe subscription stands for, or null when it is not a giving
 *  subscription (the account also sells registrations and store orders). */
export function summarizeGift(subscriptionId: string, metadata: Metadata | null | undefined): Gift | null {
  if (!metadata || metadata.kind !== "giving") return null;
  const cents = /^\d+$/.test(metadata.subtotal_cents ?? "") ? Number(metadata.subtotal_cents) : 0;
  return {
    subscriptionId,
    campaignTitle: metadata.campaign_title ?? "",
    frequencyLabel: metadata.frequency === "monthly" ? "Monthly" : metadata.frequency === "biweekly" ? "Every 2 weeks" : "",
    amountLabel: cents > 0 ? `$${(cents / 100).toFixed(2)}` : "",
  };
}

export type RequestOutcome =
  | "invalid"
  /** A link was emailed. */
  | "sent"
  /** No recurring gift for that address; nothing was sent. */
  | "none"
  | "failed";

export async function requestCancelLink(rawEmail: unknown, deps: CancelDeps, now: number): Promise<RequestOutcome> {
  const typed = typeof rawEmail === "string" ? rawEmail.trim() : "";
  if (!typed || typed.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(typed)) return "invalid";
  const lower = typed.toLowerCase();
  try {
    const customers = await deps.findCustomers(typed === lower ? [typed] : [typed, lower]);
    if (customers.length === 0) return "none";
    const gifts = await deps.listGifts(customers);
    if (gifts.length === 0) return "none";
    const ok = await deps.sendLink({ email: lower, token: deps.sealToken(customers, now), gifts });
    return ok ? "sent" : "failed";
  } catch (err) {
    console.error("[giving cancel] could not issue a link", { error: err instanceof Error ? err.name : "error" });
    return "failed";
  }
}

export type ViewOutcome = { state: "expired" } | { state: "ok"; gifts: Gift[] } | { state: "failed" };

/** What the link's page shows: the donor's live gifts, or "expired". */
export async function viewGifts(token: unknown, deps: CancelDeps, now: number = Date.now()): Promise<ViewOutcome> {
  const customers = typeof token === "string" ? deps.openToken(token, now) : null;
  if (!customers) return { state: "expired" };
  try {
    return { state: "ok", gifts: await deps.listGifts(customers) };
  } catch (err) {
    console.error("[giving cancel] could not list gifts", { error: err instanceof Error ? err.name : "error" });
    return { state: "failed" };
  }
}

export type CancelOutcome = "cancelled" | "expired" | "not_found" | "failed";

export async function cancelWithToken(token: unknown, subscriptionId: unknown, deps: CancelDeps, now: number): Promise<CancelOutcome> {
  const customers = typeof token === "string" ? deps.openToken(token, now) : null;
  if (!customers) return "expired";
  if (typeof subscriptionId !== "string" || !/^sub_[A-Za-z0-9]+$/.test(subscriptionId)) return "not_found";
  try {
    return await deps.cancelGift(subscriptionId, customers);
  } catch (err) {
    console.error("[giving cancel] cancel failed", { subscriptionId, error: err instanceof Error ? err.name : "error" });
    return "failed";
  }
}
