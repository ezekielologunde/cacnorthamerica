// Exercises the actual recurring checkout route with a fake Stripe client and
// Turnstile response. No requests leave this process and no sessions are created.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const FAKE_STRIPE_MODULE = "data:text/javascript,export const getStripeClient = () => globalThis.__fakeStripe;";
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "@/lib/stripe") return { url: FAKE_STRIPE_MODULE, shortCircuit: true };
    if (specifier === "next/server" || specifier === "next/headers") return next(`${specifier}.js`, context);
    // Next's bundler provides "server-only"; plain Node has no such package.
    if (specifier === "server-only") return { url: "data:text/javascript,", shortCircuit: true };
    let target = null;
    if (specifier.startsWith("@/")) target = path.join(root, specifier.slice(2));
    else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:") && !path.extname(specifier)) {
      target = path.join(path.dirname(new URL(context.parentURL).pathname.replace(/^\/(\w:)/, "$1")), specifier);
    }
    if (target && !path.extname(target) && existsSync(`${target}.ts`)) {
      return next(pathToFileURL(`${target}.ts`).href, context);
    }
    return next(specifier, context);
  },
});

import assert from "node:assert/strict";

const created = [];
globalThis.__fakeStripe = { checkout: { sessions: { create: async (params) => {
  created.push(params);
  return { url: "https://checkout.invalid/test", client_secret: "test-client-secret" };
} } } };
process.env.TURNSTILE_SECRET_KEY = "test-turnstile-secret";
delete process.env.GIVING_RECURRING_ENABLED;
delete process.env.NEXT_PUBLIC_STRIPE_EMBEDDED;
let verifyOk = true;
globalThis.fetch = async (url) => {
  assert.equal(String(url), "https://challenges.cloudflare.com/turnstile/v0/siteverify", "Unexpected network target");
  return Response.json({ success: verifyOk });
};
const { POST } = await import("../app/api/giving/checkout/route.ts");
const { FORM_HEADER } = await import("../lib/spam.ts");
const { GIVING_CAMPAIGNS } = await import("../lib/giving.ts");
let count = 0;
const base = { contactName: "Test Donor", contactEmail: "donor@example.invalid", campaignSlug: GIVING_CAMPAIGNS.find((c) => c.kind === "tithe").slug, amountCents: 10000, frequency: "monthly", recurringConsent: true, turnstileToken: "test-token" };
async function post(over = {}, header = true) {
  count++;
  const headers = { "content-type": "application/json", "x-real-ip": `192.0.2.${count}` };
  if (header) headers[FORM_HEADER] = "1";
  const response = await POST(new Request("http://localhost/api/giving/checkout", { method: "POST", headers, body: JSON.stringify({ ...base, contactEmail: `donor${count}@example.invalid`, ...over }) }));
  return { status: response.status, body: await response.json() };
}
assert.equal((await post()).status, 400, "Recurring must stay off by default");
assert.equal(created.length, 0);
process.env.GIVING_RECURRING_ENABLED = "true";
for (const over of [{ recurringConsent: false }, { recurringConsent: "true" }, { amountCents: 499 }, { amountCents: 500001 }, { amountCents: 100001, paymentMethod: "bank" }, { campaignSlug: GIVING_CAMPAIGNS.find((c) => c.kind === "offering").slug }, { turnstileToken: "" }]) assert.equal((await post(over)).status, 400);
assert.equal((await post({}, false)).status, 400);
verifyOk = false;
assert.equal((await post()).status, 400);
assert.equal(created.length, 0, "Rejected recurring requests must not create Checkout Sessions");
verifyOk = true;
for (const frequency of ["monthly", "biweekly"]) {
  for (const paymentMethod of ["card", "bank"]) {
    const result = await post({ frequency, paymentMethod });
    assert.equal(result.status, 200);
    const params = created.at(-1);
    assert.equal(params.mode, "subscription");
    assert.deepEqual(params.payment_method_types, [paymentMethod === "bank" ? "us_bank_account" : "card"]);
    assert.deepEqual(params.metadata, params.subscription_data.metadata);
    assert.equal(params.metadata.frequency, frequency);
    assert.equal(params.line_items[0].price_data.unit_amount, 10000);
    assert.equal(params.line_items[0].price_data.recurring.interval, frequency === "monthly" ? "month" : "week");
    assert.equal(params.line_items[0].price_data.recurring.interval_count, frequency === "monthly" ? 1 : 2);
    if (paymentMethod === "bank") {
      assert.equal(params.line_items.length, 3);
      assert.equal(params.line_items[2].price_data.recurring, undefined, "Bank setup must not repeat");
    }
  }
}
process.env.NEXT_PUBLIC_STRIPE_EMBEDDED = "true";
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_mock_only";
assert.equal((await post()).body.clientSecret, "test-client-secret");
assert.equal(created.at(-1).ui_mode, "embedded_page");
assert.equal(created.at(-1).success_url, undefined);
const sameInbox = "limit@example.invalid";
for (let i = 0; i < 5; i++) assert.equal((await post({ contactEmail: sameInbox })).status, 200);
const before = created.length;
assert.equal((await post({ contactEmail: sameInbox })).status, 429);
assert.equal(created.length, before);
// The off flag gates subscriptions, not ordinary single gifts.
delete process.env.GIVING_RECURRING_ENABLED;
assert.equal((await post({ frequency: "once", recurringConsent: false })).status, 200);
assert.equal(created.at(-1).mode, "payment");
console.log("PASS recurring route guards, monthly/biweekly card/ACH, embedded checkout, inbox cap, and one-time regression");
