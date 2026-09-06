"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import type { GivingCampaign } from "@/lib/giving";

const PRESET_AMOUNTS = [25, 50, 100, 250];

const inputStyle: CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "13px 16px", borderRadius: 10,
  border: "1.5px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.1)",
  fontSize: 15, color: "#fff",
  fontFamily: "var(--font-body)",
};
const labelStyle: CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,.75)", marginBottom: 6, letterSpacing: ".3px" };

/** Standalone online-giving form, rendered once on the /giving page (not
 *  per campaign card) -- the donor picks which of the three real campaigns
 *  their gift goes to via a dropdown instead of duplicating this form three
 *  times. Every campaign already has real bank/wire details for donors who
 *  don't want to pay online; this is the additional Stripe path. */
export function GivingForm({ campaigns }: { campaigns: GivingCampaign[] }) {
  const [campaignSlug, setCampaignSlug] = useState(campaigns[0]?.slug ?? "");
  const [amount, setAmount] = useState<number | null>(PRESET_AMOUNTS[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const effectiveDollars = customAmount.trim() !== "" ? Number(customAmount) : amount;
  const amountCents = effectiveDollars && effectiveDollars > 0 ? Math.round(effectiveDollars * 100) : null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!amountCents) {
      setErrorMessage("Please choose or enter an amount.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    try {
      const response = await fetch("/api/giving/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactName, contactEmail, campaignSlug, amountCents }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.checkoutUrl) {
        setErrorMessage(typeof data?.error === "string" ? data.error : "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div style={{
      position: "relative", overflow: "hidden",
      borderRadius: 32, padding: "clamp(36px,5.5vw,56px)",
      background: "linear-gradient(135deg,var(--ink),#1C1E2E)", boxShadow: "0 28px 60px rgba(18,20,30,.22)",
    }}>
      <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(253,200,65,.18),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 480, margin: "0 auto" }}>
        <span style={{ display: "inline-block", fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>
          Give Online
        </span>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.4vw,38px)", letterSpacing: "-1px", color: "#fff", margin: "0 0 26px", lineHeight: 1.1 }}>
          Make a gift by card.
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Campaign</label>
            <select
              className="field-input on-dark"
              style={{ ...inputStyle, appearance: "none" }}
              value={campaignSlug}
              onChange={(e) => setCampaignSlug(e.target.value)}
            >
              {campaigns.map((c) => (
                <option key={c.slug} value={c.slug} style={{ color: "#000" }}>{c.title}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Amount</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
              {PRESET_AMOUNTS.map((preset) => {
                const active = customAmount.trim() === "" && amount === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => { setAmount(preset); setCustomAmount(""); }}
                    className="press"
                    style={{
                      padding: "12px 8px", borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: "pointer",
                      border: active ? "1.5px solid var(--gold)" : "1.5px solid rgba(255,255,255,.25)",
                      background: active ? "rgba(253,200,65,.16)" : "rgba(255,255,255,.06)",
                      color: active ? "var(--gold)" : "#fff",
                    }}
                  >
                    ${preset}
                  </button>
                );
              })}
            </div>
            <input
              className="field-input on-dark"
              style={inputStyle}
              type="number" min="1" step="1" inputMode="decimal"
              placeholder="Or enter a custom amount"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setAmount(null); }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Your Name <span style={{ color: "var(--gold)" }}>*</span></label>
            <input className="field-input on-dark" style={inputStyle} value={contactName} onChange={(e) => setContactName(e.target.value)} required autoComplete="name" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Email <span style={{ color: "var(--gold)" }}>*</span></label>
            <input className="field-input on-dark" style={inputStyle} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required autoComplete="email" />
          </div>

          {status === "error" && errorMessage && (
            <p role="alert" style={{ color: "#FF9E9E", fontWeight: 600, fontSize: 14, marginBottom: 14 }}>{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-sheen press"
            style={{
              width: "100%", padding: "16px 24px", borderRadius: 999,
              background: status === "loading" ? "rgba(255,255,255,.15)" : "var(--gold)",
              color: "var(--ink)", fontWeight: 800, fontSize: 16, border: "none",
              cursor: status === "loading" ? "not-allowed" : "pointer",
            }}
          >
            {status === "loading" ? "Redirecting…" : `Give ${amountCents ? `$${(amountCents / 100).toFixed(2)}` : "Now"} →`}
          </button>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.5)", textAlign: "center", marginTop: 14 }}>
            Securely processed by Stripe. You&apos;ll get an email receipt.
          </p>
        </form>
      </div>
    </div>
  );
}
