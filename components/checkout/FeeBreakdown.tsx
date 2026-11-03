import { feeCentsFor, PROCESSING_FEE_LABEL, type PaymentMethod } from "@/lib/processingFee";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Subtotal / Processing fee / Total, shown before the payer goes to Stripe.
 *  The fee is an estimate from the same function the server charges with;
 *  the server recomputes it and never reads one from the client. */
export function FeeBreakdown({
  subtotalCents,
  subtotalLabel = "Subtotal",
  tone = "light",
  method = "card",
}: {
  subtotalCents: number;
  subtotalLabel?: string;
  tone?: "light" | "dark";
  method?: PaymentMethod;
}) {
  const fee = feeCentsFor(subtotalCents, method);
  const soft = tone === "dark" ? "rgba(255,255,255,.7)" : "var(--ink-soft)";
  const strong = tone === "dark" ? "#fff" : "var(--ink)";
  const line = tone === "dark" ? "rgba(255,255,255,.18)" : "var(--line)";
  const row = { display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 14, color: soft } as const;

  return (
    <div aria-live="polite">
      <div style={row}>
        <span>{subtotalLabel}</span>
        <span>{formatPrice(subtotalCents)}</span>
      </div>
      {fee > 0 && (
        <div style={{ ...row, marginTop: 4 }}>
          <span>{PROCESSING_FEE_LABEL}</span>
          <span>{formatPrice(fee)}</span>
        </div>
      )}
      <div style={{ ...row, borderTop: `1px solid ${line}`, marginTop: 8, paddingTop: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Total</span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: strong }}>{formatPrice(subtotalCents + fee)}</span>
      </div>
      <p style={{ fontSize: 12.5, color: soft, margin: "6px 0 0" }}>
        {method === "bank"
          ? fee > 0 ? "Covers bank-debit processing costs; shown before you pay." : "No processing fee on bank gifts."
          : "Covers card processing costs; shown before you pay."}
      </p>
    </div>
  );
}
