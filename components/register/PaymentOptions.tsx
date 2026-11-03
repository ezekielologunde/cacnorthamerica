"use client";

import { CreditCard, Landmark, Send, type LucideIcon } from "lucide-react";
import { paymentOptions } from "@/lib/registrationInfo";
import { CopiedAnnouncer, CopyButton, useCopied } from "@/components/register/CopyButton";

// One look per method -- distinct icon, tint and a one-tap copy for the two
// values people otherwise have to retype from a phone screenshot.
const KINDS: Record<string, { Icon: LucideIcon; tint: string; label: string }> = {
  zelle: { Icon: Send, tint: "#6D1ED4", label: "Recommended: no card fee" },
  check: { Icon: Landmark, tint: "#0F766E", label: "Bank deposit" },
  card: { Icon: CreditCard, tint: "#C81E3A", label: "Pay now" },
};

export function PaymentOptions({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  const { copied, copy } = useCopied();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <CopiedAnnouncer copied={copied} />
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
                <CopyButton
                  dark={dark}
                  label={option.copyLabel ?? "Copy"}
                  isCopied={copied === option.kind}
                  onCopy={() => copy(option.kind, option.copyValue!)}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
