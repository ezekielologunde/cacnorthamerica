"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { EmbeddedCheckoutScreen } from "@/components/checkout/EmbeddedStripeCheckout";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FORM_HEADER, HONEYPOT_FIELD, TURNSTILE_FIELD } from "@/lib/spam";
import { TurnstileField, resetTurnstile } from "@/components/TurnstileField";
import { FeeBreakdown } from "@/components/checkout/FeeBreakdown";
import { GiftChoice } from "@/components/register/GiftChoice";
import { GIFT_LINE_LABEL } from "@/lib/registrationGift";
import { DEFAULT_PAYMENT_METHOD, PaymentMethodChoice, ZelleTotal, paidSubmitLabel, type PaymentMethod } from "@/components/register/PaymentMethodChoice";
import { MAX_ALLERGIES_LENGTH, MEAL_SLOTS, mealSlotLabel, type MealSlot } from "@/lib/youthRegistration";

export type RegistrantCategory = "adult" | "young_adult" | "child";
// Adults (30+) only: everyone under 30 registers on the Youth & Child form
// (YouthRegisterForm), so every row here is the "adult" category.
// Individual mode also asks each person's meals (an explicit choice, as on
// the youth form) and allergy notes; group mode is a names-only list.
type RegistrantRow = { firstName: string; lastName: string; meals: MealSlot[]; noMeals: boolean; allergies: string };
const emptyRow = (): RegistrantRow => ({ firstName: "", lastName: "", meals: [], noMeals: false, allergies: "" });
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

