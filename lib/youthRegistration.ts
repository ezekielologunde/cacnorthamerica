import type { RegistrantCategory } from "@/lib/conventions";

// Youth & Child registration: everyone under 30 registers here (the main
// form is adults 30+ only), one row per person, with their Convention meals
// picked in the same submission. Pure helpers only -- no Next or Node APIs --
// so app/api/register/route.ts, the form, the confirmation page, the email
// and scripts/check-youth-registration.mjs all share one set of rules.
//
// Fees are unchanged by this split: ages 1-19 map to the existing free
// "child" category and ages 20-29 to the existing "young_adult" tier. The
// finer age group below (child / youth / young adult) is for logs and
// display only and never affects the price.

export const MIN_YOUTH_AGE = 1;
export const MAX_YOUTH_AGE = 29;
/** Under this age the contact must be a parent or guardian. */
export const ADULT_AGE = 18;
export const MAX_ALLERGIES_LENGTH = 200;

export const MEAL_SLOTS = [
  "tue_lunch", "tue_dinner",
  "wed_lunch", "wed_dinner",
  "thu_lunch", "thu_dinner",
  "fri_lunch", "fri_dinner",
] as const;
export type MealSlot = (typeof MEAL_SLOTS)[number];

const MEAL_DAY: Record<MealSlot, { day: string; offset: number; meal: string }> = {
  tue_lunch: { day: "Tuesday", offset: 1, meal: "Lunch" },
  tue_dinner: { day: "Tuesday", offset: 1, meal: "Dinner" },
  wed_lunch: { day: "Wednesday", offset: 2, meal: "Lunch" },
  wed_dinner: { day: "Wednesday", offset: 2, meal: "Dinner" },
  thu_lunch: { day: "Thursday", offset: 3, meal: "Lunch" },
  thu_dinner: { day: "Thursday", offset: 3, meal: "Dinner" },
  fri_lunch: { day: "Friday", offset: 4, meal: "Lunch" },
  fri_dinner: { day: "Friday", offset: 4, meal: "Dinner" },
};

/** "Tuesday Lunch", or "Tuesday Lunch — 7/13" when the convention's start
 *  date (always a Monday, see ConventionYear.startIso) is known. */
