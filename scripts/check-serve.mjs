// Checks for the "Serve at the Convention" sign-up: the pure validator in
// lib/serveSignup.ts, string checks that app/api/serve/route.ts keeps the
// public-form guards, and the route itself run with its services stubbed.
// No test framework is installed, so this is a plain Node script:
//
//   node scripts/check-serve.mjs
//
// Exits 1 if any check fails.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

// The route's outside services, replaced by stubs that record every call in
// `calls` (see "The route, end to end" below). next/server is stubbed too:
// the real after() only works inside a Next.js request.
const STUBS = {
  "@/lib/supabase/server": `
    const s = globalThis.__serveStubs;
    export function createServiceClient() { return s.supabase(); }
    export function createClient() { throw new Error("anon client used"); }`,
  "resend": `
    const s = globalThis.__serveStubs;
    export class Resend { constructor(key) { this.emails = { send: (msg) => s.send(msg) }; } }`,
  "@/lib/sheetsWebhook": `
    const s = globalThis.__serveStubs;
    export function logToSheet(formName, fields) { s.sheet(formName, fields); }
    export async function logToSheetChecked(formName, fields) { s.sheet(formName, fields); return true; }`,
  "next/server": `
    const s = globalThis.__serveStubs;
    export const NextResponse = { json: (body, init) => Response.json(body, init) };
    export function after(cb) { s.after(cb); }`,
};
registerHooks({
  resolve(specifier, context, next) {
    if (specifier in STUBS) return { url: `serve-stub:${specifier}`, shortCircuit: true };
    if (specifier.startsWith("@/")) {
      const target = path.join(root, specifier.slice(2));
      if (!path.extname(target) && existsSync(`${target}.ts`)) return next(pathToFileURL(`${target}.ts`).href, context);
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith("serve-stub:")) return { format: "module", source: STUBS[url.slice("serve-stub:".length)], shortCircuit: true };
    return next(url, context);
  },
});

const { validateServeSignup, honeypotFilled, SERVE_LIMITS } = await import("../lib/serveSignup.ts");
const { SERVE_TEAMS, serveTeamNames } = await import("../lib/serveTeams.ts");
const { HONEYPOT_FIELD } = await import("../lib/spam.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const valid = (extra = {}) => ({
  name: "  Ada Volunteer  ", email: " ada@example.com ", phone: "", teams: ["ushers", "choir"],
  note: "Served as an usher at my church.", consent: true, ...extra,
});
const errorOn = (r, field) => r.ok === false && r.spam === false && r.field === field && typeof r.error === "string" && r.error.length > 0;

// Valid sign-ups.
const ok = validateServeSignup(valid());
check("a complete sign-up is accepted, trimmed, with teams kept in order",
  ok.ok && ok.signup.name === "Ada Volunteer" && ok.signup.email === "ada@example.com" &&
  JSON.stringify(ok.signup.teams) === '["ushers","choir"]' && ok.signup.under18 === false && ok.signup.guardianConsent === false);
const minimal = validateServeSignup({ name: "B", email: "b@example.com", teams: ["care"], consent: true });
check("phone and note are optional", minimal.ok && minimal.signup.phone === "" && minimal.signup.note === "");
const dup = validateServeSignup(valid({ teams: ["choir", "choir", "media"] }));
check("duplicate team ids are collapsed", dup.ok && JSON.stringify(dup.signup.teams) === '["choir","media"]');
const all = validateServeSignup(valid({ teams: SERVE_TEAMS.map((t) => t.id) }));
check("every team in lib/serveTeams.ts can be chosen", all.ok && all.signup.teams.length === SERVE_TEAMS.length);
check("unknown keys are dropped from the result", ok.ok && !("consent" in ok.signup) && !("extra" in (validateServeSignup(valid({ extra: "x" })).signup ?? {})));
check("team names come from the data file", JSON.stringify(serveTeamNames(["ushers", "care"])) === '["Ushers","Care Team"]');

