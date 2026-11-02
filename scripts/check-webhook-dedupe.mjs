// Dedupe / retry checks for app/api/stripe/webhook/route.ts. No test
// framework is installed, so this is a plain Node script:
//
//   node scripts/check-webhook-dedupe.mjs
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
    // next has no "exports" map, so ESM needs the file extension.
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
process.env.STRIPE_WEBHOOK_SECRET = "whsec_check_script_only";
process.env.SHEETS_WEBHOOK = SHEETS_URL;
process.env.RESEND_API_KEY = "re_check_script_only";
process.env.REGISTRATION_SIGNING_SECRET = "check-script-only-secret";
delete process.env.SHEETS_WEBHOOK_SECRET;
console.error = () => {}; // the handler logs every simulated failure

// Fake Stripe: signature check just parses the body; retrieve is slow enough
// that two deliveries started together overlap. A retrieval returns the
// session as it was when the call started, and calls onRetrieve[id] then.
const sessions = {};
const onRetrieve = {};
globalThis.__fakeStripe = {
  webhooks: { constructEvent: (body) => JSON.parse(body) },
  checkout: {
    sessions: {
      retrieve: async (id) => {
        const snapshot = sessions[id];
        onRetrieve[id]?.();
        await new Promise((r) => setTimeout(r, 30));
        if (!snapshot) throw new Error("No such checkout session");
        return { line_items: { data: [] }, customer_details: { email: "giver@example.com" }, amount_total: 5000, ...snapshot };
      },
    },
  },
};

// Fake fetch: records accepted sheet rows and sent emails per session, and
// fails the next N calls of a kind on request. sheetReplies queues bodies the
// Sheets webhook answers with HTTP 200 instead of accepting the row (the Apps
// Script's {ok:false} on a bad secret or script error).
const rows = [];
const emails = [];
const failNext = { sheet: 0, email: 0 };
const sheetReplies = [];
const youthRows = [];
const allRows = []; // every accepted row, in full
const emailBodies = []; // every sent email's Resend payload
let failRowNamed = null; // fail the sheet write of the row with this Name, once
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  if (url === SHEETS_URL) {
    if (failNext.sheet > 0) { failNext.sheet--; throw new TypeError("fetch failed"); }
    if (sheetReplies.length) return new Response(sheetReplies.shift(), { status: 200 });
    const row = JSON.parse(init.body);
    if (failRowNamed && row.Name === failRowNamed) { failRowNamed = null; throw new TypeError("fetch failed"); }
    if (row.Name) youthRows.push(row);
    allRows.push(row);
    rows.push(row["Stripe Session"]);
    return Response.json({ ok: true });
  }
  if (url.startsWith("https://api.resend.com/")) {
    if (failNext.email > 0) {
      failNext.email--;
      return Response.json({ name: "internal_server_error", message: "try later", statusCode: 500 }, { status: 500 });
    }
    emails.push(new Headers(init.headers).get("Idempotency-Key"));
    emailBodies.push(JSON.parse(init.body));
    return Response.json({ id: `email_${emails.length}` });
  }
  throw new Error(`unexpected fetch ${url}`);
};

const { POST } = await import("../app/api/stripe/webhook/route.ts");

async function deliver(sessionId, type = "checkout.session.completed") {
  const res = await POST(new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": "t=0,v1=fake" },
    body: JSON.stringify({ type, data: { object: { id: sessionId } } }),
  }));
  return { status: res.status, body: await res.json() };
}
const giving = (status = "paid") => ({ payment_status: status, metadata: { kind: "giving", campaign_title: "Building Fund", contact_name: "Giver" } });
const count = (list, sessionId) => list.filter((v) => v === sessionId || v === `checkout-session/${sessionId}`).length;

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

// Finding B: overlapping deliveries (completed + async_payment_succeeded).
sessions.cs_test_overlap = giving();
const pair = await Promise.all([
  deliver("cs_test_overlap", "checkout.session.completed"),
  deliver("cs_test_overlap", "checkout.session.async_payment_succeeded"),
]);
check("two concurrent deliveries write one sheet row", count(rows, "cs_test_overlap") === 1);
check("two concurrent deliveries send one email", count(emails, "cs_test_overlap") === 1);
check("both concurrent deliveries get 200, one of them marked duplicate",
  pair.every((r) => r.status === 200) && pair.filter((r) => r.body.duplicate).length === 1);
const triple = await Promise.all([1, 2, 3].map(() => deliver("cs_test_overlap")));
check("a later redelivery burst records nothing more",
  triple.every((r) => r.status === 200 && r.body.duplicate) && count(rows, "cs_test_overlap") === 1 && count(emails, "cs_test_overlap") === 1);

// Finding A: a failed sheet write releases the session; the retry records it.
sessions.cs_test_sheetfail = giving();
failNext.sheet = 1;
const sheetFail = await deliver("cs_test_sheetfail");
check("sheet failure returns 500 so Stripe retries", sheetFail.status === 500 && count(rows, "cs_test_sheetfail") === 0);
const sheetRetry = await deliver("cs_test_sheetfail");
check("retry after a sheet failure records the row (not a duplicate)",
  sheetRetry.status === 200 && !sheetRetry.body.duplicate && count(rows, "cs_test_sheetfail") === 1);
