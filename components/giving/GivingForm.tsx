"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { zelleRecipientFor, type GivingCampaign } from "@/lib/giving";
import { FeeBreakdown } from "@/components/checkout/FeeBreakdown";
import { EmbeddedStripeCheckout } from "@/components/checkout/EmbeddedStripeCheckout";
import { ZellePaymentPanel } from "@/components/register/ZellePaymentPanel";
import { FORM_HEADER, TURNSTILE_FIELD } from "@/lib/spam";
import { TurnstileField, resetTurnstile } from "@/components/TurnstileField";
import type { PaymentMethod } from "@/lib/processingFee";

/** Zelle is a pledge the donor completes in their own bank app; card and bank
 *  go through Stripe Checkout. */
type GiveMethod = PaymentMethod | "zelle";

const PRESET_AMOUNTS = [25, 50, 100, 250];

// Zelle first: it carries no fee for the donor or the church. It is only
// offered for campaigns that have a Zelle address (lib/giving.ts).
const METHOD_CHOICES: readonly (readonly [GiveMethod, string, string])[] = [
  ["zelle", "Zelle (recommended)", "No fee. You send it from your bank app"],
  ["card", "Card", "Received right away"],
  ["bank", "Bank account", "Takes about 4 business days to clear"],
];

type ZelleResult = {
  zelleRef: string;
  recipient: string;
  amountCents: number;
  emailed: boolean;
  campaignTitle: string;
};

const inputStyle: CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "13px 14px", minHeight: 48, borderRadius: 12,
  border: "1.5px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.1)",
  fontSize: 16, color: "#fff",
  fontFamily: "var(--font-body)",
};
const labelStyle: CSSProperties = { display: "block", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.82)", marginBottom: 6 };

/** Standalone online-giving form, rendered once on the /giving page (not
 *  per campaign card) -- the donor picks which of the three real campaigns
 *  their gift goes to via a dropdown instead of duplicating this form three
 *  times. Every campaign already has real bank/wire details for donors who
 *  don't want to pay online; this is the additional online path. */