// Invalid sign-ups: each names the field at fault.
check("missing name rejected", errorOn(validateServeSignup(valid({ name: "   " })), "name"));
check("missing email rejected", errorOn(validateServeSignup(valid({ email: "" })), "email"));
check("malformed email rejected", errorOn(validateServeSignup(valid({ email: "ada@example" })), "email"));
check("no team chosen rejected", errorOn(validateServeSignup(valid({ teams: [] })), "teams"));
check("teams omitted rejected", errorOn(validateServeSignup(valid({ teams: undefined })), "teams"));
check("unknown team id rejected", errorOn(validateServeSignup(valid({ teams: ["ushers", "bouncers"] })), "teams"));
check("teams not an array rejected", errorOn(validateServeSignup(valid({ teams: "ushers" })), "teams"));
check("non-string team id rejected", errorOn(validateServeSignup(valid({ teams: [1] })), "teams"));
check("oversized teams array rejected", errorOn(validateServeSignup(valid({ teams: Array(SERVE_TEAMS.length * 2 + 1).fill("ushers") })), "teams"));
check("consent missing rejected", errorOn(validateServeSignup(valid({ consent: undefined })), "consent"));
check("consent false rejected", errorOn(validateServeSignup(valid({ consent: false })), "consent"));
check("consent as the string 'true' rejected", errorOn(validateServeSignup(valid({ consent: "true" })), "consent"));
for (const [key, max] of Object.entries(SERVE_LIMITS)) {
  const long = key === "email" ? `${"a".repeat(max)}@x.co` : "a".repeat(max + 1);
  check(`${key} over ${max} characters rejected`, errorOn(validateServeSignup(valid({ [key]: long })), key));
}
check("name at exactly the limit accepted", validateServeSignup(valid({ name: "n".repeat(SERVE_LIMITS.name) })).ok);
check("non-string name rejected", errorOn(validateServeSignup(valid({ name: ["Ada"] })), "name"));
check("non-object bodies rejected", [null, "x", 1, []].every((b) => { const r = validateServeSignup(b); return r.ok === false && r.spam === false; }));

// Under-18 flag.
check("under 18 without guardian consent rejected",
  errorOn(validateServeSignup(valid({ under18: true })), "guardianConsent") &&
  errorOn(validateServeSignup(valid({ under18: true, guardianConsent: false })), "guardianConsent"));
const minor = validateServeSignup(valid({ under18: true, guardianConsent: true }));
check("under 18 with guardian consent accepted and recorded", minor.ok && minor.signup.under18 === true && minor.signup.guardianConsent === true);
const adultWithConsent = validateServeSignup(valid({ under18: false, guardianConsent: true }));
check("guardian consent is not recorded for an adult", adultWithConsent.ok && adultWithConsent.signup.guardianConsent === false);
check("under18 as a string rejected", validateServeSignup(valid({ under18: "yes", guardianConsent: true })).ok === false);

// Honeypot and spam: a silent success (spam: true), never a stored sign-up.
check("honeypot filled is spam", (() => { const r = validateServeSignup(valid({ [HONEYPOT_FIELD]: "http://x" })); return r.ok === false && r.spam === true; })());
check("honeypot filled is spam even when the rest is invalid", validateServeSignup({ [HONEYPOT_FIELD]: "x" }).spam === true);
check("honeypotFilled reads the shared honeypot field", honeypotFilled({ [HONEYPOT_FIELD]: "x" }) && !honeypotFilled({ [HONEYPOT_FIELD]: "" }) && !honeypotFilled({}));
check("link-stuffed note is spam", validateServeSignup(valid({ note: "http://a.invalid http://b.invalid www.c.invalid" })).spam === true);
check("links spread across name and note count together", validateServeSignup(valid({ name: "http://a.invalid", note: "http://b.invalid http://c.invalid" })).spam === true);
check("two links are still allowed", validateServeSignup(valid({ note: "http://a.invalid and http://b.invalid" })).ok);

// The route keeps the same guards as the other public forms.
const route = readFileSync(path.join(root, "app/api/serve/route.ts"), "utf8");
const at = (s) => route.indexOf(s);
check("route rate-limits per IP before anything else",
  /rateLimit\(`serve:\$\{clientIp\(req\.headers\)\}`, \d+, [\d_]+\)/.test(route) && at("rateLimit(`serve:") < at("FORM_HEADER)"));
check("route requires the form header", route.includes("req.headers.get(FORM_HEADER)"));
check("route checks the honeypot before Turnstile", at("honeypotFilled(body)") > 0 && at("honeypotFilled(body)") < at("verifyTurnstile("));
check("route verifies Turnstile with the client IP, before validating",
  route.includes("verifyTurnstile(body.turnstileToken, clientIp(req.headers))") && at("verifyTurnstile(") < at("validateServeSignup(body)"));
check("route answers a failed Turnstile check with TURNSTILE_ERROR", route.includes("{ error: TURNSTILE_ERROR }"));
check("route validates with lib/serveSignup.ts and drops spam silently", route.includes("validateServeSignup(body)") && /if \(result\.spam\) return NextResponse\.json\(\{ success: true \}\)/.test(route));
check("route saves with the service client, never anon", route.includes("createServiceClient()") && !route.includes("createClient()"));

