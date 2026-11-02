"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FORM_HEADER, HONEYPOT_FIELD } from "@/lib/spam";
import { FeeBreakdown } from "@/components/checkout/FeeBreakdown";

export type RegistrantCategory = "adult" | "young_adult" | "child";
type RegistrantRow = { firstName: string; lastName: string; category: RegistrantCategory | "" };
type Mode = "individual" | "group";

// 16px text stops iOS Safari zooming the page on focus; 48px height is a
// comfortable thumb target. Both live in .reg-input (globals.css).
const labelStyle: CSSProperties = { display: "block", fontSize: 13.5, fontWeight: 700, color: "var(--ink)", marginBottom: 6 };
const hintStyle: CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 500, color: "var(--ink-soft)", marginTop: 5 };

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function StepHeading({ n, title }: { n: number; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "28px 0 14px" }}>
      <span
        aria-hidden
        style={{
          width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(140deg,var(--flame),var(--red))", color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800,
        }}
      >
        {n}
      </span>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "var(--ink)", margin: 0 }}>{title}</h2>
    </div>
  );
}

export function RegisterForm({ year, priceMap }: { year: number; priceMap: Partial<Record<RegistrantCategory, number>> }) {
  const t = useTranslations("Register");
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("individual");
  const [churchName, setChurchName] = useState("");
  const [registrants, setRegistrants] = useState<RegistrantRow[]>([{ firstName: "", lastName: "", category: "" }]);
  const [bulkNames, setBulkNames] = useState("");
  const [bulkCategory, setBulkCategory] = useState<RegistrantCategory | "">("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // After "+ Add" / "Duplicate", jump straight into the new row's name field
  // so a phone user keeps typing instead of hunting for it.
  const nameRefs = useRef<(HTMLInputElement | null)[]>([]);
  const focusRow = useRef<number | null>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (focusRow.current !== null) {
      nameRefs.current[focusRow.current]?.focus();
      focusRow.current = null;
    }
  }, [registrants.length]);

  useEffect(() => {
    if (errorMessage) errorRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [errorMessage]);

  // Individual and Group both support registering any number of people; the
  // only difference between them is whether a church name is collected.
  const total = useMemo(
    () => registrants.reduce((sum, r) => sum + (r.category ? priceMap[r.category] ?? 0 : 0), 0),
    [registrants, priceMap]
  );

  function updateRegistrant(index: number, patch: Partial<RegistrantRow>) {
    setRegistrants((current) => current.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRegistrant() {
    focusRow.current = registrants.length;
    setRegistrants((current) => [...current, { firstName: "", lastName: "", category: "" }]);
  }

  function duplicateRegistrant(index: number) {
    focusRow.current = index + 1;
    setRegistrants((current) => {
      const source = current[index];
      const copy = [...current];
      copy.splice(index + 1, 0, { firstName: "", lastName: "", category: source.category });
      return copy;
    });
  }

  function removeRegistrant(index: number) {
    setRegistrants((current) => current.filter((_, i) => i !== index));
  }

  // Pastes a block of names (one per line) into that many new registrant
  // rows at once, all set to `bulkCategory` -- built for a church signing up
  // a whole busload of members without clicking "+ Add" dozens of times.
  const bulkCount = bulkNames.split("\n").map((n) => n.trim()).filter(Boolean).length;
  function addBulkNames() {
    const names = bulkNames.split("\n").map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) return;
    if (!bulkCategory) return;
    // "Jane Mary Doe" -> first "Jane Mary", last "Doe"; a single word leaves the
    // last name empty so the row is flagged as required.
    const newRows: RegistrantRow[] = names.map((full) => {
      const parts = full.split(/\s+/);
      const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
      const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0];
      return { firstName, lastName, category: bulkCategory };
    });
    setRegistrants((current) =>
      current.length === 1 && current[0].firstName.trim() === "" && current[0].lastName.trim() === "" ? newRows : [...current, ...newRows]
    );
    setBulkNames("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const missing = registrants.findIndex((r) => !r.category);
    if (missing !== -1) {
      setErrorMessage(registrants.length > 1 ? `Choose a category for Person ${missing + 1}.` : "Choose a category from the list.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    const honeypot = new FormData(event.currentTarget as HTMLFormElement).get(HONEYPOT_FIELD);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", [FORM_HEADER]: "1" },
        body: JSON.stringify({
          [HONEYPOT_FIELD]: typeof honeypot === "string" ? honeypot : "",
          registrationType: mode,
          churchName: mode === "group" ? churchName : null,
          contactName,
          contactEmail,
          contactPhone,
          registrants: registrants.map((r) => ({
            firstName: r.firstName.trim(),
            lastName: r.lastName.trim(),
            fullName: `${r.firstName.trim()} ${r.lastName.trim()}`,
            category: r.category,
          })),
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

  const categoryOptions = (
    <>
      <option value="" disabled>{t("categoryPlaceholder")}</option>
      <option value="adult">{t("categoryAdult")}</option>
      <option value="young_adult">{t("categoryYoungAdult")}</option>
      <option value="child">{t("categoryChild")}</option>
    </>
  );

  const submitLabel = status === "loading" ? t("submitting") : `${t("submit")} — CACNA ${year}`;

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {/* Two big, equal tabs. */}
      <div role="tablist" aria-label="Registration type" className="reg-seg">
        {([
          { key: "individual", label: t("individualTab") },
          { key: "group", label: t("groupTab") },
        ] as const).map((m) => (
          <button
            key={m.key}
            type="button"
            role="tab"
            aria-selected={mode === m.key}
            onClick={() => setMode(m.key)}
            className={mode === m.key ? "reg-seg-btn on" : "reg-seg-btn"}
          >
            {m.label}
          </button>
        ))}
      </div>

      <StepHeading n={1} title={mode === "group" ? "Your group" : "Who's coming"} />

      {mode === "group" && (
        <label style={{ display: "block", marginBottom: 14 }}>
          <span style={labelStyle}>{t("churchName")} <span style={{ color: "var(--red)" }}>*</span></span>
          <input
            className="field-input reg-input"
            name="organization"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            required
            autoComplete="organization"
            autoCapitalize="words"
            enterKeyHint="next"
          />
        </label>
      )}

      {registrants.map((r, i) => (
        <div key={i} style={{ marginBottom: 12, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "12px 14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 44 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-soft)" }}>
              {registrants.length > 1 ? `Person ${i + 1}` : "Registrant"}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button type="button" onClick={() => duplicateRegistrant(i)} className="reg-linkbtn" style={{ color: "var(--ink-soft)" }}>
                Duplicate
              </button>
              {registrants.length > 1 && (
                <button type="button" onClick={() => removeRegistrant(i)} className="reg-linkbtn" style={{ color: "var(--red)" }}>
                  {t("removeRegistrant")}
                </button>
              )}
            </div>
          </div>
          <div className="reg-row2">
            <label>
              <span style={labelStyle}>{t("firstName")} <span style={{ color: "var(--red)" }}>*</span></span>
              <input
                ref={(el) => { nameRefs.current[i] = el; }}
                className="field-input reg-input"
                name={`registrant-${i}-first-name`}
                value={r.firstName}
                onChange={(e) => updateRegistrant(i, { firstName: e.target.value })}
                required
                autoComplete={i === 0 ? "given-name" : "off"}
                autoCapitalize="words"
                enterKeyHint="next"
              />
            </label>
            <label>
              <span style={labelStyle}>{t("lastName")} <span style={{ color: "var(--red)" }}>*</span></span>
              <input
                className="field-input reg-input"
                name={`registrant-${i}-last-name`}
                value={r.lastName}
                onChange={(e) => updateRegistrant(i, { lastName: e.target.value })}
                required
                autoComplete={i === 0 ? "family-name" : "off"}
                autoCapitalize="words"
                enterKeyHint="next"
              />
            </label>
          </div>
          <label style={{ display: "block", marginTop: 12 }}>
            <span style={labelStyle}>{t("category")} <span style={{ color: "var(--red)" }}>*</span></span>
            <select
              className="field-input reg-input"
              name={`registrant-${i}-category`}
              style={{ cursor: "pointer" }}
              value={r.category}
              onChange={(e) => updateRegistrant(i, { category: e.target.value as RegistrantCategory })}
              required
            >
              {categoryOptions}
            </select>
            {!r.category && <span style={hintStyle}>{t("categoryHint")}</span>}
          </label>
        </div>
      ))}

      <>
          <button type="button" onClick={addRegistrant} className="press reg-add">
            + {t("addRegistrant")}
          </button>

          {/* Registering a large group (a church bus, a whole family) one
              tap at a time is tedious -- collapsed by default so it does not
              crowd a phone screen, but one tap away. */}
          <details className="reg-bulk">
            <summary>Registering many people? Paste a list of names</summary>
            <label style={{ display: "block", marginTop: 12 }}>
              <span style={labelStyle}>One name per line</span>
              <textarea
                className="field-input reg-input"
                style={{ minHeight: 96, resize: "vertical", fontFamily: "var(--font-body)" }}
                value={bulkNames}
                onChange={(e) => setBulkNames(e.target.value)}
                placeholder={"Jane Doe\nJohn Doe\nMary Doe"}
                autoCapitalize="words"
              />
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginTop: 10 }}>
              <select
                aria-label="Category for pasted names"
                className="field-input reg-input"
                style={{ width: "auto", flex: "1 1 160px", cursor: "pointer" }}
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value as RegistrantCategory | "")}
              >
                {categoryOptions}
              </select>
              <button
                type="button"
                onClick={addBulkNames}
                disabled={bulkCount === 0 || !bulkCategory}
                className="press"
                style={{
                  flex: "1 1 140px", minHeight: 48, background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 14.5,
                  padding: "0 18px", borderRadius: 999, border: "none",
                  cursor: bulkCount === 0 || !bulkCategory ? "not-allowed" : "pointer", opacity: bulkCount === 0 || !bulkCategory ? 0.5 : 1,
                }}
              >
                + Add {bulkCount || ""} {bulkCount === 1 ? "person" : "people"}
              </button>
            </div>
          </details>
      </>

      <StepHeading n={2} title="Your contact details" />
      <p style={{ margin: "-6px 0 14px", fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
        We email your confirmation and QR code here.
      </p>

      <label style={{ display: "block", marginBottom: 14 }}>
        <span style={labelStyle}>{t("contactName")} <span style={{ color: "var(--red)" }}>*</span></span>
        <input
          className="field-input reg-input"
          name="contact-name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          required
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
        />
      </label>
      <label style={{ display: "block", marginBottom: 14 }}>
        <span style={labelStyle}>{t("contactEmail")} <span style={{ color: "var(--red)" }}>*</span></span>
        <input
          className="field-input reg-input"
          name="email"
          type="email"
          inputMode="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="next"
        />
      </label>
      <label style={{ display: "block", marginBottom: 14 }}>
        <span style={labelStyle}>{t("contactPhone")}</span>
        <input
          className="field-input reg-input"
          name="tel"
          type="tel"
          inputMode="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          autoComplete="tel"
          enterKeyHint="done"
        />
        <span style={hintStyle}>Only used if we need to reach you about your registration.</span>
      </label>

      {status === "error" && errorMessage && (
        <p ref={errorRef} role="alert" style={{ color: "var(--red)", fontWeight: 700, fontSize: 14.5, margin: "4px 0 12px", padding: "12px 14px", borderRadius: 12, background: "rgba(200,30,58,.08)" }}>
          {errorMessage}
        </p>
      )}

      {/* Sticky on phones: the running total and the pay button stay in thumb
          reach however long the list of people gets. The total is computed
          from the same tiers the server re-prices with, so what is shown here
          is what Stripe will charge, plus the disclosed processing fee. */}
      <div className="reg-sticky">
        <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 6 }} aria-live="polite">
          {registrants.length} {registrants.length === 1 ? "registrant" : "registrants"}
        </span>
        <div style={{ marginBottom: 10 }}>
          {total > 0 ? (
            <FeeBreakdown subtotalCents={total} />
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-soft)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)" }}>{formatPrice(0)}</span>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-sheen press"
          style={{
            width: "100%", minHeight: 54, padding: "0 24px", borderRadius: 999,
            background: status === "loading" ? "var(--line)" : "linear-gradient(100deg,var(--red-deep),var(--red))",
            color: "#fff", fontWeight: 800, fontSize: 16, border: "none",
            cursor: status === "loading" ? "not-allowed" : "pointer",
          }}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
