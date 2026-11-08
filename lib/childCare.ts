// Children's Ministry care details, collected in the Youth & Child
// registration for every child aged CHILD_CARE_MAX_AGE or under
// (docs/superpowers/specs/2026-11-08-children-parent-info-design.md).
//
// Pure helpers only -- no Next or Node APIs -- so the form, the register
// route, lib/childCareStore.ts, the admin pages and lib/childCare.test.mjs
// share one set of rules.
//
// This is children's medical information. It never goes into the
// registration summary (and so never into the sealed URL token, Stripe
// metadata, the Google Sheet, the confirmation email or page), browser
// storage, analytics or logs. Its only home is cacna.child_care_details
// (supabase/migrations/0026_child_care_details.sql), readable by the
// service role alone.

/** Children this age or younger get the care details section: the
 *  Children's Ministry's classes are ages 5-8 and 9-12. */
export const CHILD_CARE_MAX_AGE = 12;
export const MAX_CHILD_ALLERGIES = 6;
export const MAX_PICKUPS = 4;

export const CARE_LIMITS = {
  allergyName: 80,
  medicalNotes: 300,
  medications: 300,
  dietaryNeeds: 200,
  specialNeeds: 300,
  name: 120,
  phone: 40,
  relationship: 60,
} as const;

export const ALLERGY_TYPES = ["food", "medication", "other"] as const;
export type AllergyType = (typeof ALLERGY_TYPES)[number];
export const ALLERGY_TYPE_LABEL: Record<AllergyType, string> = { food: "Food", medication: "Medication", other: "Other" };

/** Mildest first; the order is used to rank allergies on the admin flag. */
export const ALLERGY_SEVERITIES = ["mild", "moderate", "severe"] as const;
export type AllergySeverity = (typeof ALLERGY_SEVERITIES)[number];
export const ALLERGY_SEVERITY_LABEL: Record<AllergySeverity, string> = {
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe (life-threatening)",
};

export type ChildAllergy = { type: AllergyType; name: string; severity: AllergySeverity };

export type ChildCareInput = {
  hasAllergies: boolean;
  allergies: ChildAllergy[];
  medicalNotes: string;
  medications: string;
  dietaryNeeds: string;
  specialNeeds: string;
  photoConsent: boolean;
};

export type PickupPerson = { name: string; phone: string };

export type FamilyCareInput = {
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  pickups: PickupPerson[];
  consent: true;
};

export function needsChildCare(age: number): boolean {
  return Number.isInteger(age) && age >= 1 && age <= CHILD_CARE_MAX_AGE;
}

/** At least 7 digits, as both registration tracks require of a phone. */
export function isPlausiblePhone(value: string): boolean {
  return (value.match(/\d/g) ?? []).length >= 7;
}

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function requiredText(value: unknown, label: string, max: number): Result<string> {
  if (typeof value !== "string" || value.trim() === "") return { ok: false, error: `${label} is required` };
  const v = value.trim();
  if (v.length > max) return { ok: false, error: `${label} must be ${max} characters or fewer` };
  return { ok: true, value: v };
}

function optionalText(value: unknown, label: string, max: number): Result<string> {
  if (value == null) return { ok: true, value: "" };
  if (typeof value !== "string") return { ok: false, error: `${label} must be text` };
  const v = value.trim();
  if (v.length > max) return { ok: false, error: `${label} must be ${max} characters or fewer` };
  return { ok: true, value: v };
}

function phone(value: unknown, label: string): Result<string> {
  const v = requiredText(value, label, CARE_LIMITS.phone);
  if (!v.ok) return v;
  if (!isPlausiblePhone(v.value)) return { ok: false, error: `${label} must be a phone number we can call` };
  return v;
}

/** One child's care details (`registrants[i].care`). `who` names the child
 *  in error messages. Explicit answers are required for allergies and photo
 *  consent, so "not answered" can never be read as "none" or "yes". */
