"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Sparkles, Send } from "lucide-react";
import { submitLead, isValidEmail } from "@/lib/forms";
import { haptic } from "@/lib/haptics";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function TestimonyForm() {
  const reduce = useReducedMotion();
  const [form, setForm] = useState({ name: "", email: "", testimony: "" });
  const [share, setShare] = useState(true);
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
    if (!form.testimony.trim()) next.testimony = "Please share your testimony.";
    if (form.email && !isValidEmail(form.email)) next.email = "Please enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) {
      haptic("error");
      document.getElementById(next.testimony ? "tf-testimony" : "tf-email")?.focus();
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
          testimony: form.testimony.trim(),
          mayShare: share ? "Yes — may share publicly" : "No — keep private",
        },
        "Testimony",
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

  const card: React.CSSProperties = {
    background: "var(--paper)", borderRadius: 28, padding: "clamp(28px,4vw,44px)",
    border: "1px solid var(--line)", boxShadow: "0 30px 70px rgba(27,19,14,.12)",
    maxWidth: 640, margin: "0 auto",
  };

  if (done) {
    return (
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ ...card, textAlign: "center" }}
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
          Praise God — thank you!
        </h3>
        <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, margin: "0 auto", maxWidth: 420 }}>
          Your testimony has reached us. Stories like yours build faith across the whole family.
        </p>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 24, fontStyle: "italic" }}>
          &ldquo;They triumphed over him by the blood of the Lamb and by the word of their testimony.&rdquo; — Revelation 12:11
        </p>
      </motion.div>
    );
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%", background: "var(--cream)", border: `1.5px solid ${hasError ? "var(--red)" : "var(--line)"}`,
    borderRadius: 14, padding: "14px 16px", fontSize: 15, color: "var(--ink)",
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  });

  return (
    <form onSubmit={handleSubmit} noValidate style={card}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div className="r2" style={{ gap: 16 }}>
          <label htmlFor="tf-name" style={{ display: "block" }}>
            <span style={labelStyle}>Your name <span style={{ fontWeight: 600, letterSpacing: 0, textTransform: "none", opacity: 0.6 }}>· optional</span></span>
            <input id="tf-name" type="text" autoComplete="name" placeholder="Jane Doe" value={form.name} onChange={(e) => update("name", e.target.value)} className="field-input" style={inputStyle(false)} />
          </label>
          <label htmlFor="tf-email" style={{ display: "block" }}>
            <span style={labelStyle}>Email <span style={{ fontWeight: 600, letterSpacing: 0, textTransform: "none", opacity: 0.6 }}>· optional</span></span>
            <input id="tf-email" type="email" inputMode="email" autoComplete="email" placeholder="jane@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} aria-invalid={!!errors.email} className="field-input" style={inputStyle(!!errors.email)} />
            {errors.email && <span role="alert" style={errStyle}>{errors.email}</span>}
          </label>
        </div>

        <label htmlFor="tf-testimony" style={{ display: "block" }}>
          <span style={labelStyle}>Your testimony <span aria-hidden style={{ color: "var(--red)" }}>*</span></span>
          <textarea id="tf-testimony" rows={5} placeholder="Tell us what God has done — a healing, an answered prayer, a changed heart…" value={form.testimony} onChange={(e) => update("testimony", e.target.value)} aria-invalid={!!errors.testimony} className="field-input" style={{ ...inputStyle(!!errors.testimony), resize: "vertical", minHeight: 130, lineHeight: 1.6, fontFamily: "inherit" }} />
          {errors.testimony && <span role="alert" style={errStyle}>{errors.testimony}</span>}
        </label>

        <button type="button" onClick={() => { setShare((v) => !v); haptic("selection"); }} aria-pressed={share} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, alignSelf: "flex-start", background: share ? "var(--red)" : "var(--cream)", color: share ? "#fff" : "var(--ink-soft)", border: `1.5px solid ${share ? "var(--red)" : "var(--line)"}`, borderRadius: 999, padding: "11px 18px", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-body)", cursor: "pointer" }}>
          <Sparkles size={16} strokeWidth={2} aria-hidden /> You may share my testimony
        </button>

        {submitError && <p role="alert" style={{ fontSize: 14, fontWeight: 600, color: "var(--red)", margin: 0 }}>{submitError}</p>}

        <motion.button type="submit" disabled={loading} className="btn-sheen press-lg" whileTap={reduce ? undefined : { scale: 0.97 }}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "var(--font-body)", border: "none", padding: "18px 28px", borderRadius: 999, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 16px 34px rgba(214,40,40,.4)", width: "100%" }}>
          {loading ? (<><Spinner /> Sending…</>) : (<><Send size={18} strokeWidth={2} aria-hidden /> Share My Testimony</>)}
        </motion.button>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 8 };
const errStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "var(--red)", marginTop: 6 };

function Spinner() {
  return (
    <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,.4)", borderTopColor: "#fff", display: "inline-block" }} aria-hidden />
  );
}
