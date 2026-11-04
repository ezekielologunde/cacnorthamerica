// Checks for lib/givingProblem.ts, what happens when a recurring gift's charge
// fails, the gift ends, or its debit is disputed. Plain Node script:
//
//   node scripts/check-giving-problem.mjs
//
// Node 24 strips TypeScript types natively. Exits 1 if any check fails.
const {
  handleGivingPaymentFailed, handleGivingSubscriptionEnded, handleGivingDispute, dateLabel, reasonLabel,
} = await import("../lib/givingProblem.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

function deps(over = {}) {
  const cancelled = [];
  const reasons = [];
  const emails = [];
  return {
    cancelled, reasons, emails,
    cancelSubscription: async (id, reason) => { cancelled.push(id); reasons.push(reason); },
    sendEmail: async (m) => { emails.push(m); return true; },
    ...over,
  };
}

const meta = { kind: "giving", campaign_title: "Tithe", contact_name: "Ada Okafor", frequency: "monthly", subtotal_cents: "10000" };
const failed = { invoiceId: "in_9", subscriptionId: "sub_9", billingReason: "subscription_cycle", status: "open", attemptCount: 1, nextAttemptAt: 1795000000, amountDueCents: 10330, contactEmail: "ada@example.com", metadata: meta };
const to = (d, who) => d.emails.filter((e) => e.audience === who);

// ---- A renewal fails ----
{
  const d = deps();
  const out = await handleGivingPaymentFailed(failed, d);
  check("a failed renewal is handled, and the subscription is NOT cancelled (Stripe retries)", out === "handled" && d.cancelled.length === 0);
  const donor = to(d, "donor")[0];
  check("the donor is told, with the gift (not the fee-inclusive charge) and the retry date", donor.kind === "failed" && donor.amountLabel === "$100.00" && donor.frequencyLabel === "Monthly" && donor.nextAttemptLabel.endsWith("2026") && donor.contactEmail === "ada@example.com");
  check("the committee hears about the first failed attempt", to(d, "committee").length === 1);
  check("each email has its own idempotency key", new Set(d.emails.map((e) => e.idempotencyKey)).size === d.emails.length && d.emails.every((e) => e.idempotencyKey.startsWith("invoice-failed/in_9/1/")));
}
{
  const d = deps();
  await handleGivingPaymentFailed({ ...failed, attemptCount: 2 }, d);
  check("a later retry that failed emails the donor but not the committee", to(d, "donor").length === 1 && to(d, "committee").length === 0);
  check("the retry attempt has a different idempotency key than the first", to(d, "donor")[0].idempotencyKey === "invoice-failed/in_9/2/donor");
}
{
  const d = deps();
  await handleGivingPaymentFailed({ ...failed, attemptCount: 4, nextAttemptAt: null }, d);
  const donor = to(d, "donor")[0];
  check("with no retry left the donor is told it will not be tried again, and the committee is told", donor.nextAttemptLabel === "" && to(d, "committee").length === 1);
}

// ---- The first charge fails ----
{
  const d = deps();
  const out = await handleGivingPaymentFailed({ ...failed, billingReason: "subscription_create", nextAttemptAt: 1795000000 }, d);
  check("a failed FIRST charge cancels the subscription so it is not tried next cycle, recording why", out === "handled" && d.cancelled.length === 1 && d.cancelled[0] === "sub_9" && d.reasons[0] === "first-charge-failed");
  check("the donor is told it was stopped and they were not charged; the committee is told too", to(d, "donor")[0].kind === "stopped-first-failure" && to(d, "donor")[0].nextAttemptLabel === "" && to(d, "committee").length === 1);
}
{
  const d = deps({ cancelSubscription: async () => { throw new Error("stripe down"); } });
  const out = await handleGivingPaymentFailed({ ...failed, billingReason: "subscription_create" }, d);
  check("if cancelling the first-failure subscription fails the delivery fails (Stripe retries) and no email goes out", out === "failed" && d.emails.length === 0);
}
{
  const d = deps({ sendEmail: async () => false });
  const out = await handleGivingPaymentFailed(failed, d);
  check("an email failure fails the delivery so Stripe retries", out === "failed");
}
{
  const d = deps();
  const out = await handleGivingPaymentFailed({ ...failed, contactEmail: "" }, d);
  check("with no donor address only the committee is emailed", out === "handled" && to(d, "donor").length === 0 && to(d, "committee").length === 1);
}
{
  const d = deps();
  const out = await handleGivingPaymentFailed({ ...failed, metadata: { kind: "store_order" } }, d);
  check("another kind of invoice is skipped and touches nothing", out === "skipped" && d.emails.length === 0 && d.cancelled.length === 0);
}

// A late redelivery finds the invoice already paid: nothing is cancelled or reported.
{
  const d = deps();
  const out = await handleGivingPaymentFailed({ ...failed, billingReason: "subscription_create", status: "paid" }, d);
  check("a delivery that finds the invoice already paid is skipped: no cancel, no email", out === "skipped" && d.cancelled.length === 0 && d.emails.length === 0);
  const v = deps();
  const out2 = await handleGivingPaymentFailed({ ...failed, billingReason: "subscription_create", status: "void" }, v);
  check("a first-charge invoice that has since been voided still cancels the gift", out2 === "handled" && v.cancelled.length === 1);
}

// ---- The gift ends ----
{
  const d = deps();
  const out = await handleGivingSubscriptionEnded({ subscriptionId: "sub_9", reason: "cancellation_requested", comment: null, contactEmail: "ada@example.com", metadata: meta }, d);
  check("an ended gift tells the donor and the committee, each in their own words", out === "handled" && to(d, "donor")[0].reasonLabel === "You asked us to stop it." && to(d, "committee")[0].reasonLabel === "Stopped at the donor's request.");
  check("ended emails are keyed by subscription", d.emails.every((e) => e.idempotencyKey.startsWith("subscription-ended/sub_9/")));
  check("an ended gift cancels nothing (it is already over)", d.cancelled.length === 0);
}
{
  const d = deps();
  const out = await handleGivingSubscriptionEnded({ subscriptionId: "sub_1", reason: null, comment: null, contactEmail: "a@b.co", metadata: { kind: "registration" } }, d);
  check("an ended non-giving subscription is skipped", out === "skipped" && d.emails.length === 0);
}
for (const comment of ["auto:dispute", "auto:first-charge-failed"]) {
  const d = deps();
  const out = await handleGivingSubscriptionEnded({ subscriptionId: "sub_9", reason: "cancellation_requested", comment, contactEmail: "ada@example.com", metadata: meta }, d);
  check(`a gift the code cancelled itself (${comment}) sends no "you asked us to stop it" email`, out === "skipped" && d.emails.length === 0);
}
check("reason labels", reasonLabel("payment_failed").length > 0 && reasonLabel("payment_disputed").length > 0 && reasonLabel(null) === "" && reasonLabel("something_new") === "");

// ---- A dispute ----
{
  const d = deps();
  const out = await handleGivingDispute({ disputeId: "dp_1", status: "needs_response", subscriptionId: "sub_9", amountCents: 10081, contactEmail: "ada@example.com", metadata: meta }, d);
  check("a dispute cancels the gift (recording why) and tells only the committee", out === "handled" && d.cancelled[0] === "sub_9" && d.reasons[0] === "dispute" && d.emails.length === 1 && d.emails[0].audience === "committee" && d.emails[0].kind === "disputed");
  check("the dispute email shows the gift, not the fee-inclusive charge", d.emails[0].amountLabel === "$100.00");
  check("the dispute email is keyed by the dispute", d.emails[0].idempotencyKey === "dispute/dp_1/committee");
}
for (const status of ["warning_needs_response", "warning_under_review"]) {
  const d = deps();
  const out = await handleGivingDispute({ disputeId: "dp_3", status, subscriptionId: "sub_9", amountCents: 10081, contactEmail: "ada@example.com", metadata: meta }, d);
  check(`a bank inquiry (${status}) tells the committee but does NOT cancel the gift`, out === "handled" && d.cancelled.length === 0 && d.emails.length === 1 && d.emails[0].kind === "inquiry" && d.emails[0].audience === "committee");
}
{
  const d = deps({ cancelSubscription: async () => { throw new Error("nope"); } });
  const out = await handleGivingDispute({ disputeId: "dp_1", status: "needs_response", subscriptionId: "sub_9", amountCents: 100, contactEmail: "", metadata: meta }, d);
  check("if a disputed gift cannot be cancelled the delivery fails (Stripe retries) and nothing is emailed", out === "failed" && d.emails.length === 0);
}
{
  const d = deps();
  const out = await handleGivingDispute({ disputeId: "dp_2", status: "needs_response", subscriptionId: "", amountCents: 100, contactEmail: "", metadata: {} }, d);
  check("a dispute that is not a giving subscription is skipped", out === "skipped" && d.cancelled.length === 0 && d.emails.length === 0);
}

// ---- Dates ----
check("a retry date is written out in full", dateLabel(1795000000) === "November 18, 2026");
check("no date reads as empty", dateLabel(null) === "" && dateLabel(0) === "");

if (failures > 0) {
  console.log(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
