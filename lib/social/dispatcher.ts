// The cross-post state machine. Design and the state diagram:
// docs/superpowers/specs/2026-11-08-social-crosspost-design.md
//
// Per target: queued -> posting -> posted | failed, or queued -> skipped.
// A failed target goes back to posting only through an admin Retry, and only
// when the failure was definite (retryable). The move into `posting` is an
// atomic conditional update (SocialStore.claim): whoever makes it publishes,
// everyone else publishes nothing. That claim, plus the unique keys on
// (video, dry_run) and (post, platform), is what stops a double click, a
// second tab or a resubmit from posting twice.
//
// Safeguards checked here: the master kill switch and the platform toggle are
// re-read right before every publish; dry runs use the fake adapter only;
// captions are built per platform and rejected (not truncated) when over the
// limit; error codes are reduced to identifiers before they are stored.

import { buildCaption, cleanText, cleanTitle } from "./limits.ts";
import { PLATFORMS } from "./types.ts";
import type {
  NewTarget,
  Platform,
  PlatformAdapter,
  PlatformCaption,
  PostRecord,
  PublishResult,
  SocialSettings,
  SocialStore,
  TargetRecord,
  VideoMeta,
} from "./types.ts";

export type DispatcherDeps = {
  store: SocialStore;
  /** The real adapter for a platform, or null while it isn't built or configured. */
  realAdapter: (platform: Platform) => PlatformAdapter | null;
  /** The adapter dry runs use. Must never touch the network. */
  fakeAdapter: (platform: Platform) => PlatformAdapter;
  now?: () => Date;
};

export type SubmitInput = { video: VideoMeta; title: string; caption: string; submittedBy: string };

export type SubmitResult =
  | { ok: true; postId: string; duplicate: boolean }
  | { ok: false; code: string; platform?: Platform };

export type ActionResult = { ok: true } | { ok: false; code: string };

/** A target stuck in `posting` this long may be released by an admin who has
 *  checked the platform (markNotPosted). Never released automatically. */
export const STALE_POSTING_MS = 15 * 60 * 1000;

const ERROR_CODE = /^[a-z0-9_]{1,64}$/;
const PLATFORM_POST_ID = /^[A-Za-z0-9_:.~-]{1,128}$/;

/** Only short identifiers are ever stored: anything else (a message that
 *  might echo a token, a URL, free text) becomes "unrecognised_error". */
export function sanitizeErrorCode(code: unknown): string {
  if (typeof code !== "string") return "unrecognised_error";
  const c = code.trim().toLowerCase();
  return ERROR_CODE.test(c) ? c : "unrecognised_error";
}

function sanitizePostId(id: unknown): string | null {
  return typeof id === "string" && PLATFORM_POST_ID.test(id) ? id : null;
}

/** Why a target must not be published under these settings, or null. */
function blockedBy(settings: SocialSettings, dryRun: boolean, platform: Platform): string | null {
  if (!settings.platforms[platform]) return "platform_disabled";
  if (!dryRun && !settings.postingEnabled) return "kill_switch_off";
  return null;
}

function adapterFor(deps: DispatcherDeps, dryRun: boolean, platform: Platform): PlatformAdapter | null {
  return dryRun ? deps.fakeAdapter(platform) : deps.realAdapter(platform);
}

/** Records an admin's submission and posts it to every enabled platform.
 *  Submitting the same video again returns the existing post and only resumes
 *  targets that are still queued. */
export async function submitPost(deps: DispatcherDeps, input: SubmitInput): Promise<SubmitResult> {
  const title = cleanTitle(input.title);
  const caption = cleanText(input.caption);
  // Checked for every platform, enabled or not, so turning a platform on
  // later can't expose a caption it would reject.
  for (const platform of PLATFORMS) {
    const built = buildCaption(platform, title, caption);
    if (!built.ok) return { ok: false, code: built.code, platform };
  }

  const settings = await deps.store.getSettings();
  const dryRun = settings.dryRun;

  let post = await deps.store.findPost(input.video.publicId, dryRun);
  let duplicate = post !== null;
  if (!post) {
    const inserted = await deps.store.insertPost({
      video: input.video,
      title,
      caption,
      dryRun,
      submittedBy: input.submittedBy,
    });
    if (inserted === "conflict") {
      post = await deps.store.findPost(input.video.publicId, dryRun);
      duplicate = true;
    } else {
      post = inserted;
    }
  }
  if (!post) return { ok: false, code: "post_not_found" };

  // Also run for a duplicate: if the first request died between the two
  // inserts, this fills in the missing targets. Existing ones are kept as is.
  await deps.store.insertTargets(post.id, planTargets(deps, settings, post));
  await runPost(deps, post.id);
  return { ok: true, postId: post.id, duplicate };
}

