"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Check } from "lucide-react";
import { EmbeddedCheckoutScreen } from "@/components/checkout/EmbeddedStripeCheckout";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FORM_HEADER, HONEYPOT_FIELD, TURNSTILE_FIELD } from "@/lib/spam";
import { TurnstileField, resetTurnstile } from "@/components/TurnstileField";
import { FeeBreakdown } from "@/components/checkout/FeeBreakdown";
import { GiftChoice } from "@/components/register/GiftChoice";
import { GIFT_LINE_LABEL } from "@/lib/registrationGift";
import { DEFAULT_PAYMENT_METHOD, PaymentMethodChoice, ZelleTotal, paidSubmitLabel, type PaymentMethod } from "@/components/register/PaymentMethodChoice";
import {
  ChildCarePanel,
  FamilyCareFields,
  childCarePayload,
  emptyChildCare,
  emptyFamilyCare,
  familyCarePayload,
  validateChildCare,
  validateFamilyCare,
  type ChildCareState,
  type FamilyCareState,
  type FieldKit,
} from "@/components/register/ChildCareFields";
import { needsChildCare } from "@/lib/childCare";
import {
  ADULT_AGE,
  AGE_GROUP_LABEL,
  MAX_ALLERGIES_LENGTH,
  MAX_YOUTH_AGE,
  MEAL_SLOTS,
  ageGroupFor,
  categoryForAge,
  isValidYouthAge,
  mealSlotLabel,
  type MealSlot,
} from "@/lib/youthRegistration";

// Same cap app/api/register/route.ts applies to every registration.
const MAX_PEOPLE = 30;

type PersonRow = {
  key: number;
  firstName: string;
  lastName: string;
  age: string;
  meals: MealSlot[];
  noMeals: boolean;
  allergies: string;
  /** Children 12 and under only (lib/childCare.ts). */
  care: ChildCareState;
};

type SharedField = "contactName" | "contactEmail" | "contactPhone" | "churchName" | "youthLeaderName" | "dccZone";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Matches RegisterForm: 16px inputs (no iOS focus zoom) and 48px targets
// come from .reg-input / .reg-check in globals.css.
const labelStyle: CSSProperties = { display: "block", fontSize: 13.5, fontWeight: 700, color: "var(--ink)", marginBottom: 6 };
const hintStyle: CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 500, color: "var(--ink-soft)", marginTop: 5 };
const errorStyle: CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--red)", marginTop: 6 };
const required = <span style={{ color: "var(--red)" }} aria-hidden>*</span>;

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

/** "12" -> 12; anything that is not a whole number -> NaN. */
function parseAge(raw: string): number {
  const s = raw.trim();
  return /^\d{1,3}$/.test(s) ? Number(s) : NaN;
}

function emptyPerson(key: number): PersonRow {
  return { key, firstName: "", lastName: "", age: "", meals: [], noMeals: false, allergies: "", care: emptyChildCare() };
}

function StepHeading({ n, title }: { n: number; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "28px 0 14px" }}>
      <span
        aria-hidden
        style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: "var(--gold)", color: "var(--ink)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800,
        }}
      >
        {n}
      </span>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "var(--ink)", margin: 0 }}>{title}</h2>
    </div>
  );
}

