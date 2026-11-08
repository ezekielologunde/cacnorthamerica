// Per-platform video and caption rules, checked before anything is posted.
// Every number below is from the cited platform doc; where a platform documents
// no limit the field is left open (null) and the comment says so. Our own caps
// are marked "ours".

import type { Platform, PlatformCaption, ValidateResult, VideoMeta } from "./types.ts";

/** Largest upload the admin form accepts: Cloudinary Free plan's per-video cap
 *  (https://cloudinary.com/pricing/compare-plans). Raise it only after
 *  confirming the account is on a bigger plan (Plus 2 GB, Advanced 4 GB). */
export const UPLOAD_MAX_BYTES = 100 * 1024 * 1024;

/** Formats the upload form and the signed upload accept. */
export const UPLOAD_FORMATS = ["mp4", "mov"] as const;

/** Cloudinary folder social uploads go in; public ids must start with it. */
export const UPLOAD_FOLDER = "social";

const PUBLIC_ID = /^social\/[A-Za-z0-9_-]{1,200}$/;

export function isSocialPublicId(value: unknown): value is string {
  return typeof value === "string" && PUBLIC_ID.test(value);
}

/** Title shown on Facebook and leading the Instagram/TikTok caption (ours:
 *  Meta documents no Page video title limit). */
export const TITLE_MAX = 100;

type VideoRules = {
  formats: readonly string[];
  maxBytes: number | null;
  minDurationSec: number | null;
  maxDurationSec: number | null;
  minFps: number | null;
  maxFps: number | null;
  codecs: readonly string[] | null;
  maxWidth: number | null;
  minSide: number | null;
  maxSide: number | null;
  minAspect: number | null;
  maxAspect: number | null;
};

type CaptionRules = {
  /** Max length of the caption text in UTF-16 code units (JS string length). */
  maxText: number;
  maxHashtags: number | null;
  maxMentions: number | null;
  /** True when the title travels in its own field (Facebook). */
  separateTitle: boolean;
};

export const VIDEO_RULES: Record<Platform, VideoRules> = {
  // https://developers.facebook.com/docs/video-api/guides/publishing lists mp4
  // as the video type for the Resumable Upload API; the Page videos reference
  // (https://developers.facebook.com/docs/graph-api/reference/page/videos/)
  // and the Video API overview document no size, duration or codec limits.
  facebook: {
    formats: ["mp4"],
    maxBytes: null,
    minDurationSec: null,
    maxDurationSec: null,
    minFps: null,
    maxFps: null,
    codecs: null,
    maxWidth: null,
    minSide: null,
    maxSide: null,
    minAspect: null,
    maxAspect: null,
  },
  // https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media
  // (Reels specifications): MOV or MP4; HEVC or H264; 23-60 FPS; max width
  // 1920; aspect 0.01:1 to 10:1; 3 s to 15 min; 300 MB.
  instagram: {
    formats: ["mp4", "mov"],
    maxBytes: 300 * 1024 * 1024,
    minDurationSec: 3,
    maxDurationSec: 15 * 60,
    minFps: 23,
    maxFps: 60,
    codecs: ["h264", "hevc", "h265"],
    maxWidth: 1920,
    minSide: null,
    maxSide: null,
    minAspect: 0.01,
    maxAspect: 10,
  },
  // https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide
  // MP4, WebM, MOV; H.264, H.265, VP8, VP9; 23-60 FPS; 360-4096 px per side;
  // up to 10 minutes; 4 GB.
  tiktok: {
    formats: ["mp4", "webm", "mov"],
    maxBytes: 4 * 1024 * 1024 * 1024,
    minDurationSec: null,
    maxDurationSec: 10 * 60,
    minFps: 23,
    maxFps: 60,
    codecs: ["h264", "h265", "hevc", "vp8", "vp9"],
    maxWidth: null,
    minSide: 360,
    maxSide: 4096,
    minAspect: null,
    maxAspect: null,
  },
};

export const CAPTION_RULES: Record<Platform, CaptionRules> = {
  // Ours: the Page videos reference documents no description limit, so the
  // same 2200 the other two platforms use keeps one caption valid everywhere.
  facebook: { maxText: 2200, maxHashtags: null, maxMentions: null, separateTitle: true },
  // IG media reference: caption max 2200 characters, 30 hashtags, 20 @ tags.
  instagram: { maxText: 2200, maxHashtags: 30, maxMentions: 20, separateTitle: false },
  // https://developers.tiktok.com/doc/content-posting-api-reference-direct-post
  // post_info.title: max 2200 UTF-16 runes.
  tiktok: { maxText: 2200, maxHashtags: null, maxMentions: null, separateTitle: false },
};

