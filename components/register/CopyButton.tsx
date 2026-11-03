"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

// One-tap copy for values people otherwise retype from a phone screenshot
// (the Zelle address, an account number, the Zelle memo reference). Shared by
// PaymentOptions and ZellePaymentPanel: one useCopied() per list, so a single
// polite live region announces whichever button was tapped.

export function useCopied() {
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
  return { copied, copy };
}

export function CopiedAnnouncer({ copied }: { copied: string | null }) {
  return (
    <span role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
      {copied ? "Copied to clipboard" : ""}
    </span>
  );
}

export function CopyButton({
  label,
  isCopied,
  onCopy,
  dark = false,
}: {
  label: string;
  isCopied: boolean;
  onCopy: () => void;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className="press"
      style={{
        marginTop: 10, minHeight: 44, display: "inline-flex", alignItems: "center", gap: 8,
        padding: "0 14px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
        fontWeight: 700, fontSize: 13.5,
        background: "transparent", color: dark ? "#fff" : "var(--ink)",
        border: `1.5px solid ${dark ? "rgba(245,246,250,.3)" : "var(--line)"}`,
      }}
    >
      {isCopied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
      <span>{isCopied ? "Copied" : label}</span>
    </button>
  );
}
