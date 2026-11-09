import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  CHILD_CARE_MAX_AGE,
  MAX_CHILD_ALLERGIES,
  MAX_PICKUPS,
  allergyFlagText,
  childCareRows,
  maxSeverity,
  needsChildCare,
  parseChildCare,
  parseFamilyCare,
  parseRegistrationCare,
  readAllergies,
} from "./childCare.ts";

const care = (extra = {}) => ({
  hasAllergies: true,
  allergies: [{ type: "food", name: "Peanuts", severity: "severe" }],
  medicalNotes: " Asthma ",
  medications: "Inhaler",
  dietaryNeeds: "",
  specialNeeds: "",
  photoConsent: false,
  ...extra,
});
const family = (extra = {}) => ({
  emergencyName: "Aunt Bisi",
  emergencyPhone: "(443) 555-0199",
  emergencyRelationship: "Aunt",
  pickups: [{ name: "Uncle Tunde", phone: "443-555-0123" }],
  consent: true,
  ...extra,
});

test("care details apply to ages 1 to 12 only", () => {
  assert.equal(CHILD_CARE_MAX_AGE, 12);
  for (const age of [1, 5, 12]) assert.equal(needsChildCare(age), true, String(age));
  for (const age of [0, 13, 19, 5.5, NaN]) assert.equal(needsChildCare(age), false, String(age));
});

test("a complete child's care details are accepted and trimmed", () => {
  const r = parseChildCare(care(), "Ada");
  assert.equal(r.ok, true);
  assert.equal(r.value.medicalNotes, "Asthma");
  assert.deepEqual(r.value.allergies, [{ type: "food", name: "Peanuts", severity: "severe" }]);
  assert.equal(r.value.photoConsent, false);
});

test("allergies and photo consent need an explicit answer", () => {
  assert.equal(parseChildCare(care({ hasAllergies: undefined }), "Ada").ok, false);
  assert.equal(parseChildCare(care({ photoConsent: undefined }), "Ada").ok, false);
  assert.equal(parseChildCare(care({ photoConsent: "yes" }), "Ada").ok, false);
  assert.equal(parseChildCare(undefined, "Ada").ok, false);
  assert.equal(parseChildCare([], "Ada").ok, false);
});

test("'no allergies' with allergies listed, or 'yes' with none, is refused", () => {
  assert.equal(parseChildCare(care({ hasAllergies: false }), "Ada").ok, false);
  assert.equal(parseChildCare(care({ allergies: [] }), "Ada").ok, false);
  assert.equal(parseChildCare(care({ hasAllergies: false, allergies: [] }), "Ada").ok, true);
});

test("allergy type, severity, name and count are validated", () => {
  const one = (a) => care({ allergies: [{ type: "food", name: "Milk", severity: "mild", ...a }] });
  assert.equal(parseChildCare(one({ type: "pollen" }), "Ada").ok, false);
  assert.equal(parseChildCare(one({ severity: "deadly" }), "Ada").ok, false);
  assert.equal(parseChildCare(one({ name: "  " }), "Ada").ok, false);
  assert.equal(parseChildCare(one({ name: "x".repeat(81) }), "Ada").ok, false);
  const many = Array.from({ length: MAX_CHILD_ALLERGIES + 1 }, (_, i) => ({ type: "other", name: `A${i}`, severity: "mild" }));
  assert.equal(parseChildCare(care({ allergies: many }), "Ada").ok, false);
  assert.equal(parseChildCare(care({ allergies: many.slice(0, MAX_CHILD_ALLERGIES) }), "Ada").ok, true);
});

test("free-text care fields are length-limited and must be text", () => {
  assert.equal(parseChildCare(care({ medicalNotes: "x".repeat(301) }), "Ada").ok, false);
  assert.equal(parseChildCare(care({ medications: "x".repeat(301) }), "Ada").ok, false);
  assert.equal(parseChildCare(care({ dietaryNeeds: "x".repeat(201) }), "Ada").ok, false);
  assert.equal(parseChildCare(care({ specialNeeds: "x".repeat(301) }), "Ada").ok, false);
  assert.equal(parseChildCare(care({ medications: 42 }), "Ada").ok, false);
  assert.equal(parseChildCare(care({ medicalNotes: "x".repeat(300) }), "Ada").ok, true);
});

