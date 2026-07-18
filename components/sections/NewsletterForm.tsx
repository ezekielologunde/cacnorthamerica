"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeAction } from "@/app/newsletter/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        flexShrink: 0,
        background: "var(--red)",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        padding: "0 24px",
        height: 46,
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "inherit",
        cursor: pending ? "not-allowed" : "pointer",
        opacity: pending ? 0.65 : 1,
        whiteSpace: "nowrap",
        transition: "opacity 0.15s",
      }}
    >
      {pending ? "Subscribing…" : "Subscribe"}
    </button>
  );
}

export function NewsletterForm() {
  const [state, action] = useActionState(subscribeAction, null);

  if (state?.ok) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 20px",
        background: "rgba(22,163,74,.15)",
        border: "1px solid rgba(22,163,74,.3)",
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 600,
        color: "#86efac",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 6L9 17l-5-5" />
        </svg>
        {state.message}
      </div>
    );
  }

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          name="email"
          type="email"
          required
          placeholder="Your email address"
          style={{
            flex: "1 1 220px",
            height: 46,
            padding: "0 16px",
            background: "rgba(255,247,239,.07)",
            border: "1px solid rgba(255,247,239,.15)",
            borderRadius: 10,
            fontSize: 14,
            color: "#fff",
            fontFamily: "inherit",
            outline: "none",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,247,239,.4)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,247,239,.15)"; }}
        />
        <SubmitButton />
      </div>
      {state && !state.ok && (
        <p style={{ fontSize: 13, color: "#fca5a5", margin: 0 }}>{state.message}</p>
      )}
    </form>
  );
}
