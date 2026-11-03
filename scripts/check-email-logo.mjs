// Checks that every designed email carries the church logo and that the logo
// stays light. Plain Node script:
//
//   node scripts/check-email-logo.mjs
//
// Gmail blocks data: images, so the logo must be a hosted https URL, and the
// file must stay small (emails should not be heavy). Exits 1 on any failure.
import { readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (f) => readFileSync(path.join(root, f), "utf8");
let failed = 0;
function check(name, ok) {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  if (!ok) failed++;
}

const logo = path.join(root, "public/email/cac-logo.jpg");
const size = statSync(logo).size;
check(`email logo exists and is light (${size} bytes, limit 25000)`, size > 1000 && size <= 25000);
const head = readFileSync(logo).subarray(0, 3);
check("email logo is a real JPEG", head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff);

const email = read("lib/email.ts");
check("logo URL is an https site URL, not a data: URI", /EMAIL_LOGO_URL = `\$\{SITE_URL\}\/email\/cac-logo\.jpg`/.test(email) && !/data:image/.test(email));
check("logo <img> has width, height and alt", /<img src="\$\{EMAIL_LOGO_URL\}" width="88" height="76" alt="Christ Apostolic Church North America"/.test(email));
check("emailShell header renders the logo", /text-align:center">\s*\$\{emailLogoHtml\(\)\}/.test(email));
check("newsletter welcome email renders the logo", /emailLogoHtml\(\)/.test(read("app/newsletter/actions.ts")));

for (const f of ["lib/contactReplyEmail.ts", "lib/givingEmail.ts", "lib/registrationEmail.ts", "lib/storeOrderEmail.ts"]) {
  check(`${f} goes through emailShell (so it gets the logo)`, /emailShell\(\{/.test(read(f)));
}

console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
