"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";

type AgeRange = "0-12" | "13-19" | "20-29" | "30+";
type MealSlot = "tue_lunch" | "tue_dinner" | "wed_lunch" | "wed_dinner" | "thu_lunch" | "thu_dinner" | "fri_lunch" | "fri_dinner";

const MEAL_SLOTS: { key: MealSlot; label: string }[] = [
  { key: "tue_lunch", label: "Tuesday Lunch — 7/14" },
  { key: "tue_dinner", label: "Tuesday Dinner — 7/14" },
  { key: "wed_lunch", label: "Wednesday Lunch — 7/15" },
  { key: "wed_dinner", label: "Wednesday Dinner — 7/15" },
  { key: "thu_lunch", label: "Thursday Lunch — 7/16" },
  { key: "thu_dinner", label: "Thursday Dinner — 7/16" },
  { key: "fri_lunch", label: "Friday Lunch — 7/17" },
  { key: "fri_dinner", label: "Friday Dinner — 7/17" },
];

const inputStyle: CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "11px 14px", borderRadius: 10,
  border: "1.5px solid var(--line)", background: "var(--cream)",
  fontSize: 14.5, color: "var(--ink)",
  fontFamily: "var(--font-body)",
};
const labelStyle: CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 5 };

export function MealRequestForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ageRange, setAgeRange] = useState<AgeRange>("0-12");
  const [churchName, setChurchName] = useState("");
  const [youthLeaderName, setYouthLeaderName] = useState("");
  const [childrenNames, setChildrenNames] = useState("");
  const [dccZone, setDccZone] = useState("");
  const [meals, setMeals] = useState<MealSlot[]>([]);
  const [allergies, setAllergies] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function toggleMeal(slot: MealSlot) {
    setMeals((current) => (current.includes(slot) ? current.filter((m) => m !== slot) : [...current, slot]));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (meals.length === 0) {
      setErrorMessage("Select at least one meal.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/meal-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, phone, ageRange, churchName, youthLeaderName,
          childrenNames: childrenNames.trim() || null,
          dccZone, meals,
          allergies: allergies.trim() || null,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrorMessage(typeof data?.error === "string" ? data.error : "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "clamp(32px,5vw,44px)" }}>
        <CheckCircle2 size={36} strokeWidth={1.8} color="var(--gold)" aria-hidden style={{ marginBottom: 14 }} />
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink)", margin: "0 0 8px" }}>You&apos;re on the list!</h3>
        <p style={{ fontSize: 14.5, color: "var(--ink-soft)", margin: 0 }}>Thanks — we&apos;ve received your meal request. See you at the Convention!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>First name <span style={{ color: "var(--red)" }}>*</span></label>
          <input className="field-input" style={inputStyle} value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoComplete="given-name" />
        </div>
        <div>
          <label style={labelStyle}>Last name <span style={{ color: "var(--red)" }}>*</span></label>
          <input className="field-input" style={inputStyle} value={lastName} onChange={(e) => setLastName(e.target.value)} required autoComplete="family-name" />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Email address <span style={{ color: "var(--red)" }}>*</span></label>
        <input className="field-input" style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Phone number <span style={{ color: "var(--red)" }}>*</span></label>
        <input className="field-input" style={inputStyle} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Age range</label>
        <select className="field-input" style={{ ...inputStyle, cursor: "pointer" }} value={ageRange} onChange={(e) => setAgeRange(e.target.value as AgeRange)}>
          <option value="0-12">0–12</option>
          <option value="13-19">13–19</option>
          <option value="20-29">20–29</option>
          <option value="30+">30+</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Church name <span style={{ color: "var(--red)" }}>*</span></label>
        <input className="field-input" style={inputStyle} value={churchName} onChange={(e) => setChurchName(e.target.value)} required autoComplete="organization" />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Youth leader&apos;s name <span style={{ color: "var(--red)" }}>*</span></label>
        <input className="field-input" style={inputStyle} value={youthLeaderName} onChange={(e) => setYouthLeaderName(e.target.value)} required />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Children traveling with you (optional)</label>
        <textarea className="field-input" style={{ ...inputStyle, resize: "vertical" }} rows={2} value={childrenNames} onChange={(e) => setChildrenNames(e.target.value)} />
        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "4px 0 0" }}>List up to 3 names living in your household — not youth from your church.</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>DCC / Zone <span style={{ color: "var(--red)" }}>*</span></label>
        <input className="field-input" style={inputStyle} value={dccZone} onChange={(e) => setDccZone(e.target.value)} required />
        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "4px 0 0" }}>If you don&apos;t know, write &quot;Not sure.&quot;</p>
      </div>

      <fieldset style={{ border: "none", padding: 0, margin: "0 0 20px" }}>
        <legend style={{ ...labelStyle, marginBottom: 10 }}>Which meals will you join us for? <span style={{ color: "var(--red)" }}>*</span></legend>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "8px 16px" }}>
          {MEAL_SLOTS.map((slot) => (
            <label key={slot.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--ink)", cursor: "pointer" }}>
              <input type="checkbox" checked={meals.includes(slot.key)} onChange={() => toggleMeal(slot.key)} />
              {slot.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Food allergies / limitations (optional)</label>
        <textarea className="field-input" style={{ ...inputStyle, resize: "vertical" }} rows={2} value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. vegetarian, vegan, nut allergy" />
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" style={{ color: "var(--red)", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-sheen press"
        style={{ width: "100%", padding: "15px 24px", borderRadius: 999, background: status === "loading" ? "var(--line)" : "linear-gradient(100deg,var(--red-deep),var(--red))", color: "#fff", fontWeight: 800, fontSize: 16, border: "none", cursor: status === "loading" ? "not-allowed" : "pointer" }}
      >
        {status === "loading" ? "Submitting…" : "Submit meal request"}
      </button>
    </form>
  );
}
