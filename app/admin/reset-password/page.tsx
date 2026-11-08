"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const MIN_LENGTH = 12;

type Stage = "loading" | "request" | "sent" | "update" | "done";

export default function AdminResetPassword() {
  const [supabase] = useState(() => createClient());
  const [stage, setStage] = useState<Stage>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // The emailed link brings the person back here with a one-time code; the
  // browser client trades it for a session, which lets them set a password.
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setStage("update");
    });
    const hasCode = new URLSearchParams(window.location.search).has("code");
    // getSession waits for the code exchange; the auth event can fire before
    // this effect subscribes, so check for the session directly as well.
    if (hasCode) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setStage("update");
      });
    }
    const timer = window.setTimeout(() => {
      setStage((s) => (s === "loading" ? "request" : s));
    }, hasCode ? 4000 : 0);
    return () => {
      data.subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, [supabase]);

  async function requestLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setBusy(false);
    // Same message whether or not the address is an admin, so this page
    // can't be used to find out who has an account.
    if (err && err.status === 429) setError("Too many requests. Wait a minute and try again.");
    else setStage("sent");
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < MIN_LENGTH) {
      setError(`Use at least ${MIN_LENGTH} characters.`);
      return;
    }
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) setError(err.message);
    else setStage("done");
  }

  const input: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)",
    fontSize: 15, fontFamily: "inherit", marginBottom: 16, background: "white", color: "var(--ink)",
  };
  const button: React.CSSProperties = {
    width: "100%", background: busy ? "#999" : "var(--red)", color: "white", border: "none",
    borderRadius: 10, padding: "13px 24px", fontSize: 15, fontWeight: 600,
    cursor: busy ? "not-allowed" : "pointer", fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--ink)", padding: 16 }}>
      <div style={{ background: "var(--cream)", borderRadius: 20, padding: "44px 36px", width: "100%", maxWidth: 420, color: "var(--ink)" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", textAlign: "center" }}>Reset admin password</h1>

        {stage === "loading" && <p style={{ textAlign: "center", opacity: 0.6 }}>One moment…</p>}

        {stage === "request" && (
          <form onSubmit={requestLink}>
            <p style={{ fontSize: 14, opacity: 0.7, margin: "0 0 20px", textAlign: "center" }}>
              Enter your admin email and we will send you a link to set a new password.
            </p>
            <input type="email" required autoComplete="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} style={input} />
            {error && <p role="alert" style={{ color: "#dc2626", fontSize: 14, margin: "-4px 0 16px" }}>{error}</p>}
            <button type="submit" disabled={busy} style={button}>{busy ? "Sending…" : "Send reset link"}</button>
          </form>
        )}

        {stage === "sent" && (
          <p style={{ fontSize: 14, textAlign: "center", lineHeight: 1.6 }}>
            If that email belongs to an admin, a reset link is on its way. Open it in this same browser.
          </p>
        )}

        {stage === "update" && (
          <form onSubmit={savePassword}>
            <p style={{ fontSize: 14, opacity: 0.7, margin: "0 0 20px", textAlign: "center" }}>
              Choose a new password (at least {MIN_LENGTH} characters).
            </p>
            <input type="password" required autoComplete="new-password" placeholder="New password" value={password}
              onChange={(e) => setPassword(e.target.value)} style={input} />
            {error && <p role="alert" style={{ color: "#dc2626", fontSize: 14, margin: "-4px 0 16px" }}>{error}</p>}
            <button type="submit" disabled={busy} style={button}>{busy ? "Saving…" : "Save password"}</button>
          </form>
        )}

        {stage === "done" && (
          <p style={{ fontSize: 14, textAlign: "center", lineHeight: 1.6 }}>
            Password saved. <Link href="/admin" style={{ color: "var(--red)", fontWeight: 600 }}>Go to the admin area</Link>
          </p>
        )}

        {stage !== "done" && (
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
            <Link href="/admin/login" style={{ color: "var(--ink)", opacity: 0.6 }}>Back to sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
