"use client";

import type { CSSProperties } from "react";

// "How would you like to pay?" on both registration forms, shown only when
// something is owed. Zelle is first and the default: it carries no card
// processing fee. The value goes to POST /api/register as paymentMethod.

export type PaymentMethod = "zelle" | "card";

export const DEFAULT_PAYMENT_METHOD: PaymentMethod = "zelle";

const CHOICES: { value: PaymentMethod; title: string; body: string }[] = [
  { value: "zelle", title: "Zelle (recommended)", body: "No card fee. Send the amount to our Zelle after you register." },
  { value: "card", title: "Card", body: "Visa, Mastercard and others, with a small processing fee." },
];

/** Submit button text for a paid registration. */
export function paidSubmitLabel(method: PaymentMethod): string {
  return method === "zelle" ? "Register and pay by Zelle" : "Continue to card payment";
}

export function PaymentMethodChoice({
  value,
  onChange,
  name,
  legendStyle,
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  /** Radio group name, unique per form instance. */
  name: string;
  legendStyle: CSSProperties;
}) {
  return (
    <fieldset style={{ border: "none", padding: 0, margin: "24px 0 0", minWidth: 0 }}>
      <legend style={{ ...legendStyle, padding: 0, marginBottom: 8, fontSize: 15 }}>How would you like to pay?</legend>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CHOICES.map((c) => (
          <label key={c.value} className="reg-check" style={{ alignItems: "flex-start", paddingTop: 12, paddingBottom: 12 }}>
            <input
              type="radio"
              name={name}
              value={c.value}
              checked={value === c.value}
              onChange={() => onChange(c.value)}
              style={{ marginTop: 1 }}
            />
            <span>
              <span style={{ display: "block", fontWeight: 800 }}>{c.title}</span>
              <span style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--ink-soft)", marginTop: 2 }}>{c.body}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Sticky-bar total when paying by Zelle: the subtotal, with no fee line. */
export function ZelleTotal({ subtotalCents }: { subtotalCents: number }) {
  return (
    <div aria-live="polite">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-soft)" }}>Total</span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink)" }}>{`$${(subtotalCents / 100).toFixed(2)}`}</span>
      </div>
      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "6px 0 0" }}>No card fee with Zelle.</p>
    </div>
  );
}
