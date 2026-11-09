// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeBlogPosts, latestBlogPost } from "./blogMerge.ts";

const post = (slug, dateIso, extra = {}) => ({
  slug, title: slug, excerpt: "", date: dateIso, dateIso,
  category: "Ministry Update", categoryColor: "", accent: "", readTime: "1 min read", body: [], ...extra,
});

test("keeps the static posts first and in their own order", () => {
  const statics = [post("lead", "2026-01-01"), post("newer-static", "2026-08-01")];
  const merged = mergeBlogPosts(statics, []);
  assert.deepEqual(merged.map((p) => p.slug), ["lead", "newer-static"]);
});

test("adds database posts after the static ones, newest first", () => {
  const statics = [post("lead", "2026-01-01")];
  const db = [post("db-old", "2026-03-01T10:00:00Z"), post("db-new", "2026-11-07T09:00:00Z")];
  const merged = mergeBlogPosts(statics, db);
  assert.deepEqual(merged.map((p) => p.slug), ["lead", "db-new", "db-old"]);
});

test("drops a database post whose slug a static post already uses", () => {
  const statics = [post("same-slug", "2026-01-01", { title: "static" })];
  const db = [post("same-slug", "2026-11-07T09:00:00Z", { title: "db" }), post("only-db", "2026-11-01")];
  const merged = mergeBlogPosts(statics, db);
  assert.deepEqual(merged.map((p) => [p.slug, p.title]), [["same-slug", "static"], ["only-db", "only-db"]]);
});

test("drops a repeated database slug", () => {
  const merged = mergeBlogPosts([], [post("dup", "2026-11-02"), post("dup", "2026-11-01")]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].dateIso, "2026-11-02");
});

test("does not mutate its inputs", () => {
  const db = [post("a", "2026-01-01"), post("b", "2026-02-01")];
  mergeBlogPosts([], db);
  assert.deepEqual(db.map((p) => p.slug), ["a", "b"]);
});

test("latestBlogPost: a just-published database post beats every static post", () => {
  const merged = mergeBlogPosts(
    [post("static-a", "2026-07-12"), post("static-b", "2026-08-01")],
    [post("db-fresh", "2026-11-07T09:00:00Z")],
  );
  assert.equal(latestBlogPost(merged)?.slug, "db-fresh");
});

test("latestBlogPost: skips excluded slugs and handles an empty list", () => {
  const posts = [post("pinned", "2026-12-01"), post("next", "2026-11-01")];
  assert.equal(latestBlogPost(posts, ["pinned"])?.slug, "next");
  assert.equal(latestBlogPost([]), undefined);
});