check("retry after a sheet failure does not resend the email", count(emails, "cs_test_sheetfail") === 1);

// Finding A: a failed email releases the session; the retry sends it once
// without appending a second sheet row.
sessions.cs_test_emailfail = giving();
failNext.email = 1;
const emailFail = await deliver("cs_test_emailfail");
check("email failure returns 500 so Stripe retries", emailFail.status === 500 && count(emails, "cs_test_emailfail") === 0);
const emailRetry = await deliver("cs_test_emailfail");
check("retry after an email failure sends the email",
  emailRetry.status === 200 && !emailRetry.body.duplicate && count(emails, "cs_test_emailfail") === 1);
check("retry after an email failure does not write a second row", count(rows, "cs_test_emailfail") === 1);

// A successful event is not recorded twice.
sessions.cs_test_once = giving();
const first = await deliver("cs_test_once");
const again = await deliver("cs_test_once");
check("a recorded session's redelivery is a 200 duplicate that records nothing",
  first.status === 200 && again.status === 200 && again.body.duplicate && count(rows, "cs_test_once") === 1 && count(emails, "cs_test_once") === 1);

// A pending delayed payment is released, not marked handled.
sessions.cs_test_pending = giving("unpaid");
const pending = await deliver("cs_test_pending");
sessions.cs_test_pending = giving("paid");
const settled = await deliver("cs_test_pending", "checkout.session.async_payment_succeeded");
check("pending payment records nothing; the later settled event records it once",
  pending.status === 200 && !pending.body.duplicate && settled.status === 200 && !settled.body.duplicate &&
  count(rows, "cs_test_pending") === 1 && count(emails, "cs_test_pending") === 1);

// Codex A: the completed delivery retrieves the session while still unpaid;
// async_payment_succeeded arrives while that retrieval is in flight. The
// overlapping delivery must not be acknowledged unprocessed.
sessions.cs_test_deferred = giving("unpaid");
const firstRetrieval = new Promise((r) => { onRetrieve.cs_test_deferred = r; });
const completedRun = deliver("cs_test_deferred", "checkout.session.completed");
await firstRetrieval;
delete onRetrieve.cs_test_deferred;
sessions.cs_test_deferred = giving("paid");
const deferred = await Promise.all([completedRun, deliver("cs_test_deferred", "checkout.session.async_payment_succeeded")]);
check("succeeded event overlapping an unpaid in-flight retrieval records the payment once",
  deferred.every((r) => r.status === 200) && count(rows, "cs_test_deferred") === 1 && count(emails, "cs_test_deferred") === 1);

// Codex B: the Apps Script answers 200 {ok:false} (bad secret, script error).
sessions.cs_test_sheetrejected = giving();
sheetReplies.push(JSON.stringify({ ok: false, error: "Invalid secret" }));
const rejected = await deliver("cs_test_sheetrejected");
check("sheet webhook {ok:false} returns 500 so Stripe retries", rejected.status === 500 && count(rows, "cs_test_sheetrejected") === 0);
const rejectedRetry = await deliver("cs_test_sheetrejected");
check("retry after {ok:false} writes the row once and sends one email",
  rejectedRetry.status === 200 && !rejectedRetry.body.duplicate &&
  count(rows, "cs_test_sheetrejected") === 1 && count(emails, "cs_test_sheetrejected") === 1);

sessions.cs_test_sheetnonjson = giving();
sheetReplies.push("<html>Script error</html>");
const nonJson = await deliver("cs_test_sheetnonjson");
check("sheet webhook non-JSON 200 body returns 500 so Stripe retries", nonJson.status === 500 && count(rows, "cs_test_sheetnonjson") === 0);

// Youth & Child: one row per person, each its own idempotent step, so a
// retry after a failure part-way through appends only the missing rows.
const { encodeSummary, chunkForMetadata } = await import("../lib/checkoutSummary.ts");
const youthSummary = {
  ref: "ref-youth", year: 2027, registrationType: "group", churchName: "CAC Example", contactName: "Parent",
  contactEmail: "parent@example.com", contactPhone: "4435550100", totalAmountCents: 10000, isComplimentary: false,
  registrants: [
    { n: "Ada Young", c: "young_adult", a: 22, m: 1, l: "Peanuts" },
    { n: "Ben Kid", c: "child", a: 8, m: 0 },
    { n: "Cy Teen", c: "child", a: 15, m: 255 },
  ],
  youth: { leader: "Leader", dcc: "Zone 1", guardian: true },
};
sessions.cs_test_youth = {
  payment_status: "paid",
  amount_total: 10330, // $100.00 young-adult subtotal + $3.30 processing fee
  metadata: {
    kind: "registration", convention_year: "2027", ...chunkForMetadata("d", encodeSummary(youthSummary)),
    subtotal_cents: "10000", processing_fee_cents: "330",
  },
};
failRowNamed = "Ben Kid";
const youthFail = await deliver("cs_test_youth");
// (The email step still runs on a failed attempt, as for every kind.)
check("youth: a failed second row returns 500 after writing only the first",
  youthFail.status === 500 && count(rows, "cs_test_youth") === 1);
