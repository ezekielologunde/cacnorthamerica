import Stripe from "stripe";

/** Separate Stripe client from the Store feature's — convention
 *  registration and merch checkout are unrelated flows and must not share
 *  a webhook route or client, even though both may eventually use the
 *  same Stripe account/keys. Matches the Store webhook's own
 *  get-or-null pattern (app/api/stripe/webhook/route.ts) so routes can
 *  503 gracefully instead of crashing while STRIPE_SECRET_KEY is unset. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(key, { apiVersion: "2024-06-20" as any });
}