export function parseChildCare(raw: unknown, who: string): Result<ChildCareInput> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: `${who}: please fill in the care details. If the form doesn't show them, refresh the page and try again.` };
  }
  const c = raw as Record<string, unknown>;
  if (typeof c.hasAllergies !== "boolean") {
    return { ok: false, error: `${who}: tell us whether they have any allergies` };
  }
  const list = c.allergies ?? [];
  if (!Array.isArray(list)) return { ok: false, error: "allergies must be a list" };
  if (!c.hasAllergies && list.length > 0) {
    return { ok: false, error: `${who}: choose "Yes" for allergies, or remove the allergies listed` };
  }
  if (c.hasAllergies && list.length === 0) {
    return { ok: false, error: `${who}: add at least one allergy, or choose "No known allergies"` };
  }
  if (list.length > MAX_CHILD_ALLERGIES) {
    return { ok: false, error: `${who}: list at most ${MAX_CHILD_ALLERGIES} allergies (use medical notes for more)` };
  }
  const allergies: ChildAllergy[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") return { ok: false, error: "Each allergy must be an object" };
    const a = item as Record<string, unknown>;
    if (typeof a.type !== "string" || !(ALLERGY_TYPES as readonly string[]).includes(a.type)) {
      return { ok: false, error: `${who}: choose what kind of allergy it is` };
    }
    const name = requiredText(a.name, `${who}: the allergy`, CARE_LIMITS.allergyName);
    if (!name.ok) return name;
    if (typeof a.severity !== "string" || !(ALLERGY_SEVERITIES as readonly string[]).includes(a.severity)) {
      return { ok: false, error: `${who}: choose how serious the ${name.value} allergy is` };
    }
    allergies.push({ type: a.type as AllergyType, name: name.value, severity: a.severity as AllergySeverity });
  }
  const texts: [key: "medicalNotes" | "medications" | "dietaryNeeds" | "specialNeeds", label: string][] = [
    ["medicalNotes", `${who}: medical notes`],
    ["medications", `${who}: medications`],
    ["dietaryNeeds", `${who}: dietary needs`],
    ["specialNeeds", `${who}: special needs`],
  ];
  const out: Record<string, string> = {};
  for (const [key, label] of texts) {
    const v = optionalText(c[key], label, CARE_LIMITS[key]);
    if (!v.ok) return v;
    out[key] = v.value;
  }
  if (typeof c.photoConsent !== "boolean") {
    return { ok: false, error: `${who}: tell us whether they may appear in church photos` };
  }
  return {
    ok: true,
    value: {
      hasAllergies: c.hasAllergies,
      allergies,
      medicalNotes: out.medicalNotes,
      medications: out.medications,
      dietaryNeeds: out.dietaryNeeds,
      specialNeeds: out.specialNeeds,
      photoConsent: c.photoConsent,
    },
  };
}

/** The family block (`childCare`) shared by every child in the registration. */
export function parseFamilyCare(raw: unknown): Result<FamilyCareInput> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "Please add an emergency contact for the children" };
  }
  const f = raw as Record<string, unknown>;
  const emergencyName = requiredText(f.emergencyName, "Emergency contact name", CARE_LIMITS.name);
  if (!emergencyName.ok) return emergencyName;
  const emergencyPhone = phone(f.emergencyPhone, "Emergency contact phone");
  if (!emergencyPhone.ok) return emergencyPhone;
  const emergencyRelationship = optionalText(f.emergencyRelationship, "Relationship", CARE_LIMITS.relationship);
  if (!emergencyRelationship.ok) return emergencyRelationship;

  const list = f.pickups ?? [];
  if (!Array.isArray(list)) return { ok: false, error: "pickups must be a list" };
  if (list.length > MAX_PICKUPS) return { ok: false, error: `Add at most ${MAX_PICKUPS} pickup people` };
  const pickups: PickupPerson[] = [];
  for (const [i, item] of list.entries()) {
    if (!item || typeof item !== "object") return { ok: false, error: "Each pickup person must be an object" };
    const p = item as Record<string, unknown>;
    const name = requiredText(p.name, `Pickup person ${i + 1}'s name`, CARE_LIMITS.name);
    if (!name.ok) return name;
    const tel = phone(p.phone, `Pickup person ${i + 1}'s phone`);
    if (!tel.ok) return tel;
    pickups.push({ name: name.value, phone: tel.value });
  }

  if (f.consent !== true) {
    return { ok: false, error: "Please give your consent for the Children's Ministry to care for your children" };
  }
  return {
    ok: true,
    value: {
      emergencyName: emergencyName.value,
      emergencyPhone: emergencyPhone.value,
      emergencyRelationship: emergencyRelationship.value,
      pickups,
      consent: true,
    },
  };
}

export type RegistrationCare = {
  /** One entry per registrant aged CHILD_CARE_MAX_AGE or under, by index. */
  children: { idx: number; care: ChildCareInput }[];
  /** Present exactly when `children` is non-empty. */
  family: FamilyCareInput | null;
};

