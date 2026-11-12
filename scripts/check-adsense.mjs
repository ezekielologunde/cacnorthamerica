// Checks for the AdSense helpers (ads.txt body and ad-free pages).
// No test framework is installed, so this is a plain Node script:
//
//   node scripts/check-adsense.mjs
//
// Node 24 strips TypeScript types natively. Exits 1 if any check fails.
const { adsTxtBody, adsenseClientId, isAdFreePath } = await import("../lib/adsense.ts");
const { isSecretUrlPath, gtagInitScript, scrubTelemetryUrl, SECRET_URL_PATH } =await import("../lib/analytics.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const LINE = "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n";
check("ads.txt strips the ca- prefix", adsTxtBody("ca-pub-1234567890123456") === LINE);
check("ads.txt accepts a bare pub- ID", adsTxtBody("pub-1234567890123456") === LINE);
check("ads.txt trims whitespace", adsTxtBody(" ca-pub-1234567890123456\n") === LINE);
check("ads.txt is null when unset", adsTxtBody(undefined) === null);
check("ads.txt is null when empty", adsTxtBody("") === null);
check("ads.txt is null for a malformed ID", adsTxtBody("ca-pub-123") === null);
check("ads.txt is null for a placeholder ID", adsTxtBody("ca-pub-XXXXXXXXXXXXXXXX") === null);

for (const p of [
  "/", "/admin", "/admin/login", "/events/cacna-2027", "/events/cacna-2027/register",
  "/events/cacna-2027/register/confirmation", "/giving", "/giving/confirmation", "/store",
  "/store/confirmation", "/privacy", "/terms", "/refunds/", "/blogger", "/blog-archive", "/category/news",
]) check(`no ads on ${p}`, isAdFreePath(p));

for (const p of ["/blog", "/blog/", "/blog/some-post", "/blog/some-post/"]) check(`ads allowed on ${p}`, !isAdFreePath(p));

// One canonical ID feeds both the ad script URL and ads.txt, so they agree.
const ID = "ca-pub-1234567890123456";
check("client ID is canonical as given", adsenseClientId(ID) === ID);
check("client ID adds ca- to a bare pub- ID", adsenseClientId("pub-1234567890123456") === ID);
check("client ID trims a trailing space/newline", adsenseClientId(ID + " \n") === ID);
check("client ID is null when unset", adsenseClientId(undefined) === null);
check("client ID is null for a malformed ID", adsenseClientId("ca-pub-12 34") === null);
check("ads.txt for a padded value is the canonical line", adsTxtBody(" " + ID + " \n") === LINE);

// Run the exact inline script the browser gets, with a stub window/location,
// and see what page_location each page would send to Google.
function configFor(pathname) {
  const dataLayer = [];
  const location = { pathname, origin: "https://cacna.org" };
  new Function("window", "location", "dataLayer", gtagInitScript(["G-TEST", "AW-TEST"]))({}, location, dataLayer);
  return dataLayer.map((a) => [...a]).filter((c) => c[0] === "config");
}
for (const p of [
  "/events/cacna-2027/register/confirmation", "/events/cacna-2027/register/confirmation/",
  "/giving/confirmation", "/store/confirmation", "/giving/cancel", "/giving/cancel/",
]) {
  check(`query stripped on ${p}`, isSecretUrlPath(p));
  const cfg = configFor(p);
  check(`gtag configs both IDs with a query-free page_location on ${p}`,
    cfg.length === 2 && cfg.every((c) => c[2].page_location === "https://cacna.org" + p));
}
for (const p of ["/", "/giving", "/store", "/blog/some-post", "/events/cacna-2027/register"]) {
  check(`query kept on ${p}`, !isSecretUrlPath(p));
  const cfg = configFor(p);
  check(`gtag leaves page_location alone on ${p}`, cfg.length === 2 && cfg.every((c) => c[2].page_location === undefined));
}

// The pattern is embedded by `.source` only, so a flag would be dropped silently.
check("secret-path pattern has no flags", SECRET_URL_PATH.flags === "");
for (const p of ["/blog/confirmation", "/confirmation", "/blog/giving/cancel-policy", "/admin/confirmation-codes"]) {
  check(`query kept on ${p}`, !isSecretUrlPath(p));
}

// Consent Mode: denied by default in the EEA/UK/CH only, and set before any config.
{
  const dl = [];
  new Function("window", "location", "dataLayer", gtagInitScript(["G-TEST"]))({}, { pathname: "/", origin: "https://cacna.org" }, dl);
  const calls = dl.map((a) => [...a]);
  const first = calls.findIndex((c) => c[0] === "consent" && c[1] === "default");
  const cfg = calls.findIndex((c) => c[0] === "config");
  const d = calls[first]?.[2] ?? {};
  check("consent default is set before the first config", first >= 0 && cfg > first);
  check("consent default denies all four signals",
    ["ad_storage", "ad_user_data", "ad_personalization", "analytics_storage"].every((k) => d[k] === "denied"));
  check("consent default is scoped to regions, not global", Array.isArray(d.region) && d.region.length > 0);
  check("consent default covers EEA, UK and Switzerland",
    ["DE", "FR", "IE", "GB", "CH", "NO", "IS", "LI"].every((r) => d.region?.includes(r)));
  check("consent default leaves the US and Canada alone", !["US", "CA", "NG", "BR"].some((r) => d.region?.includes(r)));
  check("consent default waits briefly for Google's message to update", d.wait_for_update === 500);
}

// Vercel Analytics / Speed Insights beforeSend.
const scrub = (url) => scrubTelemetryUrl({ type: "pageview", url }).url;
check("telemetry drops ?t= on registration confirmation",
  scrub("https://cacna.org/events/cacna-2027/register/confirmation?t=abc") === "https://cacna.org/events/cacna-2027/register/confirmation");
check("telemetry drops session_id and hash on giving confirmation",
  scrub("https://cacna.org/giving/confirmation?session_id=cs_1#x") === "https://cacna.org/giving/confirmation");
check("telemetry drops ?t= on giving cancel", scrub("https://cacna.org/giving/cancel?t=tok") === "https://cacna.org/giving/cancel");
check("telemetry drops ?q= on admin check-in", scrub("https://cacna.org/admin/check-in?q=Jane") === "https://cacna.org/admin/check-in");
check("telemetry keeps UTM on a normal page",
  scrub("https://cacna.org/blog/post?utm_source=x") === "https://cacna.org/blog/post?utm_source=x");
check("telemetry keeps /administer lookalike", scrub("https://cacna.org/administer?a=1") === "https://cacna.org/administer?a=1");
check("telemetry passes a non-URL through", scrub("not a url") === "not a url");

// Wiring: the lib helpers only help if the call sites use them.
import { readFileSync } from "node:fs";
const src = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const has = (f, re) => re.test(src(f));
check("GoogleTags builds its script with gtagInitScript", has("components/analytics/GoogleTags.tsx", /gtagInitScript\(/) && !has("components/analytics/GoogleTags.tsx", /register\/confirmation/));
check("GoogleTags normalizes the AdSense ID", has("components/analytics/GoogleTags.tsx", /adsenseClientId\(process\.env\.NEXT_PUBLIC_ADSENSE_ID\)/));
check("AdSenseScript puts only the normalized ID in the URL", has("components/analytics/AdSenseScript.tsx", /client=\$\{id\}/) && !has("components/analytics/AdSenseScript.tsx", /client=\$\{clientId\}/));
check("BlogAd normalizes the ID and loads no script of its own", has("components/blog/BlogAd.tsx", /adsenseClientId\(/) && !has("components/blog/BlogAd.tsx", /<Script/));
check("VercelTelemetry scrubs both Analytics and SpeedInsights",
  (src("components/analytics/VercelTelemetry.tsx").match(/beforeSend=\{scrubTelemetryUrl\}/g) ?? []).length === 2);
check("root layout mounts VercelTelemetry but not GoogleTags", has("app/layout.tsx", /<VercelTelemetry \/>/) && !has("app/layout.tsx", /<GoogleTags/));
check("site layout and 404 page mount GoogleTags", has("app/(site)/[locale]/layout.tsx", /<GoogleTags \/>/) && has("app/not-found.tsx", /<GoogleTags \/>/));
for (const f of [
  "app/(site)/[locale]/events/[slug]/register/confirmation/page.tsx",
  "app/(site)/[locale]/giving/confirmation/page.tsx",
  "app/(site)/[locale]/store/confirmation/page.tsx",
]) check(`no Referer from ${f.split("/").slice(-3, -1).join("/")}`, has(f, /referrer: "no-referrer"/));

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll checks passed");
