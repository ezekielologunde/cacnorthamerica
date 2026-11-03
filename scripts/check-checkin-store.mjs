// Checks for the check-in lookup table (cacna.checkin_people): the migration,
// lib/checkinStore.ts, and its wiring into the register route and the Stripe
// webhook. No test framework is installed, so this is a plain Node script:
//
//   node scripts/check-checkin-store.mjs
//
// Source-level checks on the migration and the two routes, then drives the
// real recordCheckinPeople with a fake Supabase service client; nothing
// leaves the process. Exits 1 if any check fails.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const FAKE_SUPABASE_MODULE = "data:text/javascript,export const createServiceClient = () => globalThis.__fakeSupabase();";
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "@/lib/supabase/server") return { url: FAKE_SUPABASE_MODULE, shortCircuit: true };
    // Next's bundler provides "server-only"; plain Node has no such package.
    if (specifier === "server-only") return { url: "data:text/javascript,", shortCircuit: true };
    if (specifier.startsWith("@/")) {
      const target = path.join(root, specifier.slice(2));
      if (!path.extname(target) && existsSync(`${target}.ts`)) return next(pathToFileURL(`${target}.ts`).href, context);
    }
    return next(specifier, context);
  },
});

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}
const read = (rel) => (existsSync(path.join(root, rel)) ? readFileSync(path.join(root, rel), "utf8") : "");
// SQL / TS with comments removed, so a commented-out line never counts.
const sqlCode = (s) => s.replace(/--.*$/gm, "");
const tsCode = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

