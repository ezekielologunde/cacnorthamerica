import test from "node:test";
import assert from "node:assert/strict";
import { socialCloudName, socialVideoRewrite } from "./cloud-name.ts";
import { parseVideoResource, videoResourceUrl } from "./cloudinary-meta.ts";

// Pure parts of the Cloudinary side: the single cloud-name source shared by
// next.config.ts, the upload/metadata code and TikTok's configuration, and
// the parsing of the Admin API's resource details.

test("cloud name: one source, no fallback; the TikTok rewrite exists only with a valid name", () => {
  assert.equal(socialCloudName({}), null);
  assert.equal(socialCloudName({ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "  " }), null);
  assert.equal(socialCloudName({ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "evil.example/x" }), null);
  assert.equal(socialCloudName({ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: " demo " }), "demo");

  assert.equal(socialVideoRewrite({}), null);
  const rule = socialVideoRewrite({ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "demo" });
  assert.equal(rule.destination, "https://res.cloudinary.com/demo/video/upload/social/:file");
  assert.match(rule.source, /^\/social-video\/:file\(/);
});

const RESOURCE = {
  public_id: "social/abc123",
  resource_type: "video",
  format: "mp4",
  bytes: 20_000_000,
  width: 1080,
  height: 1920,
  secure_url: "https://res.cloudinary.com/demo/video/upload/v1/social/abc123.mp4",
  duration: 42.5,
  frame_rate: 29.97,
  bit_rate: 3_500_000,
  video: { pix_format: "yuv420p", codec: "H264", level: 40, profile: "High" },
};

test("metadata: media_metadata is requested, and duration, frame rate and codec are read", () => {
  assert.equal(
    videoResourceUrl("demo", "social/abc123"),
    "https://api.cloudinary.com/v1_1/demo/resources/video/upload/social/abc123?media_metadata=true",
  );
  assert.deepEqual(parseVideoResource(RESOURCE, "social/abc123", "demo"), {
    publicId: "social/abc123",
    url: RESOURCE.secure_url,
    bytes: 20_000_000,
    format: "mp4",
    width: 1080,
    height: 1920,
    durationSec: 42.5,
    frameRate: 29.97,
    videoCodec: "h264",
  });
});

test("metadata: missing or malformed values stay unknown; anything not ours is refused", () => {
  const { duration, frame_rate, video, ...bare } = RESOURCE;
  void duration; void frame_rate; void video;
  const meta = parseVideoResource(bare, "social/abc123", "demo");
  assert.equal(meta.durationSec, null);
  assert.equal(meta.frameRate, null);
  assert.equal(meta.videoCodec, null);
  assert.equal(parseVideoResource({ ...RESOURCE, video: { codec: "h264; drop table" } }, "social/abc123", "demo").videoCodec, null);
  assert.equal(parseVideoResource(RESOURCE, "social/other", "demo"), null);
  assert.equal(parseVideoResource({ ...RESOURCE, resource_type: "image" }, "social/abc123", "demo"), null);
  assert.equal(parseVideoResource(RESOURCE, "social/abc123", "another-cloud"), null);
});
