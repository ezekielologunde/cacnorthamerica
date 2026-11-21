// Run with: npm test  (node's built-in runner strips the TypeScript types).
// Yoruba text must be NFC, using only code points the site fonts ship
// (Bricolage Grotesque and Plus Jakarta Sans both cover Google's latin,
// latin-ext and vietnamese subsets). NFD text, or a stray combining dot below
// instead of the precomposed ẹ/ọ/ṣ, makes browsers draw the marks from a
// fallback font or misplace them.
import { test } from "node:test";
import assert from "node:assert/strict";
import { YORUBA_PHRASES, YORUBA_WELCOME } from "./yoruba.ts";
import { CURRENT_WATCHWORD, PAST_WATCHWORDS } from "./watchwords.ts";

const COMBINING_TONE_MARKS = new Set([0x0300, 0x0301]); // grave (low), acute (high)

function badCodePoints(s) {
  const bad = [];
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    const ok =
      cp <= 0x00ff || // Basic Latin + Latin-1 (à á è é ì í ò ó ù ú)
      (cp >= 0x0100 && cp <= 0x017f) || // Latin Extended-A (ń)
      COMBINING_TONE_MARKS.has(cp) || // tone over ẹ ọ, which have no precomposed form
      (cp >= 0x1e00 && cp <= 0x1eff) || // Latin Extended Additional (ẹ ọ ṣ ḿ)
      cp === 0x2019 || cp === 0x2014; // ’ —
    if (!ok) bad.push(`U+${cp.toString(16).toUpperCase().padStart(4, "0")}`);
  }
  return bad;
}

const yorubaStrings = [
  YORUBA_WELCOME,
  ...YORUBA_PHRASES.map((p) => p.yo),
  ...[CURRENT_WATCHWORD, ...PAST_WATCHWORDS].map((w) => w.verseTextYoruba).filter(Boolean),
];

test("every Yoruba string is Unicode NFC", () => {
  for (const s of yorubaStrings) assert.equal(s, s.normalize("NFC"), `not NFC: ${JSON.stringify(s)}`);
});

test("every Yoruba string uses only code points the site fonts cover", () => {
  for (const s of yorubaStrings) assert.deepEqual(badCodePoints(s), [], `in ${JSON.stringify(s)}`);
});

test("glossary entries are non-empty and unique", () => {
  const seen = new Set();
  for (const p of YORUBA_PHRASES) {
    assert.ok(p.yo.trim() && p.en.trim());
    assert.ok(!seen.has(p.yo), `duplicate ${p.yo}`);
    seen.add(p.yo);
  }
});

test("the check rejects NFD text", () => {
  const nfd = YORUBA_WELCOME.normalize("NFD");
  assert.notEqual(nfd, nfd.normalize("NFC"));
  assert.ok(badCodePoints(nfd).includes("U+0323"), "NFD splits ẹ/ọ into a base letter + U+0323");
});
