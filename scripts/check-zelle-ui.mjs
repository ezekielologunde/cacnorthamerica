// Checks for the Zelle registration UI and email (the client half of paying
// by Zelle; the route itself is pinned by check-zelle-registration.mjs):
// Zelle is the forms' default and is sent as paymentMethod, the radios show
// only when something is owed, the confirmation page shows the Zelle panel
// and chip, the panel reads the recipient from paymentOptions (Zelle first),
// confirmByZelle emails, and the Zelle email escapes what the visitor typed.
// Plain Node script:
//
//   node scripts/check-zelle-ui.mjs
//
// The .tsx files are source-asserted (Node cannot run JSX); the email is
// built for real through a fake fetch for Resend, so nothing leaves the
// process. Exits 1 if any check fails.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
registerHooks({
  resolve(specifier, context, next) {
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

process.env.RESEND_API_KEY = "re_check_script_only";
process.env.REGISTRATION_SIGNING_SECRET = "check-script-only-secret";

const emails = [];
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  if (url.startsWith("https://api.resend.com/")) { emails.push(JSON.parse(init.body)); return Response.json({ id: "email_1" }); }
  throw new Error(`unexpected fetch ${url}`);
};

const { paymentOptions } = await import("../lib/registrationInfo.ts");
const { sendRegistrationConfirmationEmail } = await import("../lib/registrationEmail.ts");
const { zelleReferenceFor } = await import("../lib/zelleReference.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}
const tsCode = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const read = (rel) => tsCode(readFileSync(path.join(root, rel), "utf8"));

// ---------- Default and the forms ----------
const choice = read("components/register/PaymentMethodChoice.tsx");
check("DEFAULT_PAYMENT_METHOD is \"zelle\"", /export const DEFAULT_PAYMENT_METHOD: PaymentMethod = "zelle";/.test(choice));
for (const form of ["components/register/RegisterForm.tsx", "components/register/YouthRegisterForm.tsx"]) {
  const src = read(form);
  const name = path.basename(form);
  check(`${name} initialises paymentMethod from DEFAULT_PAYMENT_METHOD`,
    /const \[paymentMethod, setPaymentMethod\] = useState<PaymentMethod>\(DEFAULT_PAYMENT_METHOD\);/.test(src));
  const body = src.split('fetch("/api/register"')[1]?.split("body: JSON.stringify({")[1]?.split("registrants")[0] ?? "";
  check(`${name} sends paymentMethod in the /api/register fetch body`, /^\s*paymentMethod,\s*$/m.test(body));
  check(`${name} renders the payment radios once, only when total > 0`,
    (src.match(/<PaymentMethodChoice\b/g) ?? []).length === 1 && /\{total > 0 && \(\s*<PaymentMethodChoice\b/.test(src));
}

// ---------- Confirmation page ----------
const page = read("app/(site)/[locale]/events/[slug]/register/confirmation/page.tsx");
check("confirmation page treats only payment awaiting_zelle with a reference as awaiting Zelle",
  /const awaitingZelle = payment === "awaiting_zelle" && !!zelleRef;/.test(page));
check("confirmation page renders ZellePaymentPanel with the subtotal and reference when awaiting Zelle",
  /import \{ ZellePaymentPanel \} from "@\/components\/register\/ZellePaymentPanel";/.test(page) &&
  /\{awaitingZelle && \([\s\S]*?<ZellePaymentPanel amountDueCents=\{summary\.totalAmountCents\} zelleRef=\{zelleRef\} \/>/.test(page));
check("confirmation page shows the \"Awaiting Zelle payment\" chip on the awaiting Zelle branch",
  /\{awaitingZelle \? \(\s*<span[^>]*>\s*Awaiting Zelle payment\s*<\/span>/.test(page));

// ---------- Zelle panel and the single source of the address ----------
const panelRaw = readFileSync(path.join(root, "components/register/ZellePaymentPanel.tsx"), "utf8");
check("ZellePaymentPanel.tsx holds no literal email address",
  !/@gmail\.com/i.test(panelRaw) && !/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/.test(panelRaw));
const panel = tsCode(panelRaw);
check("ZellePaymentPanel reads the recipient from paymentOptions' Zelle entry",
  /import \{ paymentOptions \} from "@\/lib\/registrationInfo";/.test(panel) &&
  /const zelle = paymentOptions\.find\(\(o\) => o\.kind === "zelle"\);/.test(panel) &&
  /\{zelle\.detail\}/.test(panel) && /copy\("zelle", zelle\.copyValue!\)/.test(panel));
check("paymentOptions lists Zelle first, with a copyable address",
  paymentOptions[0]?.kind === "zelle" && /@/.test(paymentOptions[0].copyValue ?? "") && paymentOptions[0].detail.includes(paymentOptions[0].copyValue));

// ---------- confirmByZelle sends the Zelle email ----------
const route = read("app/api/register/route.ts");
const confirmByZelle = route.split("async function confirmByZelle(")[1]?.split("\nfunction ")[0] ?? "";
check("confirmByZelle awaits sendRegistrationConfirmationEmail with { zelleRef } inside if (emailed)",
  /if \(emailed\) \{[^}]*?await sendRegistrationConfirmationEmail\(summary, checkoutUrl, false, undefined, 0, \{ zelleRef \}\);/.test(confirmByZelle));

// ---------- Behaviour: the Zelle email escapes the contact name ----------
const zelleRef = zelleReferenceFor("ui-check-ref");
const summary = {
  ref: "ui-check-ref", year: 2027, registrationType: "individual", churchName: null, contactName: "<b>x</b>",
  contactEmail: "zelle-ui@example.com", contactPhone: "", registrants: [{ n: "Adult Person", c: "adult" }],
  totalAmountCents: 12500, isComplimentary: false, dcc: "Zone 3",
};
const sent = await sendRegistrationConfirmationEmail(summary, "https://example.invalid/confirmation?t=x", false, undefined, 0, { zelleRef });
const html = emails[0]?.html ?? "";
check("the Zelle email is sent once through Resend", sent === true && emails.length === 1 && emails[0].to === "zelle-ui@example.com");
check("the Zelle email escapes the contact name (&lt;b&gt;x&lt;/b&gt;, never raw <b>x</b>)",
  html.includes("&lt;b&gt;x&lt;/b&gt;") && !html.includes("<b>x</b>"));
check("the Zelle email carries the reference, Awaiting payment, the amount due and the paymentOptions recipient",
  html.includes(zelleRef) && html.includes("Awaiting payment") && html.includes("$125.00") && html.includes(paymentOptions[0].copyValue));

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
