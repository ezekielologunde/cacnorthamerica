import test from "node:test";
import assert from "node:assert/strict";
import { buildCaption, cleanText, cleanTitle, isSocialPublicId, validateVideo } from "./limits.ts";

const VIDEO = { publicId: "social/a", url: "https://res.cloudinary.com/d/video/upload/a.mp4", bytes: 1e6, format: "mp4", width: 1080, height: 1920, durationSec: 30 };

test("cleanText removes control and bidi-override characters, normalises line breaks", () => {
  assert.equal(cleanText("  Hi\u0007 there‮!\r\n\r\n\r\n\r\nBye \u0000 "), "Hi there!\n\nBye");
  assert.equal(cleanText("tab\tkept, emoji \u{1F468}‍\u{1F469} kept"), "tab\tkept, emoji \u{1F468}‍\u{1F469} kept");
  assert.equal(cleanTitle("Line one\nLine two"), "Line one Line two");
});

test("buildCaption: Facebook keeps title separate, Instagram and TikTok lead with it", () => {
  assert.deepEqual(buildCaption("facebook", "T", "Body"), { ok: true, caption: { title: "T", text: "Body" } });
  assert.deepEqual(buildCaption("instagram", "T", "Body"), { ok: true, caption: { title: "", text: "T\n\nBody" } });
  assert.deepEqual(buildCaption("tiktok", "T", ""), { ok: true, caption: { title: "", text: "T" } });
});

test("buildCaption rejects rather than truncates", () => {
  assert.equal(buildCaption("tiktok", "", "x").code, "title_missing");
  assert.equal(buildCaption("facebook", "t".repeat(101), "").code, "title_too_long");
  assert.equal(buildCaption("instagram", "T", "x".repeat(2198)).code, "caption_too_long");
  assert.equal(buildCaption("instagram", "T", "x".repeat(2197)).ok, true);
  const mentions = Array.from({ length: 21 }, (_, i) => `@user${i}`).join(" ");
  assert.equal(buildCaption("instagram", "T", mentions).code, "caption_too_many_mentions");
  assert.equal(buildCaption("tiktok", "T", mentions).ok, true);
});

test("validateVideo applies each platform's documented rules", () => {
  assert.deepEqual(validateVideo("instagram", VIDEO), { ok: true });
  assert.equal(validateVideo("instagram", { ...VIDEO, durationSec: 2 }).code, "video_too_short");
  assert.equal(validateVideo("instagram", { ...VIDEO, durationSec: 901 }).code, "video_too_long");
  assert.equal(validateVideo("instagram", { ...VIDEO, bytes: 301 * 1024 * 1024 }).code, "video_too_large");
  assert.equal(validateVideo("instagram", { ...VIDEO, width: 3840, height: 2160 }).code, "video_dimensions_unsupported");
  assert.equal(validateVideo("tiktok", { ...VIDEO, durationSec: 601 }).code, "video_too_long");
  assert.equal(validateVideo("tiktok", { ...VIDEO, width: 320, height: 568 }).code, "video_dimensions_unsupported");
  assert.equal(validateVideo("tiktok", { ...VIDEO, frameRate: 15 }).code, "video_frame_rate_unsupported");
  assert.equal(validateVideo("instagram", { ...VIDEO, videoCodec: "vp9" }).code, "video_codec_unsupported");
  assert.equal(validateVideo("facebook", { ...VIDEO, format: "mov" }).code, "video_format_unsupported");
  // Unknown dimensions, frame rate or codec pass; the platform's own check is the backstop.
  assert.deepEqual(validateVideo("instagram", { ...VIDEO, width: null, height: null }), { ok: true });
  // An unknown duration blocks the platforms with a duration rule, and only those.
  assert.equal(validateVideo("instagram", { ...VIDEO, durationSec: null }).code, "video_duration_unknown");
  assert.equal(validateVideo("tiktok", { ...VIDEO, durationSec: undefined }).code, "video_duration_unknown");
  assert.deepEqual(validateVideo("facebook", { ...VIDEO, durationSec: null }), { ok: true });
});

test("isSocialPublicId accepts only ids in the social folder", () => {
  assert.equal(isSocialPublicId("social/abc_DEF-123"), true);
  for (const bad of ["blog/abc", "social/../x", "social/a/b", "social/", "social/a.mp4", 7, null]) {
    assert.equal(isSocialPublicId(bad), false, String(bad));
  }
});
