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
// Safeguards checked here: the master kill switch, dry-run mode and the
// platform toggle are re-read right before every publish; dry runs use the
// fake adapter only, and a real post is never published while dry run is on;
// captions are built per platform and rejected (not truncated) when over the
// limit; error codes are reduced to identifiers before they are stored; each
// action has a time budget, and a platform that can't finish inside it is
// left queued for "Post now" instead of being started.

import { buildCaption, cleanText, cleanTitle } from "./limits.ts";
import { PLATFORMS } from "./types.ts";
import type {
  NewTarget,
  Platform,
  PlatformAdapter,
  PlatformCaption,
  PostRecord,
  PublishContext,
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

/** Wall-clock budget of one action (submit, Retry, Post now). The page's
 *  maxDuration is 300 s, the Vercel Hobby maximum with Fluid compute; 240 s
 *  leaves room for the last in-flight request's own timeout, the status
 *  writes and the page re-render. */
export const ACTION_BUDGET_MS = 240_000;

/** A platform is only started with at least this much budget left. The
 *  longest single platform without polling: Facebook's publish request may
 *  run to its 60 s timeout (facebook.ts); TikTok's whole publish stays under
 *  60 s (three 10 s requests, then 12 s of polling whose last request may
 *  itself take 10 s). Instagram waits only until its own deadline. */
export const PLATFORM_START_MIN_MS = 70_000;

/** Kept back, per platform still to come, from the deadline an adapter is
 *  given, so a long Instagram wait can't starve the platforms after it.
 *  PLATFORM_START_MIN_MS plus slack for the store writes in between. */
export const PLATFORM_RESERVE_MS = 80_000;

/** Skip reasons that come from Settings or configuration rather than from the
 *  video: once the setting changes, "Post now" can queue the target again. */
export const REQUEUE_CODES: readonly string[] = ["platform_disabled", "kill_switch_off", "not_configured", "dry_run_on"];

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

/** True for a target the "Post now" action applies to: still queued (for
 *  example deferred by the time budget), or skipped only because of a setting. */
export function canPostNow(t: Pick<TargetRecord, "status" | "errorCode">): boolean {
  return t.status === "queued" || (t.status === "skipped" && REQUEUE_CODES.includes(t.errorCode ?? ""));
}

/** Why a target must not be published under these settings, or null. */
function blockedBy(settings: SocialSettings, dryRun: boolean, platform: Platform): string | null {
  if (!settings.platforms[platform]) return "platform_disabled";
  // A real post submitted while dry run was off: if dry run has been switched
  // back on since, nothing real may go out (Retry and Post now included).
  if (!dryRun && settings.dryRun) return "dry_run_on";
  if (!dryRun && !settings.postingEnabled) return "kill_switch_off";
  return null;
}

function adapterFor(deps: DispatcherDeps, dryRun: boolean, platform: Platform): PlatformAdapter | null {
  return dryRun ? deps.fakeAdapter(platform) : deps.realAdapter(platform);
}

/** Why a target of this post would be skipped right now, or null. */
function skipReason(deps: DispatcherDeps, settings: SocialSettings, post: PostRecord, platform: Platform): string | null {
  const blocked = blockedBy(settings, post.dryRun, platform);
  if (blocked) return blocked;
  const adapter = adapterFor(deps, post.dryRun, platform);
  if (!adapter) return "not_configured";
  const checked = adapter.validate(post.video);
  return checked.ok ? null : sanitizeErrorCode(checked.code);
}

const nowMs = (deps: DispatcherDeps) => (deps.now?.() ?? new Date()).getTime();

type Budget = { deadline: number };

const newBudget = (deps: DispatcherDeps): Budget => ({ deadline: nowMs(deps) + ACTION_BUDGET_MS });

/** Records an admin's submission and posts it to every enabled platform.
 *  Submitting the same video again returns the existing post and only resumes
 *  targets that are still queued. */
export async function submitPost(deps: DispatcherDeps, input: SubmitInput): Promise<SubmitResult> {
  const budget = newBudget(deps);
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
  await runPost(deps, post.id, budget);
  return { ok: true, postId: post.id, duplicate };
}

function planTargets(deps: DispatcherDeps, settings: SocialSettings, post: PostRecord): NewTarget[] {
  return PLATFORMS.map((platform) => {
    const built = buildCaption(platform, post.title, post.caption);
    const caption: PlatformCaption = built.ok ? built.caption : { title: "", text: "" };
    const reason = built.ok ? skipReason(deps, settings, post, platform) : built.code;
    return {
      platform,
      status: reason ? "skipped" : "queued",
      captionTitle: caption.title,
      captionSent: caption.text,
      errorCode: reason,
    };
  });
}

/** Publishes every target of the post that is still queued, inside the
 *  action's time budget. */
export async function runPost(deps: DispatcherDeps, postId: string, budget: Budget = newBudget(deps)): Promise<void> {
  const post = await deps.store.getPost(postId);
  if (!post) return;
  const queued = (await deps.store.listTargets(postId)).filter((t) => t.status === "queued");
  for (let i = 0; i < queued.length; i++) {
    const later = queued.length - 1 - i;
    await attempt(deps, post, queued[i], "queued", budget.deadline - later * PLATFORM_RESERVE_MS, budget);
  }
}

/** Admin Retry: only a definite (retryable) failure is published again. */
export async function retryTarget(deps: DispatcherDeps, targetId: string): Promise<ActionResult> {
  const budget = newBudget(deps);
  const target = await deps.store.getTarget(targetId);
  if (!target) return { ok: false, code: "target_not_found" };
  if (target.status !== "failed" || !target.retryable) return { ok: false, code: "not_retryable" };
  const post = await deps.store.getPost(target.postId);
  if (!post) return { ok: false, code: "post_not_found" };
  return attempt(deps, post, target, "failed", budget.deadline, budget);
}

/** Admin "Post now": publishes a target that is still queued (deferred by
 *  the time budget, or left by a request that died), or one skipped only
 *  because of a setting that has changed since. A skipped target goes back to
 *  queued with a conditional skipped -> queued update, and only when nothing
 *  would skip it now; the usual claim then decides who publishes. */
export async function postNow(deps: DispatcherDeps, targetId: string): Promise<ActionResult> {
  const budget = newBudget(deps);
  const target = await deps.store.getTarget(targetId);
  if (!target) return { ok: false, code: "target_not_found" };
  if (!canPostNow(target)) return { ok: false, code: "not_applicable" };
  const post = await deps.store.getPost(target.postId);
  if (!post) return { ok: false, code: "post_not_found" };

  if (target.status === "skipped") {
    const reason = skipReason(deps, await deps.store.getSettings(), post, target.platform);
    if (reason) {
      // Still blocked: leave it. If the video now breaks a platform rule
      // (only checked once the setting allowed the platform), say so.
      if (!REQUEUE_CODES.includes(reason)) {
        await deps.store.transition(target.id, ["skipped"], { status: "skipped", errorCode: reason });
      }
      return { ok: false, code: reason };
    }
    if (!(await deps.store.transition(target.id, ["skipped"], { status: "queued", errorCode: null }))) {
      return { ok: false, code: "not_applicable" };
    }
  }
  return attempt(deps, post, { ...target, status: "queued" }, "queued", budget.deadline, budget);
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
    const olderThan = new Date(nowMs(deps) - STALE_POSTING_MS).toISOString();
    changed = await deps.store.transition(target.id, ["posting"], patch, { olderThan });
  }
  return changed ? { ok: true } : { ok: false, code: "not_applicable" };
}

