import "server-only";
import type { Database } from "@/types/database.types";
import type { createServiceClient } from "@/lib/supabase/server";
import type {
  NewPost,
  NewTarget,
  Platform,
  PostRecord,
  SocialSettings,
  SocialStore,
  TargetPatch,
  TargetRecord,
  TargetStatus,
} from "./types";
import { parseTikTokChoices } from "./tiktok-choices.ts";

// The SocialStore over cacna.social_* (migration 0027). Must be given the
// service-role client: the tables have RLS forced with no policies.
//
// claim/transition are single conditional UPDATEs (`... WHERE id = $1 AND
// status IN (...)`) returning the changed row. Postgres re-checks the WHERE
// after waiting on a concurrent writer's row lock, so of two racing claims
// exactly one gets a row back.

/** The service-role client (lib/supabase/server.ts). */
export type ServiceClient = ReturnType<typeof createServiceClient>;
type Client = ServiceClient;
type PostRow = Database["cacna"]["Tables"]["social_posts"]["Row"];
type TargetRow = Database["cacna"]["Tables"]["social_post_targets"]["Row"];
type TargetUpdate = Database["cacna"]["Tables"]["social_post_targets"]["Update"];

const UNIQUE_VIOLATION = "23505";

/** Stored choices are re-checked on the way out; anything malformed reads as
 *  none, so TikTok is skipped rather than posted with a guess. */
function tiktokChoices(v: unknown) {
  const parsed = parseTikTokChoices(v);
  return parsed.ok ? parsed.choices : null;
}

function toPost(r: PostRow): PostRecord {
  return {
    id: r.id,
    video: {
      publicId: r.video_public_id,
      url: r.video_url,
      bytes: r.video_bytes,
      format: r.video_format,
      width: r.video_width,
      height: r.video_height,
      durationSec: r.video_duration_s,
      frameRate: r.video_frame_rate,
      videoCodec: r.video_codec,
    },
    title: r.title,
    caption: r.caption,
    dryRun: r.dry_run,
    tiktok: tiktokChoices(r.tiktok_choices),
    submittedBy: r.submitted_by,
    createdAt: r.created_at,
  };
}

export function toTarget(r: TargetRow): TargetRecord {
  return {
    id: r.id,
    postId: r.post_id,
    platform: r.platform as Platform,
    status: r.status as TargetStatus,
    captionTitle: r.caption_title,
    captionSent: r.caption_sent,
    platformPostId: r.platform_post_id,
    containerId: r.platform_container_id,
    errorCode: r.error_code,
    retryable: r.retryable,
    attempts: r.attempts,
    claimedAt: r.claimed_at,
    finishedAt: r.finished_at,
  };
}

/** Settings as stored; a missing row reads as "everything off, dry run on". */
export async function readSocialSettings(db: Client): Promise<SocialSettings> {
  const { data, error } = await db.from("social_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(`social_settings read failed: ${error.code}`);
  return {
    postingEnabled: data?.posting_enabled ?? false,
    dryRun: data?.dry_run ?? true,
    platforms: {
      facebook: data?.facebook_enabled ?? false,
      instagram: data?.instagram_enabled ?? false,
      tiktok: data?.tiktok_enabled ?? false,
    },
  };
}

export function supabaseSocialStore(db: Client): SocialStore {
  const fail = (what: string, code: string | undefined): never => {
    throw new Error(`social store ${what} failed: ${code ?? "unknown"}`);
  };

  async function getTarget(id: string): Promise<TargetRecord | null> {
    const { data, error } = await db.from("social_post_targets").select("*").eq("id", id).maybeSingle();
    if (error) fail("getTarget", error.code);
    return data ? toTarget(data) : null;
  }

  return {
    getSettings: () => readSocialSettings(db),

    async findPost(videoPublicId, dryRun) {
      const { data, error } = await db.from("social_posts").select("*")
        .eq("video_public_id", videoPublicId).eq("dry_run", dryRun).maybeSingle();
      if (error) fail("findPost", error.code);
      return data ? toPost(data) : null;
    },

    async insertPost(p: NewPost) {
      const { data, error } = await db.from("social_posts").insert({
        video_public_id: p.video.publicId,
        video_url: p.video.url,
        video_bytes: p.video.bytes,
        video_format: p.video.format,
        video_width: p.video.width,
        video_height: p.video.height,
        video_duration_s: p.video.durationSec,
        video_frame_rate: p.video.frameRate ?? null,
        video_codec: p.video.videoCodec ?? null,
        title: p.title,
        caption: p.caption,
        dry_run: p.dryRun,
        tiktok_choices: p.tiktok,
        submitted_by: p.submittedBy,
      }).select("*").single();
      if (error?.code === UNIQUE_VIOLATION) return "conflict";
      if (error || !data) return fail("insertPost", error?.code);
      return toPost(data);
    },

    async insertTargets(postId: string, targets: NewTarget[]) {
      const now = new Date().toISOString();
      const { error } = await db.from("social_post_targets").upsert(
        targets.map((t) => ({
          post_id: postId,
          platform: t.platform,
          status: t.status,
          caption_title: t.captionTitle,
          caption_sent: t.captionSent,
          error_code: t.errorCode,
          finished_at: t.status === "skipped" ? now : null,
        })),
        { onConflict: "post_id,platform", ignoreDuplicates: true },
      );
      if (error) fail("insertTargets", error.code);
    },

    async getPost(id) {
      const { data, error } = await db.from("social_posts").select("*").eq("id", id).maybeSingle();
      if (error) fail("getPost", error.code);
      return data ? toPost(data) : null;
    },

    getTarget,

    async listTargets(postId) {
      const { data, error } = await db.from("social_post_targets").select("*")
        .eq("post_id", postId).order("platform");
      if (error) fail("listTargets", error.code);
      return (data ?? []).map(toTarget);
    },

    async claim(id, from, requireRetryable) {
      // attempts is read first; the conditional update below is still the
      // only thing that decides who wins.
      const current = await getTarget(id);
      if (!current) return false;
      const now = new Date().toISOString();
      let q = db.from("social_post_targets").update({
        status: "posting",
        attempts: current.attempts + 1,
        claimed_at: now,
        error_code: null,
        retryable: false,
        updated_at: now,
      }).eq("id", id).in("status", from);
      if (requireRetryable) q = q.eq("retryable", true);
      const { data, error } = await q.select("id");
      if (error) fail("claim", error.code);
      return (data ?? []).length === 1;
    },

    async transition(id, from, patch: TargetPatch, opts = {}) {
      const now = new Date().toISOString();
      const update: TargetUpdate = { status: patch.status, updated_at: now };
      if ("platformPostId" in patch) update.platform_post_id = patch.platformPostId ?? null;
      if ("errorCode" in patch) update.error_code = patch.errorCode ?? null;
      if ("retryable" in patch) update.retryable = patch.retryable ?? false;
      if (patch.finished) update.finished_at = now;
      let q = db.from("social_post_targets").update(update).eq("id", id).in("status", from);
      if (opts.requireRetryable) q = q.eq("retryable", true);
      if (opts.olderThan) q = q.lte("claimed_at", opts.olderThan);
      const { data, error } = await q.select("id");
      if (error) fail("transition", error.code);
      return (data ?? []).length === 1;
    },

    async setContainer(id, containerId) {
      const { data, error } = await db.from("social_post_targets")
        .update({ platform_container_id: containerId, updated_at: new Date().toISOString() })
        .eq("id", id).eq("status", "posting").select("id");
      if (error) fail("setContainer", error.code);
      return (data ?? []).length === 1;
    },
  };
}
