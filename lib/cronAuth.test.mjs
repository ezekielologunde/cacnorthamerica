// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { isAuthorizedCronRequest, CRON_SECRET_MIN_LENGTH } from "./cronAuth.ts";

const SECRET = "a-test-only-cron-secret-0123456789";

test("accepts exactly 'Bearer <secret>'", () => {
  assert.equal(isAuthorizedCronRequest(`Bearer ${SECRET}`, SECRET), true);
});

test("rejects a wrong, partial, padded or differently-cased header", () => {
  for (const header of [
    "Bearer wrong-secret-wrong-secret-00",
    SECRET,
    `bearer ${SECRET}`,
    `Bearer ${SECRET} `,
    ` Bearer ${SECRET}`,
    `Bearer ${SECRET.slice(0, -1)}`,
    `Bearer ${SECRET}x`,
    "Bearer ",
    "",
  ]) {
    assert.equal(isAuthorizedCronRequest(header, SECRET), false, JSON.stringify(header));
  }
});

test("rejects a missing header", () => {
  assert.equal(isAuthorizedCronRequest(null, SECRET), false);
  assert.equal(isAuthorizedCronRequest(undefined, SECRET), false);
});

test("fails closed when CRON_SECRET is unset or empty", () => {
  assert.equal(isAuthorizedCronRequest("Bearer undefined", undefined), false);
  assert.equal(isAuthorizedCronRequest("Bearer ", ""), false);
  assert.equal(isAuthorizedCronRequest("Bearer", ""), false);
});

test("fails closed when CRON_SECRET is shorter than the minimum", () => {
  const short = "x".repeat(CRON_SECRET_MIN_LENGTH - 1);
  assert.equal(isAuthorizedCronRequest(`Bearer ${short}`, short), false);
  const exact = "x".repeat(CRON_SECRET_MIN_LENGTH);
  assert.equal(isAuthorizedCronRequest(`Bearer ${exact}`, exact), true);
});
