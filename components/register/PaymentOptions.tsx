"use client";

import { useState } from "react";
import { Check, Copy, CreditCard, Landmark, Send, type LucideIcon } from "lucide-react";
import { paymentOptions } from "@/lib/registrationInfo";

// One look per method -- distinct icon, tint and a one-tap copy for the two
// values people otherwise have to retype from a phone screenshot.
const KINDS: Record<string, { Icon: LucideIcon; tint: string; label: string }> = {
  zelle: { Icon: Send, tint: "#6D1ED4", label: "Instant transfer" },
  check: { Icon: Landmark, tint: "#0F766E", label: "Bank deposit" },
  card: { Icon: CreditCard, tint: "#C81E3A", label: "Pay now" },
};

export function PaymentOptions({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {
      /* clipboard blocked -- the value is still shown on screen */
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
        {copied ? "Copied to clipboard" : ""}
      </span>
      {paymentOptions.map((option) => {
        const kind = KINDS[option.kind];
        const { Icon } = kind;
        return (
          <div
            key={option.kind}
            style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              background: dark ? "rgba(245,246,250,.06)" : "var(--paper)",
              border: `1px solid ${dark ? "rgba(245,246,250,.14)" : "var(--line)"}`,
              borderRadius: 16, padding: "14px 16px",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: `color-mix(in srgb, ${kind.tint} ${dark ? 28 : 12}%, transparent)`,
                color: dark ? "#fff" : kind.tint,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon size={21} strokeWidth={2.2} />
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "2px 10px" }}>
                <span style={{ fontWeight: 800, fontSize: 15.5, color: dark ? "#fff" : "var(--ink)" }}>{option.name}</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: dark ? "rgba(245,246,250,.78)" : kind.tint }}>
                  {kind.label}
                </span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 14, lineHeight: 1.55, color: dark ? "rgba(245,246,250,.7)" : "var(--ink-soft)", overflowWrap: "anywhere" }}>
                {option.detail}
              </p>
              {option.copyValue && (
                <button
                  type="button"
                  onClick={() => copy(option.kind, option.copyValue!)}
                  className="press"
                  style={{
                    marginTop: 10, minHeight: 44, display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "0 14px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
                    fontWeight: 700, fontSize: 13.5,
                    background: "transparent", color: dark ? "#fff" : "var(--ink)",
                    border: `1.5px solid ${dark ? "rgba(245,246,250,.3)" : "var(--line)"}`,
                  }}
                >
                  {copied === option.kind ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                  <span>{copied === option.kind ? "Copied" : option.copyLabel}</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
