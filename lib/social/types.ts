// Shared types for the social cross-post feature. Design:
// docs/superpowers/specs/2026-11-08-social-crosspost-design.md
//
// No runtime imports here or in the other pure lib/social modules beyond each
// other (with explicit .ts extensions), so `node --test` can load them
// directly.

export const PLATFORMS = ["facebook", "instagram", "tiktok"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  facebook: "Facebook Page",
  instagram: "Instagram Reels",
  tiktok: "TikTok",
};

export type TargetStatus = "queued" | "posting" | "posted" | "failed" | "skipped";

/** What the server knows about an uploaded video. Read from Cloudinary, never
 *  taken from the browser. Unknown values are null. */
export type VideoMeta = {
  publicId: string;
  url: string;
  bytes: number;
  format: string;
  width: number | null;
  height: number | null;
  durationSec: number | null;
  frameRate?: number | null;
  videoCodec?: string | null;
};

/** The text sent to one platform. Facebook uses both fields; Instagram and
 *  TikTok take a single caption (`text`), with `title` left empty. */
export type PlatformCaption = { title: string; text: string };

export type ValidateResult = { ok: true } | { ok: false; code: string };

/** `retryable` is the adapter's call: true only when the platform said
 *  definitively that nothing was posted. On success, `notice` is an optional
 *  code the admin should see beside the posted status (e.g. TikTok's "posted,
 *  but private until the app is audited"); it is stored in the target's
 *  error_code column and sanitised like any other code. */
export type PublishResult = { id: string; notice?: string } | { error: string; retryable: boolean };

export interface PlatformAdapter {
  readonly platform: Platform;
  validate(video: VideoMeta): ValidateResult;
  publish(video: VideoMeta, caption: PlatformCaption): Promise<PublishResult>;
}

/** A platform credential that rotates (TikTok's refresh token changes on
 *  every refresh, so it can't live in an env var). Stored only encrypted
 *  (lib/social/token-crypto.ts) in cacna.social_credentials. Instants are
 *  epoch milliseconds; `seed` is a fingerprint of the env token the chain
 *  started from, so pasting a new one restarts it. */
export type StoredCredential = {
  accessToken: string;
  accessExpiresAt: number;
  refreshToken: string;
  refreshExpiresAt: number;
  seed?: string;
};

export interface CredentialStore {
  get(platform: Platform): Promise<StoredCredential | null>;
  put(platform: Platform, credential: StoredCredential): Promise<void>;
}

export type SocialSettings = {
  postingEnabled: boolean;
  dryRun: boolean;
  platforms: Record<Platform, boolean>;
};

export type PostRecord = {
  id: string;
  video: VideoMeta;
  title: string;
  caption: string;
  dryRun: boolean;
  submittedBy: string;
  createdAt: string;
};

export type TargetRecord = {
  id: string;
  postId: string;
  platform: Platform;
  status: TargetStatus;
  captionTitle: string;
  captionSent: string;
  platformPostId: string | null;
  errorCode: string | null;
  retryable: boolean;
  attempts: number;
  claimedAt: string | null;
  finishedAt: string | null;
};

export type NewPost = Omit<PostRecord, "id" | "createdAt">;

export type NewTarget = {
  platform: Platform;
  status: "queued" | "skipped";
  captionTitle: string;
  captionSent: string;
  errorCode: string | null;
};

/** Fields a status change may set. */
export type TargetPatch = {
  status: TargetStatus;
  platformPostId?: string | null;
  errorCode?: string | null;
  retryable?: boolean;
  finished?: boolean;
};

/** Persistence the dispatcher needs. The Supabase implementation is
 *  lib/social/supabase-store.ts; tests use an in-memory one with the same
 *  unique keys and conditional updates. */
export interface SocialStore {
  getSettings(): Promise<SocialSettings>;
  findPost(videoPublicId: string, dryRun: boolean): Promise<PostRecord | null>;
  /** Inserts the post, or returns "conflict" when (video_public_id, dry_run)
   *  already exists. */
  insertPost(post: NewPost): Promise<PostRecord | "conflict">;
  /** Inserts the targets, silently skipping any (post_id, platform) that exists. */
  insertTargets(postId: string, targets: NewTarget[]): Promise<void>;
  getPost(id: string): Promise<PostRecord | null>;
  getTarget(id: string): Promise<TargetRecord | null>;
  listTargets(postId: string): Promise<TargetRecord[]>;
  /** Atomically moves the target to `posting` (attempts + 1, claimed_at = now)
   *  if, and only if, its status is in `from` (and, when `requireRetryable`,
   *  retryable is true). Returns true when this caller made the change. */
  claim(targetId: string, from: TargetStatus[], requireRetryable: boolean): Promise<boolean>;
  /** Conditional status change, as `claim`. `olderThan` additionally requires
   *  claimed_at to be at or before that instant. */
  transition(
    targetId: string,
    from: TargetStatus[],
    patch: TargetPatch,
    opts?: { olderThan?: string; requireRetryable?: boolean },
  ): Promise<boolean>;
}
