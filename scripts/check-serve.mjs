// Checks for the "Serve at the Convention" sign-up: the pure validator in
// lib/serveSignup.ts, plus string checks that app/api/serve/route.ts keeps
// the public-form guards. No test framework is installed, so this is a plain
// Node script:
//
//   node scripts/check-serve.mjs
//
// Exits 1 if any check fails.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) {
      const target = path.join(root, specifier.slice(2));
      if (!path.extname(target) && existsSync(`${target}.ts`)) return next(pathToFileURL(`${target}.ts`).href, context);
    }
    return next(specifier, context);
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

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
