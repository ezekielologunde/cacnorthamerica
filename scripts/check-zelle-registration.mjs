// Checks for paying a convention registration by Zelle (paymentMethod
// "zelle" on POST /api/register): no Stripe, no processing fee, a sealed
// confirmation token marked pay "zelle", sheet rows and check-in rows marked
// awaiting Zelle, and the admin "Mark paid" action. Plain Node script:
//
//   node scripts/check-zelle-registration.mjs
//
// Drives the real POST handler with a fake Stripe client, a fake fetch for
// the Sheets webhook and a fake Supabase service client; nothing leaves the
// process. Exits 1 if any check fails.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const FAKE_STRIPE_MODULE = "data:text/javascript,export const getStripeClient = () => globalThis.__fakeStripe;";
const FAKE_SUPABASE_MODULE = "data:text/javascript,export const createServiceClient = () => globalThis.__fakeSupabase;";
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "@/lib/stripe") return { url: FAKE_STRIPE_MODULE, shortCircuit: true };
    if (specifier === "@/lib/supabase/server") return { url: FAKE_SUPABASE_MODULE, shortCircuit: true };
    if (specifier === "next/server" || specifier === "next/headers") return next(`${specifier}.js`, context);
    if (specifier === "server-only") return { url: "data:text/javascript,", shortCircuit: true };
    let target = null;
    if (specifier.startsWith("@/")) target = path.join(root, specifier.slice(2));
    else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:") && !path.extname(specifier)) {
      target = path.join(path.dirname(new URL(context.parentURL).pathname.replace(/^\/(\w:)/, "$1")), specifier);
    }
    if (target && !path.extname(target) && existsSync(`${target}.ts`)) return next(pathToFileURL(`${target}.ts`).href, context);
    return next(specifier, context);
  },
});

const SHEETS_URL = "https://sheets.invalid/hook";
process.env.SHEETS_WEBHOOK = SHEETS_URL;
process.env.RESEND_API_KEY = "re_check_script_only";
process.env.REGISTRATION_SIGNING_SECRET = "check-script-only-secret";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-check-script-only";
delete process.env.SHEETS_WEBHOOK_SECRET;
delete process.env.STRIPE_SECRET_KEY;

const created = [];
globalThis.__fakeStripe = {
  checkout: { sessions: { create: async (params) => { created.push(params); return { url: "https://checkout.invalid/s" }; } } },
};
const stored = [];
globalThis.__fakeSupabase = {
  from: (table) => ({ upsert: (rows) => { stored.push({ table, rows }); return { abortSignal: async () => ({ error: null }) }; } }),
};
const rows = [];
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  if (url === SHEETS_URL) { rows.push(JSON.parse(init.body)); return Response.json({ ok: true }); }
  if (url.startsWith("https://api.resend.com/")) return Response.json({ id: "email_1" });
  throw new Error(`unexpected fetch ${url}`);
};