/** Checks one video against one platform's rules. An unknown duration fails
 *  on a platform with a duration rule (video_duration_unknown): Cloudinary is
 *  asked for it (lib/social/cloudinary-meta.ts), so missing means something
 *  is off, and the rule isn't silently skipped. Other values the metadata
 *  doesn't carry (null/undefined) pass: the platform's own check is the
 *  backstop. */
export function validateVideo(platform: Platform, video: VideoMeta): ValidateResult {
  const r = VIDEO_RULES[platform];
  const fail = (code: string): ValidateResult => ({ ok: false, code });

  if (!r.formats.includes(video.format.toLowerCase())) return fail("video_format_unsupported");
  if (r.maxBytes !== null && video.bytes > r.maxBytes) return fail("video_too_large");

  const d = video.durationSec;
  if (d == null) {
    if (r.minDurationSec !== null || r.maxDurationSec !== null) return fail("video_duration_unknown");
  } else {
    if (r.minDurationSec !== null && d < r.minDurationSec) return fail("video_too_short");
    if (r.maxDurationSec !== null && d > r.maxDurationSec) return fail("video_too_long");
  }

  const fps = video.frameRate;
  if (fps != null) {
    if ((r.minFps !== null && fps < r.minFps) || (r.maxFps !== null && fps > r.maxFps)) {
      return fail("video_frame_rate_unsupported");
    }
  }

  const codec = video.videoCodec?.toLowerCase();
  if (codec && r.codecs && !r.codecs.includes(codec)) return fail("video_codec_unsupported");

  const { width: w, height: h } = video;
  if (w != null && h != null && w > 0 && h > 0) {
    if (r.maxWidth !== null && w > r.maxWidth) return fail("video_dimensions_unsupported");
    if (r.minSide !== null && Math.min(w, h) < r.minSide) return fail("video_dimensions_unsupported");
    if (r.maxSide !== null && Math.max(w, h) > r.maxSide) return fail("video_dimensions_unsupported");
    const aspect = w / h;
    if ((r.minAspect !== null && aspect < r.minAspect) || (r.maxAspect !== null && aspect > r.maxAspect)) {
      return fail("video_aspect_unsupported");
    }
  }
  return { ok: true };
}

// C0 and C1 control characters except tab (09) and newline (0A), and the
// Unicode bidi embedding/override/isolate controls that can visually reorder
// text. Zero-width joiners stay: emoji sequences need them.
const UNSAFE_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F‪-‮⁦-⁩]/g;

/** Plain-text clean-up applied to everything we send: NFC, CRLF to LF, unsafe
 *  control characters removed, runs of 3+ line breaks collapsed to 2, trailing
 *  spaces on lines removed, trimmed. */
export function cleanText(input: string): string {
  return input
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(UNSAFE_CHARS, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** A title is one line: line breaks become spaces. */
export function cleanTitle(input: string): string {
  return cleanText(input).replace(/\s*\n\s*/g, " ");
}

const HASHTAG = /(^|\s)#[\p{L}\p{N}_]+/gu;
const MENTION = /(^|\s)@[\p{L}\p{N}_.]+/gu;

export type CaptionResult = { ok: true; caption: PlatformCaption } | { ok: false; code: string };

/** The exact text one platform receives. Over-limit input is rejected, never
 *  truncated, so the admin sees why and edits it. */
export function buildCaption(platform: Platform, title: string, caption: string): CaptionResult {
  const rules = CAPTION_RULES[platform];
  const t = cleanTitle(title);
  const c = cleanText(caption);
  if (!t) return { ok: false, code: "title_missing" };
  if (t.length > TITLE_MAX) return { ok: false, code: "title_too_long" };

  const text = rules.separateTitle ? c : c ? `${t}\n\n${c}` : t;
  if (text.length > rules.maxText) return { ok: false, code: "caption_too_long" };
  if (rules.maxHashtags !== null && (text.match(HASHTAG)?.length ?? 0) > rules.maxHashtags) {
    return { ok: false, code: "caption_too_many_hashtags" };
  }
  if (rules.maxMentions !== null && (text.match(MENTION)?.length ?? 0) > rules.maxMentions) {
    return { ok: false, code: "caption_too_many_mentions" };
  }
  return { ok: true, caption: { title: rules.separateTitle ? t : "", text } };
}
