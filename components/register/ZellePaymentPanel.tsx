"use client";

import { Send } from "lucide-react";
import { paymentOptions } from "@/lib/registrationInfo";
import { CopiedAnnouncer, CopyButton, useCopied } from "@/components/register/CopyButton";

// What to send after a Zelle registration (payment "awaiting_zelle" on the
// confirmation page): the amount due (the subtotal; Zelle carries no
// processing fee), the recipient from paymentOptions (never a second copy of
// the address) and the memo reference, each with a one-tap copy.

const zelle = paymentOptions.find((o) => o.kind === "zelle");

export function ZellePaymentPanel({ amountDueCents, zelleRef }: { amountDueCents: number; zelleRef: string }) {
  const { copied, copy } = useCopied();
  if (!zelle) return null;
  const soft = "rgba(245,246,250,.7)";
  const step = { fontSize: 11.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 4px" } as const;

  return (
    <div style={{ background: "rgba(245,246,250,.06)", border: "1px solid rgba(245,246,250,.14)", borderRadius: 18, padding: "20px clamp(16px, 5vw, 22px)" }}>
      <CopiedAnnouncer copied={copied} />
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <span
          aria-hidden
          style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: "color-mix(in srgb, #6D1ED4 28%, transparent)",
            color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Send size={21} strokeWidth={2.2} />
        </span>
        <div style={{ minWidth: 0 }}>
          <p style={{ ...step, margin: 0 }}>Amount due</p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "#fff", margin: 0 }}>
            {`$${(amountDueCents / 100).toFixed(2)}`}
          </p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(245,246,250,.14)", paddingTop: 14 }}>
        <p style={step}>1. Send it by Zelle to</p>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff", overflowWrap: "anywhere" }}>{zelle.detail}</p>
        {zelle.copyValue && (
          <CopyButton dark label={zelle.copyLabel ?? "Copy"} isCopied={copied === "zelle"} onCopy={() => copy("zelle", zelle.copyValue!)} />
        )}
      </div>

      <div style={{ borderTop: "1px solid rgba(245,246,250,.14)", paddingTop: 14, marginTop: 16 }}>
        <p style={step}>2. Put this in the Zelle memo</p>
        <p style={{ margin: 0, fontFamily: "Consolas, Menlo, 'Courier New', monospace", fontSize: 24, fontWeight: 700, letterSpacing: "2px", color: "#fff", overflowWrap: "anywhere" }}>
          {zelleRef}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 13.5, lineHeight: 1.55, color: soft }}>
          We match payments to the reference, so add it exactly as shown.
        </p>
        <CopyButton dark label="Copy reference" isCopied={copied === "ref"} onCopy={() => copy("ref", zelleRef)} />
      </div>
    </div>
  );
}
