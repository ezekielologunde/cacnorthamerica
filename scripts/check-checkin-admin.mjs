// Checks for the staff check-in page (app/admin/(protected)/check-in): admin
// gating on the page and every action, the conditional check-in update, the
// escaped name search, the nav link, and lib/checkinSearch.ts behaviour.
// No test framework is installed, so this is a plain Node script:
//
//   node scripts/check-checkin-admin.mjs
//
// Source-level checks plus direct calls into lib/checkinSearch.ts; nothing
// leaves the process. Exits 1 if any check fails.
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

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}
const read = (rel) => (existsSync(path.join(root, rel)) ? readFileSync(path.join(root, rel), "utf8") : "");
// TS with comments removed, so a commented-out line never counts.
const tsCode = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const DIR = "app/admin/(protected)/check-in";
const page = tsCode(read(`${DIR}/page.tsx`));
const actions = tsCode(read(`${DIR}/actions.ts`));

// ---------- Page ----------
check("check-in page lives under app/admin/(protected)", page.length > 0 && existsSync(path.join(root, DIR, "actions.ts")));
const pageBody = page.split(/export default async function \w+/)[1] ?? "";
check("page calls await requireAdmin() itself, before any query",
  /^import \{ requireAdmin \} from "@\/lib\/supabase\/require-admin";/m.test(page) &&
  /await requireAdmin\(\)/.test(pageBody) && pageBody.indexOf("await requireAdmin()") < pageBody.indexOf(".from("));
const ilikes = [...page.matchAll(/\.ilike\(([^)]*)\)/g)].map((m) => m[1]);
check("every .ilike() uses the escaped pattern from parseCheckinQuery",
  ilikes.length === 2 && ilikes.every((args) => /^"(full_name|contact_name)", search\.pattern$/.test(args.trim())) &&
  /const search = parseCheckinQuery\(params\.q\);/.test(page));
