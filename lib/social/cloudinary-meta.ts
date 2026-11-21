// Reading a social upload's metadata from Cloudinary's Admin API. Pure (no
// network, no server-only import) so `node --test` covers it;
// lib/social/cloudinary.ts does the request.
//
// GET /resources/video/upload/<public_id>
// (https://cloudinary.com/documentation/admin_api#get_details_of_a_single_resource_by_public_id):
// bytes, format, width, height and secure_url are always returned. Duration,
// frame rate and codec come only with `media_metadata=true` (the
// resource-details parameter that "applies to image and video (including
// audio) assets"; Cloudinary support documents it as the way to get
// duration, frame_rate, bit_rate and codec). Field names as in Cloudinary's
// video responses: top-level `duration` (seconds) and `frame_rate`, and
// `video.codec` (e.g. "h264"). Anything missing or malformed stays null; a
// missing duration then blocks Instagram and TikTok (validateVideo).

import type { VideoMeta } from "./types.ts";

const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : null);

const CODEC = /^[a-z0-9_.-]{1,32}$/;

export function videoResourceUrl(cloud: string, publicId: string): string {
  return `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/resources/video/upload/${publicId}?media_metadata=true`;
}

/** The metadata of a real video of ours, or null for anything else. */
export function parseVideoResource(body: Record<string, unknown>, publicId: string, cloud: string): VideoMeta | null {
  const secureUrl = body.secure_url;
  const bytes = num(body.bytes);
  const format = typeof body.format === "string" ? body.format.toLowerCase() : "";
  if (
    body.public_id !== publicId ||
    body.resource_type !== "video" ||
    typeof secureUrl !== "string" ||
    !secureUrl.startsWith(`https://res.cloudinary.com/${cloud}/video/upload/`) ||
    bytes === null ||
    !/^[a-z0-9]{1,10}$/.test(format)
  ) {
    return null;
  }

  const video = body.video && typeof body.video === "object" ? (body.video as Record<string, unknown>) : {};
  const codec = typeof video.codec === "string" ? video.codec.toLowerCase() : "";

  return {
    publicId,
    url: secureUrl,
    bytes,
    format,
    width: num(body.width),
    height: num(body.height),
    durationSec: num(body.duration),
    frameRate: num(body.frame_rate),
    videoCodec: CODEC.test(codec) ? codec : null,
  };
}