/** One publish of one target. `adapterDeadline` is when the adapter must be
 *  done (the action's deadline minus what is kept for later platforms). */
async function attempt(
  deps: DispatcherDeps,
  post: PostRecord,
  target: TargetRecord,
  from: "queued" | "failed",
  adapterDeadline: number,
  budget: Budget,
): Promise<ActionResult> {
  // Fresh read: the kill switch, dry run or a toggle may have changed since
  // submit, or since the previous platform in this same run.
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

  // Never start a platform the action can't finish: it stays queued, with a
  // note, for "Post now" (or a resubmit) to pick up.
  if (budget.deadline - nowMs(deps) < PLATFORM_START_MIN_MS) {
    if (from === "queued") {
      await deps.store.transition(target.id, ["queued"], { status: "queued", errorCode: "deferred_time_budget" });
    }
    return { ok: false, code: "deferred_time_budget" };
  }

  if (!(await deps.store.claim(target.id, [from], from === "failed"))) {
    return { ok: false, code: "already_claimed" };
  }

  const ctx: PublishContext = {
    deadline: adapterDeadline,
    containerId: sanitizePostId(target.containerId),
    async saveContainer(id) {
      const value = id === null ? null : sanitizePostId(id);
      if (id !== null && value === null) throw new Error("container id rejected");
      if (!(await deps.store.setContainer(target.id, value))) throw new Error("container id not saved");
    },
  };

  let result: PublishResult;
  try {
    result = await adapter.publish(post.video, { title: target.captionTitle, text: target.captionSent }, ctx);
  } catch {
    // Outcome unknown: the post may exist. Never retried until an admin
    // confirms it isn't there (markNotPosted).
    result = { error: "adapter_exception", retryable: false };
  }

  if ("id" in result) {
    await deps.store.transition(target.id, ["posting"], {
      status: "posted",
      platformPostId: sanitizePostId(result.id),
      // A success notice (e.g. "posted as private") is shown beside the
      // posted status; it passes the same identifier check as error codes.
      errorCode: result.notice ? sanitizeErrorCode(result.notice) : null,
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