export function mealSlotLabel(slot: MealSlot, startIso?: string): string {
  const { day, offset, meal } = MEAL_DAY[slot];
  const base = `${day} ${meal}`;
  if (!startIso) return base;
  const d = new Date(`${startIso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return base;
  d.setUTCDate(d.getUTCDate() + offset);
  return `${base} — ${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
}

export type AgeGroup = "child" | "youth" | "young_adult";

export const AGE_GROUP_LABEL: Record<AgeGroup, string> = {
  child: "Child (1–10)",
  youth: "Youth (11–19)",
  young_adult: "Young Adult (20–29)",
};

export function isValidYouthAge(age: unknown): age is number {
  return typeof age === "number" && Number.isInteger(age) && age >= MIN_YOUTH_AGE && age <= MAX_YOUTH_AGE;
}

export function ageGroupFor(age: number): AgeGroup {
  if (age <= 10) return "child";
  if (age <= 19) return "youth";
  return "young_adult";
}

/** The existing fee category for an age: 1-19 free ("child"), 20-29 the
 *  young-adult rate. Always derived on the server, never taken from the client. */
export function categoryForAge(age: number): Extract<RegistrantCategory, "child" | "young_adult"> {
  return age <= 19 ? "child" : "young_adult";
}

// Meals travel as an 8-bit mask (one bit per slot, in MEAL_SLOTS order) so a
// large family's selections stay small inside Stripe metadata.
export function encodeMeals(meals: readonly MealSlot[]): number {
  let mask = 0;
  for (const m of meals) {
    const i = MEAL_SLOTS.indexOf(m);
    if (i !== -1) mask |= 1 << i;
  }
  return mask;
}

export function decodeMeals(mask: number | undefined): MealSlot[] {
  if (typeof mask !== "number" || !Number.isInteger(mask) || mask <= 0) return [];
  return MEAL_SLOTS.filter((_, i) => (mask & (1 << i)) !== 0);
}

/** Age group and dated meal labels for one summary registrant (`a` = age,
 *  `m` = meal mask), or null for an adult-track registrant with no age.
 *  Shared by the confirmation page and the confirmation email. */
export function describeYouthRegistrant(
  r: { a?: number; m?: number },
  startIso?: string
): { ageGroup: string; meals: string[] } | null {
  if (!isValidYouthAge(r.a)) return null;
  return {
    ageGroup: AGE_GROUP_LABEL[ageGroupFor(r.a)],
    meals: decodeMeals(r.m).map((slot) => mealSlotLabel(slot, startIso)),
  };
}

/** The Sheets tab (Apps Script formName) for Youth & Child registrations. */
export function youthSheetName(year: number): string {
  return `Youth & Child Registration — CACNA ${year}`;
}

/** One sheet row per person in a Youth & Child registration. Takes the
 *  summary's structural shape (lib/checkoutSummary.ts's RegistrationSummary)
 *  so this file stays free of Node APIs. Values are passed to logToSheet /
 *  logToSheetChecked, which formula-escape every cell. */
export function youthSheetRows(
  summary: {
    ref: string;
    churchName: string | null;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    registrants: { n: string; c: string; a?: number; m?: number; l?: string }[];
    youth?: { leader: string; dcc: string; guardian: boolean };
  },
  opts: {
    stripeSession: string;
    status: string;
    startIso?: string;
    contactEmail?: string;
    /** A paid registration's "Processing Fee" / "Amount Charged" cells (as
     *  on the adult tab). They are per registration, not per person, so only
     *  the first row carries the values and the rest leave them blank, which
     *  keeps a column sum equal to what Stripe charged. */
    feeColumns?: { "Processing Fee": string; "Amount Charged": string };
    /** A Zelle registration's reference (lib/zelleReference.ts), on every
     *  row so each person can be matched to the payment. */
    zelleReference?: string;
    /** Per-person check-in codes in registrants order (lib/checkinCode.ts's
     *  checkinCodesFor; passed in so this file stays free of Node APIs). */
    checkinCodes: readonly string[];
  }
): Record<string, string>[] {
  return summary.registrants.map((r, i) => {
    const described = describeYouthRegistrant(r, opts.startIso);
    return {
      "Ref": summary.ref,
      "Name": r.n,
      "Age": typeof r.a === "number" ? String(r.a) : "",
      "Age Group": described?.ageGroup ?? "",
      "Fee Category": r.c,
      "Meals": described && described.meals.length > 0 ? described.meals.join("; ") : "None",
      "Allergies": r.l ?? "",
      "Church": summary.churchName ?? "",
      "Youth Leader": summary.youth?.leader ?? "",
      "DCC / Zone": summary.youth?.dcc ?? "",
      "Contact Name": summary.contactName,
      "Contact Email": opts.contactEmail || summary.contactEmail,
      "Contact Phone": summary.contactPhone,
      "Guardian Confirmed": summary.youth?.guardian ? "Yes" : "No",
      "Stripe Session": opts.stripeSession,
      "Status": opts.status,
      ...(opts.feeColumns
        ? i === 0
          ? opts.feeColumns
          : { "Processing Fee": "", "Amount Charged": "" }
        : {}),
      // New columns go before "Check-in Code" so it stays last.
      ...(opts.zelleReference ? { "Zelle Reference": opts.zelleReference } : {}),
      "Check-in Code": opts.checkinCodes[i] ?? "",
    };
  });
}

export type YouthRegistrantInput = {
  firstName: string;
  lastName: string;
  age: number;
  meals: MealSlot[];
  allergies: string;
};

export type YouthRegistrationInput = {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  churchName: string;
  youthLeaderName: string;
  dccZone: string;
  guardianConfirmed: boolean;
  registrants: YouthRegistrantInput[];
};

/** One plain address, tested after trimming. Whitespace, angle brackets,
 *  commas and semicolons are refused anywhere in it: "<a@x.com>" or
 *  "a,b@x.com" is not one address we can cap or send to. Both registration
 *  tracks use this. */
export const EMAIL_RE = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;

function requiredString(value: unknown, label: string, max: number): string | { error: string } {
  if (typeof value !== "string" || value.trim() === "") return { error: `${label} is required` };
  if (value.length > max) return { error: `${label} must be ${max} characters or fewer` };
  return value.trim();
}

/** One registrant's meal choice and allergy notes, under the rule both the
 *  youth track and the adult track's individual mode use: meals are
 *  optional, but the choice must be explicit (at least one slot, or
 *  `noMeals: true`, never both), and allergy notes are optional and capped at
 *  MAX_ALLERGIES_LENGTH. `who` names the person in error messages. */
export function parseMealsAndAllergies(
  r: Record<string, unknown>,
  who: string
): { ok: true; meals: MealSlot[]; allergies: string } | { ok: false; error: string } {
  if (!Array.isArray(r.meals)) return { ok: false, error: "meals must be an array" };
  const meals: MealSlot[] = [];
  for (const m of r.meals) {
    if (typeof m !== "string" || !(MEAL_SLOTS as readonly string[]).includes(m)) {
      return { ok: false, error: `Invalid meal: ${String(m).slice(0, 40)}` };
    }
    if (!meals.includes(m as MealSlot)) meals.push(m as MealSlot);
  }
  if (r.noMeals !== undefined && typeof r.noMeals !== "boolean") return { ok: false, error: "noMeals must be a boolean" };
  if (r.noMeals === true && meals.length > 0) {
    return { ok: false, error: `${who}: choose meals or tick "No meals needed", not both` };
  }
  if (r.noMeals !== true && meals.length === 0) {
    return { ok: false, error: `${who}: choose at least one meal, or tick "No meals needed"` };
  }
  if (r.allergies != null && typeof r.allergies !== "string") return { ok: false, error: "allergies must be a string" };
  const allergies = typeof r.allergies === "string" ? r.allergies.trim() : "";
  if (allergies.length > MAX_ALLERGIES_LENGTH) {
    return { ok: false, error: `Allergy notes must be ${MAX_ALLERGIES_LENGTH} characters or fewer` };
  }
  return { ok: true, meals, allergies };
}

/** Dated meal labels for a summary registrant's mask, or null when meals
 *  were never asked (an adult group-mode row carries no `m`). */
export function describeMeals(m: number | undefined, startIso?: string): string[] | null {
  return typeof m === "number" ? decodeMeals(m).map((slot) => mealSlotLabel(slot, startIso)) : null;
}

/** The adult tab's "DCC / Zone", "Meals" and "Allergies" cells. The adult tab
 *  has one row per registration, so Meals and Allergies list "Name: ..." per
 *  person in Registrants order (allergies only for people who gave some).
 *  Group-mode registrations (names only) leave both blank. */
export function adultSheetExtras(
  summary: { dcc?: string; registrants: { n: string; m?: number; l?: string }[] },
  startIso?: string
): { "DCC / Zone": string; "Meals": string; "Allergies": string } {
  const meals = summary.registrants
    .map((r) => {
      const labels = describeMeals(r.m, startIso);
      return labels ? `${r.n}: ${labels.length > 0 ? labels.join(", ") : "None"}` : null;
    })
    .filter((v): v is string => v !== null);
  return {
    "DCC / Zone": summary.dcc ?? "",
    "Meals": meals.join("; "),
    "Allergies": summary.registrants.filter((r) => r.l).map((r) => `${r.n}: ${r.l}`).join("; "),
  };
}

/** Validates the youth-track request body field by field (hand-rolled, like
 *  the rest of app/api). Returns the cleaned input or the first error. */
export function parseYouthRegistration(
  body: unknown,
  limits: { maxRegistrants: number; maxFieldLength: number }
): { ok: true; value: YouthRegistrationInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Request body must be a JSON object" };
  const b = body as Record<string, unknown>;
  const max = limits.maxFieldLength;

  const shared: Record<string, string> = {};
  const fields: [key: string, label: string][] = [
    ["contactName", "Parent / guardian or contact name"],
    ["contactEmail", "Email"],
    ["churchName", "Church name"],
    ["youthLeaderName", "Youth leader's name"],
    ["dccZone", "DCC / Zone"],
  ];
  for (const [key, label] of fields) {
    const v = requiredString(b[key], label, max);
    if (typeof v !== "string") return { ok: false, error: v.error };
    shared[key] = v;
  }
  if (!EMAIL_RE.test(shared.contactEmail)) return { ok: false, error: "Please enter a valid email address" };
  // Phone is optional; when given it must be a plausible number.
  const rawPhone = b.contactPhone;
  if (rawPhone != null && typeof rawPhone !== "string") return { ok: false, error: "Phone must be text" };
  shared.contactPhone = (rawPhone ?? "").trim();
  if (shared.contactPhone.length > max) return { ok: false, error: `Phone must be ${max} characters or fewer` };
  if (shared.contactPhone !== "" && (shared.contactPhone.match(/\d/g) ?? []).length < 7) {
    return { ok: false, error: "Please enter a phone number we can reach you on, or leave it blank" };
  }
  if (b.guardianConfirmed !== undefined && typeof b.guardianConfirmed !== "boolean") {
    return { ok: false, error: "guardianConfirmed must be a boolean" };
  }

  if (!Array.isArray(b.registrants) || b.registrants.length === 0) {
    return { ok: false, error: "Add at least one child or youth" };
  }
  if (b.registrants.length > limits.maxRegistrants) {
    return {
      ok: false,
      error: `A registration can include at most ${limits.maxRegistrants} people. Please split larger groups into separate registrations.`,
    };
  }

  const registrants: YouthRegistrantInput[] = [];
  for (const [i, raw] of b.registrants.entries()) {
    const who = b.registrants.length > 1 ? `Person ${i + 1}` : "This person";
    if (!raw || typeof raw !== "object") return { ok: false, error: "Each registrant must be an object" };
    const r = raw as Record<string, unknown>;
    const firstName = requiredString(r.firstName, `${who}'s first name`, max);
    if (typeof firstName !== "string") return { ok: false, error: firstName.error };
    const lastName = requiredString(r.lastName, `${who}'s last name`, max);
    if (typeof lastName !== "string") return { ok: false, error: lastName.error };
    if (!isValidYouthAge(r.age)) {
      return {
        ok: false,
        error: `${who}'s age must be a whole number from ${MIN_YOUTH_AGE} to ${MAX_YOUTH_AGE}. Adults 30 and over use the main registration form.`,
      };
    }
    const choice = parseMealsAndAllergies(r, who);
    if (!choice.ok) return choice;
    const { meals, allergies } = choice;
    registrants.push({ firstName, lastName, age: r.age, meals, allergies });
  }

  const guardianConfirmed = b.guardianConfirmed === true;
  if (registrants.some((r) => r.age < ADULT_AGE) && !guardianConfirmed) {
    return {
      ok: false,
      error: "For anyone under 18, the contact must be their parent or guardian. Please confirm this before submitting.",
    };
  }

  return {
    ok: true,
    value: {
      contactName: shared.contactName,
      contactEmail: shared.contactEmail,
      contactPhone: shared.contactPhone,
      churchName: shared.churchName,
      youthLeaderName: shared.youthLeaderName,
      dccZone: shared.dccZone,
      guardianConfirmed,
      registrants,
    },
  };
}