const { POST } = await import("../app/api/register/route.ts");
const { FORM_HEADER } = await import("../lib/spam.ts");
const { SITE_URL } = await import("../lib/site.ts");
const { openRegistrationToken } = await import("../lib/registrationToken.ts");
const { resolveRegistrationConfirmation } = await import("../lib/registrationConfirmation.ts");
const { zelleReferenceFor, isWellFormedZelleReference } = await import("../lib/zelleReference.ts");
const { checkinCodesFor } = await import("../lib/checkinCode.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}
const settle = () => new Promise((r) => setTimeout(r, 30));
const lastColumn = (row) => Object.keys(row ?? {}).filter((k) => k !== "formName" && k !== "secret").at(-1);
const columns = (row) => Object.keys(row ?? {}).filter((k) => k !== "formName" && k !== "secret");
const tokenOf = (res) => new URL(res.body.checkoutUrl ?? "http://x/").searchParams.get("t") ?? "";
const noSession = async () => { throw new Error("no session"); };

let ip = 0;
async function post(body) {
  const headers = { "content-type": "application/json", "x-real-ip": `10.1.0.${++ip}`, [FORM_HEADER]: "1" };
  const res = await POST(new Request("http://localhost/api/register", { method: "POST", headers, body: JSON.stringify(body) }));
  return { status: res.status, body: await res.json() };
}
const reset = () => { created.length = 0; rows.length = 0; stored.length = 0; };

const adultPerson = (i, extra = {}) => ({ firstName: "Adult", lastName: `Person${i}`, category: "adult", meals: ["tue_lunch"], ...extra });
const adultBody = (extra = {}) => ({
  track: "adult", registrationType: "individual", churchName: "CAC Example", contactName: "A Adult", contactEmail: "zelle-adult@example.com",
  contactPhone: "4435550100", dccZone: "Zone 3", registrants: [adultPerson(1, { allergies: "Gluten" }), adultPerson(2)], ...extra,
});
const youth = (registrants, extra = {}) => ({
  track: "youth", contactName: "Parent Name", contactEmail: "zelle-parent@example.com", contactPhone: "(443) 555-0100",
  churchName: "CAC Example", youthLeaderName: "Leader", dccZone: "Zone 1", guardianConfirmed: true, registrants, ...extra,
});
const kid = (age, extra = {}) => ({ firstName: "Kid", lastName: `Age${age}`, age, meals: ["tue_lunch"], ...extra });
const confirmationPrefix = `${SITE_URL}/events/cacna-2027/register/confirmation?t=`;

// ---------- Reference helper ----------
const zr = zelleReferenceFor("some-ref");
check("zelleReferenceFor is deterministic, ZEL- plus 8 Crockford characters, and differs per ref",
  isWellFormedZelleReference(zr) && zr === zelleReferenceFor("some-ref") && zr !== zelleReferenceFor("other-ref") &&
  /^ZEL-[0-9A-HJKMNP-TV-Z]{8}$/.test(zr));

// ---------- Card path unchanged ----------
reset();
const card = await post(adultBody());
check("adult with paymentMethod absent still returns the Stripe URL", card.status === 200 && card.body.checkoutUrl === "https://checkout.invalid/s" && created.length === 1);
reset();
const cardExplicit = await post(adultBody({ paymentMethod: "card" }));
check("adult with paymentMethod 'card' returns the Stripe URL with the processing fee line",
  cardExplicit.body.checkoutUrl === "https://checkout.invalid/s" && created[0]?.line_items.at(-1).price_data.product_data.name === "Processing fee");
reset();
const youthCard = await post(youth([kid(22)]));
check("paid youth with paymentMethod absent still returns the Stripe URL", youthCard.body.checkoutUrl === "https://checkout.invalid/s" && created.length === 1);
check("an unknown paymentMethod is rejected with 400 on both tracks",
  (await post(adultBody({ paymentMethod: "cash" }))).status === 400 && (await post(youth([kid(22)], { paymentMethod: "cash" }))).status === 400);

// ---------- Adult Zelle ----------
reset();
const az = await post(adultBody({ paymentMethod: "zelle" }));
await settle();
const azToken = tokenOf(az);
const azOpened = openRegistrationToken(azToken);
check("adult Zelle returns a confirmation URL on this site with ?t=", az.status === 200 && az.body.checkoutUrl?.startsWith(confirmationPrefix) && azToken !== "");
check("adult Zelle never calls Stripe", created.length === 0);
const azRow = rows[0];
check("adult Zelle logs one row with Status awaiting Zelle, Total = subtotal, $0.00 fee, blank Amount Charged",
  rows.length === 1 && azRow.Status === "awaiting Zelle (unverified email)" && azRow.Total === `$${(azOpened?.totalAmountCents / 100).toFixed(2)}` &&
  azOpened?.totalAmountCents > 0 && azRow["Processing Fee"] === "$0.00" && azRow["Amount Charged"] === "" && azRow["Stripe Session"] === "");
check("adult Zelle row: Zelle Reference just before Check-in Code, which stays last",
  azRow?.["Zelle Reference"] === zelleReferenceFor(azOpened?.ref ?? "") && lastColumn(azRow) === "Check-in Code" &&
  columns(azRow).at(-2) === "Zelle Reference" && azRow.Allergies === "Adult Person1: Gluten");
check("adult Zelle token: pay zelle, its reference, emailed, no allergies, no fee",
  azOpened?.pay === "zelle" && azOpened.zelleRef === azRow?.["Zelle Reference"] && azOpened.emailed === true &&
  azOpened.registrants.every((r) => !("l" in r)) && azOpened.registrants[0].m === 1);
check("adult Zelle check-in rows are awaiting_zelle with the reference",
  stored.length === 1 && stored[0].table === "checkin_people" && stored[0].rows.length === 2 &&
  stored[0].rows.every((r) => r.payment_status === "awaiting_zelle" && r.zelle_ref === azOpened?.zelleRef && r.stripe_session === null));
const azConf = await resolveRegistrationConfirmation({ year: 2027, token: azToken, retrieveSession: noSession });
check("adult Zelle token opens via registrationConfirmation as awaiting_zelle, not paid",
  azConf?.payment === "awaiting_zelle" && azConf.zelleRef === azOpened?.zelleRef && azConf.isPaid === false && azConf.isFree === false &&
  azConf.processingFeeCents === 0 && azConf.summary.totalAmountCents === azOpened?.totalAmountCents);
const tampered = azToken.slice(0, -2) + (azToken.at(-2) === "A" ? "B" : "A") + azToken.at(-1);
check("a tampered Zelle token is rejected",
  (await resolveRegistrationConfirmation({ year: 2027, token: tampered, retrieveSession: noSession })) === null);
check("a Zelle token for another year is rejected",
  (await resolveRegistrationConfirmation({ year: 2026, token: azToken, retrieveSession: noSession })) === null);

// ---------- Youth Zelle ----------
reset();
const yz = await post(youth([kid(22, { allergies: "Shellfish" }), kid(8)], { paymentMethod: "zelle" }));
await settle();
const yzOpened = openRegistrationToken(tokenOf(yz));
const yzCodes = checkinCodesFor(yzOpened ?? { ref: "", year: 0, registrants: [] });
check("youth Zelle returns a confirmation URL and never calls Stripe", yz.body.checkoutUrl?.startsWith(confirmationPrefix) && created.length === 0);
check("youth Zelle logs one row per person, awaiting Zelle, fee $0.00 on the first row only, no Amount Charged",
  rows.length === 2 && rows.every((r) => r.Status === "awaiting Zelle (unverified email)" && r["Amount Charged"] === "") &&
  rows[0]["Processing Fee"] === "$0.00" && rows[1]["Processing Fee"] === "");
check("youth Zelle rows carry the Zelle Reference before Check-in Code, which stays last",
  rows.every((r, i) => r["Zelle Reference"] === yzOpened?.zelleRef && columns(r).at(-2) === "Zelle Reference" &&
    lastColumn(r) === "Check-in Code" && r["Check-in Code"] === yzCodes[i]));
check("youth Zelle token is pay zelle with the subtotal and no allergies",
  yzOpened?.pay === "zelle" && yzOpened.totalAmountCents === 10000 && yzOpened.registrants.every((r) => !("l" in r)));
check("youth Zelle check-in rows are awaiting_zelle",
  stored[0]?.rows.length === 2 && stored[0].rows.every((r) => r.payment_status === "awaiting_zelle" && r.zelle_ref === yzOpened?.zelleRef));
check("youth Zelle token opens as awaiting_zelle",
  (await resolveRegistrationConfirmation({ year: 2027, token: tokenOf(yz), retrieveSession: noSession }))?.payment === "awaiting_zelle");

// ---------- $0 with paymentMethod zelle behaves exactly as before ----------
reset();
const free = await post(youth([kid(5)], { paymentMethod: "zelle", contactEmail: "zelle-free@example.com" }));
await settle();
const freeOpened = openRegistrationToken(tokenOf(free));
check("$0 youth with paymentMethod zelle: free path (free status, no Zelle columns, no pay in token)",
  free.body.checkoutUrl?.startsWith(confirmationPrefix) && created.length === 0 && rows.length === 1 &&
  rows[0].Status === "free (email unverified)" && !("Zelle Reference" in rows[0]) && !("Processing Fee" in rows[0]) &&
  freeOpened && !("pay" in freeOpened) && !("zelleRef" in freeOpened) &&
  stored[0]?.rows.every((r) => r.payment_status === "free" && !("zelle_ref" in r)));
const freeConf = await resolveRegistrationConfirmation({ year: 2027, token: tokenOf(free), retrieveSession: noSession });
check("$0 youth token still opens as free", freeConf?.payment === "free" && freeConf.isFree === true);

// ---------- Zelle email cap (own key) ----------
reset();
const capped = [];
for (let i = 0; i < 4; i++) capped.push(openRegistrationToken(tokenOf(await post(youth([kid(22)], { paymentMethod: "zelle", contactEmail: "zelle-cap@example.com" })))));
check("Zelle: first 3 per address per day seal emailed, the 4th does not",
  capped.slice(0, 3).every((t) => t?.emailed === true) && capped[3]?.emailed === undefined && capped[3]?.pay === "zelle");

// ---------- Admin action and page (source) ----------
const tsCode = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const read = (rel) => tsCode(readFileSync(path.join(root, rel), "utf8"));
const actions = read("app/admin/(protected)/check-in/actions.ts");
const mark = actions.split("export async function markZellePaid")[1]?.split("export async function")[0] ?? "";
check("markZellePaid calls await requireAdmin() first, then validates the id",
  /^\(id: string, formData\?: FormData\) \{\s*const \{ supabase \} = await requireAdmin\(\);\s*if \(!isCheckinId\(id\)\) throw new Error\(/.test(mark));
check("markZellePaid sets paid only where payment_status is awaiting_zelle",
  /\.update\(\{ payment_status: "paid" \}\)\s*\.eq\("id", id\)\s*\.eq\("payment_status", "awaiting_zelle"\);/.test(mark));
check("markZellePaid logs the id only, revalidates and redirects back like checkInPerson",
  /console\.error\(`\[check-in\] markZellePaid failed for id \$\{id\}`\);/.test(mark) && /revalidatePath\("\/admin\/check-in"\);/.test(mark) &&
  /redirect\(checkinPageHref\(formData\?\.get\("q"\), formData\?\.get\("year"\)\), RedirectType\.replace\);/.test(mark));
const page = read("app/admin/(protected)/check-in/page.tsx");
check("check-in page still calls await requireAdmin()", /await requireAdmin\(\)/.test(page));
check("page shows the Mark paid button, the warning and the badge only for awaiting_zelle",
  /const awaitingZelle = person\.payment_status === "awaiting_zelle";/.test(page) &&
  /\{awaitingZelle && \([\s\S]*Payment not received yet[\s\S]*markZellePaid\.bind\(null, person\.id\)[\s\S]*Mark paid[\s\S]*\)\}/.test(page) &&
  /awaitingZelle \? "Awaiting Zelle payment"/.test(page) && /person\.zelle_ref/.test(page) && /zelle_ref/.test(page.match(/const COLUMNS =[^;]*;/)?.[0] ?? ""));
const migration = readFileSync(path.join(root, "supabase/migrations/0016_checkin_awaiting_zelle.sql"), "utf8").replace(/--.*$/gm, "");
check("migration 0016 replaces the payment_status check to allow awaiting_zelle and adds zelle_ref",
  /drop constraint checkin_people_payment_status_check;/.test(migration) &&
  /check \(payment_status in \('free', 'paid', 'awaiting_zelle'\)\)/.test(migration) && /add column zelle_ref text/.test(migration));

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
