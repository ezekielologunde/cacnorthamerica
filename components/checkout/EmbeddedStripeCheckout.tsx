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

/** Full-width screen shown in place of a form once its server call returns a
 *  client secret: the embed plus a way back to the form. */
export function EmbeddedCheckoutScreen({ clientSecret, onBack, backLabel = "← Back" }: { clientSecret: string; onBack: () => void; backLabel?: string }) {
  return (
    <div ref={(el) => el?.scrollIntoView({ block: "start", behavior: "smooth" })}>
      <EmbeddedStripeCheckout clientSecret={clientSecret} />
      <button
        type="button"
        onClick={onBack}
        className="press"
        style={{
          marginTop: 18, minHeight: 48, padding: "0 22px", borderRadius: 999, cursor: "pointer",
          background: "transparent", color: "var(--ink)", fontWeight: 700, fontSize: 15,
          border: "1.5px solid var(--line)",
        }}
      >
        {backLabel}
      </button>
    </div>
  );
}