// The route, end to end, with its outside services stubbed: what reaches the
// database, the sheet and email for each kind of post.
const calls = { inserts: [], selects: 0, sends: [], sheets: [], turnstile: 0, pending: [] };
globalThis.__serveStubs = {
  supabase: () => ({
    from: () => ({
      insert: async (row) => { calls.inserts.push(row); return { error: null }; },
      select: () => {
        calls.selects++;
        const q = { ilike: () => q, gte: async () => ({ count: 0, error: null }) };
        return q;
      },
    }),
  }),
  send: async (msg) => { calls.sends.push(msg); return { data: { id: "x" }, error: null }; },
  sheet: (formName, fields) => { calls.sheets.push({ formName, fields }); },
  after: (cb) => { calls.pending.push(cb); },
};
// Turnstile is on (secret set) and Cloudflare is stubbed: only "good-token" passes.
process.env.TURNSTILE_SECRET_KEY = "test-secret";
process.env.RESEND_API_KEY = "test-key";
globalThis.fetch = async (url, init) => {
  if (String(url).includes("challenges.cloudflare.com")) {
    calls.turnstile++;
    return Response.json({ success: init.body.get("response") === "good-token" });
  }
  throw new Error(`unexpected fetch to ${url}`);
};

const { POST } = await import("../app/api/serve/route.ts");
const { serveNoticeHtml } = await import("../lib/serveEmail.ts");
const { FORM_HEADER } = await import("../lib/spam.ts");

let ipSeq = 0;
/** One POST, then the after() callbacks run to completion. Each post comes
 *  from its own IP so the per-IP rate limit never trips. */
async function post(body, { header = true } = {}) {
  for (const k of Object.keys(calls)) calls[k] = Array.isArray(calls[k]) ? [] : 0;
  const headers = { "content-type": "application/json", "x-real-ip": `203.0.113.${++ipSeq}` };
  if (header) headers[FORM_HEADER] = "1";
  const res = await POST(new Request("http://localhost/api/serve", { method: "POST", headers, body: JSON.stringify(body) }));
  const json = await res.json();
  for (const cb of calls.pending.splice(0)) await cb();
  return { status: res.status, json };
}
const nothingStored = () => calls.inserts.length === 0 && calls.sends.length === 0 && calls.sheets.length === 0;
let mailSeq = 0;
const goodPost = (extra = {}) => ({ ...valid({ email: `vol${++mailSeq}@example.com` }), turnstileToken: "good-token", ...extra });

const hp = await post(goodPost({ [HONEYPOT_FIELD]: "http://spam.invalid", turnstileToken: "" }));
check("route: honeypot post gets a silent success, before Turnstile, and stores and sends nothing",
  hp.status === 200 && hp.json.success === true && calls.turnstile === 0 && nothingStored());

const noHeader = await post(goodPost(), { header: false });
check("route: post without the form header gets a silent success and stores and sends nothing",
  noHeader.status === 200 && noHeader.json.success === true && calls.turnstile === 0 && nothingStored());

const badTs = await post(goodPost({ turnstileToken: "bad-token" }));
check("route: failed Turnstile check is rejected and stores and sends nothing",
  badTs.status === 400 && typeof badTs.json.error === "string" && calls.turnstile === 1 && nothingStored());

const good = await post(goodPost());
check("route: valid post succeeds and saves exactly one row",
  good.status === 200 && good.json.success === true && calls.inserts.length === 1 && calls.inserts[0].email === `vol${mailSeq}@example.com`);
check("route: valid post logs one sheet row and sends the committee notice and the confirmation",
  calls.sheets.length === 1 && calls.sends.length === 2 &&
  calls.sends.some((m) => m.to === "convention@cacna.org") && calls.sends.some((m) => m.to === `vol${mailSeq}@example.com`));

const SECRET = "UNKNOWN_KEY_MARKER";
const extra = await post(goodPost({ [SECRET]: SECRET, isAdmin: SECRET, role: SECRET }));
const reached = JSON.stringify({ inserts: calls.inserts, sends: calls.sends, sheets: calls.sheets });
check("route: unknown keys never reach the database, the sheet or email",
  extra.json.success === true && calls.inserts.length === 1 && calls.sheets.length === 1 && calls.sends.length > 0 && !reached.includes(SECRET));

const notice = serveNoticeHtml([["Name", "<script>alert(1)</script>"], ["<img onerror=x>", "ok"]]);
check("serveNoticeHtml escapes keys and values", !notice.includes("<script>") && notice.includes("&lt;script&gt;") && !notice.includes("<img onerror"));

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
