// Checks for the recurring-gift fee and validation helpers (lib/processingFee.ts
// and lib/givingRequest.ts). No test framework is installed, so this is a plain
// Node script:
//
//   node scripts/check-giving-recurring.mjs
//
// Node 24 strips TypeScript types natively. Exits 1 if any check fails.
const fee = await import("../lib/processingFee.ts");
const req = await import("../lib/givingRequest.ts");
const {
  recurringCardFeeCents, recurringBankFeeCents, recurringFeeCentsFor, setupFeeCentsFor, recurringFeeLineItems, recurringFeeMetadataFor,
  feeCents, bankFeeCents, STRIPE_BILLING_PERCENT_FEE, BANK_FEE_CAP_CENTS, BANK_SETUP_FEE_LABEL, PROCESSING_FEE_LABEL,
} = fee;
const {
  validateGiftBasics, validateRecurringAmount, isRecurring, RECURRING_INTERVALS, RECURRING_MIN_CENTS, RECURRING_MAX_CARD_CENTS, RECURRING_MAX_BANK_CENTS,
} = req;

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

// ---- Fees ----
check("the Billing fee is off until confirmed in the Dashboard", STRIPE_BILLING_PERCENT_FEE === 0);
check("a card renewal fee equals the one-time card fee while Billing is off", [2500, 10000, 100000].every((s) => recurringCardFeeCents(s) === feeCents(s)));
check("a card gift has no setup fee", setupFeeCentsFor(10000, "card") === 0);
check("no recurring or setup fee on a $0 or negative subtotal", [0, -500].every((s) => recurringCardFeeCents(s) === 0 && recurringBankFeeCents(s) === 0 && setupFeeCentsFor(s, "bank") === 0));

// Hand-computed, so a changed constant is caught.
check("bank renewal fee on $100.00 is $0.81", recurringBankFeeCents(10000) === 81);
check("bank setup fee is $1.52", setupFeeCentsFor(10000, "bank") === 152);
check("bank first-charge fee on $100.00 stays within 1 cent of the one-time bank fee", Math.abs(recurringBankFeeCents(10000) + setupFeeCentsFor(10000, "bank") - bankFeeCents(10000)) <= 1);
check("bank renewal fee stops at the $5.00 cap", recurringBankFeeCents(100000) === BANK_FEE_CAP_CENTS && recurringBankFeeCents(1_000_000) === BANK_FEE_CAP_CENTS);
check("a bank renewal fee never includes the verification cost", [500, 10000, 100000].every((s) => recurringBankFeeCents(s) < bankFeeCents(s)));

// With Billing on (0.7%), the same inputs gross up further.
check("a $100 card renewal fee with Billing at 0.7% is $4.05", recurringCardFeeCents(10000, 0.007) === 405);
for (const s of [500, 2500, 10000, 50000, 100000]) {
  const f = recurringBankFeeCents(s, 0.007);
  const total = s + f;
  const stripeCost = Math.min(Math.round(0.008 * total), BANK_FEE_CAP_CENTS) + Math.round(0.007 * total);
  check(`bank renewal fee on ${s} with Billing on covers Stripe's cost (net ${total - stripeCost})`, total - stripeCost >= s - 1 && total - stripeCost <= s + 2);
}

// Net to the church on every cycle is the subtotal, within a cent or two.
for (const s of [500, 2500, 10000, 120000]) {
  const f = recurringCardFeeCents(s);
  const total = s + f;
  const net = total - (Math.round(0.029 * total) + 30);
  check(`card renewal net on ${s} is within 1 cent of the subtotal (net ${net})`, Math.abs(net - s) <= 1);
}

