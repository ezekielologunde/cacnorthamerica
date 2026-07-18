"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Lock, PhoneCall, Send } from "lucide-react";
import { submitLead, isValidEmail } from "@/lib/forms";
import { haptic } from "@/lib/haptics";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function PrayerForm() {
  const reduce = useReducedMotion();
  const [form, setForm] = useState({ name: "", email: "", request: "" });
  const [confidential, setConfidential] = useState(false);
  const [pastorCall, setPastorCall] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.request.trim()) next.request = "Please share what we can pray for.";
    if (form.email && !isValidEmail(form.email)) next.email = "Please enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) {
      haptic("error");
      document.getElementById(next.request ? "pr-request" : "pr-email")?.focus();
      return;
    }
    setSubmitError("");
    setLoading(true);
    haptic("medium");
    try {
      await submitLead(
        {
          name: form.name.trim() || "(anonymous)",
          email: form.email.trim() || "(not provided)",
          prayerRequest: form.request.trim(),
          confidential: confidential ? "Yes — keep private" : "No",
          requestPastorCall: pastorCall ? "Yes — please call" : "No",
        },
        "Prayer request",
      );
      haptic("success");
      setDone(true);
    } catch {
      haptic("error");
      setSubmitError("Something went wrong. Please try again, or call us at (443) 272-6794.");
    } finally {
      setLoading(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    background: "var(--paper)", borderRadius: 28, padding: "clamp(28px,4vw,48px)",
    border: "1px solid var(--line)", boxShadow: "0 30px 70px rgba(27,19,14,.12)",
    maxWidth: 640, margin: "0 auto",
  };

  if (done) {
    return (
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ ...cardStyle, textAlign: "center" }}
        role="status"
      >
        <motion.span
          initial={reduce ? { opacity: 0 } : { scale: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.1 }}
          style={{ display: "grid", placeItems: "center", width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(140deg,var(--flame),var(--red))", margin: "0 auto 24px", boxShadow: "0 14px 34px rgba(214,40,40,.36)" }}
        >
          <Check size={36} strokeWidth={2.5} color="#fff" aria-hidden />
        </motion.span>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,32px)", letterSpacing: "-.6px", color: "var(--ink)", margin: "0 0 12px" }}>
          We&apos;re praying with you.
        </h3>
        <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, margin: "0 auto", maxWidth: 420 }}>
          Your request has reached our prayer team. {pastorCall ? "A pastor will reach out to you soon. " : ""}
          You are not alone — and you are loved.
        </p>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 24, fontStyle: "italic" }}>
          &ldquo;Cast all your anxiety on Him because He cares for you.&rdquo; — 1 Peter 5:7
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={cardStyle}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Name + Email row */}
        <div className="r2" style={{ gap: 16 }}>
          <Field label="Your name" optional>
            <input
              id="pr-name" type="text" autoComplete="name" placeholder="Jane Doe"
              value={form.name} onChange={(e) => update("name", e.target.value)}
              className="field-input" style={inputStyle(false)}
            />
          </Field>
          <Field label="Email" optional error={errors.email}>
            <input
              id="pr-email" type="email" inputMode="email" autoComplete="email" placeholder="jane@example.com"
              value={form.email} onChange={(e) => update("email", e.target.value)}
              aria-invalid={!!errors.email} aria-describedby={errors.email ? "pr-email-err" : undefined}
              className="field-input" style={inputStyle(!!errors.email)}
            />
          </Field>
        </div>

        {/* Request */}
        <Field label="What can we pray for?" required error={errors.request}>
          <textarea
            id="pr-request" rows={5} placeholder="Share as much or as little as you'd like. This is a safe place."
            value={form.request} onChange={(e) => update("request", e.target.value)}
            aria-invalid={!!errors.request} aria-describedby={errors.request ? "pr-request-err" : undefined}
            className="field-input" style={{ ...inputStyle(!!errors.request), resize: "vertical", minHeight: 130, lineHeight: 1.6, fontFamily: "inherit" }}
          />
        </Field>

        {/* Toggles */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Toggle active={confidential} onToggle={() => { setConfidential((v) => !v); haptic("selection"); }} icon={<Lock size={16} strokeWidth={2} aria-hidden />}>
            Keep this private
          </Toggle>
          <Toggle active={pastorCall} onToggle={() => { setPastorCall((v) => !v); haptic("selection"); }} icon={<PhoneCall size={16} strokeWidth={2} aria-hidden />}>
            Ask a pastor to call me
          </Toggle>
        </div>

        {submitError && <p role="alert" style={{ fontSize: 14, fontWeight: 600, color: "var(--red)", margin: 0 }}>{submitError}</p>}

        {/* Submit */}
        <motion.button
          type="submit" disabled={loading}
          className="btn-sheen press-lg"
          whileTap={reduce ? undefined : { scale: 0.97 }}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 16,
            fontFamily: "var(--font-body)", border: "none", padding: "18px 28px", borderRadius: 999,
            cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1,
            boxShadow: "0 16px 34px rgba(214,40,40,.4)", width: "100%",
          }}
        >
          {loading ? (
            <>
              <Spinner /> Sending…
            </>
          ) : (
            <>
              <Send size={18} strokeWidth={2} aria-hidden /> Send Prayer Request
            </>
          )}
        </motion.button>
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", textAlign: "center", margin: 0 }}>
          Held in confidence by our pastoral team. We&apos;ll only reach out if you ask us to.
        </p>
      </div>
    </form>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%", background: "var(--cream)", border: `1.5px solid ${hasError ? "var(--red)" : "var(--line)"}`,
    borderRadius: 14, padding: "14px 16px", fontSize: 15, color: "var(--ink)",
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };
}

function Field({ label, required, optional, error, children }: { label: string; required?: boolean; optional?: boolean; error?: string; children: React.ReactNode }) {
  const id = label.toLowerCase().includes("pray") ? "pr-request" : label.toLowerCase().includes("email") ? "pr-email" : "pr-name";
  return (
    <label htmlFor={id} style={{ display: "block" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 8 }}>
        {label}
        {required && <span aria-hidden style={{ color: "var(--red)" }}>*</span>}
        {optional && <span style={{ fontWeight: 600, letterSpacing: 0, textTransform: "none", opacity: 0.6 }}>· optional</span>}
      </span>
      {children}
      {error && <span id={`${id}-err`} role="alert" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--red)", marginTop: 6 }}>{error}</span>}
    </label>
  );
}

function Toggle({ active, onToggle, icon, children }: { active: boolean; onToggle: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button" onClick={onToggle} aria-pressed={active}
      className="press"
      style={{
        display: "inline-flex", alignItems: "center", gap: 9,
        background: active ? "var(--red)" : "var(--cream)",
        color: active ? "#fff" : "var(--ink-soft)",
        border: `1.5px solid ${active ? "var(--red)" : "var(--line)"}`,
        borderRadius: 999, padding: "11px 18px", fontSize: 14, fontWeight: 700,
        fontFamily: "var(--font-body)", cursor: "pointer",
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,.4)", borderTopColor: "#fff", display: "inline-block" }}
      aria-hidden
    />
  );
}
