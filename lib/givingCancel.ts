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
  /** The Stripe customer that owns the subscription. */
  customerId: string;
  campaignTitle: string;
  /** "Monthly" or "Every 2 weeks", or "". */
  frequencyLabel: string;
  /** The gift, e.g. "$100.00", or "". */
  amountLabel: string;
};

export type CancelDeps = {
  /** Every Stripe customer whose email is this address, however it is cased. */
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
export function summarizeGift(subscriptionId: string, customerId: string, metadata: Metadata | null | undefined): Gift | null {
  if (!metadata || metadata.kind !== "giving") return null;
  const cents = /^\d+$/.test(metadata.subtotal_cents ?? "") ? Number(metadata.subtotal_cents) : 0;
  return {
    subscriptionId,
    customerId,
    campaignTitle: metadata.campaign_title ?? "",
    frequencyLabel: metadata.frequency === "monthly" ? "Monthly" : metadata.frequency === "biweekly" ? "Every 2 weeks" : "",
    amountLabel: cents > 0 ? `$${(cents / 100).toFixed(2)}` : "",
  };
}

/** The address as typed and lowercased, or null when it is not a usable email. */
export function parseEmail(raw: unknown): { typed: string; lower: string } | null {
  const typed = typeof raw === "string" ? raw.trim() : "";
  if (!typed || typed.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(typed)) return null;
  return { typed, lower: typed.toLowerCase() };
}

export type RequestOutcome =
  | "invalid"
  /** A link was emailed. */
  | "sent"
  /** No recurring gift for that address; nothing was sent. */
  | "none"
  | "failed";

export async function requestCancelLink(rawEmail: unknown, deps: CancelDeps, now: number): Promise<RequestOutcome> {
  const email = parseEmail(rawEmail);
  if (!email) return "invalid";
  const { typed, lower } = email;
  try {
    const customers = await deps.findCustomers(typed === lower ? [typed] : [typed, lower]);
    if (customers.length === 0) return "none";
    const gifts = await deps.listGifts(customers);
    if (gifts.length === 0) return "none";
    // The token holds only customers that own a live gift, so a donor with many
    // gift-less customers (one per past Checkout) can still cancel an old gift.
    const owners = [...new Set(gifts.map((g) => g.customerId))];
    const ok = await deps.sendLink({ email: lower, token: deps.sealToken(owners, now), gifts });
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

// ---- Stripe ----
// The Stripe-backed pieces, written against the small slice of the client they
// use so the checks can run them against a fake. A donor can have several
// Stripe customers (Checkout makes a new one for each gift), so every lookup
// works on the whole set found for the address.

type StripeSubscription = { id: string; status: string; customer: string | { id: string }; metadata?: Metadata | null };

export type StripeLike = {
  customers: {
    list: (params: { email: string; limit: number }) => AsyncIterable<{ id: string }>;
    search: (params: { query: string; limit: number }) => AsyncIterable<{ id: string }>;
  };
  subscriptions: {
    list: (params: { customer: string; limit: number }) => Promise<{ data: StripeSubscription[] }>;
    retrieve: (id: string) => Promise<StripeSubscription>;
    cancel: (id: string, params: { cancellation_details: { comment: string } }) => Promise<unknown>;
  };
};

/** Stored on the cancellation. Deliberately not the "auto:" prefix the code's
 *  own cancels use, so the ended-gift handler confirms this one to the donor. */
export const DONOR_CANCEL_COMMENT = "donor:self-service";

/** Subscription states that take payments or may yet. "incomplete" is a bank
 *  gift whose first debit is still processing: the donor can change their mind
 *  the same day. */
const LIVE = new Set(["active", "past_due", "trialing", "unpaid", "incomplete"]);

/** Safety bound on customers examined for one address. */
const MAX_LOOKUP_CUSTOMERS = 50;

const customerOf = (sub: StripeSubscription) => (typeof sub.customer === "string" ? sub.customer : sub.customer.id);

export function stripeGiftOps(stripe: StripeLike): Pick<CancelDeps, "findCustomers" | "listGifts" | "cancelGift"> {
  return {
    findCustomers: async (emails) => {
      const found = new Set<string>();
      // list() is exact-match and case-sensitive but immediately consistent;
      // search() is case-insensitive but can lag a minute. Together they find a
      // customer however the address was typed or stored, new or old.
      for (const email of emails) {
        for await (const c of stripe.customers.list({ email, limit: 100 })) {
          found.add(c.id);
          if (found.size >= MAX_LOOKUP_CUSTOMERS) return [...found];
        }
      }
      const quoted = emails[emails.length - 1].replace(/[\\"]/g, "\\$&");
      for await (const c of stripe.customers.search({ query: `email:"${quoted}"`, limit: 100 })) {
        found.add(c.id);
        if (found.size >= MAX_LOOKUP_CUSTOMERS) break;
      }
      return [...found];
    },
    listGifts: async (customerIds) => {
      const pages = await Promise.all(customerIds.map((customer) => stripe.subscriptions.list({ customer, limit: 20 })));
      const gifts: Gift[] = [];
      for (const sub of pages.flatMap((p) => p.data)) {
        if (!LIVE.has(sub.status)) continue;
        const gift = summarizeGift(sub.id, customerOf(sub), sub.metadata);
        if (gift) gifts.push(gift);
      }
      return gifts;
    },
    cancelGift: async (subscriptionId, customerIds) => {
      try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        // Someone else's gift, or not a gift at all: indistinguishable from missing.
        if (!customerIds.includes(customerOf(sub)) || sub.metadata?.kind !== "giving") return "not_found";
        if (sub.status === "canceled") return "cancelled";
        await stripe.subscriptions.cancel(subscriptionId, { cancellation_details: { comment: DONOR_CANCEL_COMMENT } });
        return "cancelled";
      } catch (err) {
        if ((err as { code?: string }).code === "resource_missing") return "not_found";
        throw err;
      }
    },
  };
}
