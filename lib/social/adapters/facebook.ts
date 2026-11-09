// Facebook Page video adapter.
//
// POST /{page_id}/videos with `file_url` (an "accessible URL of a video
// file"), `title`, `description` and `published=true`; the response carries
// the video `id`. Needs a Page access token from someone with the
// CREATE_CONTENT task, plus pages_manage_posts, pages_read_engagement and
// pages_show_list. https://developers.facebook.com/docs/graph-api/reference/page/videos/
//
// Facebook downloads and processes the file after answering, so a returned id
// means the upload was accepted; processing problems after that show up on
// the Page, not here.
//
// Token lifetime: a Page access token obtained from a long-lived User token
// has no expiration date and is only invalidated under certain conditions
// (https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived),
// e.g. the person losing their Page role. Then publishes fail with
// facebook_reconnect_needed and the owner pastes a new token into
// FACEBOOK_PAGE_ACCESS_TOKEN.

import { validateVideo } from "../limits.ts";
import { requestJson, field, type HttpDeps } from "../http.ts";
import type { PlatformAdapter, PlatformCaption, PublishResult, ValidateResult, VideoMeta } from "../types.ts";
import { GRAPH_BASE, GRAPH_ID, bearer, graphFailure } from "./graph.ts";

export type FacebookConfig = { pageId: string; pageAccessToken: string };

/** Timeout of the publish request. The Page videos reference doesn't say how
 *  long a `file_url` request takes to answer, and Facebook may fetch part or
 *  all of the file (up to UPLOAD_MAX_BYTES, 100 MB) before it does. A timeout
 *  here is an unknown outcome that an admin must check by hand, so it waits
 *  well past the 10 s default; 60 s fits the dispatcher's
 *  PLATFORM_START_MIN_MS (70 s) with room for the status write. */
export const PUBLISH_TIMEOUT_MS = 60_000;

export class FacebookAdapter implements PlatformAdapter {
  readonly platform = "facebook" as const;
  private readonly config: FacebookConfig;
  private readonly http: HttpDeps;
  private readonly publishTimeoutMs: number;

  constructor(config: FacebookConfig, http: HttpDeps, timing: { publishTimeoutMs?: number } = {}) {
    if (!GRAPH_ID.test(config.pageId)) throw new Error("facebook: invalid page id");
    this.config = config;
    this.http = http;
    this.publishTimeoutMs = timing.publishTimeoutMs ?? PUBLISH_TIMEOUT_MS;
  }

  validate(video: VideoMeta): ValidateResult {
    return validateVideo("facebook", video);
  }

  async publish(video: VideoMeta, caption: PlatformCaption): Promise<PublishResult> {
    const checked = this.validate(video);
    if (!checked.ok) return { error: checked.code, retryable: false };

    const body = new URLSearchParams({
      file_url: video.url,
      title: caption.title,
      description: caption.text,
      published: "true",
    });
    const res = await requestJson(this.http, `${GRAPH_BASE}/${this.config.pageId}/videos`, {
      method: "POST",
      headers: { ...bearer(this.config.pageAccessToken), "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }, this.publishTimeoutMs);
    const id = res.kind === "response" && res.status < 300 ? field(res.body, "id") : undefined;
    if (typeof id === "string" && GRAPH_ID.test(id)) return { id };
    // This request is the one that publishes, so an unclear outcome is not
    // retryable.
    return graphFailure("facebook", res, true);
  }
}
