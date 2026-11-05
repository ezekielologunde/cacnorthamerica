"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { submitServeSignup } from "@/lib/forms";
import { HONEYPOT_FIELD, TURNSTILE_FIELD } from "@/lib/spam";
import { TurnstileField, resetTurnstile } from "@/components/TurnstileField";
import { SERVE_TEAMS } from "@/lib/serveTeams";
import { SERVE_INBOX, SERVE_LIMITS, validateServeSignup, type ServeField } from "@/lib/serveSignup";

const FIELD_IDS: Record<ServeField, string> = {
  name: "s-name",
  email: "s-email",
  phone: "s-phone",
  note: "s-note",
  teams: `s-team-${SERVE_TEAMS[0].id}`,
  guardianConsent: "s-guardian",
  consent: "s-consent",
};

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "12px 14px", minHeight: 48, borderRadius: 12,
  border: "1.5px solid var(--line)", background: "var(--cream)",
  fontSize: 16, color: "var(--ink)",
  fontFamily: "var(--font-body)",
};
const labelStyle: React.CSSProperties = { display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 6 };
const optional = <span style={{ fontWeight: 400, opacity: .6 }}>(optional)</span>;
const required = <span style={{ color: "var(--red)" }}>*</span>;
const checkRow: React.CSSProperties = { display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "var(--ink)", lineHeight: 1.5, cursor: "pointer", minHeight: 44, paddingTop: 10 };
const checkbox: React.CSSProperties = { width: 20, height: 20, flexShrink: 0, marginTop: 1, accentColor: "var(--red)", cursor: "pointer" };

