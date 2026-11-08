"use client";

import { useState } from "react";
import { Check, Copy, Landmark, Send } from "lucide-react";

/** One account / Zelle value as a tappable card: label, the value, and a
 *  44px copy button so nobody retypes digits from a phone screen. */
export function CopyAccount({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const isZelle = label.toLowerCase().includes("zelle");
  const Icon = isZelle ? Send : Landmark;
  // Copy just the number / address, not the "Ac#" prefix.
  const copyValue = value.replace(/^\s*(ac|account)\s*#\s*/i, "").trim();

  async function copy() {
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked -- the value is still on screen */
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 16, padding: "12px 12px 12px 14px" }}>
      <span aria-hidden style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: "rgba(255,255,255,.16)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} strokeWidth={2.2} />
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.82)" }}>{label}</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#fff", lineHeight: 1.3, overflowWrap: "anywhere" }}>{value}</div>
      </div>
      <button
        type="button"
        onClick={copy}
        className="press"
        aria-label={`Copy ${label} ${isZelle ? "email" : "account number"}`}
        style={{ minWidth: 44, minHeight: 44, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 12px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 14, background: copied ? "#fff" : "transparent", color: copied ? "var(--ink)" : "#fff", border: "1.5px solid rgba(255,255,255,.45)" }}
      >
        {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
      <span role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
