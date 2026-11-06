import test from "node:test";
import assert from "node:assert/strict";
import { receiverWorld } from "../scripts/helpers/sheets-receiver.mjs";
import { logToSheetChecked } from "./sheetsWebhook.ts";

const payload = (key = "invoice/in_test/sheet", extra = {}) => ({ formName: "Giving", secret: "test-secret", Total: "$25.00", idempotencyKey: key, ...extra });

test("receiver fails closed with no secret, wrong secret, or missing secret", () => {
  for (const expected of [null, "test-secret"]) {
    const world = receiverWorld();
    world.state.secret = expected;
    const receive = world.newReceiver();
    assert.equal(receive(payload(undefined, { secret: "wrong" })).ok, false);
    assert.equal(receive(payload(undefined, { secret: undefined })).ok, false);
    if (!expected) assert.equal(receive(payload()).ok, false);
    assert.equal(world.state.sheets.size, 0);
    assert.equal(world.state.releases, 0);
  }
});

test("lock contention writes nothing and does not release another request's lock", () => {
  const world = receiverWorld();
  world.state.busy = true;
  const reply = world.newReceiver()(payload());
  assert.equal(reply.ok, false);
  assert.equal(world.state.sheets.size, 0);
  assert.equal(world.state.releases, 0);
});

test("fresh receiver contexts dedupe the persisted row, and different steps remain separate", () => {
  const world = receiverWorld();
  assert.equal(world.newReceiver()(payload()).ok, true);
  const replay = world.newReceiver()(payload());
  assert.equal(replay.duplicate, true);
  assert.equal(replay.idempotencyKey, payload().idempotencyKey);
  assert.equal(world.state.sheets.get("Giving").rows.length, 2);
  assert.equal(world.newReceiver()(payload("invoice/in_second/sheet")).ok, true);
  assert.equal(world.state.sheets.get("Giving").rows.length, 3);
});

test("crashes after append or before acknowledgement do not append again on retry", () => {
  for (const failure of ["failAfterAppend", "failFlush"]) {
    const world = receiverWorld();
    world.state[failure] = true;
    assert.equal(world.newReceiver()(payload()).ok, false);
    assert.equal(world.newReceiver()(payload()).duplicate, true);
    assert.equal(world.state.sheets.get("Giving").rows.length, 2);
    assert.equal(world.state.releases, 2);
  }
});

test("keys are receiver-controlled; check-in column stays last and formulas are text", () => {
  const world = receiverWorld();
  const receive = world.newReceiver();
  const first = payload("checkout-session/cs_1/sheet-0", { Name: "=FORMULA()", "Check-in Code": "ABCD", "Idempotency Key": "forged" });
  assert.equal(receive(first).ok, true);
  assert.equal(receive(payload("checkout-session/cs_1/sheet-1", { Name: "Other", Extra: "note", "Check-in Code": "EFGH" })).ok, true);
  const [headers, row] = world.state.sheets.get("Giving").rows;
  assert.equal(headers.at(-1), "Check-in Code");
  assert.equal(row[headers.indexOf("Idempotency Key")], first.idempotencyKey);
  assert.equal(row[headers.indexOf("Name")], "'=FORMULA()");
  for (const key of ["", "=FORMULA()", 42, null, "x".repeat(201)]) assert.equal(receive(payload(key)).ok, false);
});

test("checked sender requires config and receiver confirmation, and retries an uncertain append safely", async () => {
  const before = { hook: process.env.SHEETS_WEBHOOK, secret: process.env.SHEETS_WEBHOOK_SECRET, fetch: globalThis.fetch };
  let calls = 0;
  try {
    process.env.SHEETS_WEBHOOK = "https://sheets.invalid/test";
    delete process.env.SHEETS_WEBHOOK_SECRET;
    globalThis.fetch = async () => { calls++; throw new Error("Network forbidden"); };
    assert.equal(await logToSheetChecked("Giving", {}, "key"), false);
    process.env.SHEETS_WEBHOOK_SECRET = "test-secret";
    delete process.env.SHEETS_WEBHOOK;
    assert.equal(await logToSheetChecked("Giving", {}, "key"), false);
    assert.equal(calls, 0);
    process.env.SHEETS_WEBHOOK = "https://sheets.invalid/test";
    for (const reply of [{ ok: true }, { ok: false }, { ok: true, idempotencyKey: "other" }]) {
      globalThis.fetch = async () => Response.json(reply);
      assert.equal(await logToSheetChecked("Giving", {}, "key"), false);
    }
    const world = receiverWorld();
    world.state.failAfterAppend = true;
    globalThis.fetch = async (url, init) => {
      assert.equal(url, "https://sheets.invalid/test");
      assert.ok(init.signal instanceof AbortSignal);
      return Response.json(world.newReceiver()(JSON.parse(init.body)));
    };
    const fields = { Total: "$25.00", secret: "forged", idempotencyKey: "forged", "Idempotency Key": "forged" };
    assert.equal(await logToSheetChecked("Giving", fields, "invoice/in_1/sheet"), false);
    assert.equal(await logToSheetChecked("Giving", fields, "invoice/in_1/sheet"), true);
    assert.equal(world.state.sheets.get("Giving").rows.length, 2);
  } finally {
    if (before.hook === undefined) delete process.env.SHEETS_WEBHOOK; else process.env.SHEETS_WEBHOOK = before.hook;
    if (before.secret === undefined) delete process.env.SHEETS_WEBHOOK_SECRET; else process.env.SHEETS_WEBHOOK_SECRET = before.secret;
    globalThis.fetch = before.fetch;
  }
});
