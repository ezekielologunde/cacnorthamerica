// Checks for app/api/register/route.ts's adult/youth tracks and the
// registration email. No test framework is installed, so this is a plain
// Node script:
//
//   node scripts/check-register-route.mjs
//
// Drives the real POST handler with a fake Stripe client and a fake fetch
// standing in for the Sheets webhook and Resend; nothing leaves the process.
// Exits 1 if any check fails.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const FAKE_STRIPE_MODULE = "data:text/javascript,export const getStripeClient = () => globalThis.__fakeStripe;";
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "@/lib/stripe") return { url: FAKE_STRIPE_MODULE, shortCircuit: true };
    if (specifier === "next/server") return next("next/server.js", context);
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

const SHEETS_URL = "https://sheets.invalid/hook";
process.env.SHEETS_WEBHOOK = SHEETS_URL;
process.env.RESEND_API_KEY = "re_check_script_only";
process.env.REGISTRATION_SIGNING_SECRET = "check-script-only-secret";
delete process.env.SHEETS_WEBHOOK_SECRET;
delete process.env.STRIPE_SECRET_KEY;

const created = [];
globalThis.__fakeStripe = {
  checkout: { sessions: { create: async (params) => { created.push(params); return { url: "https://checkout.invalid/s" }; } } },
};
const rows = [];
const emails = []; // every Resend send attempt, failed ones included
let resendFailure = null; // null | "error" (Resend answers 500) | "throw" (network failure)
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  if (url === SHEETS_URL) { rows.push(JSON.parse(init.body)); return Response.json({ ok: true }); }
  if (url.startsWith("https://api.resend.com/")) {
    emails.push(JSON.parse(init.body));
    if (resendFailure === "throw") throw new Error("fake network failure");
    if (resendFailure === "error") return Response.json({ name: "application_error", message: "fake" }, { status: 500 });
    return Response.json({ id: "email_1" });
  }
  throw new Error(`unexpected fetch ${url}`);
};