export function GivingForm({ campaigns }: { campaigns: GivingCampaign[] }) {
  const [campaignSlug, setCampaignSlug] = useState(campaigns[0]?.slug ?? "");
  const [amount, setAmount] = useState<number | null>(PRESET_AMOUNTS[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [method, setMethod] = useState<GiveMethod>("zelle");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [zelleResult, setZelleResult] = useState<ZelleResult | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const focusFormAfterReset = useRef(false);

  // The form unmounts when the Zelle details appear (and the other way round),
  // which would drop focus to the page body; move it to the new heading so
  // keyboard and screen-reader users land on the change.
  useEffect(() => {
    if (zelleResult) {
      resultHeadingRef.current?.focus();
    } else if (focusFormAfterReset.current) {
      focusFormAfterReset.current = false;
      formHeadingRef.current?.focus();
    }
  }, [zelleResult]);

  const effectiveDollars = customAmount.trim() !== "" ? Number(customAmount) : amount;
  const amountCents = effectiveDollars && effectiveDollars > 0 ? Math.round(effectiveDollars * 100) : null;

  // Zelle is the default, but a campaign with no Zelle address (the Centenary
  // project) quietly falls back to card.
  const campaign = campaigns.find((c) => c.slug === campaignSlug);
  const zelleRecipient = campaign ? zelleRecipientFor(campaign) : null;
  const activeMethod: GiveMethod = method === "zelle" && !zelleRecipient ? "card" : method;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!amountCents) {
      setErrorMessage("Please choose or enter an amount.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMessage(null);

    if (activeMethod === "zelle") {
      const form = event.currentTarget as HTMLFormElement;
      const turnstileToken = new FormData(form).get(TURNSTILE_FIELD);
      try {
        const response = await fetch("/api/giving/zelle", {
          method: "POST",
          headers: { "Content-Type": "application/json", [FORM_HEADER]: "1" },
          body: JSON.stringify({ contactName, contactEmail, campaignSlug, amountCents, turnstileToken: typeof turnstileToken === "string" ? turnstileToken : "" }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || typeof data?.zelleRef !== "string" || typeof data?.recipient !== "string") {
          resetTurnstile(form);
          setErrorMessage(typeof data?.error === "string" ? data.error : "Something went wrong. Please try again.");
          setStatus("error");
          return;
        }
        setZelleResult({
          zelleRef: data.zelleRef,
          recipient: data.recipient,
          amountCents: typeof data.amountCents === "number" ? data.amountCents : amountCents,
          emailed: data.emailed === true,
          campaignTitle: campaign?.name ?? "",
        });
        setStatus("idle");
      } catch {
        resetTurnstile(form);
        setErrorMessage("Something went wrong. Please try again.");
        setStatus("error");
      }
      return;
    }

    try {
      const response = await fetch("/api/giving/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactName, contactEmail, campaignSlug, amountCents, paymentMethod: activeMethod }),
      });
      const data = await response.json().catch(() => null);
      if (response.ok && typeof data?.clientSecret === "string") {
        setClientSecret(data.clientSecret);
        setStatus("idle");
        return;
      }
      if (!response.ok || !data?.checkoutUrl) {
        setErrorMessage(typeof data?.error === "string" ? data.error : "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      window.location.assign(data.checkoutUrl);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div style={{
      position: "relative", overflow: "hidden",
      borderRadius: 28, padding: "clamp(22px,5.5vw,56px)",
      background: "linear-gradient(135deg,var(--ink),#1C1E2E)", boxShadow: "0 28px 60px rgba(18,20,30,.22)",
    }}>
      <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(253,200,65,.18),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 480, margin: "0 auto" }}>

        {clientSecret ? (
          <div>
            <EmbeddedStripeCheckout clientSecret={clientSecret} />
            <button
              type="button"
              onClick={() => setClientSecret(null)}
              className="press"
              style={{
                marginTop: 18, minHeight: 48, padding: "0 22px", borderRadius: 999, cursor: "pointer",
                background: "transparent", color: "#fff", fontWeight: 700, fontSize: 15,
                border: "1.5px solid rgba(255,255,255,.4)",
              }}
            >
              ← Change my gift
            </button>
          </div>
        ) : zelleResult ? (
          <div>
            <h2 ref={resultHeadingRef} tabIndex={-1} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.4vw,38px)", letterSpacing: "-1px", color: "#fff", margin: "0 0 12px", lineHeight: 1.1, outline: "none" }}>
              Now send it by Zelle.
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.78)", lineHeight: 1.6, margin: "0 0 18px" }}>
              Your gift to {zelleResult.campaignTitle} isn&rsquo;t made until you send the payment from your bank app.
              We&rsquo;ll match it to your reference when it arrives.
            </p>
            <ZellePaymentPanel amountDueCents={zelleResult.amountCents} zelleRef={zelleResult.zelleRef} recipient={zelleResult.recipient} />
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.78)", lineHeight: 1.6, margin: "16px 0 0" }}>
              Zelle payments can&rsquo;t be reversed, so check the address before you send.{" "}
              {zelleResult.emailed
                ? "We’ve also emailed these details to you."
                : "We couldn’t email these details, so please copy them now."}
            </p>
            <button
              type="button"
              onClick={() => { focusFormAfterReset.current = true; setZelleResult(null); }}
              className="press"
              style={{
                marginTop: 18, minHeight: 48, padding: "0 22px", borderRadius: 999, cursor: "pointer",
                background: "transparent", color: "#fff", fontWeight: 700, fontSize: 15,
                border: "1.5px solid rgba(255,255,255,.3)",
              }}
            >
              Give another gift
            </button>
          </div>
        ) : (
        <>
        <h2 ref={formHeadingRef} tabIndex={-1} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.4vw,38px)", letterSpacing: "-1px", color: "#fff", margin: "0 0 20px", lineHeight: 1.1, outline: "none" }}>
          Make a gift online.
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="give-campaign" style={labelStyle}>Campaign</label>
            <select
              id="give-campaign"
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
            <span id="give-amount" style={{ ...labelStyle, display: "block" }}>Amount</span>
            <div role="group" aria-labelledby="give-amount" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
              {PRESET_AMOUNTS.map((preset) => {
                const active = customAmount.trim() === "" && amount === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => { setAmount(preset); setCustomAmount(""); }}
                    className="press"
                    style={{
                      minHeight: 48, padding: "0 8px", borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: "pointer",
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
              type="number" min="1" step="1" inputMode="decimal" aria-label="Custom amount in dollars"
              placeholder="Or enter a custom amount ($)"
              value={customAmount}
              onChange={(e) => {
                const v = e.target.value;
                setCustomAmount(v);
                // Clearing the field falls back to the default preset instead of leaving no amount.
                // A half-typed entry like "-" also reads as "", so only an empty field restores it.
                setAmount(v.trim() === "" && !e.target.validity.badInput ? PRESET_AMOUNTS[1] : null);
              }}
            />
          </div>

          <fieldset style={{ border: "none", padding: 0, margin: "0 0 18px", minWidth: 0 }}>
            <legend style={{ ...labelStyle, padding: 0 }}>How would you like to give?</legend>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 8 }}>
              {METHOD_CHOICES.filter(([value]) => value !== "zelle" || zelleRecipient).map(([value, title, note]) => {
                const active = activeMethod === value;
                return (
                  <label
                    key={value}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10, minHeight: 48, padding: "12px 14px", borderRadius: 12, cursor: "pointer", color: "#fff",
                      border: active ? "1.5px solid var(--gold)" : "1.5px solid rgba(255,255,255,.25)",
                      background: active ? "rgba(253,200,65,.16)" : "rgba(255,255,255,.06)",
                    }}
                  >
                    <input type="radio" name="give-method" value={value} checked={active} onChange={() => setMethod(value)} style={{ marginTop: 4, accentColor: "var(--gold)" }} />
                    <span>
                      <strong style={{ display: "block", fontSize: 15 }}>{title}</strong>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,.72)" }}>{note}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div style={{ marginBottom: 14 }}>
            <label htmlFor="give-name" style={labelStyle}>Your Name <span style={{ color: "var(--gold)" }}>*</span></label>
            <input id="give-name" className="field-input on-dark" style={inputStyle} value={contactName} onChange={(e) => setContactName(e.target.value)} required autoComplete="name" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="give-email" style={labelStyle}>Email <span style={{ color: "var(--gold)" }}>*</span></label>
            <input id="give-email" inputMode="email" className="field-input on-dark" style={inputStyle} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required autoComplete="email" />
          </div>

          {amountCents ? (
            <div style={{ marginBottom: 18 }}>
              {activeMethod === "zelle" ? (
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.78)", lineHeight: 1.6, margin: 0 }}>
                  No processing fee: you send exactly ${(amountCents / 100).toFixed(2)}.
                </p>
              ) : (
                <FeeBreakdown subtotalCents={amountCents} subtotalLabel="Gift" tone="dark" method={activeMethod} />
              )}
            </div>
          ) : null}

          {status === "error" && errorMessage && (
            <p role="alert" style={{ color: "#FF9E9E", fontWeight: 600, fontSize: 14, marginBottom: 14 }}>{errorMessage}</p>
          )}

          <TurnstileField />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-sheen press"
            style={{
              width: "100%", minHeight: 56, padding: "0 24px", borderRadius: 999,
              background: status === "loading" ? "rgba(255,255,255,.15)" : "var(--gold)",
              color: "var(--ink)", fontWeight: 800, fontSize: 16, border: "none",
              cursor: status === "loading" ? "not-allowed" : "pointer",
            }}
          >
            {status === "loading"
              ? (activeMethod === "zelle" ? "One moment…" : "Redirecting…")
              : activeMethod === "zelle"
                ? "Show me how to send it →"
                : `Give ${amountCents ? `$${(amountCents / 100).toFixed(2)}` : "Now"} →`}
          </button>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.7)", textAlign: "center", marginTop: 14 }}>
            {activeMethod === "zelle"
              ? "We’ll show you where to send it and a reference to put in the memo, and email you the same details."
              : activeMethod === "bank"
                ? "Securely processed by Stripe. Your bank will ask you to confirm the account, and we’ll email you when the gift clears."
                : "Securely processed by Stripe. You’ll get an email receipt."}
          </p>
        </form>
        </>
        )}
      </div>
    </div>
  );
}
