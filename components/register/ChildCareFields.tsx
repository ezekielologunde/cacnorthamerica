"use client";

import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  ALLERGY_SEVERITIES,
  ALLERGY_TYPES,
  CARE_LIMITS,
  MAX_CHILD_ALLERGIES,
  MAX_PICKUPS,
  isPlausiblePhone,
  type AllergySeverity,
  type AllergyType,
} from "@/lib/childCare";

// Children's Ministry care details inside the Youth & Child form (one panel
// per child 12 and under, one family block for all of them). The rules live
// in lib/childCare.ts and are re-checked on the server.
//
// Medical data: this state is never written to browser storage, analytics or
// the URL.

export type AllergyRow = { key: number; type: AllergyType | ""; name: string; severity: AllergySeverity | "" };
export type YesNo = "" | "yes" | "no";
export type ChildCareState = {
  hasAllergies: YesNo;
  allergies: AllergyRow[];
  medicalNotes: string;
  medications: string;
  dietaryNeeds: string;
  specialNeeds: string;
  photoConsent: YesNo;
};
export type PickupRow = { key: number; name: string; phone: string };
export type FamilyCareState = {
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  pickups: PickupRow[];
  consent: boolean;
};

export function emptyChildCare(): ChildCareState {
  return { hasAllergies: "", allergies: [], medicalNotes: "", medications: "", dietaryNeeds: "", specialNeeds: "", photoConsent: "" };
}

export function emptyFamilyCare(): FamilyCareState {
  return { emergencyName: "", emergencyPhone: "", emergencyRelationship: "", pickups: [], consent: false };
}

type T = ReturnType<typeof useTranslations<"ChildCare">>;
type TextKey = "medicalNotes" | "medications" | "dietaryNeeds" | "specialNeeds";
const TEXT_FIELDS: TextKey[] = ["medications", "medicalNotes", "dietaryNeeds", "specialNeeds"];

/** Error keys are `${prefix}-...`; the first one in insertion order is the
 *  first invalid field on the page. Mirrors parseChildCare. */
export function validateChildCare(prefix: string, care: ChildCareState, t: T): Record<string, string> {
  const found: Record<string, string> = {};
  if (!care.hasAllergies) found[`${prefix}-has`] = t("errHasAllergies");
  if (care.hasAllergies === "yes") {
    if (care.allergies.length === 0) found[`${prefix}-has`] = t("errAddAllergy");
    for (const a of care.allergies) {
      if (!a.type) found[`${prefix}-a${a.key}-type`] = t("errAllergyType");
      if (!a.name.trim()) found[`${prefix}-a${a.key}-name`] = t("errAllergyName");
      if (!a.severity) found[`${prefix}-a${a.key}-severity`] = t("errAllergySeverity");
    }
  }
  for (const key of TEXT_FIELDS) {
    if (care[key].trim().length > CARE_LIMITS[key]) found[`${prefix}-${key}`] = t("errTooLong", { max: CARE_LIMITS[key] });
  }
  if (!care.photoConsent) found[`${prefix}-photo`] = t("errPhoto");
  return found;
}

/** Mirrors parseFamilyCare. */
export function validateFamilyCare(fam: FamilyCareState, t: T): Record<string, string> {
  const found: Record<string, string> = {};
  if (!fam.emergencyName.trim()) found["fam-emergencyName"] = t("errEmergencyName");
  if (!isPlausiblePhone(fam.emergencyPhone)) found["fam-emergencyPhone"] = t("errPhone");
  for (const p of fam.pickups) {
    if (!p.name.trim()) found[`fam-pickup${p.key}-name`] = t("errPickupName");
    if (!isPlausiblePhone(p.phone)) found[`fam-pickup${p.key}-phone`] = t("errPhone");
  }
  if (!fam.consent) found["fam-consent"] = t("errConsent");
  return found;
}

