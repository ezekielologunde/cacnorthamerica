// Run with: npm test  (node's built-in runner strips the types from navMatch.ts).
import test from "node:test";
import assert from "node:assert/strict";
import { activeGroupId, isCurrentPage, isWithin } from "./navMatch.ts";

// Same shape as lib/nav.ts's sections, trimmed to what matching reads.
const groups = [
  { id: "about", href: "/about", links: [{ href: "/about" }, { href: "/leadership" }, { href: "https://cacworld.org/" }] },
  { id: "ministries", href: "/ministries", links: [{ href: "/youth" }, { href: "/children" }] },
  {
    id: "events",
    href: "/calendar",
    match: (p) => p.startsWith("/events/"),
    links: [{ href: "/events/cacna-2027/register" }, { href: "/youth#register" }, { href: "/archive" }, { href: "/calendar" }],
  },
  { id: "media", href: "/online", links: [{ href: "/online" }, { href: "/blog" }] },
];

test("a section is active on its own pages and on pages beneath them", () => {
  assert.equal(activeGroupId("/leadership", groups), "about");
  assert.equal(activeGroupId("/leadership/past", groups), "about");
  assert.equal(activeGroupId("/blog/ancient-altars-interview", groups), "media");
  assert.equal(activeGroupId("/events/cacna-2027/register/youth", groups), "events");
});

test("every /events/* page, current or past, belongs to Events", () => {
  assert.equal(activeGroupId("/events/cacna-2027", groups), "events");
  assert.equal(activeGroupId("/events/pilgrimage-2026", groups), "events");
  assert.equal(activeGroupId("/events/cacna-2026/schedule", groups), "events");
  assert.equal(activeGroupId("/calendar", groups), "events");
});

test("anchors and external links never claim a page", () => {
  // /youth#register sits under Convention, but /youth is a Ministries page.
  assert.equal(activeGroupId("/youth", groups), "ministries");
  assert.equal(activeGroupId("/", groups), null);
  assert.equal(activeGroupId("/contact", groups), null);
});

test("isWithin needs a whole path segment, not a prefix", () => {
  assert.equal(isWithin("/aboutus", "/about"), false);
  assert.equal(isWithin("/about/", "/about"), true);
  assert.equal(isWithin("/anything", "/"), false);
  assert.equal(isWithin("/", "/"), true);
});

test("isCurrentPage is exact, ignoring a trailing slash", () => {
  assert.equal(isCurrentPage("/giving", "/giving"), true);
  assert.equal(isCurrentPage("/giving/", "/giving"), true);
  assert.equal(isCurrentPage("/giving/cancel", "/giving"), false);
  assert.equal(isCurrentPage("/about", "/about#convention"), false);
  assert.equal(isCurrentPage("/", "https://cacworld.org/"), false);
});
