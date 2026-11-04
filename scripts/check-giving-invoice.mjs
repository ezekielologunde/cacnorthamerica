// Checks for lib/givingInvoice.ts, the recording of a recurring gift's paid
// invoices. No test framework is installed, so this is a plain Node script:
//
//   node scripts/check-giving-invoice.mjs
//
// The store here is an in-memory fake with the same contract as the Supabase
// store (lib/givingInvoiceStore.ts): the first begin() owns the invoice, later
// ones resume, or report busy while a claim is fresh. Two "instances" share
// one fake store, as two serverless instances share the table.
// Node 24 strips TypeScript types natively. Exits 1 if any check fails.
const {
  recordGivingInvoice, splitInvoiceAmount, shouldRecordInvoice, isGivingInvoice, frequencyLabel,
} = await import("../lib/givingInvoice.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

function fakeStore() {
  const rows = new Map();
  return {
    rows,
    async begin(inv) {
      const row = rows.get(inv.invoiceId);
      if (!row) {
        rows.set(inv.invoiceId, { done: new Set(), fresh: true });
        return { state: "new", done: new Set() };
      }
      if (row.done.has("sheet") && row.done.has("email")) return { state: "resume", done: new Set(row.done) };
      if (row.fresh) return { state: "busy", done: new Set(row.done) };
      row.fresh = true;
      return { state: "resume", done: new Set(row.done) };
    },
    async markDone(id, step) { rows.get(id).done.add(step); },
    async release(id) { rows.get(id).fresh = false; },
  };
}

function deps(store, over = {}) {
  const sheet = [];
  const emails = [];
  return {
    sheet, emails,
    store,
    logSheet: async (form, fields) => { sheet.push({ form, fields }); return true; },
    sendEmail: async (input) => { emails.push(input); return true; },
    ...over,
  };
}

const meta = {
  kind: "giving", campaign_title: "Tithe", contact_name: "Ada Okafor", frequency: "biweekly",
  subtotal_cents: "10000", processing_fee_cents: "81", setup_fee_cents: "152",
};
const first = { invoiceId: "in_1", subscriptionId: "sub_1", amountPaidCents: 10233, billingReason: "subscription_create", contactEmail: "ada@example.com", metadata: meta };
const renewal = { ...first, invoiceId: "in_2", amountPaidCents: 10081, billingReason: "subscription_cycle" };

// ---- Splitting the charge ----
const s1 = splitInvoiceAmount(10233, meta, "subscription_create");
check("the first bank invoice splits into gift, renewal fee and setup fee", s1.subtotalCents === 10000 && s1.processingFeeCents === 81 && s1.setupFeeCents === 152 && !s1.mismatch);
const s2 = splitInvoiceAmount(10081, meta, "subscription_cycle");
check("a renewal carries no setup fee", s2.subtotalCents === 10000 && s2.processingFeeCents === 81 && s2.setupFeeCents === 0 && !s2.mismatch);
const s3 = splitInvoiceAmount(10150, meta, "subscription_cycle");
check("an unexpected charge is flagged, and fee is whatever was charged beyond the gift", s3.mismatch && s3.subtotalCents === 10000 && s3.processingFeeCents === 150 && s3.totalCents === 10150);
const s4 = splitInvoiceAmount(5000, {}, "subscription_cycle");
check("missing metadata reads as all gift, no fee, flagged", s4.subtotalCents === 5000 && s4.processingFeeCents === 0 && s4.mismatch);
const s5 = splitInvoiceAmount(5000, { subtotal_cents: "9999" }, "subscription_cycle");
check("a gift larger than the charge is ignored", s5.subtotalCents === 5000 && s5.mismatch);
check("the split always adds up to the charge", [s1, s2, s3, s4, s5].every((s) => s.subtotalCents + s.processingFeeCents + s.setupFeeCents === s.totalCents));

// ---- Which invoices count ----
check("the first charge and scheduled renewals are gifts", shouldRecordInvoice("subscription_create", 100) && shouldRecordInvoice("subscription_cycle", 100));
check("a zero invoice is never a gift", !shouldRecordInvoice("subscription_cycle", 0));
check("manual and threshold invoices are not recorded", !shouldRecordInvoice("manual", 500) && !shouldRecordInvoice("subscription_threshold", 500) && !shouldRecordInvoice(null, 500));
check("only giving subscriptions are giving invoices", isGivingInvoice(first) && !isGivingInvoice({ ...first, metadata: { kind: "store_order" } }) && !isGivingInvoice({ ...first, subscriptionId: "" }));
check("frequency labels", frequencyLabel("monthly") === "Monthly" && frequencyLabel("biweekly") === "Every 2 weeks" && frequencyLabel("weekly") === "" && frequencyLabel(undefined) === "");

// ---- Recording ----
{
  const store = fakeStore();
  const d = deps(store);
  const outcome = await recordGivingInvoice(first, d);
  check("a first invoice records one sheet row and one receipt", outcome === "recorded" && d.sheet.length === 1 && d.emails.length === 1);
  const row = d.sheet[0].fields;
  check("the row is on the Giving tab with the invoice, subscription, frequency and amounts", d.sheet[0].form === "Giving" && row["Stripe Invoice"] === "in_1" && row["Stripe Subscription"] === "sub_1" && row["Frequency"] === "Every 2 weeks" && row["Payment"] === "First" && row["Total"] === "$100.00" && row["Processing Fee"] === "$2.33" && row["Amount Charged"] === "$102.33");
  const mail = d.emails[0];
  check("the receipt has its own idempotency key, the gift, fee and frequency", mail.idempotencyKey === "invoice/in_1" && mail.totalLabel === "$100.00" && mail.feeLabel === "$2.33" && mail.chargedLabel === "$102.33" && mail.frequencyLabel === "Every 2 weeks" && mail.contactName === "Ada Okafor");
  const again = await recordGivingInvoice(first, d);
  check("the same invoice delivered again is a duplicate: no second row, no second receipt", again === "duplicate" && d.sheet.length === 1 && d.emails.length === 1);

  const d2 = deps(store);
  const second = await recordGivingInvoice(renewal, d2);
  check("a renewal is its own gift: a new row and receipt marked Renewal", second === "recorded" && d2.sheet[0].fields["Payment"] === "Renewal" && d2.sheet[0].fields["Stripe Invoice"] === "in_2" && d2.emails[0].idempotencyKey === "invoice/in_2");
}

// Two instances, one durable store: a redelivery on the other instance does nothing.
{
  const store = fakeStore();
  const a = deps(store);
  const b = deps(store);
  await recordGivingInvoice(renewal, a);
  const out = await recordGivingInvoice(renewal, b);
  check("a redelivery on another instance, sharing the store, records nothing", out === "duplicate" && b.sheet.length === 0 && b.emails.length === 0);
}

// Overlapping deliveries: the second sees a fresh claim and is told to retry.
{
  const store = fakeStore();
  let release;
  const gate = new Promise((r) => { release = r; });
  const slow = deps(store, { logSheet: async () => { await gate; return true; } });
  const racing = deps(store);
  const running = recordGivingInvoice(renewal, slow);
  await Promise.resolve();
  const lost = await recordGivingInvoice(renewal, racing);
  check("an overlapping delivery is busy (500, retried later) and writes nothing", lost === "busy" && racing.sheet.length === 0 && racing.emails.length === 0);
  release();
  check("the first delivery still completes", (await running) === "recorded");
}

// Failures: nothing is lost, and nothing already done is repeated.
{
  const store = fakeStore();
  const sheetDown = deps(store, { logSheet: async () => false });
  const out = await recordGivingInvoice(renewal, sheetDown);
  check("a sheet failure is reported failed (Stripe retries)", out === "failed");
  check("the receipt is still sent when only the sheet failed", sheetDown.emails.length === 1);

  const retry = deps(store);
  const out2 = await recordGivingInvoice(renewal, retry);
  check("the retry writes the missing sheet row and does not resend the receipt", out2 === "recorded" && retry.sheet.length === 1 && retry.emails.length === 0);
}
{
  const store = fakeStore();
  const emailDown = deps(store, { sendEmail: async () => false });
  const out = await recordGivingInvoice(renewal, emailDown);
  const retry = deps(store);
  const out2 = await recordGivingInvoice(renewal, retry);
  check("an email failure retries only the email, never a second sheet row", out === "failed" && emailDown.sheet.length === 1 && out2 === "recorded" && retry.sheet.length === 0 && retry.emails.length === 1);
}
{
  const store = fakeStore();
  const threw = deps(store, { sendEmail: async () => { throw new Error("boom"); } });
  const out = await recordGivingInvoice(renewal, threw);
  check("a thrown error is reported failed, not crashed", out === "failed");
}
{
  const broken = deps({ begin: async () => { throw new Error("db down"); }, markDone: async () => {}, release: async () => {} });
  const out = await recordGivingInvoice(renewal, broken);
  check("a database error before anything is written is failed (500), with no row and no receipt", out === "failed" && broken.sheet.length === 0 && broken.emails.length === 0);
}
{
  const store = fakeStore();
  const d = deps(store);
  const skipped = await recordGivingInvoice({ ...renewal, metadata: { kind: "store_order" } }, d);
  const proration = await recordGivingInvoice({ ...renewal, billingReason: "subscription_update" }, d);
  check("a store invoice and a proration are skipped without touching the store", skipped === "skipped" && proration === "skipped" && store.rows.size === 0 && d.sheet.length === 0);
}

if (failures > 0) {
  console.log(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