/** Care details for a whole Youth & Child request body, once
 *  parseYouthRegistration has accepted it (`ages` in registrants order).
 *  Anyone older than CHILD_CARE_MAX_AGE has any `care` sent ignored, and with
 *  no such child the family block is ignored too. */
export function parseRegistrationCare(body: unknown, ages: readonly number[]): Result<RegistrationCare> {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const registrants = Array.isArray(b.registrants) ? b.registrants : [];
  const children: RegistrationCare["children"] = [];
  for (const [idx, age] of ages.entries()) {
    if (!needsChildCare(age)) continue;
    const r = registrants[idx] as Record<string, unknown> | undefined;
    const who = ages.length > 1 ? `Person ${idx + 1}` : "Your child";
    const care = parseChildCare(r?.care, who);
    if (!care.ok) return care;
    children.push({ idx, care: care.value });
  }
  if (children.length === 0) return { ok: true, value: { children, family: null } };
  const family = parseFamilyCare(b.childCare);
  if (!family.ok) return family;
  return { ok: true, value: { children, family: family.value } };
}

export function maxSeverity(allergies: readonly ChildAllergy[]): AllergySeverity | null {
  let best = -1;
  for (const a of allergies) best = Math.max(best, ALLERGY_SEVERITIES.indexOf(a.severity));
  return best >= 0 ? ALLERGY_SEVERITIES[best] : null;
}

/** "Peanuts (food, severe); Amoxicillin (medication, mild)": most severe
 *  first, for the admin check-in flag and the printed care sheet. */
export function allergyFlagText(allergies: readonly ChildAllergy[]): string {
  return [...allergies]
    .sort((x, y) => ALLERGY_SEVERITIES.indexOf(y.severity) - ALLERGY_SEVERITIES.indexOf(x.severity))
    .map((a) => `${a.name} (${a.type}, ${a.severity})`)
    .join("; ");
}

/** Reads the allergies jsonb column back defensively: anything malformed is
 *  dropped rather than trusted. */
export function readAllergies(value: unknown): ChildAllergy[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (a): a is ChildAllergy =>
      !!a &&
      typeof a === "object" &&
      (ALLERGY_TYPES as readonly string[]).includes((a as ChildAllergy).type) &&
      (ALLERGY_SEVERITIES as readonly string[]).includes((a as ChildAllergy).severity) &&
      typeof (a as ChildAllergy).name === "string"
  );
}

export function readPickups(value: unknown): PickupPerson[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (p): p is PickupPerson => !!p && typeof p === "object" && typeof (p as PickupPerson).name === "string" && typeof (p as PickupPerson).phone === "string"
  );
}

export type ChildCareRow = {
  year: number;
  ref: string;
  idx: number;
  child_name: string;
  age: number;
  has_allergies: boolean;
  allergies: ChildAllergy[];
  max_allergy_severity: AllergySeverity | null;
  medical_notes: string | null;
  medications: string | null;
  dietary_needs: string | null;
  special_needs: string | null;
  photo_consent: boolean;
  emergency_name: string;
  emergency_phone: string;
  emergency_relationship: string | null;
  pickups: PickupPerson[];
  guardian_name: string;
  guardian_phone: string;
  consent_at: string;
};

/** The cacna.child_care_details rows for one registration: one per child,
 *  with the family block copied onto each so a row stands on its own at the
 *  check-in desk. */
export function childCareRows(input: {
  ref: string;
  year: number;
  registrants: readonly { name: string; age: number }[];
  care: RegistrationCare;
  guardian: { name: string; phone: string };
  now: Date;
}): ChildCareRow[] {
  const family = input.care.family;
  if (!family) return [];
  const orNull = (s: string) => s || null;
  return input.care.children.map(({ idx, care }) => ({
    year: input.year,
    ref: input.ref,
    idx,
    child_name: input.registrants[idx].name.slice(0, 2 * CARE_LIMITS.name + 1),
    age: input.registrants[idx].age,
    has_allergies: care.hasAllergies,
    allergies: care.allergies,
    max_allergy_severity: maxSeverity(care.allergies),
    medical_notes: orNull(care.medicalNotes),
    medications: orNull(care.medications),
    dietary_needs: orNull(care.dietaryNeeds),
    special_needs: orNull(care.specialNeeds),
    photo_consent: care.photoConsent,
    emergency_name: family.emergencyName,
    emergency_phone: family.emergencyPhone,
    emergency_relationship: orNull(family.emergencyRelationship),
    pickups: family.pickups,
    guardian_name: input.guardian.name,
    guardian_phone: input.guardian.phone,
    consent_at: input.now.toISOString(),
  }));
}