const { POST } = await import("../app/api/register/route.ts");
const { FORM_HEADER } = await import("../lib/spam.ts");
const { openRegistrationToken } = await import("../lib/registrationToken.ts");
const { resolveRegistrationConfirmation } = await import("../lib/registrationConfirmation.ts");
const { decodeSummary, unchunkFromMetadata, STRIPE_METADATA_MAX_KEYS } = await import("../lib/checkoutSummary.ts");
const { sendRegistrationConfirmationEmail } = await import("../lib/registrationEmail.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}
// logToSheet and the free youth confirmation email are fire-and-forget; the
// email renders a QR code first, so it gets a longer wait.
const settle = (ms = 20) => new Promise((r) => setTimeout(r, ms));
const settleEmail = () => settle(300);
const recipients = (e) => [].concat(e.to);
const tokenOf = (res) => new URL(res.body.checkoutUrl ?? "http://x/").searchParams.get("t") ?? "";

let ip = 0; // a fresh rate-limit bucket per request
async function post(body, { header = true } = {}) {
  const headers = { "content-type": "application/json", "x-real-ip": `10.0.0.${++ip}` };
  if (header) headers[FORM_HEADER] = "1";
  const res = await POST(new Request("http://localhost/api/register", { method: "POST", headers, body: JSON.stringify(body) }));
  return { status: res.status, body: await res.json() };
}

const adult = (category) => ({
  registrationType: "individual", churchName: "CAC Example", contactName: "A Adult", contactEmail: "a@example.com",
  contactPhone: "4435550100", registrants: [{ firstName: "A", lastName: "Adult", category }],
});
const youth = (registrants, extra = {}) => ({
  track: "youth", contactName: "Parent Name", contactEmail: "parent@example.com", contactPhone: "(443) 555-0100",
  churchName: "CAC Example", youthLeaderName: "Leader", dccZone: "Zone 1", guardianConfirmed: true, registrants, ...extra,
});
const kid = (age, extra = {}) => ({ firstName: "Kid", lastName: `Age${age}`, age, meals: ["tue_lunch", "fri_dinner"], ...extra });

// Adult track accepts category "adult" only.
for (const c of ["child", "young_adult"]) {
  const r = await post(adult(c));
  check(`adult track rejects category ${c} with 400`, r.status === 400 && /under 30/.test(r.body.error));
}
const adultTrackExplicit = await post({ ...adult("child"), track: "adult" });
check("explicit track 'adult' rejects category child", adultTrackExplicit.status === 400);
check("unknown track rejected", (await post({ ...adult("adult"), track: "kids" })).status === 400);

// Youth validation.
for (const age of [0, 30, "abc", 5.5]) {
  check(`youth age ${JSON.stringify(age)} rejected with 400`, (await post(youth([kid(age)]))).status === 400);
}
check("youth unknown meal slot rejected with 400", (await post(youth([kid(5, { meals: ["sat_breakfast"] })]))).status === 400);
check("youth minor without guardian confirmation rejected", (await post(youth([kid(14)], { guardianConfirmed: false }))).status === 400);
check("youth complimentary request refused with 403", (await post(youth([kid(5)], { isComplimentary: true }))).status === 403);

// Bot guards return a silent success and record nothing.
rows.length = 0;
check("youth without the form header: silent success",
  (await post(youth([kid(5)]), { header: false })).body.success === true);
check("youth with the honeypot filled: silent success",
  (await post(youth([kid(5)], { company_website: "x" }))).body.success === true);
await settle();
check("bot-guarded youth posts log no rows", rows.length === 0);

// Free path: everyone 19 or under.
rows.length = 0; emails.length = 0; created.length = 0;
const free = await post(youth([kid(5, { allergies: "Peanuts" }), kid(14, { meals: [], noMeals: true })]));
await settleEmail();
const token = new URL(free.body.checkoutUrl ?? "http://x/").searchParams.get("t");
check("free youth registration succeeds with a sealed confirmation link", free.status === 200 && !!token && /\/register\/confirmation\?t=/.test(free.body.checkoutUrl));
check("free youth registration logs one row per person to the youth tab",
  rows.length === 2 && rows.every((r) => r.formName === "Youth & Child Registration — CACNA 2027"));
const r5 = rows.find((r) => r.Name === "Kid Age5");
const r14 = rows.find((r) => r.Name === "Kid Age14");
check("youth rows carry age, group, fee category, meals and allergies",
  r5?.Age === "5" && r5["Age Group"] === "Child (1–10)" && r5["Fee Category"] === "child" &&
  r5.Meals === "Tuesday Lunch — 7/13; Friday Dinner — 7/16" && r5.Allergies === "Peanuts" &&
  r14?.["Age Group"] === "Youth (11–19)" && r14.Meals === "None" && r14["Guardian Confirmed"] === "Yes" &&
  r14["Youth Leader"] === "Leader" && r14["DCC / Zone"] === "Zone 1" && r14.Status === "free (email unverified)" &&
  r5.Ref && r5.Ref === r14.Ref);
check("free youth path creates no Stripe session", created.length === 0);
check("free youth rows carry no processing fee columns", rows.every((r) => !("Processing Fee" in r) && !("Amount Charged" in r)));
const freeHtml0 = emails[0]?.html ?? "";
check("free youth registration sends exactly one email, to the contact address",
  emails.length === 1 && recipients(emails[0]).length === 1 && recipients(emails[0])[0] === "parent@example.com");
check("free youth email names each person with their meals and allergies, and no Payment Options",
  freeHtml0.includes("Kid Age5") && freeHtml0.includes("Kid Age14") &&
  freeHtml0.includes("Meals: Tuesday Lunch — 7/13, Friday Dinner — 7/16") && freeHtml0.includes("Meals: None") &&
  freeHtml0.includes("Allergies: Peanuts") && !freeHtml0.includes("Payment Options"));
const opened = openRegistrationToken(token ?? "");
check("free youth token records that an email was attempted", opened?.emailed === true);
check("sealed token keeps age and meals but leaves allergies out",
  opened?.registrants?.length === 2 && opened.registrants.every((r) => !("l" in r)) && opened.registrants[0].a === 5 &&
  opened.registrants[0].m === 129 && opened.youth?.guardian === true);
const confirmation = await resolveRegistrationConfirmation({ year: 2027, token, retrieveSession: async () => { throw new Error("no"); } });
check("free youth token renders as a free confirmation", confirmation?.isFree === true && confirmation.summary.registrants.length === 2);

// Free-path email cap: 3 per recipient address per day (case-insensitive).
// The 4th registration still succeeds and is logged, but sends nothing.
emails.length = 0; rows.length = 0;
const capped = [];
for (const addr of ["cap@example.com", "cap@example.com", "cap@example.com", "Cap@Example.COM"]) {
  capped.push(await post(youth([kid(6)], { contactEmail: addr })));
  await settleEmail();
}
check("first 3 free registrations for one address each send one email",
  emails.length === 3 && emails.every((e) => recipients(e)[0] === "cap@example.com"));
check("4th free registration for the same address within the window succeeds, is logged, and sends none",
  capped[3].status === 200 && /\/register\/confirmation\?t=/.test(capped[3].body.checkoutUrl) && rows.length === 4 &&
  openRegistrationToken(tokenOf(capped[3]))?.emailed === undefined);

// A failed send never fails the registration.
for (const mode of ["error", "throw"]) {
  emails.length = 0; rows.length = 0; resendFailure = mode;
  const res = await post(youth([kid(7)], { contactEmail: `fail-${mode}@example.com` }));
  await settleEmail();
  resendFailure = null;
  check(`Resend failure (${mode}) still returns a successful free youth registration`,
    res.status === 200 && /\/register\/confirmation\?t=/.test(res.body.checkoutUrl) && emails.length === 1 && rows.length === 1);
}

// A spam-looking submission sends no email (and, as before, logs nothing).
emails.length = 0; rows.length = 0;
const spam = await post(youth([kid(8, { allergies: "http://a.invalid http://b.invalid http://c.invalid" })], { contactEmail: "spam@example.com" }));
await settleEmail();
check("spam-looking free youth submission sends no email", spam.body.success === true && emails.length === 0 && rows.length === 0);

// Without Resend configured the email is skipped silently, and the page is not told one was sent.
emails.length = 0;
delete process.env.RESEND_API_KEY;
const noResend = await post(youth([kid(9)], { contactEmail: "noresend@example.com" }));
await settleEmail();
process.env.RESEND_API_KEY = "re_check_script_only";
check("free youth registration without RESEND_API_KEY succeeds, sends none, and seals no emailed flag",
  noResend.status === 200 && emails.length === 0 && openRegistrationToken(tokenOf(noResend))?.emailed === undefined);

emails.length = 0;
const bigGroup = await post(youth(Array.from({ length: 30 }, (_, i) => kid(5 + (i % 10), { firstName: "Christopher" + i, lastName: "Johnson-Williams" })), { contactEmail: "biggroup@example.com" }));
await settleEmail();
check("a 30-person free group still gets its confirmation email even if the QR cannot be encoded",
  bigGroup.status === 200 && emails.length === 1 && recipients(emails[0])[0] === "biggroup@example.com");

emails.length = 0;
const prompt = await post(youth([kid(7)], { contactEmail: "prompt@example.com" }));
check("the free youth email has been sent by the time the response returns (not left to run after it)",
  prompt.status === 200 && emails.length === 1);

// Paid path: anyone 20-29.
created.length = 0; rows.length = 0;
const paid = await post(youth([kid(22, { allergies: "Shellfish" }), kid(8)]));
await settle();
const params = created[0];
check("paid youth registration creates a Stripe session", paid.status === 200 && paid.body.checkoutUrl === "https://checkout.invalid/s" && !!params);
const feeLines = (params?.line_items ?? []).filter((li) => li.price_data.product_data.name === "Processing fee");
const realLines = (params?.line_items ?? []).filter((li) => li.price_data.product_data.name !== "Processing fee");
check("only the young adult is a registration line item, at the young_adult rate",
  realLines.length === 1 && realLines[0].price_data.unit_amount === 10000 &&
  realLines[0].price_data.product_data.name.endsWith("Kid Age22 (young_adult)"));
// ceil((10000 + 30) / 0.971) = 10330, so the fee on a $100.00 subtotal is $3.30.
check("paid youth session has exactly one 'Processing fee' line item, after the registration lines, for $3.30",
  feeLines.length === 1 && feeLines[0].price_data.unit_amount === 330 && feeLines[0].quantity === 1 &&
  params.line_items.at(-1) === feeLines[0]);
check("paid youth metadata records subtotal_cents and processing_fee_cents",
  params?.metadata.subtotal_cents === "10000" && params.metadata.processing_fee_cents === "330");
check("paid youth cancel_url returns to the youth registration page", params?.cancel_url.endsWith("/events/cacna-2027/register/youth"));
const meta = decodeSummary(unchunkFromMetadata(params?.metadata, "d"));
check("paid youth metadata carries the full summary, allergies included",
  meta?.youth?.leader === "Leader" && meta.registrants[0].l === "Shellfish" && meta.registrants[0].c === "young_adult" &&
  meta.registrants[1].c === "child" && meta.totalAmountCents === 10000);
check("paid youth path logs no rows before payment", rows.length === 0);
const paidConfirmation = await resolveRegistrationConfirmation({
  year: 2027, sessionId: "cs_test_paidyouth",
  retrieveSession: async () => ({ metadata: params?.metadata, payment_status: "paid", amount_total: 10330 }),
});
check("paid youth confirmation reads back the fee and keeps age and meals",
  paidConfirmation?.processingFeeCents === 330 && paidConfirmation.summary.totalAmountCents === 10000 &&
  paidConfirmation.summary.registrants[0].a === 22 && paidConfirmation.summary.registrants[0].m === 129);

// A 10-person, every-field-maxed paid registration still fits Stripe metadata.
created.length = 0;
const big = Array.from({ length: 10 }, (_, i) => ({
  firstName: "F".repeat(120), lastName: "L".repeat(119) + i, age: 20 + i,
  meals: ["tue_lunch", "tue_dinner", "wed_lunch", "wed_dinner", "thu_lunch", "thu_dinner", "fri_lunch", "fri_dinner"],
  allergies: "A".repeat(200),
}));
const bigRes = await post(youth(big, { contactName: "N".repeat(120), churchName: "C".repeat(120), youthLeaderName: "Y".repeat(120), dccZone: "D".repeat(120) }));
check(`10-person maxed registration passes fitsStripeMetadata and reaches Stripe (${Object.keys(created[0]?.metadata ?? {}).length}/${STRIPE_METADATA_MAX_KEYS} keys)`,
  bigRes.status === 200 && created.length === 1 && Object.keys(created[0].metadata).length <= STRIPE_METADATA_MAX_KEYS);

// 30 people with every field maxed need more summary chunks than fit beside
// kind, convention_year and the two fee keys (50 keys max), so the guard (which
// must count the fee keys) refuses it before Stripe would.
created.length = 0;
const huge = Array.from({ length: 30 }, (_, i) => ({ ...big[0], lastName: "L".repeat(118) + String(i).padStart(2, "0"), age: 20 + (i % 10) }));
const hugeRes = await post(youth(huge, { contactEmail: `${"e".repeat(108)}@example.com`, contactPhone: "5".repeat(120), contactName: "N".repeat(120), churchName: "C".repeat(120), youthLeaderName: "Y".repeat(120), dccZone: "D".repeat(120) }));
check("30-person maxed paid registration is refused with the split message and creates no Stripe session",
  hugeRes.status === 400 && /split it/.test(hugeRes.body.error ?? "") && created.length === 0);

// Email: per-person details, escaped, and Payment Options only when owed.
emails.length = 0;
const emailSummary = {
  ref: "r", year: 2027, registrationType: "group", churchName: "CAC <b>Example</b>", contactName: "Parent",
  contactEmail: "parent@example.com", contactPhone: "", totalAmountCents: 10000, isComplimentary: false,
  registrants: [
    { n: "Kid <i>One</i>", c: "young_adult", a: 22, m: 129, l: "<script>alert(1)</script>" },
    { n: "Kid Two", c: "child", a: 8, m: 0 },
  ],
  youth: { leader: "Leader", dcc: "Zone", guardian: true },
};
await sendRegistrationConfirmationEmail(emailSummary, "https://example.invalid/c", true);
await sendRegistrationConfirmationEmail({ ...emailSummary, totalAmountCents: 0 }, "https://example.invalid/c", true);
const [paidHtml, freeHtml] = emails.map((e) => e.html);
check("email lists each person's age group and meals",
  paidHtml?.includes("Young Adult (20–29)") && paidHtml.includes("Child (1–10)") &&
  paidHtml.includes("Tuesday Lunch — 7/13, Friday Dinner — 7/16") && paidHtml.includes("Meals: None"));
check("email escapes names and allergy notes",
  paidHtml?.includes("Allergies: &lt;script&gt;alert(1)&lt;/script&gt;") && paidHtml.includes("Kid &lt;i&gt;One&lt;/i&gt;") && !paidHtml.includes("<script>"));
check("email shows Payment Options only when the total is over $0",
  paidHtml?.includes("Payment Options") && freeHtml !== undefined && !freeHtml.includes("Payment Options"));
emails.length = 0;
await sendRegistrationConfirmationEmail(emailSummary, "https://example.invalid/c", true, undefined, 330);
const feeHtml = emails[0]?.html ?? "";
check("paid youth email shows Subtotal, Processing fee and the charged total, and keeps age groups and meals",
  feeHtml.includes("Subtotal") && feeHtml.includes("$100.00") && feeHtml.includes("Processing fee") && feeHtml.includes("$3.30") &&
  feeHtml.includes("$103.30") && feeHtml.includes("Young Adult (20–29)") && feeHtml.includes("Tuesday Lunch — 7/13"));
check("free youth email has no processing fee row", !freeHtml?.includes("Processing fee"));

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
