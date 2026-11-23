// Offline regressions against the actual TSX components. No browser, Google,
// Stripe, network requests, real publisher IDs, or payment sessions are used.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as adsense from "../lib/adsense.ts";

let pathname = "/blog";
const fragment = Symbol("Fragment");
const jsx = (type, props) => ({ type, props });
function loadComponent(file) {
  const exports = {};
  const source = readFileSync(new URL(file, import.meta.url), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  runInNewContext(output, {
    exports,
    process: { env: { NEXT_PUBLIC_GA_ID: "G-TEST", NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-TEST" } },
    require(name) {
      if (name === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: fragment };
      if (name === "next/script") return { default: "script" };
      if (name === "next/navigation") return { usePathname: () => pathname };
      if (name === "./AdSenseScript") return { AdSenseScript: "adsense" };
      if (name === "@/lib/adsense") return adsense;
      throw new Error(`Unexpected import: ${name}`);
    },
  }, { filename: file });
  return exports;
}
const { GoogleTags } = loadComponent("../components/analytics/GoogleTags.tsx");
const { AdSenseScript } = loadComponent("../components/analytics/AdSenseScript.tsx");
function nodes(node) {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap(nodes);
  return [node, ...nodes(node.props?.children)];
}
const bootstrap = nodes(GoogleTags()).find((node) => node.props?.id === "gtag-init").props.children;
function configs(href, referrer = "") {
  const window = { dataLayer: [] };
  runInNewContext(bootstrap, {
    window, dataLayer: window.dataLayer, location: new URL(href),
    document: { referrer }, URL,
  });
  return window.dataLayer.map((args) => Array.from(args)).filter(([command]) => command === "config");
}
let failures = 0;
let passed = 0;
function check(name, test) {
  try { test(); passed++; console.log(`PASS  ${name}`); }
  catch (error) { failures++; console.error(`FAIL  ${name}: ${error.message}`); }
}
const origin = "https://example.test";
const receipts = ["/events/cacna-2027/register/confirmation", "/giving/confirmation", "/store/confirmation"];
for (const path of receipts) {
  for (const suffix of ["", "/"]) {
    check(`redacts query and hash on ${path}${suffix} for both Google IDs`, () => {
      const result = configs(`${origin}${path}${suffix}?session_id=cs_test_synthetic&t=synthetic#private`);
      assert.equal(result.length, 2);
      for (const [, , config] of result) assert.equal(config.page_location, `${origin}${path}${suffix}`);
      assert.equal(JSON.stringify(result).includes("synthetic"), false);
    });
  }
  check(`redacts receipt referrer ${path}`, () => {
    for (const [, , config] of configs(`${origin}/blog`, `${origin}${path}?session_id=cs_test_synthetic#private`)) {
      assert.equal(config.page_referrer, `${origin}${path}`);
    }
  });
}
for (const path of ["/blog", "/giving", "/store", "/giving/confirmation-guide", "/store/confirmation/archive"]) {
  check(`preserves ordinary URL behavior on ${path}`, () => {
    for (const [, , config] of configs(`${origin}${path}?utm_source=test#section`, "https://search.example/?q=test")) {
      assert.equal(config.page_location, undefined);
      assert.equal(config.page_referrer, undefined);
    }
  });
}
check("malformed referrer does not break initialization", () => assert.equal(configs(`${origin}/`, "not a URL").length, 2));

const canonical = "ca-pub-1234567890123456";
const line = "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n";
for (const id of [canonical, ` ${canonical}`, `${canonical} `, `\n${canonical}\t`, "pub-1234567890123456", " pub-1234567890123456 "]) {
  check(`ad loader and ads.txt agree for ${JSON.stringify(id)}`, () => {
    pathname = "/blog/article";
    const script = AdSenseScript({ clientId: id });
    assert.equal(new URL(script.props.src).searchParams.get("client"), canonical);
    assert.equal(script.props.src.endsWith(`client=${canonical}`), true);
    assert.equal(adsense.adsTxtBody(id), line);
  });
}
for (const id of ["", " ", "invalid", "ca-pub-123", "ca-pub-XXXXXXXXXXXXXXXX", `${canonical}&other=value`]) {
  check(`invalid ID suppresses loader and ads.txt: ${JSON.stringify(id)}`, () => {
    pathname = "/blog";
    assert.equal(AdSenseScript({ clientId: id }), null);
    assert.equal(adsense.adsTxtBody(id), null);
  });
}
for (const path of ["/", "/admin", "/giving", "/store", "/privacy", ...receipts]) {
  check(`valid ad ID remains excluded from ${path}`, () => {
    pathname = path;
    assert.equal(AdSenseScript({ clientId: canonical }), null);
  });
}
console.log(`\n${passed} passed; ${failures} failed`);
if (failures) process.exitCode = 1;