// ---------- Migration ----------
const migration = sqlCode(read("supabase/migrations/0015_checkin_people.sql")).toLowerCase();
check("migration 0015_checkin_people.sql exists and creates cacna.checkin_people",
  /create table cacna\.checkin_people\s*\(/.test(migration));
check("migration enables RLS on the table",
  /alter table cacna\.checkin_people enable row level security/.test(migration));
check("migration constrains code to a canonical 4-character Crockford code",
  migration.includes("check (code ~ '^[0-9a-hjkmnp-tv-z]{4}$')"));
check("migration makes (ref, idx) unique", /unique\s*\(\s*ref\s*,\s*idx\s*\)/.test(migration));
check("migration restricts payment_status to free / paid",
  /payment_status text not null check \(payment_status in \('free',\s*'paid'\)\)/.test(migration));
const policies = migration.match(/create policy[\s\S]*?;/g) ?? [];
check("migration's only policy is an admin-gated select for authenticated (none for anon)",
  policies.length === 1 && /for select to authenticated using \(cacna\.is_admin\(\)\)/.test(policies[0]) &&
  !/\banon\b|public/.test(policies[0]));
check("migration revokes everything from anon and grants anon nothing back",
  /revoke all on cacna\.checkin_people from anon, authenticated;/.test(migration) &&
  !/grant[^;]*to[^;]*\banon\b/.test(migration));
check("migration indexes (year, code) and has no name index (the page searches with ILIKE contains)",
  /on cacna\.checkin_people \(year, code\)/.test(migration) && !/text_pattern_ops|lower\(full_name\)/.test(migration));

// ---------- lib/checkinStore.ts (source) ----------
const store = tsCode(read("lib/checkinStore.ts"));
check("checkinStore is server-only", /^import "server-only";/m.test(store));
check("checkinStore upserts on (ref, idx) and ignores duplicates",
  /\.upsert\(\s*rows,\s*\{\s*onConflict:\s*"ref,idx",\s*ignoreDuplicates:\s*true\s*\}\s*\)/.test(store));
check("checkinStore wraps its work in try/catch and never rethrows",
  /export async function recordCheckinPeople[\s\S]*try \{[\s\S]*\} catch/.test(store) && !/\bthrow\b/.test(store));

// ---------- Wiring ----------
const register = tsCode(read("app/api/register/route.ts"));
const webhook = tsCode(read("app/api/stripe/webhook/route.ts"));
const imports = (src) => /import \{ recordCheckinPeople \} from "@\/lib\/checkinStore";/.test(src);
check("register route imports recordCheckinPeople and awaits it on both free paths (adult, youth)",
  imports(register) && (register.match(/await recordCheckinPeople\(summary, \{ paymentStatus: "free" \}\);/g) ?? []).length === 2);
check("webhook imports recordCheckinPeople and awaits it as paid, after the sheet step succeeds",
  imports(webhook) &&
  /if \(summary && sheetOk\) \{\s*await recordCheckinPeople\(summary, \{ paymentStatus: "paid", stripeSession: sessionId, contactEmail \}\);/.test(webhook));

// ---------- recordCheckinPeople (behaviour) ----------
process.env.REGISTRATION_SIGNING_SECRET = "check-script-only-secret";
const logs = [];
console.error = (...args) => logs.push(args.join(" "));
const calls = [];
let mode = "ok"; // "ok" | "error" (Supabase answers an error) | "throw" (client construction throws) | "hang" (never answers unless aborted)
globalThis.__fakeSupabase = () => {
  if (mode === "throw") throw new Error("supabaseUrl is required. Ada Young parent@example.com");
  return {
    from: (table) => ({
      upsert: (rows, opts) => {
        calls.push({ table, rows, opts });
        let signal;
        const builder = {
          abortSignal(s) { signal = s; return builder; },
          then(resolve, reject) {
            const p = mode === "hang"
              ? new Promise((_, rej) => {
                  if (signal?.aborted) rej(signal.reason);
                  // AbortSignal.timeout timers are unref'd; a real socket keeps the loop alive, so fake one.
                  const keepAlive = setInterval(() => {}, 1000);
                  signal?.addEventListener("abort", () => { clearInterval(keepAlive); rej(signal.reason); });
                })
              : Promise.resolve(mode === "error"
                  ? { error: { code: "42P01", message: 'relation "cacna.checkin_people" does not exist: Ada Young parent@example.com' } }
                  : { error: null });
            return p.then(resolve, reject);
          },
        };
        return builder;
      },
    }),
  };
};
const { recordCheckinPeople } = await import("../lib/checkinStore.ts");
const { checkinCodesFor } = await import("../lib/checkinCode.ts");

const youth = {
  ref: "ref-store-youth", year: 2027, registrationType: "group", churchName: "  CAC Example  ", contactName: "Parent",
  contactEmail: "parent@example.com", contactPhone: "4435550100", totalAmountCents: 0, isComplimentary: false,
  registrants: [
    { n: "Ada Young", c: "young_adult", a: 22, m: 1, l: "Peanuts" },
    { n: "x".repeat(300), c: "child", a: 8, m: 0 },
  ],
  youth: { leader: "Leader", dcc: "Zone 1", guardian: true },
};
const adultGroup = {
  ref: "ref-store-adult", year: 2027, registrationType: "group", churchName: null, contactName: "Adult One",
  contactEmail: "adult@example.com", contactPhone: "", totalAmountCents: 30000, isComplimentary: false,
  registrants: [{ n: "Adult One", c: "adult" }, { n: "Adult Two", c: "adult" }], dcc: "Zone 9",
};

process.env.SUPABASE_SERVICE_ROLE_KEY = "service-check-script-only";
await recordCheckinPeople(youth, { paymentStatus: "free" });
const youthCall = calls[0];
const codes = checkinCodesFor(youth);
check("writes one row per registrant to checkin_people with onConflict ref,idx / ignoreDuplicates",
  youthCall?.table === "checkin_people" && youthCall.rows.length === 2 &&
  youthCall.opts?.onConflict === "ref,idx" && youthCall.opts?.ignoreDuplicates === true);
const [ada, kid] = youthCall?.rows ?? [];
check("each row carries ref, idx and that person's check-in code, in registrants order",
  ada?.ref === "ref-store-youth" && ada.idx === 0 && kid?.idx === 1 && ada.code === codes[0] && kid.code === codes[1] && ada.year === 2027);
check("youth row: name, category, age, trimmed church, youth DCC, sheet-style meals, allergies, free, no session",
  ada?.full_name === "Ada Young" && ada.category === "young_adult" && ada.age === 22 && ada.church_name === "CAC Example" &&
  ada.dcc === "Zone 1" && ada.meals === "Tuesday Lunch — 7/13" && ada.allergies === "Peanuts" &&
  ada.payment_status === "free" && ada.stripe_session === null && kid?.meals === "None" && kid.allergies === null);
check("full_name is length-capped at 120", kid?.full_name.length === 120);
check("never writes checked_in_at / checked_in_by (an upsert must not reset a check-in)",
  (youthCall?.rows ?? []).every((r) => !("checked_in_at" in r) && !("checked_in_by" in r)));

await recordCheckinPeople(adultGroup, { paymentStatus: "paid", stripeSession: "cs_test_1", contactEmail: "stripe@example.com" });
const [one] = calls[1]?.rows ?? [];
check("paid adult group row: Stripe email and session, adult DCC, no age / meals / church / phone",
  one?.payment_status === "paid" && one.stripe_session === "cs_test_1" && one.contact_email === "stripe@example.com" &&
  one.dcc === "Zone 9" && one.age === null && one.meals === null && one.church_name === null && one.contact_phone === null);

logs.length = 0;
mode = "error";
let threw = false;
try { await recordCheckinPeople(youth, { paymentStatus: "free" }); } catch { threw = true; }
check("a database error is logged with the ref and error code only (no message), and swallowed",
  !threw && logs.length === 1 && logs[0].startsWith("[checkin]") && logs[0].includes("ref-store-youth") &&
  logs[0].includes("42P01") && !/relation|Ada|@/.test(logs[0]));

logs.length = 0;
mode = "hang";
threw = false;
const t0 = Date.now();
try { await recordCheckinPeople(youth, { paymentStatus: "free" }); } catch { threw = true; }
const elapsed = Date.now() - t0;
const mine = logs.filter((l) => l.startsWith("[checkin]")); // Node may log its own warnings via console.error
check("a stalled database call is aborted after ~3s: resolves without throwing, logged by ref",
  !threw && elapsed < 4500 && mine.length === 1 && mine[0].includes("ref-store-youth") && !/Ada|@/.test(mine[0]));

logs.length = 0;
mode = "throw";
threw = false;
try { await recordCheckinPeople(youth, { paymentStatus: "free" }); } catch { threw = true; }
check("a thrown error is logged and swallowed, without names or emails in the log",
  !threw && logs.length === 1 && logs[0].includes("ref-store-youth") && !/Ada|@/.test(logs.join(" ")));

logs.length = 0;
mode = "ok";
const before = calls.length;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;
threw = false;
try { await recordCheckinPeople(youth, { paymentStatus: "free" }); } catch { threw = true; }
check("without SUPABASE_SERVICE_ROLE_KEY it writes nothing, logs the ref and returns",
  !threw && calls.length === before && logs.length === 1 && logs[0].includes("ref-store-youth"));

process.stdout.write(failures ? `\n${failures} check(s) FAILED\n` : "\nAll checks passed\n");
process.exit(failures ? 1 : 0);
