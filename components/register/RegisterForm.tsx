"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export type RegistrantCategory = "adult" | "young_adult" | "child";
type RegistrantRow = { fullName: string; category: RegistrantCategory };
type Mode = "individual" | "group" | "complimentary";

const inputStyle: CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "11px 14px", borderRadius: 10,
  border: "1.5px solid var(--line)", background: "var(--cream)",
  fontSize: 14.5, color: "var(--ink)",
  fontFamily: "var(--font-body)",
};
const labelStyle: CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 5 };

export function RegisterForm({ year }: { year: number }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("individual");
  const [churchName, setChurchName] = useState("");
  const [registrants, setRegistrants] = useState<RegistrantRow[]>([{ fullName: "", category: "adult" }]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [staffPasscode, setStaffPasscode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isComplimentary = mode === "complimentary";

  function updateRegistrant(index: number, patch: Partial<RegistrantRow>) {
    setRegistrants((current) => current.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRegistrant() {
    setRegistrants((current) => [...current, { fullName: "", category: "adult" }]);
  }

  function removeRegistrant(index: number) {
    setRegistrants((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // The Complimentary tab reuses the single-registrant Individual
          // layout (no church name, no add-another-registrant) -- it's a
          // one-off comp/staff-test registration, not a group booking.
          registrationType: mode === "group" ? "group" : "individual",
          churchName: mode === "group" ? churchName : null,
          contactName,
          contactEmail,
          contactPhone,
          registrants,
          isComplimentary,
          ...(isComplimentary ? { staffPasscode } : {}),
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.checkoutUrl) {
        setErrorMessage(typeof data?.error === "string" ? data.error : "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      if (data.checkoutUrl.startsWith("http")) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push(data.checkoutUrl);
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "1.5px solid var(--line)" }}>
        {([
          { key: "individual", label: "Individual" },
          { key: "group", label: "Church / Group" },
          { key: "complimentary", label: "Complimentary" },
        ] as const).map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            style={{
              padding: "10px 4px", marginBottom: -1.5, background: "none", border: "none",
              borderBottom: mode === m.key ? "2.5px solid var(--red)" : "2.5px solid transparent",
              color: mode === m.key ? "var(--red)" : "var(--ink-soft)",
              fontWeight: 700, fontSize: 14.5, cursor: "pointer", marginRight: 20,
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "group" && (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Church name <span style={{ color: "var(--red)" }}>*</span></label>
          <input
            className="field-input"
            style={inputStyle}
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            required
            autoComplete="organization"
          />
        </div>
      )}

      {isComplimentary && (
        <p style={{ marginBottom: 16, padding: "11px 14px", borderRadius: 10, background: "var(--cream)", fontSize: 13.5, color: "var(--ink-soft)" }}>
          Complimentary registrations are for staff/comp use only and require a staff passcode to submit.
        </p>
      )}

      {registrants.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 12, marginBottom: 12, alignItems: "end", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 16px 16px", position: "relative" }}>
          <div>
            <label style={labelStyle}>Full name <span style={{ color: "var(--red)" }}>*</span></label>
            <input
              className="field-input"
              style={inputStyle}
              value={r.fullName}
              onChange={(e) => updateRegistrant(i, { fullName: e.target.value })}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select
              className="field-input"
              style={{ ...inputStyle, cursor: "pointer" }}
              value={r.category}
              onChange={(e) => updateRegistrant(i, { category: e.target.value as RegistrantCategory })}
            >
              <option value="adult">Adult (30+)</option>
              <option value="young_adult">Young Adult (20-29)</option>
              <option value="child">Child (1-19) — Free</option>
            </select>
          </div>
          {mode === "group" && registrants.length > 1 && (
            <button
              type="button"
              onClick={() => removeRegistrant(i)}
              style={{ position: "absolute", top: 10, right: 14, background: "none", border: "none", color: "var(--red)", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      {mode === "group" && (
        <button
          type="button"
          onClick={addRegistrant}
          className="press"
          style={{ marginBottom: 20, background: "none", border: "1.5px solid var(--line)", borderRadius: 999, padding: "9px 18px", fontWeight: 700, fontSize: 13.5, color: "var(--ink)", cursor: "pointer" }}
        >
          + Add another registrant
        </button>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginTop: 8, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Contact name <span style={{ color: "var(--red)" }}>*</span></label>
          <input className="field-input" style={inputStyle} value={contactName} onChange={(e) => setContactName(e.target.value)} required autoComplete="name" />
        </div>
        <div>
          <label style={labelStyle}>Email <span style={{ color: "var(--red)" }}>*</span></label>
          <input className="field-input" style={inputStyle} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required autoComplete="email" />
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Phone <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
        <input className="field-input" style={inputStyle} type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} autoComplete="tel" />
      </div>

      {isComplimentary && (
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Staff passcode <span style={{ color: "var(--red)" }}>*</span></label>
          <input
            className="field-input"
            style={inputStyle}
            type="password"
            value={staffPasscode}
            onChange={(e) => setStaffPasscode(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
      )}

      {status === "error" && errorMessage && (
        <p role="alert" style={{ color: "var(--red)", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-sheen press"
        style={{
          width: "100%", padding: "16px 24px", borderRadius: 999,
          background: status === "loading" ? "var(--line)" : "linear-gradient(100deg,var(--red-deep),var(--red))",
          color: "#fff", fontWeight: 800, fontSize: 16, border: "none",
          cursor: status === "loading" ? "not-allowed" : "pointer",
        }}
      >
        {status === "loading"
          ? "Submitting…"
          : isComplimentary
            ? `Submit Complimentary Registration — CACNA ${year}`
            : `Continue to Payment — CACNA ${year}`}
      </button>
    </form>
  );
}
