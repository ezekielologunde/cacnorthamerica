import { BANK_SETUP_FEE_LABEL, feeCentsFor, PROCESSING_FEE_LABEL, recurringFeeCentsFor, setupFeeCentsFor, type PaymentMethod } from "@/lib/processingFee";
import { isRecurring, type GiftFrequency } from "@/lib/givingRequest";
import { cadencePhrase } from "@/lib/givingRecurring";

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
  frequency = "once",
  extraLabel,
  extraCents = 0,
}: {
  subtotalCents: number;
  subtotalLabel?: string;
  tone?: "light" | "dark";
  method?: PaymentMethod;
  /** A repeating gift shows the fee charged each time, and a bank gift's one-time setup fee. */
  frequency?: GiftFrequency;
  /** An optional separate line after the fee (a gift added to a registration), counted in the total. */
  extraLabel?: string;
  extraCents?: number;
}) {
  const repeating = isRecurring(frequency);
  const fee = repeating ? recurringFeeCentsFor(subtotalCents, method) : feeCentsFor(subtotalCents, method);
  const setup = repeating ? setupFeeCentsFor(subtotalCents, method) : 0;
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
      {extraCents > 0 && extraLabel && (
        <div style={{ ...row, marginTop: 4 }}>
          <span>{extraLabel}</span>
          <span>{formatPrice(extraCents)}</span>
        </div>
      )}
      <div style={{ ...row, borderTop: `1px solid ${line}`, marginTop: 8, paddingTop: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{repeating ? "Each payment" : "Total"}</span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: strong }}>{formatPrice(subtotalCents + fee + extraCents)}</span>
      </div>
      {setup > 0 && (
        <p style={{ fontSize: 12.5, color: soft, margin: "6px 0 0" }}>
          Your first payment also includes a one-time {BANK_SETUP_FEE_LABEL.toLowerCase()} of {formatPrice(setup)}.
        </p>
      )}
      {repeating && (
        <p style={{ fontSize: 12.5, color: soft, margin: "6px 0 0" }}>
          Charged {cadencePhrase(frequency)} until you cancel.
        </p>
      )}
      <p style={{ fontSize: 12.5, color: soft, margin: "6px 0 0" }}>
        {method === "bank"
          ? "Covers bank-debit processing costs; shown before you pay."
          : "Covers card processing costs; shown before you pay."}
      </p>
    </div>
  );
}