export function YouthRegisterForm({
  year,
  startIso,
  youngAdultPriceCents,
}: {
  year: number;
  startIso: string;
  /** Today's young-adult (20-29) rate; ages 1-19 are always free. */
  youngAdultPriceCents?: number;
}) {
  const t = useTranslations("YouthRegister");
  const tc = useTranslations("ChildCare");
  const router = useRouter();
  const uid = useId();
  const nextKey = useRef(1);
  const [people, setPeople] = useState<PersonRow[]>([emptyPerson(0)]);
  const [shared, setShared] = useState<Record<SharedField, string>>({
    contactName: "", contactEmail: "", contactPhone: "", churchName: "", youthLeaderName: "", dccZone: "",
  });
  const [family, setFamily] = useState<FamilyCareState>(emptyFamilyCare);
  const [guardianConfirmed, setGuardianConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(DEFAULT_PAYMENT_METHOD);
  const [giftCents, setGiftCents] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const serverErrorRef = useRef<HTMLParagraphElement | null>(null);
  const focusKey = useRef<number | null>(null);

  /** DOM id for a logical field name, unique per form instance. */
  const fid = (name: string) => `${uid}-${name}`;
  const newKey = () => nextKey.current++;

  // After "+ Add", jump straight into the new person's first-name field.
  useEffect(() => {
    if (focusKey.current !== null) {
      document.getElementById(`${uid}-p${focusKey.current}-first`)?.focus();
      focusKey.current = null;
    }
  }, [people.length, uid]);

  useEffect(() => {
    if (serverError) serverErrorRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [serverError]);

  const ages = people.map((p) => parseAge(p.age));
  const anyMinor = ages.some((a) => isValidYouthAge(a) && a < ADULT_AGE);
  const anyChild = ages.some((a) => needsChildCare(a));
  const total = useMemo(
    () =>
      people.reduce((sum, p) => {
        const age = parseAge(p.age);
        return isValidYouthAge(age) && categoryForAge(age) === "young_adult" ? sum + (youngAdultPriceCents ?? 0) : sum;
      }, 0),
    [people, youngAdultPriceCents]
  );
  // A gift rides on a card payment only; the server enforces the same.
  const gift = total > 0 && paymentMethod === "card" ? giftCents : 0;

  function updatePerson(key: number, patch: Partial<PersonRow>) {
    setPeople((current) => current.map((p) => (p.key === key ? { ...p, ...patch } : p)));
  }

  function updateCare(key: number, patch: Partial<ChildCareState>) {
    setPeople((current) => current.map((p) => (p.key === key ? { ...p, care: { ...p.care, ...patch } } : p)));
  }

  function toggleMeal(key: number, slot: MealSlot) {
    setPeople((current) =>
      current.map((p) => {
        if (p.key !== key) return p;
        const meals = p.meals.includes(slot) ? p.meals.filter((m) => m !== slot) : [...p.meals, slot];
        // Picking a meal undoes "No meals needed" -- the two never coexist.
        return { ...p, meals, noMeals: false };
      })
    );
  }

  function toggleNoMeals(key: number) {
    setPeople((current) => current.map((p) => (p.key === key ? { ...p, noMeals: !p.noMeals, meals: p.noMeals ? p.meals : [] } : p)));
  }

  function addPerson() {
    if (people.length >= MAX_PEOPLE) return;
    const key = nextKey.current++;
    focusKey.current = key;
    setPeople((current) => [...current, emptyPerson(key)]);
  }

  function removePerson(key: number) {
    setPeople((current) => current.filter((p) => p.key !== key));
  }

  function personLabel(index: number) {
    return people.length > 1 ? t("personN", { n: index + 1 }) : t("personSingle");
  }

  // Mirror parseYouthRegistration / lib/childCare.ts so most mistakes are
  // caught before the round trip. Keys are logical field names; the first key
  // in insertion order is the first invalid field on the page.
  function validatePeople(): Record<string, string> {
    const found: Record<string, string> = {};
    people.forEach((p) => {
      if (!p.firstName.trim()) found[`p${p.key}-first`] = t("errFirstName");
      if (!p.lastName.trim()) found[`p${p.key}-last`] = t("errLastName");
      const age = parseAge(p.age);
      if (!isValidYouthAge(age)) found[`p${p.key}-age`] = age > MAX_YOUTH_AGE ? t("errAgeAdult") : t("errAge");
      if (!p.noMeals && p.meals.length === 0) found[`p${p.key}-meals`] = t("errMeals");
      if (needsChildCare(age)) Object.assign(found, validateChildCare(`p${p.key}-care`, p.care, tc));
      else if (p.allergies.trim().length > MAX_ALLERGIES_LENGTH) found[`p${p.key}-allergies`] = t("errAllergies", { max: MAX_ALLERGIES_LENGTH });
    });
    return found;
  }

  function validateContact(): Record<string, string> {
    const found: Record<string, string> = {};
    if (!shared.contactName.trim()) found.contactName = t("errContactName");
    if (!EMAIL_RE.test(shared.contactEmail.trim())) found.contactEmail = t("errEmail");
    if ((shared.contactPhone.match(/\d/g) ?? []).length < 7) found.contactPhone = t("errPhone");
    if (!shared.churchName.trim()) found.churchName = t("errChurch");
    if (!shared.youthLeaderName.trim()) found.youthLeaderName = t("errLeader");
    if (anyMinor && !guardianConfirmed) found.guardian = t("errGuardian");
    return found;
  }

  const peopleErrors = validatePeople();
  const contactErrors = validateContact();
  const familyErrors = anyChild ? validateFamilyCare(family, tc) : {};
  const steps = [
    { title: t("stepPeople"), done: Object.keys(peopleErrors).length === 0 },
    { title: t("stepContact"), done: Object.keys(contactErrors).length === 0 },
    ...(anyChild ? [{ title: t("stepCare"), done: Object.keys(familyErrors).length === 0 }] : []),
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = { ...peopleErrors, ...contactErrors, ...familyErrors };
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      setStatus("idle");
      setServerError(null);
      // A choice group (meals, yes / no, severity) has no element of its own:
      // send focus to its first option.
      const el = document.getElementById(fid(first)) ?? document.getElementById(fid(`${first}-0`));
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.focus({ preventScroll: true });
      return;
    }

    setStatus("loading");
    setServerError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const honeypot = formData.get(HONEYPOT_FIELD);
    const turnstileToken = formData.get(TURNSTILE_FIELD);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", [FORM_HEADER]: "1" },
        body: JSON.stringify({
          [HONEYPOT_FIELD]: typeof honeypot === "string" ? honeypot : "",
          turnstileToken: typeof turnstileToken === "string" ? turnstileToken : "",
          track: "youth",
          paymentMethod,
          donationCents: gift,
          contactName: shared.contactName.trim(),
          contactEmail: shared.contactEmail.trim(),
          contactPhone: shared.contactPhone.trim(),
          churchName: shared.churchName.trim(),
          youthLeaderName: shared.youthLeaderName.trim(),
          dccZone: shared.dccZone.trim(),
          guardianConfirmed: anyMinor ? guardianConfirmed : false,
          registrants: people.map((p) => {
            const child = needsChildCare(parseAge(p.age));
            return {
              firstName: p.firstName.trim(),
              lastName: p.lastName.trim(),
              age: parseAge(p.age),
              meals: MEAL_SLOTS.filter((m) => p.meals.includes(m)),
              noMeals: p.noMeals,
              // A child's allergies travel in `care`, never as the free-text note.
              allergies: child ? "" : p.allergies.trim(),
              ...(child ? { care: childCarePayload(p.care) } : {}),
            };
          }),
          ...(anyChild ? { childCare: familyCarePayload(family) } : {}),
        }),
      });

      const data = await response.json().catch(() => null);
      if (response.ok && typeof data?.clientSecret === "string") {
        setClientSecret(data.clientSecret);
        setStatus("idle");
        return;
      }
      if (!response.ok || !data?.checkoutUrl) {
        setServerError(typeof data?.error === "string" ? data.error : t("errGeneric"));
        resetTurnstile(form);
        setStatus("error");
        return;
      }

      if (data.checkoutUrl.startsWith("http")) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push(data.checkoutUrl);
      }
    } catch {
      resetTurnstile(form);
      setServerError(t("errGeneric"));
      setStatus("error");
    }
  }

  /** aria wiring for a field: invalid flag plus its error (and hint) ids. */
  function a11y(name: string, hintId?: string) {
    const describedBy = [errors[name] ? fid(`${name}-err`) : null, hintId ?? null].filter(Boolean).join(" ");
    return {
      id: fid(name),
      "aria-invalid": errors[name] ? (true as const) : undefined,
      "aria-describedby": describedBy || undefined,
    };
  }

  function fieldError(name: string) {
    return errors[name] ? <span id={fid(`${name}-err`)} style={errorStyle}>{errors[name]}</span> : null;
  }

  function clearError(name: string) {
    if (errors[name]) setErrors((current) => { const next = { ...current }; delete next[name]; return next; });
  }

  const kit: FieldKit = { errors, fid, clearError, a11y, fieldError, labelStyle, hintStyle, required, newKey };

  const sharedFields: { name: SharedField; label: string; type?: string; autoComplete: string; inputMode?: "email" | "tel"; hint?: string; optional?: boolean }[] = [
    { name: "contactName", label: t("contactName"), autoComplete: "name" },
    { name: "contactEmail", label: t("contactEmail"), type: "email", inputMode: "email", autoComplete: "email", hint: t("contactEmailHint") },
    { name: "contactPhone", label: t("contactPhone"), type: "tel", inputMode: "tel", autoComplete: "tel" },
    { name: "churchName", label: t("churchName"), autoComplete: "organization" },
    { name: "youthLeaderName", label: t("youthLeaderName"), autoComplete: "off" },
    { name: "dccZone", label: t("dccZone"), autoComplete: "off", hint: t("dccZoneHint"), optional: true },
  ];

  const submitLabel =
    status === "loading" ? t("submitting") : total > 0 ? paidSubmitLabel(paymentMethod) : `${t("submitFree")} — CACNA ${year}`;

  if (clientSecret) {
    return <EmbeddedCheckoutScreen clientSecret={clientSecret} onBack={() => setClientSecret(null)} backLabel="← Back to my registration" />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

      {/* Progress: one pill per step, ticked once that step has nothing missing. */}
      <nav aria-label={t("progressLabel")}>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`, gap: 6 }}>
          {steps.map((s, i) => (
            <li key={s.title} style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
              <span aria-hidden style={{ height: 5, borderRadius: 999, background: s.done ? "var(--red)" : "var(--line)", transition: "background .25s" }} />
              <span style={{ display: "flex", alignItems: "flex-start", gap: 5, fontSize: 12.5, lineHeight: 1.3, fontWeight: 700, color: s.done ? "var(--ink)" : "var(--ink-soft)" }}>
                {s.done ? <Check size={14} strokeWidth={3} color="var(--red)" aria-hidden style={{ flexShrink: 0, marginTop: 1 }} /> : <span aria-hidden style={{ flexShrink: 0 }}>{i + 1}.</span>}
                <span>
                  {s.title}
                  <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
                    {`, ${s.done ? t("progressDone") : t("progressTodo")}`}
                  </span>
                </span>
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <StepHeading n={1} title={t("stepPeople")} />

      {people.map((p, i) => {
        const age = parseAge(p.age);
        const validAge = isValidYouthAge(age);
        const child = needsChildCare(age);
        const who = p.firstName.trim() || personLabel(i);
        const ageHintId = fid(`p${p.key}-age-hint`);
        const allergiesHintId = fid(`p${p.key}-allergies-hint`);
        return (
          <div key={p.key} style={{ marginBottom: 12, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "12px 14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 44 }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-soft)" }}>{personLabel(i)}</h3>
              {people.length > 1 && (
                <button type="button" onClick={() => removePerson(p.key)} className="reg-linkbtn" style={{ color: "var(--red)", minHeight: 48 }} aria-label={t("removeLabel", { who })}>
                  {t("remove")}
                </button>
              )}
            </div>

            <div className="reg-row2">
              <div>
                <label htmlFor={fid(`p${p.key}-first`)} style={labelStyle}>{t("firstName")} {required}</label>
                <input
                  {...a11y(`p${p.key}-first`)}
                  className="field-input reg-input"
                  value={p.firstName}
                  onChange={(e) => { updatePerson(p.key, { firstName: e.target.value }); clearError(`p${p.key}-first`); }}
                  required
                  autoComplete="off"
                  autoCapitalize="words"
                  enterKeyHint="next"
                />
                {fieldError(`p${p.key}-first`)}
              </div>
              <div>
                <label htmlFor={fid(`p${p.key}-last`)} style={labelStyle}>{t("lastName")} {required}</label>
                <input
                  {...a11y(`p${p.key}-last`)}
                  className="field-input reg-input"
                  value={p.lastName}
                  onChange={(e) => { updatePerson(p.key, { lastName: e.target.value }); clearError(`p${p.key}-last`); }}
                  required
                  autoComplete="off"
                  autoCapitalize="words"
                  enterKeyHint="next"
                />
                {fieldError(`p${p.key}-last`)}
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "8px 14px" }}>
              <div style={{ flex: "0 0 120px" }}>
                <label htmlFor={fid(`p${p.key}-age`)} style={labelStyle}>{t("age")} {required}</label>
                <input
                  {...a11y(`p${p.key}-age`, ageHintId)}
                  className="field-input reg-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  value={p.age}
                  onChange={(e) => { updatePerson(p.key, { age: e.target.value.replace(/\D/g, "") }); clearError(`p${p.key}-age`); }}
                  required
                  autoComplete="off"
                  enterKeyHint="next"
                />
              </div>
              {/* Derived from the age as it is typed; the server re-derives
                  the fee from the age, never from anything shown here. */}
              <p id={ageHintId} aria-live="polite" style={{ flex: "1 1 160px", margin: 0, paddingTop: 30, fontSize: 14.5, lineHeight: 1.4, color: "var(--ink)" }}>
                {validAge ? (
                  <>
                    <strong>{AGE_GROUP_LABEL[ageGroupFor(age)]}</strong>
                    {" · "}
                    {categoryForAge(age) === "young_adult"
                      ? youngAdultPriceCents !== undefined ? formatPrice(youngAdultPriceCents) : t("youngAdultRate")
                      : t("free")}
                  </>
                ) : age > MAX_YOUTH_AGE ? (
                  <Link href={`/events/cacna-${year}/register`} style={{ color: "var(--red)", fontWeight: 700 }}>{t("adultFormLink")}</Link>
                ) : (
                  <span style={{ color: "var(--ink-soft)" }}>{t("ageHint", { max: MAX_YOUTH_AGE })}</span>
                )}
              </p>
            </div>
            {fieldError(`p${p.key}-age`)}

            <fieldset
              style={{ border: "none", padding: 0, margin: "16px 0 0", minWidth: 0 }}
              aria-describedby={errors[`p${p.key}-meals`] ? fid(`p${p.key}-meals-err`) : undefined}
            >
              <legend style={{ ...labelStyle, padding: 0, marginBottom: 8 }}>{t("mealsLegend", { who })} {required}</legend>
              <div className="reg-meals">
                {MEAL_SLOTS.map((slot, si) => (
                  <label key={slot} className="reg-check">
                    <input
                      id={fid(`p${p.key}-meals-${si}`)}
                      type="checkbox"
                      checked={p.meals.includes(slot)}
                      onChange={() => { toggleMeal(p.key, slot); clearError(`p${p.key}-meals`); }}
                      aria-invalid={errors[`p${p.key}-meals`] ? true : undefined}
                    />
                    {mealSlotLabel(slot, startIso)}
                  </label>
                ))}
              </div>
              <label className="reg-check" style={{ marginTop: 8 }}>
                <input
                  type="checkbox"
                  checked={p.noMeals}
                  onChange={() => { toggleNoMeals(p.key); clearError(`p${p.key}-meals`); }}
                  aria-invalid={errors[`p${p.key}-meals`] ? true : undefined}
                />
                {t("noMeals")}
              </label>
              {fieldError(`p${p.key}-meals`)}
            </fieldset>

            {child ? (
              <ChildCarePanel prefix={`p${p.key}-care`} who={who} value={p.care} onChange={(patch) => updateCare(p.key, patch)} kit={kit} />
            ) : validAge ? (
              <div style={{ marginTop: 14 }}>
                <label htmlFor={fid(`p${p.key}-allergies`)} style={labelStyle}>{t("allergies")}</label>
                <textarea
                  {...a11y(`p${p.key}-allergies`, allergiesHintId)}
                  className="field-input reg-input"
                  style={{ minHeight: 72, resize: "vertical" }}
                  maxLength={MAX_ALLERGIES_LENGTH}
                  value={p.allergies}
                  onChange={(e) => { updatePerson(p.key, { allergies: e.target.value }); clearError(`p${p.key}-allergies`); }}
                />
                <span id={allergiesHintId} style={hintStyle}>
                  {t("allergiesHint", { count: p.allergies.length, max: MAX_ALLERGIES_LENGTH })}
                </span>
                {fieldError(`p${p.key}-allergies`)}
              </div>
            ) : null}
          </div>
        );
      })}

      {people.length < MAX_PEOPLE ? (
        <button type="button" onClick={addPerson} className="press reg-add">
          + {t("addPerson")}
        </button>
      ) : (
        <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "4px 0 12px" }}>{t("maxReached", { max: MAX_PEOPLE })}</p>
      )}

      <StepHeading n={2} title={t("stepContact")} />
      <p style={{ margin: "-6px 0 14px", fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{t("stepContactBody")}</p>

      {sharedFields.map((f) => (
        <div key={f.name} style={{ marginBottom: 14 }}>
          <label htmlFor={fid(f.name)} style={labelStyle}>{f.label} {f.optional ? null : required}</label>
          <input
            {...a11y(f.name, f.hint ? fid(`${f.name}-hint`) : undefined)}
            className="field-input reg-input"
            type={f.type ?? "text"}
            inputMode={f.inputMode}
            value={shared[f.name]}
            onChange={(e) => { setShared((s) => ({ ...s, [f.name]: e.target.value })); clearError(f.name); }}
            required={!f.optional}
            autoComplete={f.autoComplete}
            autoCapitalize={f.type === "email" ? "none" : "words"}
            autoCorrect={f.type === "email" ? "off" : undefined}
            spellCheck={f.type === "email" ? false : undefined}
            enterKeyHint="next"
          />
          {f.hint && <span id={fid(`${f.name}-hint`)} style={hintStyle}>{f.hint}</span>}
          {fieldError(f.name)}
        </div>
      ))}

      {anyMinor && (
        <div style={{ marginBottom: 14 }}>
          <label className="reg-check" style={{ alignItems: "flex-start", paddingTop: 12, paddingBottom: 12 }}>
            <input
              id={fid("guardian")}
              type="checkbox"
              checked={guardianConfirmed}
              onChange={(e) => { setGuardianConfirmed(e.target.checked); clearError("guardian"); }}
              required
              aria-invalid={errors.guardian ? true : undefined}
              aria-describedby={errors.guardian ? fid("guardian-err") : undefined}
              style={{ marginTop: 1 }}
            />
            <span>{t("guardianConfirm", { age: ADULT_AGE })} {required}</span>
          </label>
          {fieldError("guardian")}
        </div>
      )}

      {anyChild && (
        <>
          <StepHeading n={3} title={t("stepCare")} />
          <p style={{ margin: "-6px 0 14px", fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{t("stepCareBody")}</p>
          <FamilyCareFields value={family} onChange={(patch) => setFamily((f) => ({ ...f, ...patch }))} kit={kit} consentText={t("careConsent")} />
        </>
      )}

      {/* Only when someone is 20+ (the young-adult rate); 19 and under is free. */}
      {total > 0 && (
        <PaymentMethodChoice name={fid("payment-method")} value={paymentMethod} onChange={setPaymentMethod} legendStyle={labelStyle} />
      )}

      {total > 0 && (
        <GiftChoice giftCents={giftCents} onChange={setGiftCents} cardSelected={paymentMethod === "card"} legendStyle={labelStyle} />
      )}

      {status === "error" && serverError && (
        <p ref={serverErrorRef} role="alert" style={{ color: "var(--red)", fontWeight: 700, fontSize: 14.5, margin: "4px 0 12px", padding: "12px 14px", borderRadius: 12, background: "rgba(200,30,58,.08)" }}>
          {serverError}
        </p>
      )}

      {/* Same sticky total + submit bar as RegisterForm, including the
          disclosed processing fee whenever a card payment is owed. */}
      <div className="reg-sticky">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink-soft)" }} aria-live="polite">
            {t("peopleCount", { count: people.length })}
          </span>
          {total === 0 && (
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)" }}>
              {t("free")}
            </span>
          )}
        </div>
        {total > 0 && (
          <div style={{ marginBottom: 10 }}>
            {paymentMethod === "zelle" ? <ZelleTotal subtotalCents={total} /> : <FeeBreakdown subtotalCents={total} extraLabel={GIFT_LINE_LABEL} extraCents={gift} />}
          </div>
        )}
        <TurnstileField />
        <button
          type="submit"
          disabled={status === "loading"}
          className="press"
          style={{
            width: "100%", minHeight: 54, padding: "0 24px", borderRadius: 999,
            background: status === "loading" ? "var(--line)" : "var(--red)",
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
