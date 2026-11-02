// Run with: npm test  (node's built-in runner; Node 22.18+ strips the
// TypeScript types from cacWorldNews.ts on import).
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { getLatestCacWorldNews, fetchCacWorldCandidates } from "./cacWorldNews.ts";

const SUPA = "http://supa.test";
const FEED_PREFIX = "https://www.cacworldnews.com/feeds/posts/default";

function entry({ title, href, published, html = "<p>Body</p>", thumb }) {
  return {
    title: { $t: title },
    published: { $t: published },
    content: { $t: html },
    ...(thumb ? { media$thumbnail: { url: thumb } } : {}),
    link: [{ rel: "alternate", href }],
  };
}

function row({ id, url, title, published, excerpt = null, image = null }) {
  return { id, source_url: url, title, excerpt, image_url: image, published_at: published };
}

let calls;
let feedResponse;
let approvedRows;
let rejectedRows;
let dbDown;
const realFetch = globalThis.fetch;
const realEnv = { ...process.env };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

beforeEach(() => {
  calls = [];
  feedResponse = () => json({ feed: { entry: [] } });
  approvedRows = [];
  rejectedRows = [];
  dbDown = false;
  process.env.NEXT_PUBLIC_SUPABASE_URL = SUPA;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service";
  globalThis.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
    calls.push({ url, init });
    if (url.startsWith(FEED_PREFIX)) return feedResponse();
    if (url.startsWith(SUPA)) {
      if (dbDown) throw new TypeError("fetch failed");
      const q = decodeURIComponent(url);
      if (q.includes("status=eq.approved")) return json(approvedRows);
      if (q.includes("status=eq.rejected")) return json(rejectedRows);
    }
    throw new Error(`unexpected fetch ${url}`);
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
  process.env = { ...realEnv };
});

const quiet = (t) => t.mock.method(console, "error", () => {});

test("merges feed with approved rows, dedupes by story URL, newest first, limited", async () => {
  feedResponse = () => json({ feed: { entry: [
    entry({ title: "Feed newest", href: "https://www.cacworldnews.com/2026/10/c.html", published: "2026-10-15T11:00:00-07:00" }),
    entry({ title: "Feed copy of approved", href: "https://www.cacworldnews.com/2026/10/b.html?m=1", published: "2026-10-10T00:00:00Z" }),
    entry({ title: "Feed oldest", href: "https://www.cacworldnews.com/2026/09/a.html", published: "2026-09-01T00:00:00Z" }),
  ] } });
  approvedRows = [row({ id: "db-1", url: "https://cacworldnews.com/2026/10/b.html", title: "Approved title", published: "2026-10-10T00:00:00Z" })];

  const items = await getLatestCacWorldNews(2);
  assert.deepEqual(items.map((i) => i.title), ["Feed newest", "Approved title"]);
  assert.equal(items[1].id, "db-1");

  const all = await getLatestCacWorldNews(10);
  assert.deepEqual(all.map((i) => i.title), ["Feed newest", "Approved title", "Feed oldest"]);
});

test("reads the feed through Next's data cache, revalidating every 30 minutes", async () => {
  await getLatestCacWorldNews(3);
  const feedCall = calls.find((c) => c.url.startsWith(FEED_PREFIX));
  assert.deepEqual(feedCall.init, { next: { revalidate: 1800 } });
});

test("only keeps https story links on cacworldnews.com (not blogspot lookalikes) and https Blogger images", async () => {
  feedResponse = () => json({ feed: { entry: [
    entry({ title: "Good", href: "https://www.cacworldnews.com/2026/10/good.html", published: "2026-10-05T00:00:00Z",
      thumb: "https://blogger.googleusercontent.com/img/b/x/s72-w381-h254-c/IMG.jpg" }),
    entry({ title: "Plain thumb", href: "https://cacworldnews.com/2026/10/x.html", published: "2026-10-04T00:00:00Z",
      thumb: "http://blogger.googleusercontent.com/img/b/y/s72-c/plain-http.jpg" }),
    entry({ title: "Off-host image", href: "https://www.cacworldnews.com/2026/10/img.html", published: "2026-10-03T00:00:00Z",
      thumb: "https://evil.example/pixel.gif" }),
    entry({ title: "Plain http", href: "http://www.cacworldnews.com/2026/10/http.html", published: "2026-10-02T00:00:00Z" }),
    entry({ title: "Lookalike", href: "https://cacworldnews.com.evil.example/x.html", published: "2026-10-01T00:00:00Z" }),
    entry({ title: "Blogspot lookalike", href: "https://evil.blogspot.com/x", published: "2026-09-30T12:00:00Z" }),
    entry({ title: "Script", href: "javascript:alert(1)", published: "2026-09-30T00:00:00Z" }),
  ] } });
  approvedRows = [row({ id: "db-x", url: "https://example.com/story", title: "Off-site approved", published: "2026-10-09T00:00:00Z" })];

  const items = await getLatestCacWorldNews(10);
  assert.deepEqual(items.map((i) => i.title), ["Good", "Plain thumb", "Off-host image"]);
  assert.equal(items[0].imageUrl, "https://blogger.googleusercontent.com/img/b/x/s640/IMG.jpg");
  assert.equal(items[1].imageUrl, null);
  assert.equal(items[2].imageUrl, null);
});

