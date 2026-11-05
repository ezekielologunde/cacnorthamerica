"use client";

import { useState } from "react";
import { FORM_HEADER } from "@/lib/spam";

// Cancels one gift. A POST from a button, never a link, so a mail scanner that
// opens the emailed page cannot cancel anything. Two presses on purpose: the
// first asks, the second does it.
export function CancelGiftButton({ token, subscriptionId, label }: { token: string; subscriptionId: string; label: string }) {
  const [state, setState] = useState<"idle" | "confirm" | "working" | "done">("idle");
  const [error, setError] = useState("");

  async function cancel() {
    setState("working");
    setError("");
    try {
      const res = await fetch("/api/giving/cancel/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json", [FORM_HEADER]: "1" },
        body: JSON.stringify({ token, subscriptionId }),
      });
      if (!res.ok) {
        const body: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("confirm");
    }
  }

  if (state === "done") {
    return (
      <p role="status" style={{ margin: 0, fontSize: 14, color: "var(--gold)", fontWeight: 700 }}>
        Cancelled. No more payments will be taken. A confirmation is on its way to your email.
      </p>
    );
  }

  const base = { fontWeight: 800, fontSize: 14, padding: "11px 20px", borderRadius: 999, border: "1px solid rgba(245,246,250,.3)", cursor: "pointer" } as const;
  return (
    <div>
      {state === "idle" ? (
        <button type="button" className="press" onClick={() => setState("confirm")} style={{ ...base, background: "transparent", color: "var(--cream)" }}>
          Cancel this gift
        </button>
      ) : (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" className="press" disabled={state === "working"} onClick={cancel} style={{ ...base, background: "var(--red)", color: "#fff", border: 0, cursor: state === "working" ? "wait" : "pointer" }}>
            {state === "working" ? "Cancelling…" : `Yes, stop ${label}`}
          </button>
          <button type="button" className="press" disabled={state === "working"} onClick={() => setState("idle")} style={{ ...base, background: "transparent", color: "var(--cream)" }}>
            Keep it
          </button>
        </div>
      )}
      {error && <p role="alert" style={{ color: "#ff8a9b", fontSize: 14, margin: "10px 0 0" }}>{error}</p>}
    </div>
  );
}
