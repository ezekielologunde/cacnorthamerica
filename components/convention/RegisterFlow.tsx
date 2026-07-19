"use client";

import { useState, type FormEvent } from "react";

export type RegistrantCategory = "adult" | "young_adult" | "child";
type RegistrantRow = { fullName: string; category: RegistrantCategory };

const CATEGORY_LABEL: Record<RegistrantCategory, string> = {
  adult: "Adult (20+)",
  young_adult: "Young Adult (13–19)",
  child: "Child (1–12) — Free",
};

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "12px 15px", borderRadius: 12,
  border: "1.5px solid var(--line)", background: "var(--cream)",
  fontSize: 15, color: "var(--ink)", outline: "none",
  fontFamily: "var(--font-body)",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 6,
};

/** Ported from the Convention project's RegistrationForm.tsx +
 *  RegisterPageClient.tsx (individual/group tabs, repeatable registrant
 *  rows), restyled to CACNA's own inline-style/CSS-custom-property design
 *  language instead of Convention's Tailwind tokens — the submit logic
 *  (POST /api/convention/register, redirect to the returned checkoutUrl)
 *  is unchanged. */
export function RegisterFlow() {
  const [mode, setMode] = useState<"individual" | "group">("individual");
  const [churchName, setChurchName] = useState("");
  const [registrants, setRegistrants] = useState<RegistrantRow[]>([{ fullName: "", category: "adult" }]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateRegistrant(index: number, patch: Partial<RegistrantRow>) {
    setRegistrants((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }
  function addRegistrant() {
    setRegistrants((current) => [...current, { fullName: "", category: "adult" }]);
  }
  function removeRegistrant(index: number) {
    setRegistrants((current) => current.filter((_, i) => i !== index));
  }
  function switchMode(next: "individual" | "group") {
    setMode(next);
    if (next === "individual") setRegistrants((current) => current.slice(0, 1));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      registrationType: mode,
      churchName: mode === "group" ? churchName : null,
      contactName,
      contactEmail,
      contactPhone,
      registrants,
    };

    try {
      const response = await fetch("/api/convention/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(data?.error || "Something went wrong submitting your registration. Please try again.");
        setIsSubmitting(false);
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setErrorMessage("Something went wrong submitting your registration. Please try again.");
      setIsSubmitting(false);
    }
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "10px 20px", borderRadius: 999, border: "none", cursor: "pointer",
    fontSize: 14, fontWeight: 700, fontFamily: "var(--font-body)",
    background: active ? "var(--ink)" : "transparent",
    color: active ? "#fff" : "var(--ink-soft)",
    transition: "background .2s, color .2s",
  });

  return (
    <div>
      <div role="tablist" aria-label="Registration type" style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 999, background: "var(--cream-2)", marginBottom: 28 }}>
        <button type="button" role="tab" aria-selected={mode === "individual"} onClick={() => switchMode("individual")} className="press" style={tabStyle(mode === "individual")}>
          Individual
        </button>
        <button type="button" role="tab" aria-selected={mode === "group"} onClick={() => switchMode("group")} className="press" style={tabStyle(mode === "group")}>
          Group / Church
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 520 }}>
        {mode === "group" && (
          <div>
            <label style={labelStyle}>Church / Group Name</label>
            <input style={inputStyle} value={churchName} onChange={(e) => setChurchName(e.target.value)} required autoComplete="organization" />
          </div>
        )}

        {registrants.map((registrant, index) => (
          <div key={index} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} value={registrant.fullName} onChange={(e) => updateRegistrant(index, { fullName: e.target.value })} required autoComplete="name" />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={registrant.category} onChange={(e) => updateRegistrant(index, { category: e.target.value as RegistrantCategory })}>
                {(Object.keys(CATEGORY_LABEL) as RegistrantCategory[]).map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                ))}
              </select>
            </div>
            {mode === "group" && registrants.length > 1 && (
              <button type="button" onClick={() => removeRegistrant(index)} className="press" style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "var(--red)", textDecoration: "underline", padding: 0 }}>
                Remove
              </button>
            )}
          </div>
        ))}

        {mode === "group" && (
          <button type="button" onClick={addRegistrant} className="press" style={{ alignSelf: "flex-start", background: "transparent", border: "1.5px solid var(--line)", borderRadius: 999, padding: "10px 20px", fontSize: 14, fontWeight: 700, color: "var(--ink)", cursor: "pointer" }}>
            + Add another registrant
          </button>
        )}

        <div>
          <label style={labelStyle}>Contact Name</label>
          <input style={inputStyle} value={contactName} onChange={(e) => setContactName(e.target.value)} required autoComplete="name" />
        </div>
        <div>
          <label style={labelStyle}>Contact Email</label>
          <input style={inputStyle} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div>
          <label style={labelStyle}>Contact Phone <span style={{ fontWeight: 400, opacity: .6 }}>(optional)</span></label>
          <input style={inputStyle} type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} autoComplete="tel" />
        </div>

        {errorMessage && (
          <p role="alert" style={{ fontSize: 14, fontWeight: 600, color: "var(--red)", margin: 0 }}>{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-sheen press"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: isSubmitting ? "var(--line)" : "linear-gradient(135deg,#7A1128,#FDC841)",
            color: "#fff", fontWeight: 800, fontSize: 16,
            padding: "16px 30px", borderRadius: 999, border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Submitting…" : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
}
