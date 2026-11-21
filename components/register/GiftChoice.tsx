"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { GIFT_MAX_CENTS, GIFT_MIN_CENTS, GIFT_PRESETS_DOLLARS } from "@/lib/registrationGift";

// "Add a gift to the convention (optional)" on both registration forms. It is
// offered when paying by card; with Zelle it points to the giving page instead.
// The chosen amount goes to POST /api/register as donationCents, where the
// server validates it again (lib/registrationGift.ts).

const chip = (active: boolean): CSSProperties => ({
  minHeight: 44,
  padding: "0 18px",
  borderRadius: 999,
  border: `1.5px solid ${active ? "var(--red)" : "var(--line)"}`,
  background: active ? "rgba(200,30,58,.08)" : "var(--paper)",
  color: active ? "var(--red)" : "var(--ink)",
  fontWeight: 800,
  fontSize: 15,
  cursor: "pointer",
});

export function GiftChoice({
  giftCents,
  onChange,
  cardSelected,
  legendStyle,
}: {
  giftCents: number;
  onChange: (cents: number) => void;
  /** False when another method (Zelle) is chosen: the gift is not offered. */
  cardSelected: boolean;
  legendStyle: CSSProperties;
}) {
  const [custom, setCustom] = useState("");
  const presetActive = (dollars: number) => giftCents === dollars * 100 && custom === "";

  if (!cardSelected) {
    return (
      <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: "16px 0 0", lineHeight: 1.55 }}>
        Want to add a gift to the convention? Choose card above, or give any time on our{" "}
        <Link href="/giving" style={{ color: "var(--red)", fontWeight: 700 }}>giving page</Link>.
      </p>
    );
  }

  function onCustomChange(raw: string) {
    setCustom(raw);
    const dollars = Number(raw);
    if (raw.trim() === "" || !Number.isFinite(dollars)) return onChange(0);
    onChange(Math.round(dollars * 100));
  }

  const customInvalid = giftCents !== 0 && (giftCents < GIFT_MIN_CENTS || giftCents > GIFT_MAX_CENTS);

  return (
    <fieldset style={{ border: "none", padding: 0, margin: "24px 0 0", minWidth: 0 }}>
      <legend style={{ ...legendStyle, padding: 0, marginBottom: 4, fontSize: 15 }}>Add a gift to the convention (optional)</legend>
      <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: "0 0 10px", lineHeight: 1.5 }}>
        Your gift is separate from your registration and tax-deductible. It supports the convention and the work of CACNA.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <button type="button" aria-pressed={giftCents === 0 && custom === ""} style={chip(giftCents === 0 && custom === "")} onClick={() => { setCustom(""); onChange(0); }}>
          No gift
        </button>
        {GIFT_PRESETS_DOLLARS.map((d) => (
          <button key={d} type="button" aria-pressed={presetActive(d)} style={chip(presetActive(d))} onClick={() => { setCustom(""); onChange(d * 100); }}>
            ${d}
          </button>
        ))}
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-soft)" }}>Other $</span>
          <input
            type="number"
            inputMode="decimal"
            min={GIFT_MIN_CENTS / 100}
            max={GIFT_MAX_CENTS / 100}
            step="0.01"
            value={custom}
            onChange={(e) => onCustomChange(e.target.value)}
            aria-label="Other gift amount in dollars"
            aria-invalid={customInvalid}
            className="field-input reg-input"
            style={{ width: 110, minHeight: 44 }}
          />
        </label>
      </div>
      {customInvalid && (
        <p role="alert" style={{ fontSize: 13.5, color: "var(--red)", fontWeight: 700, margin: "8px 0 0" }}>
          Please enter a gift between ${GIFT_MIN_CENTS / 100} and ${(GIFT_MAX_CENTS / 100).toLocaleString("en-US")}, or choose No gift.
        </p>
      )}
    </fieldset>
  );
}