export function ServeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [teams, setTeams] = useState<string[]>([]);
  const [under18, setUnder18] = useState(false);
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "mailto">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [errField, setErrField] = useState<ServeField | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const done = status === "sent" || status === "mailto";

  // The form is replaced by the thank-you message: move focus there so
  // keyboard and screen reader users aren't left on a removed button.
  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  function toggleTeam(id: string) {
    setTeams((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const errorProps = (field: ServeField) => ({
    "aria-invalid": errField === field || undefined,
    "aria-describedby": errField === field ? "s-error" : undefined,
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // Show the message and move focus to the field it is about.
    const invalid = (msg: string, field?: ServeField) => {
      setErrMsg(msg);
      setErrField(field ?? null);
      if (field) document.getElementById(FIELD_IDS[field])?.focus();
    };
    setErrMsg("");
    setErrField(null);

    const payload = {
      name, email, phone, note, teams,
      under18, guardianConsent: under18 && guardianConsent, consent,
      [HONEYPOT_FIELD]: honeypot,
    };
    const check = validateServeSignup(payload);
    if (!check.ok && !check.spam) return invalid(check.error, check.field);

    setStatus("loading");
    const turnstileToken = new FormData(form).get(TURNSTILE_FIELD);
    try {
      const result = await submitServeSignup(payload, typeof turnstileToken === "string" ? turnstileToken : "");
      setStatus(result);
    } catch (err) {
      resetTurnstile(form);
      setStatus("idle");
      const { message, field } = err as Error & { field?: ServeField };
      invalid(message || `Something went wrong. Please try again or email ${SERVE_INBOX}.`, field);
    }
  }

  if (done) {
    return (
      <div role="status" style={{ textAlign: "center", padding: "28px 0" }}>
        <CheckCircle2 size={44} strokeWidth={2} aria-hidden style={{ color: "var(--red)", marginBottom: 14 }} />
        <h2 ref={doneRef} tabIndex={-1} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--ink)", margin: "0 0 10px", outline: "none" }}>Thank you for offering to serve</h2>
        <p style={{ color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
          {status === "sent"
            ? "We've got your sign-up. The Convention Committee will be in touch."
            : `Your email app should now open with your sign-up ready to send to ${SERVE_INBOX}. Please press send there to finish.`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot: bots fill every input, people never see this one. */}
      <input type="text" name={HONEYPOT_FIELD} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(19px,2.5vw,26px)", color: "var(--ink)", margin: "0 0 20px", letterSpacing: "-0.4px" }}>
        Sign up to serve
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 12, marginBottom: 12 }}>
        <div>
          <label htmlFor="s-name" style={labelStyle}>Your Name {required}</label>
          <input id="s-name" className="field-input" style={inputStyle} required aria-required="true" {...errorProps("name")} type="text" maxLength={SERVE_LIMITS.name} enterKeyHint="next" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="s-email" style={labelStyle}>Email Address {required}</label>
          <input id="s-email" className="field-input" style={inputStyle} required aria-required="true" {...errorProps("email")} type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={SERVE_LIMITS.email} enterKeyHint="next" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label htmlFor="s-phone" style={labelStyle}>Phone {optional}</label>
        <input id="s-phone" className="field-input" style={inputStyle} {...errorProps("phone")} type="tel" inputMode="tel" maxLength={SERVE_LIMITS.phone} autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <fieldset style={{ border: "none", padding: 0, margin: "0 0 18px" }}>
        <legend style={{ ...labelStyle, marginBottom: 8, padding: 0 }}>Which teams would you like to serve on? {required} <span style={{ fontWeight: 400, opacity: .6 }}>Choose as many as you like.</span></legend>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,200px),1fr))", gap: 8 }}>
          {SERVE_TEAMS.map((team, i) => {
            const active = teams.includes(team.id);
            return (
              <label key={team.id} htmlFor={`s-team-${team.id}`} style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 48, padding: "0 14px", borderRadius: 12, border: active ? "1.5px solid var(--red)" : "1.5px solid var(--line)", background: active ? "rgba(200,30,58,.06)" : "var(--cream)", fontSize: 15, fontWeight: 600, color: "var(--ink)", cursor: "pointer", transition: "border-color .15s, background .15s" }}>
                <input id={`s-team-${team.id}`} type="checkbox" {...(i === 0 ? errorProps("teams") : {})} checked={active} onChange={() => toggleTeam(team.id)} style={checkbox} />
                {team.name}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="s-note" style={labelStyle}>Experience and availability {optional}</label>
        <textarea id="s-note" className="field-input" style={{ ...inputStyle, minHeight: 110, resize: "vertical", lineHeight: 1.6 }} {...errorProps("note")} maxLength={SERVE_LIMITS.note} placeholder="Anything that helps us place you: where you've served before, skills, and which days you expect to be at the convention." value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <label htmlFor="s-under18" style={checkRow}>
        <input id="s-under18" type="checkbox" checked={under18} onChange={(e) => { setUnder18(e.target.checked); if (!e.target.checked) setGuardianConsent(false); }} style={checkbox} />
        <span>I am under 18 {optional}</span>
      </label>
      {under18 && (
        <div style={{ margin: "8px 0 4px 30px", padding: "12px 14px", borderRadius: 12, background: "var(--cream-2)", border: "1px solid var(--line)" }}>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>
            Volunteers under 18 need a parent or guardian&apos;s agreement to serve. Please talk with them before you sign up; the Convention Committee may contact them too.
          </p>
          <label htmlFor="s-guardian" style={checkRow}>
            <input id="s-guardian" type="checkbox" required aria-required="true" {...errorProps("guardianConsent")} checked={guardianConsent} onChange={(e) => setGuardianConsent(e.target.checked)} style={checkbox} />
            <span>My parent or guardian knows and agrees to me serving {required}</span>
          </label>
        </div>
      )}

      <label htmlFor="s-consent" style={{ ...checkRow, marginBottom: 18 }}>
        <input id="s-consent" type="checkbox" required aria-required="true" {...errorProps("consent")} checked={consent} onChange={(e) => setConsent(e.target.checked)} style={checkbox} />
        <span>
          I agree to be contacted by the CACNA Convention Committee about serving. My details are used only for that (see the{" "}
          <Link href="/privacy" style={{ color: "var(--red)", fontWeight: 700 }}>privacy policy</Link>). {required}
        </span>
      </label>

      <TurnstileField />

      {errMsg && (
        <p id="s-error" role="alert" style={{ color: "var(--red)", fontSize: 15, fontWeight: 600, margin: "0 0 14px" }}>{errMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="press"
        style={{ width: "100%", minHeight: 52, padding: "0 32px", borderRadius: 999, background: status === "loading" ? "var(--line)" : "linear-gradient(100deg,var(--blue),var(--red))", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: status === "loading" ? "not-allowed" : "pointer" }}
      >
        {status === "loading" ? "Sending…" : "Sign up to serve"}
      </button>
    </form>
  );
}
