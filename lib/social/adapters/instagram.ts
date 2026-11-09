// Instagram Reels adapter (Instagram API with Facebook Login).
//
// Content publishing, https://developers.facebook.com/docs/instagram-platform/content-publishing:
//   1. POST /<IG_ID>/media with media_type=REELS, video_url (public at the
//      time of the request) and caption; the response `id` is the container.
//   2. GET /<IG_CONTAINER_ID>?fields=status_code: EXPIRED, ERROR, FINISHED,
//      IN_PROGRESS or PUBLISHED.
//   3. POST /<IG_ID>/media_publish with creation_id; the response `id` is the
//      published media.
// Caption and the other parameters:
// https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media
// Needs a Facebook Page access token with instagram_basic,
// instagram_content_publish and pages_read_engagement; 100 API-published posts
// per 24 hours (checked by Meta on media_publish).
//
// One container per target. Its id is saved on the target (ctx.saveContainer)
// right after it is created and before any waiting, so if processing outlasts
// this call (or the function dies) the next attempt polls the same container
// (ctx.containerId) and publishes it once FINISHED; no second container is
// made. The only exception is a container Meta reports as EXPIRED or ERROR:
// it can never be published, so its id is cleared and the next attempt starts
// over with a new one (no risk of a double post).
//
// Polling: Meta suggests checking "once per minute, for no more than 5
// minutes". We check every POLL_INTERVAL_MS (30 s, so twice that rate, about
// ten checks in Meta's window) and stop at the earlier of POLL_BUDGET_MS (5
// minutes) and the dispatcher's deadline, keeping room for one more status
// check and the publish request. An unfinished container fails as
// retryable (nothing was posted); Retry resumes it.
//
// Token lifetime: the long-lived Page token used for Facebook has no expiry
// date (see facebook.ts); when Meta invalidates it the target fails with
// instagram_reconnect_needed.

import { validateVideo } from "../limits.ts";
import { DEFAULT_TIMEOUT_MS, requestJson, field, sleep, type HttpDeps } from "../http.ts";
import type {
  PlatformAdapter,
  PlatformCaption,
  PublishContext,
  PublishResult,
  ValidateResult,
  VideoMeta,
} from "../types.ts";
import { GRAPH_BASE, GRAPH_ID, bearer, graphFailure } from "./graph.ts";

export type InstagramConfig = { igUserId: string; accessToken: string };

export type InstagramTiming = {
  pollIntervalMs?: number;
  pollBudgetMs?: number;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
};

export const POLL_INTERVAL_MS = 30_000;
export const POLL_BUDGET_MS = 5 * 60_000;

export class InstagramAdapter implements PlatformAdapter {
  readonly platform = "instagram" as const;
  private readonly config: InstagramConfig;
  private readonly http: HttpDeps;
  private readonly timing: Required<InstagramTiming>;

  constructor(config: InstagramConfig, http: HttpDeps, timing: InstagramTiming = {}) {
    if (!GRAPH_ID.test(config.igUserId)) throw new Error("instagram: invalid user id");
    this.config = config;
    this.http = http;
    this.timing = {
      pollIntervalMs: timing.pollIntervalMs ?? POLL_INTERVAL_MS,
      pollBudgetMs: timing.pollBudgetMs ?? POLL_BUDGET_MS,
      sleep: timing.sleep ?? sleep,
      now: timing.now ?? Date.now,
    };
  }

  validate(video: VideoMeta): ValidateResult {
    return validateVideo("instagram", video);
  }

  private post(path: string, params: Record<string, string>) {
    return requestJson(this.http, `${GRAPH_BASE}/${path}`, {
      method: "POST",
      headers: { ...bearer(this.config.accessToken), "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params),
    });
  }

  async publish(video: VideoMeta, caption: PlatformCaption, ctx?: PublishContext): Promise<PublishResult> {
    const checked = this.validate(video);
    if (!checked.ok) return { error: checked.code, retryable: false };
    const ig = this.config.igUserId;
    const started = this.timing.now();
    const context: PublishContext = ctx ?? {
      deadline: started + this.timing.pollBudgetMs,
      containerId: null,
      saveContainer: async () => {},
      tiktok: null,
    };

    // 1. The container: the one an earlier attempt saved, or a new one.
    let containerId = context.containerId;
    if (containerId !== null && !GRAPH_ID.test(containerId)) {
      // Not something we saved (ids are numeric); never replace it silently.
      return { error: "instagram_unexpected_response", retryable: false };
    }
    if (containerId === null) {
      // Creating a container posts nothing, so every failure is retryable.
      const created = await this.post(`${ig}/media`, {
        media_type: "REELS",
        video_url: video.url,
        caption: caption.text,
      });
      const id = created.kind === "response" && created.status < 300 ? field(created.body, "id") : undefined;
      if (typeof id !== "string" || !GRAPH_ID.test(id)) {
        return { ...graphFailure("instagram", created, false), retryable: true };
      }
      try {
        await context.saveContainer(id);
      } catch {
        // Unsaved, a retry would have to create a second container. Stop and
        // let an admin release it (nothing has been published).
        return { error: "instagram_container_save_failed", retryable: false };
      }
      containerId = id;
    }

    // 2. Wait for processing, bounded by Meta's window and our deadline, with
    // room left for one more status check and the publish request.
    const tail = 2 * (this.http.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    const waitUntil = Math.min(context.deadline, started + this.timing.pollBudgetMs) - tail;
    for (;;) {
      const res = await requestJson(this.http, `${GRAPH_BASE}/${containerId}?fields=status_code`, {
        method: "GET",
        headers: bearer(this.config.accessToken),
      });
      const status = res.kind === "response" && res.status < 300 ? field(res.body, "status_code") : undefined;
      if (status === "FINISHED") break;
      if (status === "ERROR" || status === "EXPIRED") {
        // Unpublishable for good: forget it so the next attempt starts over.
        try {
          await context.saveContainer(null);
        } catch {
          // Then the next attempt sees the same status and clears it again.
        }
        return status === "ERROR"
          ? { error: "instagram_processing_failed", retryable: true }
          : { error: "instagram_container_expired", retryable: true };
      }
      // Only we publish this container: PUBLISHED means an earlier
      // media_publish went through even though its answer was lost. The Reel
      // is live; never publish it again.
      if (status === "PUBLISHED") return { error: "instagram_already_published", retryable: false };
      if (res.kind === "response" && res.status >= 400 && res.status < 500) {
        return { ...graphFailure("instagram", res, false), retryable: true };
      }
      // IN_PROGRESS, or a transient failure of the status check itself.
      if (this.timing.now() + this.timing.pollIntervalMs > waitUntil) {
        return { error: "instagram_processing_timeout", retryable: true };
      }
      await this.timing.sleep(this.timing.pollIntervalMs);
    }

    // 3. Publish. This is the request that makes the Reel public.
    const published = await this.post(`${ig}/media_publish`, { creation_id: containerId });
    const mediaId = published.kind === "response" && published.status < 300 ? field(published.body, "id") : undefined;
    if (typeof mediaId === "string" && GRAPH_ID.test(mediaId)) return { id: mediaId };
    return graphFailure("instagram", published, true);
  }
}
