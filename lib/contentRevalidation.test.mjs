// Run with: npm test
// Pins the exact revalidatePath / revalidateTag calls each content hook makes.
// next/cache is replaced and the "@/" alias resolved by a resolve hook, so the
// real modules (and the cron route) load without a Next server.
import { test, beforeEach, before } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = pathToFileURL(fileURLToPath(new URL("..", import.meta.url)));
const calls = [];
globalThis.__revalidateCalls = calls;

const NEXT_CACHE_STUB = `data:text/javascript,${encodeURIComponent(
  `export const revalidatePath = (...a) => globalThis.__revalidateCalls.push(["path", ...a]);
   export const revalidateTag = (...a) => globalThis.__revalidateCalls.push(["tag", ...a]);`,
)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "next/cache") return { url: NEXT_CACHE_STUB, shortCircuit: true };
    if (specifier.startsWith("@/")) {
      return nextResolve(new URL(`${specifier.slice(2)}.ts`, root).href, context);
    }
    return nextResolve(specifier, context);
  },
});

let mod;
let route;
before(async () => {
  mod = await import("./contentRevalidation.ts");
  route = await import("../app/api/cron/refresh-content/route.ts");
});
beforeEach(() => {
  calls.length = 0;
});

const HOME = ["path", "/(site)/[locale]", "page"];
const BLOG = ["path", "/(site)/[locale]/blog", "page"];
const POST = ["path", "/(site)/[locale]/blog/[slug]", "page"];
const CAL = ["path", "/(site)/[locale]/calendar", "page"];
const EVENT = ["path", "/(site)/[locale]/events/[slug]", "page"];

test("blog content refreshes home, blog and post pages by route pattern", () => {
  mod.revalidateBlogContent();
  assert.deepEqual(calls, [HOME, BLOG, POST]);
});

test("event content refreshes home and calendar", () => {
  mod.revalidateEventContent();
  assert.deepEqual(calls, [HOME, CAL]);
});

test("announcements refresh the whole layout", () => {
  mod.revalidateAnnouncements();
  assert.deepEqual(calls, [["path", "/", "layout"]]);
});

test("cac-world news: pages only by default, hard-expires the feed tag when refetching", () => {
  mod.revalidateCacWorldNewsContent();
  assert.deepEqual(calls, [HOME, BLOG]);
  calls.length = 0;
  mod.revalidateCacWorldNewsContent({ refetchFeed: true });
  assert.deepEqual(calls, [["tag", "cac-world-news", { expire: 0 }], HOME, BLOG]);
});

test("scheduled refresh uses stale-while-revalidate for the feed and covers every page", () => {
  const result = mod.refreshAllPublicContent();
  assert.deepEqual(calls, [["tag", "cac-world-news", "max"], HOME, BLOG, POST, CAL, EVENT]);
  assert.deepEqual(result, { tags: 1, pages: 5 });
});

test("cron route: unauthorized request returns 401 and revalidates nothing", async () => {
  const prev = process.env.CRON_SECRET;
  process.env.CRON_SECRET = "a-test-only-cron-secret-0123456789";
  const errors = console.error;
  console.error = () => {};
  try {
    const bad = await route.GET({ headers: new Headers({ authorization: "Bearer wrong" }) });
    assert.equal(bad.status, 401);
    const none = await route.GET({ headers: new Headers() });
    assert.equal(none.status, 401);
    assert.deepEqual(calls, []);
    const ok = await route.GET({
      headers: new Headers({ authorization: "Bearer a-test-only-cron-secret-0123456789" }),
    });
    assert.equal(ok.status, 200);
    assert.equal(calls.length, 6);
  } finally {
    console.error = errors;
    if (prev === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = prev;
  }
});
