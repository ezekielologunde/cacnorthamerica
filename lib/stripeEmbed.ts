import type Stripe from "stripe";

/** Hosted Checkout (Stripe's own page) is the default. Embedded Checkout is
 *  opt-in: it needs NEXT_PUBLIC_STRIPE_EMBEDDED=true and the publishable key,
 *  which Stripe.js needs in the browser. */
export function embeddedCheckoutEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_STRIPE_EMBEDDED === "true" &&
    Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  );
}

/** The session params that differ between embedded and hosted Checkout. */
export function checkoutModeParams(returnUrl: string, cancelUrl: string) {
  return embeddedCheckoutEnabled()
    ? { ui_mode: "embedded_page" as const, return_url: returnUrl }
    : { success_url: returnUrl, cancel_url: cancelUrl };
}

/** What the browser needs to continue: a client secret for the embed, or the
 *  hosted URL to redirect to. */
export function checkoutResponseBody(session: Stripe.Checkout.Session) {
  return session.ui_mode === "embedded_page" && session.client_secret
    ? { clientSecret: session.client_secret }
    : { checkoutUrl: session.url };
}