check("a failed lookup shows the setup notice and logs the error code only",
  page.includes("Check-in database isn&apos;t set up yet. Ask the site owner to apply migration 0015.") &&
  page.includes("Couldn&apos;t load the check-in list. Check your connection and try again; the Google Sheet has the same list.") &&
  page.includes("Registered recently? Check the Google Sheet, which lists everyone the moment they register.") &&
  (page.match(/=== "42P01" \|\| failed(\.error)?\.code === "PGRST205"/g) ?? []).length === 2 &&
  (page.match(/console\.error\(/g) ?? []).length === 2 &&
  /console\.error\("\[check-in\] lookup failed:", failed\.error\.code\);/.test(page) &&
  /console\.error\("\[check-in\] count failed:", failed\.code\);/.test(page));
check("page shows the codes-are-not-unique warning",
  page.includes("Codes are not unique. Always confirm the name before checking someone in."));

// ---------- Actions ----------
check("actions.ts is a server actions module", /^"use server";/.test(actions.trim()));
const actionBodies = Object.fromEntries(
  actions.split(/export async function /).slice(1).map((chunk) => [chunk.match(/^\w+/)[0], chunk])
);
check("actions.ts exports exactly checkInPerson and undoCheckIn",
  Object.keys(actionBodies).sort().join(",") === "checkInPerson,undoCheckIn");
for (const [name, body] of Object.entries(actionBodies)) {
  check(`${name} calls await requireAdmin() first, then validates the id`,
    /^\w+\([^)]*\) \{\s*const \{[^}]*\} = await requireAdmin\(\);\s*if \(!isCheckinId\(id\)\) throw new Error\(/.test(body));
  check(`${name} logs the id only, throws a friendly error and revalidates /admin/check-in`,
    new RegExp(`console\\.error\\(\`\\[check-in\\] ${name} failed for id \\$\\{id\\}\`\\);`).test(body) &&
    /throw new Error\("Could not [^"]+\. Please try again\."\);/.test(body) &&
    /revalidatePath\("\/admin\/check-in"\);/.test(body));
}
check("checkInPerson only updates rows that are not yet checked in",
  /\.update\(\{ checked_in_at: new Date\(\)\.toISOString\(\), checked_in_by: user\.email \?\? null \}\)\s*\.eq\("id", id\)\s*\.is\("checked_in_at", null\);/
    .test(actionBodies.checkInPerson ?? ""));
check("undoCheckIn clears both checked_in_at and checked_in_by",
  /\.update\(\{ checked_in_at: null, checked_in_by: null \}\)\s*\.eq\("id", id\);/.test(actionBodies.undoCheckIn ?? ""));

// ---------- Nav ----------
check("admin nav links to /admin/check-in",
  /href: "\/admin\/check-in",\s*label: "Check-in",/.test(tsCode(read("components/admin/AdminSidebar.tsx"))));

// ---------- lib/checkinSearch.ts (behaviour) ----------
const s = await import("../lib/checkinSearch.ts");
const { currentOrNextConvention } = await import("../lib/conventions.ts");
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

check("empty / non-string query searches nothing",
  eq(s.parseCheckinQuery(""), { q: "", code: null, pattern: null }) &&
  eq(s.parseCheckinQuery("   "), { q: "", code: null, pattern: null }) &&
  eq(s.parseCheckinQuery(undefined), { q: "", code: null, pattern: null }));
check("a name is trimmed and searched as %name%, with no code",
  eq(s.parseCheckinQuery("  Ada Young "), { q: "Ada Young", code: null, pattern: "%Ada Young%" }));
check("a 4-character code is normalised (case, O->0, I/L->1) and still searched as a name",
  eq(s.parseCheckinQuery(" 7k3q "), { q: "7k3q", code: "7K3Q", pattern: "%7k3q%" }) &&
  s.parseCheckinQuery("IL0o").code === "1100" && s.parseCheckinQuery("John").code === "J0HN");
check("only exactly 4 characters can be a code",
  s.parseCheckinQuery("7K3").code === null && s.parseCheckinQuery("7K3QX").code === null &&
  s.parseCheckinQuery("7K-3Q").code === null && s.parseCheckinQuery("Paul").code === null);
check("%, _ and \\ are escaped and * dropped, so input is never a pattern",
  s.parseCheckinQuery("50%_a\\b*").pattern === "%50\\%\\_a\\\\b%" && s.parseCheckinQuery("***").pattern === null);
check("query is capped at 60 characters",
  s.parseCheckinQuery("x".repeat(200)).q.length === 60 && s.MAX_CHECKIN_QUERY_LENGTH === 60);
check("isCheckinId accepts a uuid and rejects anything else",
  s.isCheckinId("3f2504e0-4f89-11d3-9a0c-0305e82c3301") && !s.isCheckinId("3f2504e0") &&
  !s.isCheckinId("3f2504e0-4f89-11d3-9a0c-0305e82c3301 or 1=1") && !s.isCheckinId(42));
const row = (id, full_name, code = "AAAA") => ({ id, full_name, code });
const merged = s.mergeCheckinResults([[row("2", "bea"), row("1", "Ada")], [row("1", "Ada"), row("3", "Cal")]], 50);
check("results merge one per id, ordered by name", eq(merged.rows.map((r) => r.id), ["1", "2", "3"]) && !merged.truncated);
const many = Array.from({ length: 51 }, (_, i) => row(String(i), `P${String(i).padStart(2, "0")}`));
const capped = s.mergeCheckinResults([many]);
check("more than 50 matches is capped at 50 and flagged", capped.rows.length === 50 && capped.truncated &&
  !s.mergeCheckinResults([many.slice(0, 50)]).truncated);
check("sharedCodes flags only codes seen more than once",
  eq([...s.sharedCodes([row("1", "a", "7K3Q"), row("2", "b", "7K3Q"), row("3", "c", "ZZZZ")])], ["7K3Q"]));
const current = currentOrNextConvention().year;
check("year defaults to the current convention and accepts only listed years",
  s.resolveCheckinYear(undefined) === current && s.resolveCheckinYear("1999") === current &&
  s.resolveCheckinYear("2026") === 2026 && s.resolveCheckinYear(["2026"]) === 2026);
check("checkinPageHref keeps the cleaned query (encoded) and a non-default year only",
  s.checkinPageHref("  a&b ", null) === "/admin/check-in?q=a%26b" && s.checkinPageHref("", "") === "/admin/check-in" &&
  s.checkinPageHref("x", String(current)) === "/admin/check-in?q=x" &&
  s.checkinPageHref("x", "2026") === (current === 2026 ? "/admin/check-in?q=x" : "/admin/check-in?q=x&year=2026") &&
  s.checkinPageHref("x", "https://evil.example") === "/admin/check-in?q=x");
check("category label: age group for youth, fee category for adults",
  s.checkinCategoryLabel("child", 14) === "Youth (11–19) · age 14" && s.checkinCategoryLabel("adult", null) === "Adult" &&
  s.checkinCategoryLabel("adult", 40) === "Adult");

process.stdout.write(failures ? `\n${failures} check(s) FAILED\n` : "\nAll checks passed\n");
process.exit(failures ? 1 : 0);
