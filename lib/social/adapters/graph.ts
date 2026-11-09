// Shared Meta Graph API pieces for the Facebook Page and Instagram adapters.
//
// Host: graph.facebook.com, the Facebook Login host for both Page videos and
// Instagram publishing (https://developers.facebook.com/docs/instagram-platform/content-publishing).
// The graph-video.facebook.com host is deprecated
// (https://developers.facebook.com/docs/video-api/overview).
// Version: v27.0, the current version of the Page videos reference
// (https://developers.facebook.com/docs/graph-api/reference/page/videos/).
//
// The token travels only in the Authorization header ("Authorization: Bearer
// <ACCESS_TOKEN>", as in the content-publishing examples), never in a URL.

import { field, type HttpResult } from "../http.ts";

export const GRAPH_BASE = "https://graph.facebook.com/v27.0";

/** Graph node ids (Page, IG user, container, media) are numeric strings.
 *  Anything else is refused before it can reach a URL path. */
export const GRAPH_ID = /^[0-9]{1,32}$/;

export type Failure = { error: string; retryable: boolean };

export function bearer(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

const RECONNECT_SUBCODES = new Set([458, 460, 463, 467, 492]);
const CHECKPOINT_SUBCODES = new Set([459, 464]);

function int(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < 1e10 ? value : null;
}

/** Maps a failed Graph request to a fixed identifier. Only the numeric
 *  `error.code` and `error.error_subcode` are read; `message`,
 *  `error_user_msg` and the rest of the body never leave this function.
 *
 *  `mayHavePosted`: true for the request that creates the public post
 *  (Page /videos, IG /media_publish). When its outcome is unclear (timeout,
 *  network, 5xx, "unknown" codes 1 and 2) the failure is not retryable, so it
 *  is never re-sent until an admin has checked the platform.
 *
 *  Codes and actions: https://developers.facebook.com/docs/graph-api/guides/error-handling */
export function graphFailure(prefix: "facebook" | "instagram", res: HttpResult, mayHavePosted: boolean): Failure {
  const unclear = (name: string): Failure => ({ error: `${prefix}_${name}`, retryable: !mayHavePosted });
  const definite = (name: string, retryable = true): Failure => ({ error: `${prefix}_${name}`, retryable });

  if (res.kind === "timeout") return unclear("timeout");
  if (res.kind === "network") return unclear("network_error");

  const code = int(field(res.body, "error", "code"));
  const sub = int(field(res.body, "error", "error_subcode"));
  const type = field(res.body, "error", "type");

  if (code === null) {
    if (type === "OAuthException") return definite("reconnect_needed");
    return res.status >= 500 ? unclear("server_error") : unclear("unexpected_response");
  }
  // 190 access token expired/invalid, 102 session; OAuth subcodes 458 app not
  // installed, 460 password changed, 463 expired, 467 invalid, 492 no Page role.
  if (code === 190 || code === 102 || (sub !== null && RECONNECT_SUBCODES.has(sub))) return definite("reconnect_needed");
  // 459 checkpointed, 464 unconfirmed: the person must log in to Facebook.
  if (sub !== null && CHECKPOINT_SUBCODES.has(sub)) return definite("account_checkpoint");
  if (code === 10 || (code >= 200 && code <= 299)) return definite("permission_missing");
  if (code === 4 || code === 17 || code === 341) return definite("rate_limited");
  if (code === 368) return definite("policy_blocked");
  // 506: an identical post was just published, so ours may well be live.
  if (code === 506) return definite("duplicate_post", false);
  if (code === 1 || code === 2) return unclear("platform_unavailable");
  return definite(sub !== null ? `api_error_${code}_${sub}` : `api_error_${code}`);
}