function planTargets(deps: DispatcherDeps, settings: SocialSettings, post: PostRecord): NewTarget[] {
  return PLATFORMS.map((platform) => {
    const built = buildCaption(platform, post.title, post.caption);
    const caption: PlatformCaption = built.ok ? built.caption : { title: "", text: "" };
    let reason = built.ok ? blockedBy(settings, post.dryRun, platform) : built.code;
    if (!reason) {
      const adapter = adapterFor(deps, post.dryRun, platform);
      if (!adapter) reason = "not_configured";
      else {
        const checked = adapter.validate(post.video);
        if (!checked.ok) reason = sanitizeErrorCode(checked.code);
      }
    }
    return {
      platform,
      status: reason ? "skipped" : "queued",
      captionTitle: caption.title,
      captionSent: caption.text,
      errorCode: reason,
    };
  });
}

/** Publishes every target of the post that is still queued. */
export async function runPost(deps: DispatcherDeps, postId: string): Promise<void> {
  const post = await deps.store.getPost(postId);
  if (!post) return;
  for (const target of await deps.store.listTargets(postId)) {
    if (target.status !== "queued") continue;
    await attempt(deps, post, target, "queued");
  }
}

/** Admin Retry: only a definite (retryable) failure is published again. */
export async function retryTarget(deps: DispatcherDeps, targetId: string): Promise<ActionResult> {
  const target = await deps.store.getTarget(targetId);
  if (!target) return { ok: false, code: "target_not_found" };
  if (target.status !== "failed" || !target.retryable) return { ok: false, code: "not_retryable" };
  const post = await deps.store.getPost(target.postId);
  if (!post) return { ok: false, code: "post_not_found" };
  return attempt(deps, post, target, "failed");
}

/** An admin has checked the platform and the video is not there: a target
 *  whose outcome was unknown (failed and not retryable, or stuck in posting
 *  for STALE_POSTING_MS) becomes a retryable failure. */
export async function markNotPosted(deps: DispatcherDeps, targetId: string): Promise<ActionResult> {
  const target = await deps.store.getTarget(targetId);
  if (!target) return { ok: false, code: "target_not_found" };
  const patch = {
    status: "failed" as const,
    errorCode: "admin_confirmed_not_posted",
    retryable: true,
    finished: true,
  };
  let changed = false;
  if (target.status === "failed" && !target.retryable) {
    changed = await deps.store.transition(target.id, ["failed"], patch);
  } else if (target.status === "posting") {
    const now = (deps.now?.() ?? new Date()).getTime();
    const olderThan = new Date(now - STALE_POSTING_MS).toISOString();
    changed = await deps.store.transition(target.id, ["posting"], patch, { olderThan });
  }
  return changed ? { ok: true } : { ok: false, code: "not_applicable" };
}

async function attempt(
  deps: DispatcherDeps,
  post: PostRecord,
  target: TargetRecord,
  from: "queued" | "failed",
): Promise<ActionResult> {
  // Fresh read: the kill switch or a toggle may have changed since submit,
  // or since the previous platform in this same run.
  const settings = await deps.store.getSettings();
  const blocked = blockedBy(settings, post.dryRun, target.platform);
  const adapter = blocked ? null : adapterFor(deps, post.dryRun, target.platform);
  const reason = blocked ?? (adapter ? null : "not_configured");
  if (reason || !adapter) {
    if (from === "queued") {
      await deps.store.transition(target.id, ["queued"], {
        status: "skipped",
        errorCode: reason,
        finished: true,
      });
    }
    return { ok: false, code: reason ?? "not_configured" };
  }

  if (!(await deps.store.claim(target.id, [from], from === "failed"))) {
    return { ok: false, code: "already_claimed" };
  }

  let result: PublishResult;
  try {
    result = await adapter.publish(post.video, { title: target.captionTitle, text: target.captionSent });
  } catch {
    // Outcome unknown: the post may exist. Never retried until an admin
    // confirms it isn't there (markNotPosted).
    result = { error: "adapter_exception", retryable: false };
  }

  if ("id" in result) {
    await deps.store.transition(target.id, ["posting"], {
      status: "posted",
      platformPostId: sanitizePostId(result.id),
      errorCode: null,
      retryable: false,
      finished: true,
    });
    return { ok: true };
  }

  const code = sanitizeErrorCode(result.error);
  await deps.store.transition(target.id, ["posting"], {
    status: "failed",
    errorCode: code,
    retryable: result.retryable === true,
    finished: true,
  });
  return { ok: false, code };
}
