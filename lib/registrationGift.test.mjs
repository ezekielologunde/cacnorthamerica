import test from "node:test";
import assert from "node:assert/strict";
import { GIFT_LINE_LABEL, GIFT_MAX_CENTS, GIFT_MIN_CENTS, giftLineItems, giftOf, isGiftLine, parseGiftCents } from "./registrationGift.ts";

test("no gift when the field is absent, null or zero", () => {
  for (const v of [undefined, null, 0]) assert.deepEqual(parseGiftCents(v), { ok: true, cents: 0 });
});

test("a whole-cent amount inside the limits is accepted", () => {
  assert.deepEqual(parseGiftCents(2500), { ok: true, cents: 2500 });
  assert.deepEqual(parseGiftCents(GIFT_MIN_CENTS), { ok: true, cents: GIFT_MIN_CENTS });
  assert.deepEqual(parseGiftCents(GIFT_MAX_CENTS), { ok: true, cents: GIFT_MAX_CENTS });
});

test("out-of-range, fractional, negative and non-numeric amounts are rejected", () => {
  for (const v of [99, GIFT_MAX_CENTS + 1, 25.5, -500, "2500", NaN, Infinity, true, {}]) {
    assert.equal(parseGiftCents(v).ok, false, String(v));
  }
});

test("the gift line item carries the label and amount; no gift gives no line", () => {
  assert.deepEqual(giftLineItems(0), []);
  const [item] = giftLineItems(2500);
  assert.equal(item.price_data.unit_amount, 2500);
  assert.equal(item.price_data.product_data.name, GIFT_LINE_LABEL);
  assert.equal(item.quantity, 1);
});

test("giftOf ignores malformed values; isGiftLine matches only the label", () => {
  assert.equal(giftOf({ gift: 2500 }), 2500);
  for (const g of [undefined, "2500", 25.5, 50, GIFT_MAX_CENTS + 1]) assert.equal(giftOf({ gift: g }), 0);
  assert.equal(isGiftLine(GIFT_LINE_LABEL), true);
  assert.equal(isGiftLine("Processing fee"), false);
  assert.equal(isGiftLine(null), false);
});