const youthRetry = await deliver("cs_test_youth");
const youthAgain = await deliver("cs_test_youth");
const names = youthRows.filter((r) => r["Stripe Session"] === "cs_test_youth").map((r) => r.Name);
check("youth: the retry appends only the missing rows, in order, then emails once",
  youthRetry.status === 200 && JSON.stringify(names) === JSON.stringify(["Ada Young", "Ben Kid", "Cy Teen"]) &&
  count(emails, "cs_test_youth") === 1);
check("youth: a later redelivery adds no rows", youthAgain.body.duplicate === true && count(rows, "cs_test_youth") === 3);
const ada = youthRows.find((r) => r.Name === "Ada Young");
check("youth: rows go to the youth tab with per-person details and status paid",
  ada?.formName === "Youth & Child Registration — CACNA 2027" && ada.Allergies === "Peanuts" && ada.Age === "22" &&
  ada.Meals === "Tuesday Lunch — 7/13" && ada.Status === "paid" && ada["Contact Email"] === "giver@example.com");
const youthSessionRows = youthRows.filter((r) => r["Stripe Session"] === "cs_test_youth");
check("youth: the first row carries the registration's Processing Fee and Amount Charged, the rest leave them blank",
  ada?.["Processing Fee"] === "$3.30" && ada["Amount Charged"] === "$103.30" &&
  youthSessionRows.filter((r) => r !== ada).every((r) => r["Processing Fee"] === "" && r["Amount Charged"] === ""));

// Check-in codes (lib/checkinCode.ts): youth rows carry each person's code
// as the last column, the adult row pairs every code with its person's name
// in Registrants order, and the paid confirmation email shows each code in
// its person's own cell.
const { checkinCodesFor } = await import("../lib/checkinCode.ts");
const lastColumn = (row) => Object.keys(row ?? {}).filter((k) => k !== "formName" && k !== "secret").at(-1);
// The person's name, then directly their own "Check-in code: <code>" line.
const codeBesideName = (html, name, code) =>
  new RegExp(`>${name}<div[^>]*>Check-in code: <span[^>]*>${code}</span>`).test(html ?? "");
const youthCodes = checkinCodesFor({ ref: "ref-youth", year: 2027, registrants: [{}, {}, {}] });
const youthByName = (n) => youthRows.find((r) => r["Stripe Session"] === "cs_test_youth" && r.Name === n);
check("youth (paid): each row carries that person's check-in code as the last column",
  ["Ada Young", "Ben Kid", "Cy Teen"].every((n, i) => youthByName(n)?.["Check-in Code"] === youthCodes[i] && lastColumn(youthByName(n)) === "Check-in Code") &&
  new Set(youthCodes).size === 3);
const youthEmail = emailBodies.find((e) => e.html?.includes("Ada Young"));
check("youth (paid): the confirmation email shows every person's code next to their name",
  ["Ada Young", "Ben Kid", "Cy Teen"].every((n, i) => codeBesideName(youthEmail?.html, n, youthCodes[i])));

const adultSummary = {
  ref: "ref-adult", year: 2027, registrationType: "group", churchName: "CAC Example", contactName: "Adult One",
  contactEmail: "adult@example.com", contactPhone: "4435550100", totalAmountCents: 30000, isComplimentary: false,
  registrants: [{ n: "Adult One", c: "adult" }, { n: "Adult Two", c: "adult" }],
};
sessions.cs_test_adult = {
  payment_status: "paid",
  metadata: { kind: "registration", convention_year: "2027", ...chunkForMetadata("d", encodeSummary(adultSummary)) },
};
const adultRes = await deliver("cs_test_adult");
const adultRow = allRows.find((r) => r["Stripe Session"] === "cs_test_adult");
const adultCodes = checkinCodesFor(adultSummary);
check("adult (paid): the row pairs every registrant's code with their name in Registrants order, as the last column after the fee columns",
  adultRes.status === 200 && adultRow?.Registrants === "Adult One (adult); Adult Two (adult)" &&
  adultRow["Check-in Code"] === `Adult One: ${adultCodes[0]}; Adult Two: ${adultCodes[1]}` && lastColumn(adultRow) === "Check-in Code" &&
  "Processing Fee" in adultRow && "Amount Charged" in adultRow && adultCodes[0] !== adultCodes[1]);
const adultEmail = emailBodies.find((e) => e.html?.includes("Adult Two"));
check("adult (paid): the confirmation email shows each person's code next to their name",
  ["Adult One", "Adult Two"].every((n, i) => codeBesideName(adultEmail?.html, n, adultCodes[i])));

process.stdout.write(failures ? `\n${failures} check(s) FAILED\n` : "\nAll checks passed\n");
process.exit(failures ? 1 : 0);
