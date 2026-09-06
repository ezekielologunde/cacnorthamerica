"use client";

import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function RegisterForm({ year, priceMap }: { year: number; priceMap: Partial<Record<RegistrantCategory, number>> }) {
  const t = useTranslations("Register");
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("individual");
  const [churchName, setChurchName] = useState("");
  const [registrants, setRegistrants] = useState<RegistrantRow[]>([{ fullName: "", category: "adult" }]);
  // Every new row (via "+ Add", duplicate, or bulk-add) starts on whichever
  // category was picked most recently, instead of always resetting to
  // "adult" -- saves a re-click when adding several people of the same kind
  // (e.g. a youth group registering 10 young adults in a row).
  const [lastCategory, setLastCategory] = useState<RegistrantCategory>("adult");
  const [bulkNames, setBulkNames] = useState("");
  const [bulkCategory, setBulkCategory] = useState<RegistrantCategory>("adult");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [staffPasscode, setStaffPasscode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isComplimentary = mode === "complimentary";
  // The Complimentary tab is a one-off staff/comp registration, not a group
  // booking -- it keeps the single-registrant layout. Individual and Group
  // both support registering any number of people; the only difference
  // between them is whether a church name is collected.
  const allowsMultiple = !isComplimentary;

  // Complimentary submissions are always zeroed server-side regardless of
  // category (see app/api/register/route.ts) -- reflect that here so the
  // live total never shows a price that won't actually be charged.
  const total = useMemo(
    () => (isComplimentary ? 0 : registrants.reduce((sum, r) => sum + (priceMap[r.category] ?? 0), 0)),
    [registrants, priceMap, isComplimentary]
  );

  function updateRegistrant(index: number, patch: Partial<RegistrantRow>) {
    setRegistrants((current) => current.map((r, i) => (i === index ? { ...r, ...patch } : r)));
    if (patch.category) setLastCategory(patch.category);
  }

  function addRegistrant() {
    setRegistrants((current) => [...current, { fullName: "", category: lastCategory }]);
  }

  function duplicateRegistrant(index: number) {
    setRegistrants((current) => {
      const source = current[index];
      const copy = [...current];
      copy.splice(index + 1, 0, { fullName: "", category: source.category });
      return copy;
    });
  }

  function removeRegistrant(index: number) {
    setRegistrants((current) => current.filter((_, i) => i !== index));
  }

  // Pastes a block of names (one per line) into that many new registrant
  // rows at once, all set to `bulkCategory` -- built for a church signing up
  // a whole busload of members without clicking "+ Add" dozens of times.
  function addBulkNames() {
    const names = bulkNames.split("\n").map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) return;
    const newRows: RegistrantRow[] = names.map((fullName) => ({ fullName, category: bulkCategory }));
    setRegistrants((current) =>
      current.length === 1 && current[0].fullName.trim() === "" ? newRows : [...current, ...newRows]
    );
    setLastCategory(bulkCategory);
    setBulkNames("");
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
          { key: "individual", label: t("individualTab") },
          { key: "group", label: t("groupTab") },
          { key: "complimentary", label: t("complimentaryTab") },
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
          <label style={labelStyle}>{t("churchName")} <span style={{ color: "var(--red)" }}>*</span></label>
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
        <div key={i} style={{ marginBottom: 12, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 16px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-soft)" }}>
              Registrant {i + 1}
            </span>
            {allowsMultiple && (
              <div style={{ display: "flex", gap: 14 }}>
                <button
                  type="button"
                  onClick={() => duplicateRegistrant(i)}
                  style={{ background: "none", border: "none", color: "var(--ink-soft)", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                >
                  Duplicate
                </button>
                {registrants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRegistrant(i)}
                    style={{ background: "none", border: "none", color: "var(--red)", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                  >
                    {t("removeRegistrant")}
                  </button>
                )}
              </div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 12, alignItems: "end" }}>
            <div>
              <label style={labelStyle}>{t("fullName")} <span style={{ color: "var(--red)" }}>*</span></label>
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
              <label style={labelStyle}>{t("category")}</label>
              <select
                className="field-input"
                style={{ ...inputStyle, cursor: "pointer" }}
                value={r.category}
                onChange={(e) => updateRegistrant(i, { category: e.target.value as RegistrantCategory })}
              >
                <option value="adult">{t("categoryAdult")}</option>
                <option value="young_adult">{t("categoryYoungAdult")}</option>
                <option value="child">{t("categoryChild")}</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      {allowsMultiple && (
        <>
          <button
            type="button"
            onClick={addRegistrant}
            className="press"
            style={{ marginBottom: 16, marginRight: 10, background: "none", border: "1.5px solid var(--line)", borderRadius: 999, padding: "9px 18px", fontWeight: 700, fontSize: 13.5, color: "var(--ink)", cursor: "pointer" }}
          >
            + {t("addRegistrant")}
          </button>

          {/* Registering a large group (a church bus, a whole family) one
              click at a time is tedious -- paste every name at once instead. */}
          <div style={{ marginBottom: 20, background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 16px" }}>
            <label style={labelStyle}>Add multiple people at once — paste one name per line</label>
            <textarea
              className="field-input"
              style={{ ...inputStyle, minHeight: 70, resize: "vertical", fontFamily: "var(--font-body)" }}
              value={bulkNames}
              onChange={(e) => setBulkNames(e.target.value)}
              placeholder={"Jane Doe\nJohn Doe\nMary Doe"}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
              <select
                className="field-input"
                style={{ ...inputStyle, width: "auto", padding: "8px 10px", cursor: "pointer" }}
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value as RegistrantCategory)}
              >
                <option value="adult">{t("categoryAdult")}</option>
                <option value="young_adult">{t("categoryYoungAdult")}</option>
                <option value="child">{t("categoryChild")}</option>
              </select>
              <button
                type="button"
                onClick={addBulkNames}
                disabled={bulkNames.trim() === ""}
                className="press"
                style={{
                  background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 13.5,
                  padding: "10px 18px", borderRadius: 999, border: "none",
                  cursor: bulkNames.trim() === "" ? "not-allowed" : "pointer",
                  opacity: bulkNames.trim() === "" ? 0.5 : 1,
                }}
              >
                + Add {bulkNames.split("\n").map((n) => n.trim()).filter(Boolean).length || ""} people
              </button>
            </div>
          </div>
        </>
      )}

      {/* Live headcount + running total -- computed from the same tiers the
          server re-prices with, so what's shown here is what Stripe will
          actually charge. */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--cream-2)", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink-soft)" }}>
          {registrants.length} {registrants.length === 1 ? "registrant" : "registrants"}
        </span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)" }}>
          {formatPrice(total)}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginTop: 8, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>{t("contactName")} <span style={{ color: "var(--red)" }}>*</span></label>
          <input className="field-input" style={inputStyle} value={contactName} onChange={(e) => setContactName(e.target.value)} required autoComplete="name" />
        </div>
        <div>
          <label style={labelStyle}>{t("contactEmail")} <span style={{ color: "var(--red)" }}>*</span></label>
          <input className="field-input" style={inputStyle} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required autoComplete="email" />
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>{t("contactPhone")}</label>
        <input className="field-input" style={inputStyle} type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} autoComplete="tel" />
      </div>

      {isComplimentary && (
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>{t("staffPasscode")} <span style={{ color: "var(--red)" }}>*</span></label>
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
          ? t("submitting")
          : isComplimentary
            ? `${t("submitComplimentary")} — CACNA ${year}`
            : `${t("submit")} — CACNA ${year}`}
      </button>
    </form>
  );
}