// ---- Checkout line items ----
const monthly = RECURRING_INTERVALS.monthly;
const cardLines = recurringFeeLineItems(10000, "card", monthly);
check("a card subscription has one fee line, and it repeats", cardLines.length === 1 && cardLines[0].price_data.recurring === monthly && cardLines[0].price_data.product_data.name === PROCESSING_FEE_LABEL);
const bankLines = recurringFeeLineItems(10000, "bank", RECURRING_INTERVALS.biweekly);
check("a bank subscription has a repeating fee line", bankLines[0].price_data.unit_amount === 81 && bankLines[0].price_data.recurring.interval === "week" && bankLines[0].price_data.recurring.interval_count === 2);
check("the bank setup line is one-time (no recurring on it) and is named", bankLines.length === 2 && bankLines[1].price_data.recurring === undefined && bankLines[1].price_data.product_data.name === BANK_SETUP_FEE_LABEL && bankLines[1].price_data.unit_amount === 152);
check("a $0 subtotal adds no fee lines", recurringFeeLineItems(0, "bank", monthly).length === 0);
const meta = recurringFeeMetadataFor(10000, "bank", "biweekly");
check("subscription metadata records subtotal, renewal fee, setup fee and frequency", meta.subtotal_cents === "10000" && meta.processing_fee_cents === "81" && meta.setup_fee_cents === "152" && meta.frequency === "biweekly");
check("every metadata value is a string (Stripe metadata values must be)", Object.values(meta).every((v) => typeof v === "string"));
check("the recurring fee equals recurringFeeCentsFor", recurringFeeCentsFor(10000, "bank") === 81 && recurringFeeCentsFor(10000, "card") === 330);

// ---- Intervals ----
check("monthly is every 1 month", RECURRING_INTERVALS.monthly.interval === "month" && RECURRING_INTERVALS.monthly.interval_count === 1);
check("every 2 weeks is every 14 days, not twice a month", RECURRING_INTERVALS.biweekly.interval === "week" && RECURRING_INTERVALS.biweekly.interval_count === 2);
check("isRecurring is true only for monthly and biweekly", isRecurring("monthly") && isRecurring("biweekly") && !isRecurring("once") && !isRecurring(undefined) && !isRecurring("weekly"));

// ---- Validation ----
const slugs = ["tithe"];
const base = { contactName: "Ada", contactEmail: "ada@example.com", campaignSlug: "tithe", amountCents: 10000 };
const allow = { allowRecurring: true };
check("a gift with no frequency is accepted as before", validateGiftBasics(base, slugs) === null);
check("frequency once is accepted by default", validateGiftBasics({ ...base, frequency: "once" }, slugs) === null);
check("monthly is refused unless the caller allows recurring (Zelle, and checkout until it is enabled)", validateGiftBasics({ ...base, frequency: "monthly" }, slugs) !== null);
check("monthly and biweekly are accepted when recurring is allowed", validateGiftBasics({ ...base, frequency: "monthly" }, slugs, {}, allow) === null && validateGiftBasics({ ...base, frequency: "biweekly" }, slugs, {}, allow) === null);
check("an unknown frequency is refused even when recurring is allowed", ["weekly", "", 5, null, {}].every((f) => validateGiftBasics({ ...base, frequency: f }, slugs, {}, allow) !== null));
check("a one-time $1 gift is still accepted", validateGiftBasics({ ...base, amountCents: 100 }, slugs) === null);

// ---- Recurring caps ----
check("the caps start at $5 minimum, $5,000 card, $1,000 bank", RECURRING_MIN_CENTS === 500 && RECURRING_MAX_CARD_CENTS === 500_000 && RECURRING_MAX_BANK_CENTS === 100_000);
check("one-time gifts are not held to the recurring caps", validateRecurringAmount(100, "card", "once") === null && validateRecurringAmount(5_000_000, "bank", "once") === null);
check("a $4.99 recurring gift is refused", validateRecurringAmount(499, "card", "monthly") !== null);
check("a $5.00 recurring gift is accepted", validateRecurringAmount(500, "card", "monthly") === null);
check("recurring card tops out at $5,000", validateRecurringAmount(500_000, "card", "biweekly") === null && validateRecurringAmount(500_001, "card", "biweekly") !== null);
check("recurring bank tops out at $1,000", validateRecurringAmount(100_000, "bank", "monthly") === null && validateRecurringAmount(100_001, "bank", "monthly") !== null);

if (failures > 0) {
  console.log(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