test("the family block needs an emergency contact and consent; pickups are optional, max 4", () => {
  assert.equal(parseFamilyCare(family()).ok, true);
  assert.equal(parseFamilyCare(family({ pickups: undefined })).ok, true);
  assert.equal(parseFamilyCare(family({ consent: false })).ok, false);
  assert.equal(parseFamilyCare(family({ consent: "true" })).ok, false);
  assert.equal(parseFamilyCare(family({ emergencyName: "" })).ok, false);
  assert.equal(parseFamilyCare(family({ emergencyPhone: "12345" })).ok, false);
  assert.equal(parseFamilyCare(family({ pickups: [{ name: "Bo", phone: "" }] })).ok, false);
  assert.equal(parseFamilyCare(family({ pickups: [{ name: "", phone: "4435550123" }] })).ok, false);
  const pickups = Array.from({ length: MAX_PICKUPS + 1 }, (_, i) => ({ name: `P${i}`, phone: "4435550123" }));
  assert.equal(parseFamilyCare(family({ pickups })).ok, false);
  assert.equal(parseFamilyCare(family({ pickups: pickups.slice(0, MAX_PICKUPS) })).ok, true);
  assert.equal(parseFamilyCare(null).ok, false);
});

test("a registration needs care for each child 12 and under, and the family block once", () => {
  const body = { registrants: [{ care: care() }, {}, { care: care({ hasAllergies: false, allergies: [] }) }], childCare: family() };
  const r = parseRegistrationCare(body, [5, 15, 9]);
  assert.equal(r.ok, true);
  assert.deepEqual(r.value.children.map((c) => c.idx), [0, 2]);
  assert.equal(r.value.family.emergencyName, "Aunt Bisi");
  assert.equal(parseRegistrationCare({ ...body, childCare: undefined }, [5, 15, 9]).ok, false);
  assert.equal(parseRegistrationCare({ registrants: [{}, {}, { care: care() }], childCare: family() }, [5, 15, 9]).ok, false);
});

test("with no child 12 or under, any care sent is ignored", () => {
  const r = parseRegistrationCare({ registrants: [{ care: "junk" }], childCare: "junk" }, [14]);
  assert.deepEqual(r, { ok: true, value: { children: [], family: null } });
});

test("rows copy the family block onto each child and carry the highest severity", () => {
  const parsed = parseRegistrationCare({ registrants: [{ care: care() }, { care: care({ hasAllergies: false, allergies: [] }) }], childCare: family() }, [5, 9]);
  const now = new Date("2027-07-01T12:00:00Z");
  const rows = childCareRows({
    ref: "ref-1", year: 2027, registrants: [{ name: "Ada Obi", age: 5 }, { name: "Femi Obi", age: 9 }],
    care: parsed.value, guardian: { name: "Mum Obi", phone: "4435550100" }, now,
  });
  assert.equal(rows.length, 2);
  assert.equal(rows[0].max_allergy_severity, "severe");
  assert.equal(rows[1].max_allergy_severity, null);
  assert.equal(rows[1].has_allergies, false);
  assert.equal(rows[1].dietary_needs, null);
  assert.equal(rows[1].emergency_phone, "(443) 555-0199");
  assert.deepEqual(rows[1].pickups, [{ name: "Uncle Tunde", phone: "443-555-0123" }]);
  assert.equal(rows[0].consent_at, now.toISOString());
  assert.deepEqual(rows.map((r) => [r.ref, r.idx, r.child_name]), [["ref-1", 0, "Ada Obi"], ["ref-1", 1, "Femi Obi"]]);
});

test("the allergy flag lists the most severe first; malformed stored values are dropped", () => {
  const list = [
    { type: "medication", name: "Penicillin", severity: "mild" },
    { type: "food", name: "Peanuts", severity: "severe" },
    { type: "other", name: "Bees", severity: "moderate" },
  ];
  assert.equal(maxSeverity(list), "severe");
  assert.equal(maxSeverity([]), null);
  assert.equal(allergyFlagText(list), "Peanuts (food, severe); Bees (other, moderate); Penicillin (medication, mild)");
  assert.deepEqual(readAllergies([list[0], { type: "x", name: "y", severity: "mild" }, null, "s"]), [list[0]]);
  assert.deepEqual(readAllergies("nope"), []);
});

test("migration 0026 denies anon and authenticated: RLS on, no policies, privileges revoked", () => {
  const sql = readFileSync(path.join(import.meta.dirname, "..", "supabase", "migrations", "0026_child_care_details.sql"), "utf8")
    .replace(/--.*$/gm, "");
  assert.match(sql, /create table cacna\.child_care_details/);
  assert.match(sql, /alter table cacna\.child_care_details enable row level security/);
  assert.doesNotMatch(sql, /create policy/i);
  assert.match(sql, /revoke all on cacna\.child_care_details from public, anon, authenticated/);
  assert.doesNotMatch(sql, /grant [^;]* to [^;]*\b(anon|authenticated)\b/i);
  assert.match(sql, /grant all on cacna\.child_care_details to service_role/);
  assert.match(sql, /unique \(ref, idx\)/);
});
