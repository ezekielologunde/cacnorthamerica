// Checks for the AdSense helpers (ads.txt body and ad-free pages).
// No test framework is installed, so this is a plain Node script:
//
//   node scripts/check-adsense.mjs
//
// Node 24 strips TypeScript types natively. Exits 1 if any check fails.
const { adsTxtBody, adsenseClientId, isAdFreePath } = await import("../lib/adsense.ts");
const { isConfirmationPath, CONFIRMATION_PATH } = await import("../lib/analytics.ts");

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
check("ads.txt and script agree on a padded value", adsTxtBody(" " + ID + " ")?.includes(adsenseClientId(" " + ID + " ").slice(3)) === true);

// Query strings carry a Stripe session id / sealed token on every confirmation page.
for (const p of [
  "/events/cacna-2027/register/confirmation", "/events/cacna-2027/register/confirmation/",
  "/giving/confirmation", "/store/confirmation",
]) check(`query stripped on ${p}`, isConfirmationPath(p));
for (const p of ["/", "/giving", "/store", "/blog/confirmation-bias", "/confirmation/extra"]) check(`query kept on ${p}`, !isConfirmationPath(p));
// The inline gtag script embeds the same pattern; make sure it survives templating.
check("inline regex source matches giving confirmation", new RegExp(CONFIRMATION_PATH.source).test("/giving/confirmation"));

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll checks passed");
