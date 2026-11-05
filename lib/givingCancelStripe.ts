import { getStripeClient } from "@/lib/stripe";
import { openCancelToken, sealCancelToken } from "@/lib/cancelToken";
import { sendGivingCancelLinkEmail } from "@/lib/givingCancelEmail";
import { summarizeGift, type CancelDeps, type Gift } from "@/lib/givingCancel";

// Stripe-backed pieces of lib/givingCancel.ts. A donor can have several Stripe
// customers (Checkout makes a new one for each gift), so every lookup works on
// the whole set of customers found for the address.

/** Subscription states that still take payments, or may yet. */
const LIVE = new Set(["active", "past_due", "trialing", "unpaid"]);

/** Stored on the cancellation. Deliberately not the "auto:" prefix the code's
 *  own cancels use, so the ended-gift handler confirms this one to the donor. */
export const DONOR_CANCEL_COMMENT = "donor:self-service";

/** Safety bound on customers examined for one address. */
const MAX_LOOKUP_CUSTOMERS = 50;

export function cancelDeps(): CancelDeps {
  const stripe = getStripeClient();
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
        const gift = summarizeGift(sub.id, typeof sub.customer === "string" ? sub.customer : sub.customer.id, sub.metadata);
        if (gift) gifts.push(gift);
      }
      return gifts;
    },
    cancelGift: async (subscriptionId, customerIds) => {
      try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const owner = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        // Someone else's gift, or not a gift at all: indistinguishable from missing.
        if (!customerIds.includes(owner) || sub.metadata?.kind !== "giving") return "not_found";
        if (sub.status === "canceled") return "cancelled";
        await stripe.subscriptions.cancel(subscriptionId, { cancellation_details: { comment: DONOR_CANCEL_COMMENT } });
        return "cancelled";
      } catch (err) {
        if ((err as { code?: string }).code === "resource_missing") return "not_found";
        throw err;
      }
    },
    sealToken: sealCancelToken,
    openToken: openCancelToken,
    sendLink: sendGivingCancelLinkEmail,
  };
}
