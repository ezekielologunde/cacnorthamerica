"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { broadcastAction, type BroadcastState } from "@/app/admin/(protected)/newsletter/actions";

const inp: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid rgba(0,0,0,0.12)",
  borderRadius: 8,
  fontSize: 15,
  fontFamily: "inherit",
  background: "white",
  boxSizing: "border-box",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--ink)",
  marginBottom: 6,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        background: "var(--red)",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "10px 24px",
        fontSize: 14,
        fontWeight: 600,
        cursor: pending ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        opacity: pending ? 0.65 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {pending ? "Sending…" : "Send Broadcast"}
    </button>
  );
}

export default function NewsletterBroadcast({ subscriberCount }: { subscriberCount: number }) {
  const [state, formAction] = useActionState<BroadcastState, FormData>(broadcastAction, null);

  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        padding: "24px 28px",
        marginBottom: 24,
      }}
    >
      <style>{`
        .bc-inp { transition: border-color 0.15s, box-shadow 0.15s; }
        .bc-inp:focus-visible { border-color: var(--red); box-shadow: 0 0 0 3px rgba(214,40,40,0.12); }
        .bc-inp:hover:not(:focus-visible) { border-color: rgba(27,19,14,0.24); }
      `}</style>

      <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>
        Send Broadcast
      </h2>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "0 0 20px" }}>
        This will send to all {subscriberCount} active subscriber{subscriberCount !== 1 ? "s" : ""}.
      </p>

      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={labelStyle}>Subject *</label>
          <input
            name="subject"
            required
            maxLength={200}
            className="bc-inp"
            style={inp}
            placeholder="e.g. Sunday Service Update"
          />
        </div>

        <div>
          <label style={labelStyle}>Message *</label>
          <textarea
            name="body"
            required
            rows={10}
            maxLength={10000}
            className="bc-inp"
            style={{ ...inp, resize: "vertical" }}
            placeholder="Write your message here…"
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <SubmitButton />

          {state && (
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 500,
                color: state.ok ? "#15803d" : "#dc2626",
              }}
            >
              {state.message}
              {state.ok && state.failed > 0 && (
                <span style={{ color: "#854d0e" }}> ({state.failed} failed)</span>
              )}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
