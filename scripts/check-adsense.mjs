// Checks for the AdSense helpers (ads.txt body and ad-free pages).
// No test framework is installed, so this is a plain Node script:
//
//   node scripts/check-adsense.mjs
//
// Node 24 strips TypeScript types natively. Exits 1 if any check fails.
const { adsTxtBody, isAdFreePath } = await import("../lib/adsense.ts");

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

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll checks passed");