export function childCarePayload(care: ChildCareState) {
  const hasAllergies = care.hasAllergies === "yes";
  return {
    hasAllergies,
    allergies: hasAllergies ? care.allergies.map((a) => ({ type: a.type, name: a.name.trim(), severity: a.severity })) : [],
    medicalNotes: care.medicalNotes.trim(),
    medications: care.medications.trim(),
    dietaryNeeds: care.dietaryNeeds.trim(),
    specialNeeds: care.specialNeeds.trim(),
    photoConsent: care.photoConsent === "yes",
  };
}

export function familyCarePayload(fam: FamilyCareState) {
  return {
    emergencyName: fam.emergencyName.trim(),
    emergencyPhone: fam.emergencyPhone.trim(),
    emergencyRelationship: fam.emergencyRelationship.trim(),
    pickups: fam.pickups.map((p) => ({ name: p.name.trim(), phone: p.phone.trim() })),
    consent: fam.consent,
  };
}

/** The form's per-field helpers, passed down so ids and errors stay in one place. */
export type FieldKit = {
  errors: Record<string, string>;
  fid: (name: string) => string;
  clearError: (name: string) => void;
  a11y: (name: string, hintId?: string) => { id: string; "aria-invalid"?: true; "aria-describedby"?: string };
  fieldError: (name: string) => ReactNode;
  labelStyle: CSSProperties;
  hintStyle: CSSProperties;
  required: ReactNode;
  newKey: () => number;
};

function YesNoGroup({
  name, legend, hint, value, onChange, yes, no, kit,
}: { name: string; legend: string; hint?: string; value: YesNo; onChange: (v: YesNo) => void; yes: string; no: string; kit: FieldKit }) {
  const invalid = kit.errors[name] ? true : undefined;
  const errorId = invalid ? kit.fid(`${name}-err`) : undefined;
  const describedBy = [kit.errors[name] ? kit.fid(`${name}-err`) : null, hint ? kit.fid(`${name}-hint`) : null].filter(Boolean).join(" ");
  return (
    <fieldset style={{ border: "none", padding: 0, margin: "14px 0 0", minWidth: 0 }} aria-describedby={describedBy || undefined}>
      <legend style={{ ...kit.labelStyle, padding: 0 }}>{legend} {kit.required}</legend>
      {hint && <span id={kit.fid(`${name}-hint`)} style={{ ...kit.hintStyle, marginTop: 0, marginBottom: 8 }}>{hint}</span>}
      <div className="reg-row2" style={{ gap: 8 }}>
        {(["yes", "no"] as const).map((v, i) => (
          <label key={v} className="reg-check" style={invalid ? { borderColor: "var(--red)" } : undefined}>
            <input
              id={kit.fid(`${name}-${i}`)}
              type="radio"
              name={kit.fid(name)}
              aria-invalid={invalid}
              aria-describedby={errorId}
              checked={value === v}
              onChange={() => { onChange(v); kit.clearError(name); }}
            />
            {v === "yes" ? yes : no}
          </label>
        ))}
      </div>
      {kit.fieldError(name)}
    </fieldset>
  );
}

