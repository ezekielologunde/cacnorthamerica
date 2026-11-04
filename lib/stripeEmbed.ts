import type Stripe from "stripe";

/** Embedded Checkout needs Stripe.js in the browser, which needs the
 *  publishable key. Without it every flow keeps the hosted redirect. */
export function embeddedCheckoutEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
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
