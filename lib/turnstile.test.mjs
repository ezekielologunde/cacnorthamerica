import test from "node:test";
import assert from "node:assert/strict";
import { verifyTurnstile } from "./turnstile.ts";

const realFetch = globalThis.fetch;
const realSecret = process.env.TURNSTILE_SECRET_KEY;
const reply = (body, ok = true) => async () => ({ ok, status: ok ? 200 : 500, json: async () => body });

test.afterEach(() => {
  globalThis.fetch = realFetch;
  if (realSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
  else process.env.TURNSTILE_SECRET_KEY = realSecret;
});

test("no secret configured: verification is off", async () => {
  delete process.env.TURNSTILE_SECRET_KEY;
  globalThis.fetch = () => assert.fail("must not call Cloudflare");
  assert.equal(await verifyTurnstile(undefined, "1.2.3.4"), true);
});

test("secret set: missing, empty or oversized token is rejected without a network call", async () => {
  process.env.TURNSTILE_SECRET_KEY = "s";
  globalThis.fetch = () => assert.fail("must not call Cloudflare");
  for (const token of [undefined, null, "", 42, "x".repeat(2049)]) {
    assert.equal(await verifyTurnstile(token, "1.2.3.4"), false);
  }
});

test("secret set: Cloudflare's verdict decides", async () => {
  process.env.TURNSTILE_SECRET_KEY = "s";
  globalThis.fetch = reply({ success: true });
  assert.equal(await verifyTurnstile("tok", "1.2.3.4"), true);
  globalThis.fetch = reply({ success: false, "error-codes": ["invalid-input-response"] });
  assert.equal(await verifyTurnstile("tok", "1.2.3.4"), false);
});

test("secret set: a Cloudflare outage lets the submission through", async () => {
  process.env.TURNSTILE_SECRET_KEY = "s";
  const log = console.error;
  console.error = () => {};
  try {
    globalThis.fetch = reply({}, false);
    assert.equal(await verifyTurnstile("tok", "1.2.3.4"), true);
    globalThis.fetch = async () => {
      throw new Error("offline");
    };
    assert.equal(await verifyTurnstile("tok", "1.2.3.4"), true);
  } finally {
    console.error = log;
  }
});