export function ChildCarePanel({
  prefix, who, value, onChange, kit,
}: { prefix: string; who: string; value: ChildCareState; onChange: (patch: Partial<ChildCareState>) => void; kit: FieldKit }) {
  const t = useTranslations("ChildCare");

  function updateAllergy(key: number, patch: Partial<AllergyRow>) {
    onChange({ allergies: value.allergies.map((a) => (a.key === key ? { ...a, ...patch } : a)) });
  }
  function addAllergy() {
    if (value.allergies.length >= MAX_CHILD_ALLERGIES) return;
    onChange({ allergies: [...value.allergies, { key: kit.newKey(), type: "", name: "", severity: "" }] });
    kit.clearError(`${prefix}-has`);
  }

  return (
    <section
      aria-labelledby={kit.fid(`${prefix}-care-h`)}
      style={{ marginTop: 16, padding: "14px 14px 16px", borderRadius: 14, background: "var(--cream)", border: "1px solid var(--line)" }}
    >
      <h4 id={kit.fid(`${prefix}-care-h`)} style={{ margin: 0, fontSize: 15.5, fontWeight: 800, color: "var(--ink)" }}>{t("panelHeading", { who })}</h4>
      <p style={{ margin: "4px 0 0", fontSize: 13.5, lineHeight: 1.5, color: "var(--ink-soft)" }}>{t("panelBody")}</p>

      <YesNoGroup
        name={`${prefix}-has`}
        legend={t("hasAllergiesLegend", { who })}
        value={value.hasAllergies}
        onChange={(v) => onChange({ hasAllergies: v, allergies: v === "yes" && value.allergies.length === 0 ? [{ key: kit.newKey(), type: "", name: "", severity: "" }] : value.allergies })}
        yes={t("yesAllergies")}
        no={t("noAllergies")}
        kit={kit}
      />

      {value.hasAllergies === "yes" && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          {value.allergies.map((a, i) => (
            <div key={a.key} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 40 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--ink-soft)" }}>{t("allergyN", { n: i + 1 })}</span>
                {value.allergies.length > 1 && (
                  <button type="button" className="reg-linkbtn" style={{ color: "var(--red)" }} onClick={() => onChange({ allergies: value.allergies.filter((x) => x.key !== a.key) })} aria-label={t("removeAllergyLabel", { n: i + 1 })}>
                    {t("remove")}
                  </button>
                )}
              </div>
              <div className="reg-row2">
                <div>
                  <label htmlFor={kit.fid(`${prefix}-a${a.key}-name`)} style={kit.labelStyle}>{t("allergyName")} {kit.required}</label>
                  <input
                    {...kit.a11y(`${prefix}-a${a.key}-name`)}
                    className="field-input reg-input"
                    value={a.name}
                    maxLength={CARE_LIMITS.allergyName}
                    placeholder={t("allergyNamePlaceholder")}
                    onChange={(e) => { updateAllergy(a.key, { name: e.target.value }); kit.clearError(`${prefix}-a${a.key}-name`); }}
                    autoComplete="off"
                    enterKeyHint="next"
                  />
                  {kit.fieldError(`${prefix}-a${a.key}-name`)}
                </div>
                <div>
                  <label htmlFor={kit.fid(`${prefix}-a${a.key}-type`)} style={kit.labelStyle}>{t("allergyType")} {kit.required}</label>
                  <select
                    {...kit.a11y(`${prefix}-a${a.key}-type`)}
                    className="field-input reg-input"
                    value={a.type}
                    onChange={(e) => { updateAllergy(a.key, { type: e.target.value as AllergyType }); kit.clearError(`${prefix}-a${a.key}-type`); }}
                  >
                    <option value="" disabled>{t("typePlaceholder")}</option>
                    {ALLERGY_TYPES.map((type) => <option key={type} value={type}>{t(`type_${type}`)}</option>)}
                  </select>
                  {kit.fieldError(`${prefix}-a${a.key}-type`)}
                </div>
              </div>
              <fieldset style={{ border: "none", padding: 0, margin: "10px 0 0", minWidth: 0 }} aria-describedby={kit.errors[`${prefix}-a${a.key}-severity`] ? kit.fid(`${prefix}-a${a.key}-severity-err`) : undefined}>
                <legend style={{ ...kit.labelStyle, padding: 0 }}>{t("severityLegend")} {kit.required}</legend>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: 8 }}>
                  {ALLERGY_SEVERITIES.map((sev, si) => (
                    <label key={sev} className="reg-check" style={{ ...(sev === "severe" ? { fontWeight: 800 } : {}), ...(kit.errors[`${prefix}-a${a.key}-severity`] ? { borderColor: "var(--red)" } : {}) }}>
                      <input
                        id={kit.fid(`${prefix}-a${a.key}-severity-${si}`)}
                        type="radio"
                        name={kit.fid(`${prefix}-a${a.key}-severity`)}
                        aria-invalid={kit.errors[`${prefix}-a${a.key}-severity`] ? true : undefined}
                        aria-describedby={kit.errors[`${prefix}-a${a.key}-severity`] ? kit.fid(`${prefix}-a${a.key}-severity-err`) : undefined}
                        checked={a.severity === sev}
                        onChange={() => { updateAllergy(a.key, { severity: sev }); kit.clearError(`${prefix}-a${a.key}-severity`); }}
                      />
                      {t(`severity_${sev}`)}
                    </label>
                  ))}
                </div>
                {kit.fieldError(`${prefix}-a${a.key}-severity`)}
              </fieldset>
            </div>
          ))}
          {value.allergies.length < MAX_CHILD_ALLERGIES && (
            <button type="button" onClick={addAllergy} className="press reg-add" style={{ margin: 0, background: "var(--paper)" }}>
              + {t("addAllergy")}
            </button>
          )}
        </div>
      )}

      {TEXT_FIELDS.map((key) => {
        const name = `${prefix}-${key}`;
        const hintId = kit.fid(`${name}-hint`);
        return (
          <div key={key} style={{ marginTop: 14 }}>
            <label htmlFor={kit.fid(name)} style={kit.labelStyle}>{t(`${key}Label`)}</label>
            <textarea
              {...kit.a11y(name, hintId)}
              className="field-input reg-input"
              style={{ minHeight: 56, resize: "vertical", background: "var(--paper)" }}
              rows={2}
              maxLength={CARE_LIMITS[key]}
              value={value[key]}
              onChange={(e) => { onChange({ [key]: e.target.value }); kit.clearError(name); }}
              autoComplete="off"
            />
            <span id={hintId} style={kit.hintStyle}>{t(`${key}Hint`)}</span>
            {kit.fieldError(name)}
          </div>
        );
      })}

      <YesNoGroup
        name={`${prefix}-photo`}
        legend={t("photoLegend", { who })}
        hint={t("photoHint")}
        value={value.photoConsent}
        onChange={(v) => onChange({ photoConsent: v })}
        yes={t("photoYes")}
        no={t("photoNo")}
        kit={kit}
      />
    </section>
  );
}

