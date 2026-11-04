"use client";

import { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";

/** Mounts Stripe's embedded Checkout inside the page. The server creates the
 *  session (amount, line items, return_url) and hands back only its client
 *  secret, so nothing the browser sends can change what is charged. */
export function EmbeddedStripeCheckout({ clientSecret }: { clientSecret: string }) {
  const stripePromise = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    return key ? loadStripe(key) : null;
  }, []);

  if (!stripePromise) return null;

  return (
    <div style={{ borderRadius: 18, overflow: "hidden", background: "#fff" }}>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