test("excerpt is plain text of at most ~160 chars, cut on a word with an ellipsis", async () => {
  const long = "<p>The&nbsp;Christ Apostolic Church &#8216;family&#8217; gathered " + "for worship and fellowship ".repeat(12) + "</p>";
  feedResponse = () => json({ feed: { entry: [
    entry({ title: "Long", href: "https://www.cacworldnews.com/2026/10/long.html", published: "2026-10-05T00:00:00Z", html: long }),
    entry({ title: "Short", href: "https://www.cacworldnews.com/2026/10/short.html", published: "2026-10-04T00:00:00Z", html: "<b>Brief</b> note." }),
  ] } });

  const [longItem, shortItem] = await getLatestCacWorldNews(2);
  assert.ok(longItem.excerpt.length <= 160, `excerpt length ${longItem.excerpt.length}`);
  assert.ok(longItem.excerpt.endsWith("…"));
  assert.ok(longItem.excerpt.startsWith("The Christ Apostolic Church ‘family’ gathered"));
  assert.doesNotMatch(longItem.excerpt, /[<>]|&#?\w+;/);
  assert.doesNotMatch(longItem.excerpt, /\s…$/);
  assert.equal(shortItem.excerpt, "Brief note.");
});

test("stories an admin rejected or unpublished stay hidden even while still in the feed", async () => {
  feedResponse = () => json({ feed: { entry: [
    entry({ title: "Kept", href: "https://www.cacworldnews.com/2026/10/kept.html", published: "2026-10-05T00:00:00Z" }),
    entry({ title: "Rejected", href: "https://www.cacworldnews.com/2026/10/rejected.html", published: "2026-10-06T00:00:00Z" }),
  ] } });
  rejectedRows = [{ source_url: "https://www.cacworldnews.com/2026/10/rejected.html" }];

  const items = await getLatestCacWorldNews(5);
  assert.deepEqual(items.map((i) => i.title), ["Kept"]);
});

test("never throws: feed down returns approved rows, DB down returns feed, both down returns []", async (t) => {
  quiet(t);
  approvedRows = [row({ id: "db-1", url: "https://www.cacworldnews.com/2026/10/db.html", title: "From DB", published: "2026-10-01T00:00:00Z" })];
  feedResponse = () => json({ error: "boom" }, 500);
  assert.deepEqual((await getLatestCacWorldNews(3)).map((i) => i.title), ["From DB"]);

  feedResponse = () => { throw new TypeError("fetch failed"); };
  assert.deepEqual((await getLatestCacWorldNews(3)).map((i) => i.title), ["From DB"]);

  feedResponse = () => new Response("<html>not json</html>", { status: 200 });
  assert.deepEqual((await getLatestCacWorldNews(3)).map((i) => i.title), ["From DB"]);

  feedResponse = () => json({ feed: { entry: [
    entry({ title: "From feed", href: "https://www.cacworldnews.com/2026/10/f.html", published: "2026-10-02T00:00:00Z" }),
  ] } });
  dbDown = true;
  assert.deepEqual((await getLatestCacWorldNews(3)).map((i) => i.title), ["From feed"]);

  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  assert.deepEqual((await getLatestCacWorldNews(3)).map((i) => i.title), ["From feed"]);

  feedResponse = () => { throw new TypeError("fetch failed"); };
  assert.deepEqual(await getLatestCacWorldNews(3), []);
});

test("admin candidate fetch is unchanged: no-store, unfiltered, throws on feed failure", async () => {
  feedResponse = () => json({ feed: { entry: [
    entry({ title: "Any", href: "https://www.cacworldnews.com/2026/10/any.html", published: "2026-10-05T00:00:00Z",
      thumb: "https://blogger.googleusercontent.com/img/b/x/s72-c/IMG.jpg" }),
  ] } });
  const candidates = await fetchCacWorldCandidates();
  assert.deepEqual(calls.at(-1).init, { cache: "no-store" });
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].imageUrl, "https://blogger.googleusercontent.com/img/b/x/s640/IMG.jpg");

  feedResponse = () => json({}, 503);
  await assert.rejects(fetchCacWorldCandidates(), /503/);
});
