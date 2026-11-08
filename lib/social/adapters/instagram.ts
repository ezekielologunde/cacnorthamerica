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
// Polling is bounded so the whole publish fits one Vercel function (60 s on
// Hobby): Meta suggests checking once a minute for up to 5 minutes, which
// can't fit, so we check every POLL_INTERVAL_MS up to POLL_BUDGET_MS. A
// container that isn't FINISHED by then is left unpublished (it expires after
// 24 hours) and the target fails as retryable: nothing was posted, and a
// retry builds a fresh container.
//
// Token lifetime: the long-lived Page token used for Facebook has no expiry
// date (see facebook.ts); when Meta invalidates it the target fails with
// instagram_reconnect_needed.

import { validateVideo } from "../limits.ts";
import { requestJson, field, sleep, type HttpDeps } from "../http.ts";
import type { PlatformAdapter, PlatformCaption, PublishResult, ValidateResult, VideoMeta } from "../types.ts";
import { GRAPH_BASE, GRAPH_ID, bearer, graphFailure } from "./graph.ts";

export type InstagramConfig = { igUserId: string; accessToken: string };

export type InstagramTiming = {
  pollIntervalMs?: number;
  pollBudgetMs?: number;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
};

export const POLL_INTERVAL_MS = 4_000;
export const POLL_BUDGET_MS = 28_000;

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

  async publish(video: VideoMeta, caption: PlatformCaption): Promise<PublishResult> {
    const checked = this.validate(video);
    if (!checked.ok) return { error: checked.code, retryable: false };
    const ig = this.config.igUserId;

    // 1. Container. Creating one posts nothing, so every failure is retryable.
    const created = await this.post(`${ig}/media`, {
      media_type: "REELS",
      video_url: video.url,
      caption: caption.text,
    });
    const containerId = created.kind === "response" && created.status < 300 ? field(created.body, "id") : undefined;
    if (typeof containerId !== "string" || !GRAPH_ID.test(containerId)) {
      return { ...graphFailure("instagram", created, false), retryable: true };
    }

    // 2. Wait for processing, bounded.
    const deadline = this.timing.now() + this.timing.pollBudgetMs;
    for (;;) {
      const res = await requestJson(this.http, `${GRAPH_BASE}/${containerId}?fields=status_code`, {
        method: "GET",
        headers: bearer(this.config.accessToken),
      });
      const status = res.kind === "response" && res.status < 300 ? field(res.body, "status_code") : undefined;
      if (status === "FINISHED") break;
      if (status === "ERROR") return { error: "instagram_processing_failed", retryable: true };
      if (status === "EXPIRED") return { error: "instagram_container_expired", retryable: true };
      // PUBLISHED can't happen (only we publish this container), but if it
      // ever did the post is live: never publish it again.
      if (status === "PUBLISHED") return { error: "instagram_already_published", retryable: false };
      if (res.kind === "response" && res.status >= 400 && res.status < 500) {
        return { ...graphFailure("instagram", res, false), retryable: true };
      }
      // IN_PROGRESS, or a transient failure of the status check itself.
      if (this.timing.now() + this.timing.pollIntervalMs > deadline) {
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