export function FamilyCareFields({
  value, onChange, kit, consentText,
}: { value: FamilyCareState; onChange: (patch: Partial<FamilyCareState>) => void; kit: FieldKit; consentText: string }) {
  const t = useTranslations("ChildCare");

  function updatePickup(key: number, patch: Partial<PickupRow>) {
    onChange({ pickups: value.pickups.map((p) => (p.key === key ? { ...p, ...patch } : p)) });
  }

  const text = (name: "emergencyName" | "emergencyPhone" | "emergencyRelationship", label: string, opts: { tel?: boolean; optional?: boolean; max: number; hint?: string }) => {
    const id = `fam-${name}`;
    return (
      <div style={{ marginBottom: 14 }}>
        <label htmlFor={kit.fid(id)} style={kit.labelStyle}>{label} {opts.optional ? null : kit.required}</label>
        <input
          {...kit.a11y(id, opts.hint ? kit.fid(`${id}-hint`) : undefined)}
          className="field-input reg-input"
          type={opts.tel ? "tel" : "text"}
          inputMode={opts.tel ? "tel" : undefined}
          // Someone else's details: "off" so the browser does not fill in the parent's own.
          autoComplete="off"
          autoCapitalize={opts.tel ? undefined : "words"}
          maxLength={opts.max}
          value={value[name]}
          onChange={(e) => { onChange({ [name]: e.target.value }); kit.clearError(id); }}
          enterKeyHint="next"
        />
        {opts.hint && <span id={kit.fid(`${id}-hint`)} style={kit.hintStyle}>{opts.hint}</span>}
        {kit.fieldError(id)}
      </div>
    );
  };

  return (
    <div>
      <h3 style={{ margin: "0 0 4px", fontSize: 15.5, fontWeight: 800, color: "var(--ink)" }}>{t("emergencyHeading")}</h3>
      <p style={{ margin: "0 0 12px", fontSize: 13.5, lineHeight: 1.5, color: "var(--ink-soft)" }}>{t("emergencyBody")}</p>
      {text("emergencyName", t("emergencyName"), { max: CARE_LIMITS.name })}
      <div className="reg-row2">
        {text("emergencyPhone", t("emergencyPhone"), { tel: true, max: CARE_LIMITS.phone })}
        {text("emergencyRelationship", t("emergencyRelationship"), { optional: true, max: CARE_LIMITS.relationship, hint: t("emergencyRelationshipHint") })}
      </div>

      <h3 style={{ margin: "14px 0 4px", fontSize: 15.5, fontWeight: 800, color: "var(--ink)" }}>{t("pickupHeading")}</h3>
      <p style={{ margin: "0 0 12px", fontSize: 13.5, lineHeight: 1.5, color: "var(--ink-soft)" }}>{t("pickupBody", { max: MAX_PICKUPS })}</p>
      {value.pickups.map((p, i) => (
        <div key={p.key} style={{ marginBottom: 10, background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 12, padding: "8px 12px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 40 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--ink-soft)" }}>{t("pickupN", { n: i + 1 })}</span>
            <button type="button" className="reg-linkbtn" style={{ color: "var(--red)" }} onClick={() => onChange({ pickups: value.pickups.filter((x) => x.key !== p.key) })} aria-label={t("removePickupLabel", { n: i + 1 })}>
              {t("remove")}
            </button>
          </div>
          <div className="reg-row2">
            <div>
              <label htmlFor={kit.fid(`fam-pickup${p.key}-name`)} style={kit.labelStyle}>{t("pickupName")} {kit.required}</label>
              <input
                {...kit.a11y(`fam-pickup${p.key}-name`)}
                className="field-input reg-input"
                style={{ background: "var(--paper)" }}
                value={p.name}
                maxLength={CARE_LIMITS.name}
                onChange={(e) => { updatePickup(p.key, { name: e.target.value }); kit.clearError(`fam-pickup${p.key}-name`); }}
                autoComplete="off"
                autoCapitalize="words"
                enterKeyHint="next"
              />
              {kit.fieldError(`fam-pickup${p.key}-name`)}
            </div>
            <div>
              <label htmlFor={kit.fid(`fam-pickup${p.key}-phone`)} style={kit.labelStyle}>{t("pickupPhone")} {kit.required}</label>
              <input
                {...kit.a11y(`fam-pickup${p.key}-phone`)}
                className="field-input reg-input"
                style={{ background: "var(--paper)" }}
                type="tel"
                inputMode="tel"
                value={p.phone}
                maxLength={CARE_LIMITS.phone}
                onChange={(e) => { updatePickup(p.key, { phone: e.target.value }); kit.clearError(`fam-pickup${p.key}-phone`); }}
                autoComplete="off"
                enterKeyHint="next"
              />
              {kit.fieldError(`fam-pickup${p.key}-phone`)}
            </div>
          </div>
        </div>
      ))}
      {value.pickups.length < MAX_PICKUPS && (
        <button type="button" className="press reg-add" onClick={() => onChange({ pickups: [...value.pickups, { key: kit.newKey(), name: "", phone: "" }] })}>
          + {t("addPickup")}
        </button>
      )}

      <div style={{ marginTop: 6 }}>
        <label className="reg-check" style={{ alignItems: "flex-start", paddingTop: 12, paddingBottom: 12 }}>
          <input
            id={kit.fid("fam-consent")}
            type="checkbox"
            checked={value.consent}
            onChange={(e) => { onChange({ consent: e.target.checked }); kit.clearError("fam-consent"); }}
            aria-invalid={kit.errors["fam-consent"] ? true : undefined}
            aria-describedby={kit.errors["fam-consent"] ? kit.fid("fam-consent-err") : undefined}
            style={{ marginTop: 1 }}
          />
          <span>{consentText} {kit.required}</span>
        </label>
        {kit.fieldError("fam-consent")}
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 12.5, lineHeight: 1.5, color: "var(--ink-soft)" }}>{t("privacyNote")}</p>
    </div>
  );
}
