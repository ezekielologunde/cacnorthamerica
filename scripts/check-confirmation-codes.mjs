// Checks that the registration confirmation page shows each person's
// check-in code directly under their name. No test framework is installed,
// so this is a plain Node script:
//
//   node scripts/check-confirmation-codes.mjs
//
// Renders components/register/RegistrantCheckinList.tsx (the page's list of
// registrants) to static HTML with react-dom/server. Node cannot load .tsx
// itself, so a load hook compiles it with the project's own TypeScript.
// Exits 1 if any check fails.
import { registerHooks } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) {
      const target = path.join(root, specifier.slice(2));
      for (const ext of ["", ".ts", ".tsx"]) {
        if (path.extname(target + ext) && existsSync(target + ext)) return next(pathToFileURL(target + ext).href, context);
      }
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (!url.endsWith(".tsx")) return next(url, context);
    const { outputText } = ts.transpileModule(readFileSync(fileURLToPath(url), "utf8"), {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    });
    return { format: "module", source: outputText, shortCircuit: true };
  },
});

process.env.REGISTRATION_SIGNING_SECRET = "check-script-only-secret";

const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { RegistrantCheckinList } = await import("../components/register/RegistrantCheckinList.tsx");
const { checkinCodesFor } = await import("../lib/checkinCode.ts");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const render = (summary) => renderToStaticMarkup(createElement(RegistrantCheckinList, { summary, startIso: "2027-07-12" }));
// The person's (escaped) name, then, still inside their own <li>, their
// "Check-in code" label and the code itself.
const codeUnderName = (html, name, code) =>
  new RegExp(`>${name}</span>(?:(?!<li).)*?Check-in code</p><code[^>]*data-checkin-code[^>]*>${code}</code>`).test(html);

const summary = {
  ref: "ref-page-check", year: 2027, registrationType: "individual", churchName: "CAC Example", contactName: "Parent",
  contactEmail: "parent@example.com", contactPhone: "", totalAmountCents: 0, isComplimentary: false,
  registrants: [
    { n: "Ada Young", c: "young_adult", a: 22, m: 129 },
    { n: "Kid <i>Two</i>", c: "child", a: 8, m: 0 },
    { n: "Adult Three", c: "adult" },
  ],
};
const codes = checkinCodesFor(summary);
const html = render(summary);
check("confirmation page shows each person's code directly under their own name",
  codeUnderName(html, "Ada Young", codes[0]) && codeUnderName(html, "Kid &lt;i&gt;Two&lt;/i&gt;", codes[1]) &&
  codeUnderName(html, "Adult Three", codes[2]));
check("each person's code appears exactly once on the page",
  codes.every((c) => html.split(`>${c}</code>`).length === 2) && new Set(codes).size === 3);
check("codes are large, monospaced and selectable as one unit",
  (html.match(/<code[^>]*data-checkin-code[^>]*>/g) ?? []).length === 3 &&
  /<code[^>]*font-family:ui-monospace[^>]*font-size:28px[^>]*user-select:all/.test(html));
check("meals still show under the person", html.includes("Meals: None"));

const group = { ...summary, ref: "ref-page-group", registrants: Array.from({ length: 30 }, (_, i) => ({ n: `Christopher${i} Johnson-Williams`, c: "child", a: 5 + (i % 10), m: 1 })) };
const groupCodes = checkinCodesFor(group);
const groupHtml = render(group);
check("a 30-person group page shows all 30 codes, each under its own person's name",
  groupCodes.every((c, i) => codeUnderName(groupHtml, `Christopher${i} Johnson-Williams`, c)));

const page = readFileSync(path.join(root, "app/(site)/[locale]/events/[slug]/register/confirmation/page.tsx"), "utf8");
check("the confirmation page renders this list for the registration",
  page.includes("<RegistrantCheckinList summary={summary} startIso={cy.startIso} />"));
check("the confirmation page makes no mention of a QR code", !/qr/i.test(page));

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
