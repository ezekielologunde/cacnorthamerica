// Checks for the Youth & Child registration rules (lib/youthRegistration.ts)
// and that a large family still fits Stripe's metadata limits. No test
// framework is installed, so this is a plain Node script:
//
//   node scripts/check-youth-registration.mjs
//
// Same loader hook as scripts/check-payment-confirmation.mjs: maps the repo's
// "@/..." alias and extensionless imports onto the .ts sources. Exits 1 if
// any check fails. Never calls Stripe.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
registerHooks({
  resolve(specifier, context, next) {
    let target = null;
    if (specifier.startsWith("@/")) target = path.join(root, specifier.slice(2));
    else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:") && !path.extname(specifier)) {
      target = path.join(path.dirname(new URL(context.parentURL).pathname.replace(/^\/(\w:)/, "$1")), specifier);
    }
    if (target && !path.extname(target) && existsSync(`${target}.ts`)) {
      return next(pathToFileURL(`${target}.ts`).href, context);
    }
    return next(specifier, context);
  },
});

const Y = await import("../lib/youthRegistration.ts");
const { encodeSummary, chunkForMetadata, fitsStripeMetadata, decodeSummary, STRIPE_METADATA_MAX_KEYS } = await import("../lib/checkoutSummary.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}
const limits = { maxRegistrants: 30, maxFieldLength: 120 };
const base = {
  contactName: "Parent Name", contactEmail: "parent@example.com", contactPhone: "(443) 555-0100",
  churchName: "CAC Example", youthLeaderName: "Leader", dccZone: "Not sure", guardianConfirmed: true,
};
const person = (age, extra = {}) => ({ firstName: "Kid", lastName: "Doe", age, meals: ["tue_lunch"], ...extra });
const parse = (registrants, extra = {}) => Y.parseYouthRegistration({ ...base, ...extra, registrants }, limits);

for (const bad of [0, 30, "abc", 5.5, "14", null]) {
  check(`age ${JSON.stringify(bad)} rejected`, !parse([person(bad)]).ok);
}
check("ages 1 and 29 accepted", parse([person(1), person(29)]).ok);
check("unknown meal slot rejected", !parse([person(5, { meals: ["sat_breakfast"] })]).ok);
check("no meals and no 'No meals needed' rejected", !parse([person(5, { meals: [] })]).ok);
check("'No meals needed' with no meals accepted", parse([person(5, { meals: [], noMeals: true })]).ok);
check("'No meals needed' plus meals rejected", !parse([person(5, { noMeals: true })]).ok);
check("minor without guardian confirmation rejected", !parse([person(14)], { guardianConfirmed: false }).ok);
check("young adult (20-29) needs no guardian confirmation", parse([person(22)], { guardianConfirmed: false }).ok);
check("allergies over 200 chars rejected", !parse([person(5, { allergies: "x".repeat(201) })]).ok);
check("31 people rejected", !parse(Array.from({ length: 31 }, () => person(5))).ok);
check("bad email rejected", !parse([person(5)], { contactEmail: "nope" }).ok);
check("missing youth leader rejected", !parse([person(5)], { youthLeaderName: "  " }).ok);
check("blank phone accepted (optional)", parse([person(5)], { contactPhone: "" }).ok);
check("missing phone accepted (optional)", parse([person(5)], { contactPhone: undefined }).ok);
check("phone with too few digits rejected", !parse([person(5)], { contactPhone: "12-34" }).ok);

check("age 10 -> child group, free category", Y.ageGroupFor(10) === "child" && Y.categoryForAge(10) === "child");
check("age 11 -> youth group, free category", Y.ageGroupFor(11) === "youth" && Y.categoryForAge(11) === "child");
check("age 19 -> youth group, free category", Y.ageGroupFor(19) === "youth" && Y.categoryForAge(19) === "child");
check("age 20 -> young adult group and category", Y.ageGroupFor(20) === "young_adult" && Y.categoryForAge(20) === "young_adult");

const all = [...Y.MEAL_SLOTS];
check("meal bitmask round-trips all 8 slots", Y.encodeMeals(all) === 255 && JSON.stringify(Y.decodeMeals(255)) === JSON.stringify(all));
check("meal bitmask round-trips a subset",
  JSON.stringify(Y.decodeMeals(Y.encodeMeals(["wed_dinner", "tue_lunch"]))) === JSON.stringify(["tue_lunch", "wed_dinner"]));
check("meal labels carry convention dates",
  Y.mealSlotLabel("tue_lunch", "2027-07-12") === "Tuesday Lunch — 7/13" && Y.mealSlotLabel("fri_dinner", "2027-07-12") === "Friday Dinner — 7/16");

// Worst case per person: max-length names and allergy notes, every meal.
function bigSummary(n) {
  return {
    ref: crypto.randomUUID(), year: 2027, registrationType: "group", churchName: "C".repeat(120),
    contactName: "N".repeat(120), contactEmail: `${"e".repeat(100)}@example.com`, contactPhone: "5".repeat(120),
    registrants: Array.from({ length: n }, (_, i) => ({
      n: `${"F".repeat(120)} ${"L".repeat(120)}`, c: i % 2 ? "child" : "young_adult", a: 29, m: 255, l: "A".repeat(200),
    })),
    totalAmountCents: 150000, isComplimentary: false,
    youth: { leader: "Y".repeat(120), dcc: "D".repeat(120), guardian: true },
  };
}
// A paid session carries 4 keys besides the summary chunks: kind,
// convention_year, subtotal_cents, processing_fee_cents.
for (const n of [10, 29]) {
  const encoded = encodeSummary(bigSummary(n));
  const chunks = chunkForMetadata("d", encoded);
  const keys = Object.keys(chunks).length + 4;
  check(`${n}-person worst-case summary fits Stripe metadata (${keys}/${STRIPE_METADATA_MAX_KEYS} keys, values <= 500 chars)`,
    fitsStripeMetadata(encoded, 4) && keys <= STRIPE_METADATA_MAX_KEYS && Object.values(chunks).every((v) => v.length <= 500));
  const back = decodeSummary(Object.values(chunks).join(""));
  check(`${n}-person summary decodes back intact`, back?.registrants.length === n && back.registrants[0].m === 255 && back.youth?.guardian === true);
}
// With the two fee keys, a 30-person registration with every field at its
// maximum needs one key too many; the guard must say so (the route then asks
// the visitor to split it) instead of letting Stripe reject the session.
{
  const encoded = encodeSummary(bigSummary(30));
  const keys = Object.keys(chunkForMetadata("d", encoded)).length + 4;
  check(`30-person every-field-maxed summary is reported as not fitting (${keys}/${STRIPE_METADATA_MAX_KEYS} keys)`,
    keys > STRIPE_METADATA_MAX_KEYS && !fitsStripeMetadata(encoded, 4));
}
check("an oversized value is reported as not fitting", !fitsStripeMetadata("x".repeat(450 * 49), 2));

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
