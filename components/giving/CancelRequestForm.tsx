"use client";

import { useRef, useState } from "react";
import { FORM_HEADER, TURNSTILE_FIELD } from "@/lib/spam";
import { TurnstileField, resetTurnstile } from "@/components/TurnstileField";

// Step 1 of cancelling a recurring gift: ask for the emailed link. The answer
// is the same whether or not a gift exists for the address.
export function CancelRequestForm() {
  const form = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const turnstileToken = data.get(TURNSTILE_FIELD);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/giving/cancel/request", {
        method: "POST",
        headers: { "Content-Type": "application/json", [FORM_HEADER]: "1" },
        body: JSON.stringify({ email, turnstileToken: typeof turnstileToken === "string" ? turnstileToken : "" }),
      });
      if (!res.ok) {
        const body: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("idle");
      resetTurnstile(form.current);
    }
  }

  if (state === "sent") {
    return (
      <div role="status" style={{ maxWidth: 460, margin: "0 auto", textAlign: "left", background: "rgba(245,246,250,.06)", border: "1px solid rgba(245,246,250,.14)", borderRadius: 18, padding: "24px 26px", color: "var(--cream)", fontSize: 15, lineHeight: 1.7 }}>
        If a recurring gift is set up with that email, we&apos;ve sent a link to it. The link works for one hour. If nothing arrives in a few minutes, check your spam folder or write to{" "}
        <a href="mailto:info@cacna.org" style={{ color: "var(--gold)" }}>info@cacna.org</a> and we&apos;ll stop it for you.
      </div>
    );
  }

  return (
    <form ref={form} onSubmit={onSubmit} style={{ maxWidth: 460, margin: "0 auto", textAlign: "left" }}>
      <label htmlFor="cancel-email" style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: "var(--cream)", marginBottom: 8 }}>
        The email you gave with
      </label>
      <input
        id="cancel-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        maxLength={254}
        style={{ width: "100%", boxSizing: "border-box", fontSize: 16, padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(245,246,250,.25)", background: "rgba(245,246,250,.08)", color: "#fff" }}
      />
      <TurnstileField />
      {error && (
        <p role="alert" style={{ color: "#ff8a9b", fontSize: 14, margin: "12px 0 0" }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="press"
        style={{ marginTop: 18, width: "100%", background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 15, padding: "14px 20px", borderRadius: 999, border: 0, cursor: state === "sending" ? "wait" : "pointer", opacity: state === "sending" ? 0.7 : 1 }}
      >
        {state === "sending" ? "Sending…" : "Email me a link"}
      </button>
    </form>
  );
}