export function RegisterForm({ year, startIso, priceMap }: { year: number; startIso?: string; priceMap: Partial<Record<RegistrantCategory, number>> }) {
  const t = useTranslations("Register");
  // Meal, allergy and DCC / Zone copy is shared with the youth form.
  const ty = useTranslations("YouthRegister");
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("individual");
  const [churchName, setChurchName] = useState("");
  const [registrants, setRegistrants] = useState<RegistrantRow[]>([emptyRow()]);
  const [bulkNames, setBulkNames] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [dccZone, setDccZone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(DEFAULT_PAYMENT_METHOD);
  const [giftCents, setGiftCents] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // After "+ Add", jump straight into the new row's name field
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
  const total = registrants.length * (priceMap.adult ?? 0);
  // A gift rides on a card payment only; the server enforces the same.
  const gift = total > 0 && paymentMethod === "card" ? giftCents : 0;

  function updateRegistrant(index: number, patch: Partial<RegistrantRow>) {
    setRegistrants((current) => current.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRegistrant() {
    focusRow.current = registrants.length;
    setRegistrants((current) => [...current, emptyRow()]);
  }

  function removeRegistrant(index: number) {
    setRegistrants((current) => current.filter((_, i) => i !== index));
  }

  // Pastes a block of names (one per line) into that many new registrant
  // rows at once -- built for a church signing up
  // a whole busload of members without clicking "+ Add" dozens of times.
  const bulkCount = bulkNames.split("\n").map((n) => n.trim()).filter(Boolean).length;
  function addBulkNames() {
    const names = bulkNames.split("\n").map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) return;
    // "Jane Mary Doe" -> first "Jane Mary", last "Doe"; a single word leaves the
    // last name empty so the row is flagged as required.
    const newRows: RegistrantRow[] = names.map((full) => {
      const parts = full.split(/\s+/);
      const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
      const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0];
      return { ...emptyRow(), firstName, lastName };
    });
    setRegistrants((current) =>
      current.length === 1 && current[0].firstName.trim() === "" && current[0].lastName.trim() === "" ? newRows : [...current, ...newRows]
    );
    setBulkNames("");
  }

  function toggleMeal(index: number, slot: MealSlot) {
    const r = registrants[index];
    // Picking a meal undoes "No meals needed" -- the two never coexist.
    updateRegistrant(index, { meals: r.meals.includes(slot) ? r.meals.filter((m) => m !== slot) : [...r.meals, slot], noMeals: false });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // Same explicit-choice rule the server enforces (parseMealsAndAllergies).
    const missingMeals = mode === "individual" ? registrants.findIndex((r) => !r.noMeals && r.meals.length === 0) : -1;
    if (missingMeals !== -1) {
      setErrorMessage(`${registrants.length > 1 ? `Person ${missingMeals + 1}` : "This person"}: ${ty("errMeals")}`);
      setStatus("error");
      return;
    }
    if (dccZone.trim() === "" && churchName.trim() === "") {
      setErrorMessage(t("errDccOrChurch"));
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    const form = event.currentTarget as HTMLFormElement;
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
          track: "adult",
          paymentMethod,
          donationCents: gift,
          registrationType: mode,
          churchName: churchName.trim() || null,
          contactName,
          contactEmail,
          contactPhone,
          dccZone: dccZone.trim(),
          registrants: registrants.map((r) => ({
            firstName: r.firstName.trim(),
            lastName: r.lastName.trim(),
            fullName: `${r.firstName.trim()} ${r.lastName.trim()}`,
            category: "adult",
            ...(mode === "individual"
              ? { meals: MEAL_SLOTS.filter((m) => r.meals.includes(m)), noMeals: r.noMeals, allergies: r.allergies.trim() }
              : {}),
          })),
        }),
      });

      const data = await response.json().catch(() => null);
      if (response.ok && typeof data?.clientSecret === "string") {
        setClientSecret(data.clientSecret);
        setStatus("idle");
        return;
      }
      if (!response.ok || !data?.checkoutUrl) {
        setErrorMessage(typeof data?.error === "string" ? data.error : "Something went wrong. Please try again.");
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
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  const submitLabel =
    status === "loading" ? t("submitting") : total > 0 ? paidSubmitLabel(paymentMethod) : `${t("submit")} — CACNA ${year}`;

  if (clientSecret) {
    return <EmbeddedCheckoutScreen clientSecret={clientSecret} onBack={() => setClientSecret(null)} backLabel="← Back to my registration" />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ margin: "0 0 20px", padding: "14px 16px", borderRadius: 14, background: "var(--cream)", borderLeft: "4px solid var(--gold)", fontSize: 15, lineHeight: 1.5, color: "var(--ink)" }}>
        {t("youthCalloutLead")}{" "}
        <Link href={`/events/cacna-${year}/register/youth`} style={{ color: "var(--red)", fontWeight: 800, display: "inline-block", padding: "10px 0" }}>
          {t("youthCalloutLink")}
        </Link>
      </p>
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
          {mode === "individual" && (
            <>
              <fieldset style={{ border: "none", padding: 0, margin: "16px 0 0", minWidth: 0 }}>
                <legend style={{ ...labelStyle, padding: 0, marginBottom: 8 }}>
                  {ty("mealsLegend", { who: r.firstName.trim() || (registrants.length > 1 ? `Person ${i + 1}` : "this person") })} <span style={{ color: "var(--red)" }}>*</span>
                </legend>
                <div className="reg-meals">
                  {MEAL_SLOTS.map((slot) => (
                    <label key={slot} className="reg-check">
                      <input type="checkbox" checked={r.meals.includes(slot)} onChange={() => toggleMeal(i, slot)} />
                      {mealSlotLabel(slot, startIso)}
                    </label>
                  ))}
                </div>
                <label className="reg-check" style={{ marginTop: 8 }}>
                  <input
                    type="checkbox"
                    checked={r.noMeals}
                    onChange={() => updateRegistrant(i, { noMeals: !r.noMeals, meals: r.noMeals ? r.meals : [] })}
                  />
                  {ty("noMeals")}
                </label>
              </fieldset>
              <label style={{ display: "block", marginTop: 14 }}>
                <span style={labelStyle}>{ty("allergies")}</span>
                <textarea
                  className="field-input reg-input"
                  style={{ minHeight: 72, resize: "vertical" }}
                  maxLength={MAX_ALLERGIES_LENGTH}
                  value={r.allergies}
                  onChange={(e) => updateRegistrant(i, { allergies: e.target.value })}
                />
                <span style={hintStyle}>{ty("allergiesHint", { count: r.allergies.length, max: MAX_ALLERGIES_LENGTH })}</span>
              </label>
            </>
          )}
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
              <button
                type="button"
                onClick={addBulkNames}
                disabled={bulkCount === 0}
                className="press"
                style={{
                  flex: "1 1 140px", minHeight: 48, background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 14.5,
                  padding: "0 18px", borderRadius: 999, border: "none",
                  cursor: bulkCount === 0 ? "not-allowed" : "pointer", opacity: bulkCount === 0 ? 0.5 : 1,
                }}
              >
                + Add {bulkCount || ""} {bulkCount === 1 ? "person" : "people"}
              </button>
            </div>
          </details>
      </>

      <StepHeading n={2} title="Your contact details" />
      <p style={{ margin: "-6px 0 14px", fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
        We email your confirmation and check-in codes here.
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
        <span style={labelStyle}>{ty("dccZone")}{mode === "group" ? "" : " *"}</span>
        <input
          className="field-input reg-input"
          name="dcc-zone"
          value={dccZone}
          onChange={(e) => setDccZone(e.target.value)}
          required={mode !== "group" && churchName.trim() === ""}
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="next"
          aria-describedby="dcc-zone-hint"
        />
        <span id="dcc-zone-hint" style={{ display: "block", marginTop: 6, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.45 }}>
          {t("dccZoneOptionalHint")}
        </span>
      </label>
      {mode !== "group" && (
        <label style={{ display: "block", marginBottom: 14 }}>
          <span style={labelStyle}>{t("churchNameContact")}</span>
          <input
            className="field-input reg-input"
            name="organization"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            autoComplete="organization"
            autoCapitalize="words"
            enterKeyHint="next"
          />
        </label>
      )}
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

      {total > 0 && (
        <PaymentMethodChoice name="payment-method" value={paymentMethod} onChange={setPaymentMethod} legendStyle={labelStyle} />
      )}

      {total > 0 && (
        <GiftChoice giftCents={giftCents} onChange={setGiftCents} cardSelected={paymentMethod === "card"} legendStyle={labelStyle} />
      )}

      {status === "error" && errorMessage && (
        <p ref={errorRef} role="alert" style={{ color: "var(--red)", fontWeight: 700, fontSize: 14.5, margin: "4px 0 12px", padding: "12px 14px", borderRadius: 12, background: "rgba(200,30,58,.08)" }}>
          {errorMessage}
        </p>
      )}

      {/* Sticky on phones: the running total and the pay button stay in thumb
          reach however long the list of people gets. The total is computed
          from the same tiers the server re-prices with, so what is shown here
          is what Stripe will charge, plus the disclosed processing fee (or,
          paying by Zelle, the subtotal with no fee). */}
      <div className="reg-sticky">
        <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 6 }} aria-live="polite">
          {registrants.length} {registrants.length === 1 ? "registrant" : "registrants"}
        </span>
        <div style={{ marginBottom: 10 }}>
          {total > 0 && paymentMethod === "zelle" ? (
            <ZelleTotal subtotalCents={total} />
          ) : total > 0 ? (
            <FeeBreakdown subtotalCents={total} extraLabel={GIFT_LINE_LABEL} extraCents={gift} />
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-soft)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)" }}>{formatPrice(0)}</span>
            </div>
          )}
        </div>
        <TurnstileField />
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
