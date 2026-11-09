// TikTok adapter (Content Posting API, Direct Post).
//
//   1. POST /v2/post/publish/creator_info/query/: privacy_level_options and
//      max_video_post_duration_sec for the connected account.
//      https://developers.tiktok.com/doc/content-posting-api-reference-query-creator-info
//   2. POST /v2/post/publish/video/init/ with post_info {title, privacy_level}
//      and source_info {source: PULL_FROM_URL, video_url}; returns publish_id.
//      https://developers.tiktok.com/doc/content-posting-api-reference-direct-post
//   3. POST /v2/post/publish/status/fetch/ {publish_id}, bounded polling, until
//      PUBLISH_COMPLETE or FAILED.
//      https://developers.tiktok.com/doc/content-posting-api-reference-get-video-status
//
// PULL_FROM_URL only accepts a URL under a domain or URL prefix verified in
// the developer portal and doesn't follow redirects
// (https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide),
// so the video goes out as TIKTOK_PULL_URL_PREFIX + <id>.<format>: a cacna.org
// path that next.config.ts rewrites (proxies, no redirect) to Cloudinary.
//
// Per-post choices: TikTok's Content Sharing Guidelines make the poster
// choose the privacy level (no default), the comment/duet/stitch settings
// (off by default) and the commercial content disclosure, and consent, for
// every post (lib/social/tiktok-choices.ts cites them). The admin makes
// those choices on the upload form; they reach this adapter as
// PublishContext.tiktok and are sent exactly as chosen. Without them
// (missing or malformed) nothing is requested at all. They are re-checked
// against fresh creator info before init: a privacy level the account no
// longer offers, or an interaction the creator has since switched off, is
// refused rather than changed.
//
// Privacy while unaudited: "All content posted by unaudited clients will be
// restricted to private viewing mode", and an unaudited client asking for
// anything else is refused with
// unaudited_client_can_only_post_to_private_accounts. Until the owner sets
// TIKTOK_APP_AUDITED=true the form offers only SELF_ONLY, anything else is
// refused here (tiktok_unaudited_private_only), and the target is marked
// posted with the notice tiktok_private_unaudited.
//
// Tokens (https://developers.tiktok.com/doc/oauth-user-access-token-management):
// the access token lives 2 hours, the refresh token 180 days, and every
// refresh returns a new refresh token that replaces the old one. So the
// refresh token can't live in an env var: TIKTOK_REFRESH_TOKEN only seeds the
// chain, after which the current pair is kept encrypted in
// cacna.social_credentials (CredentialStore). Pasting a different
// TIKTOK_REFRESH_TOKEN restarts the chain from it (that is how the owner
// reconnects). When the refresh token is expired or refused, targets fail
// with tiktok_reconnect_needed. Refresh:
// https://developers.tiktok.com/docs/en/oauth-refresh-a-user-access-token
// Concurrent refreshes are serialised by a compare-and-swap lease on the
// credential row (accessToken below; migration 0028).

import { createHash } from "node:crypto";
import { UPLOAD_FOLDER, validateVideo } from "../limits.ts";
import { requestJson, field, sleep, type HttpDeps, type HttpResult } from "../http.ts";
import {
  choicesRefusedBy,
  parseTikTokChoices,
  postInfoFields,
  TIKTOK_PRIVACY_LEVELS,
  type TikTokCreatorInfo,
  type TikTokPrivacyLevel,
} from "../tiktok-choices.ts";
import type {
  CredentialRecord,
  CredentialStore,
  PlatformAdapter,
  PlatformCaption,
  PublishContext,
  PublishResult,
  StoredCredential,
  ValidateResult,
  VideoMeta,
} from "../types.ts";

const API = "https://open.tiktokapis.com/v2";
const JSON_HEADERS = { "Content-Type": "application/json; charset=UTF-8" };
/** Refresh this long before the access token's stated expiry. */
const REFRESH_MARGIN_MS = 5 * 60 * 1000;
const PUBLISH_ID = /^[A-Za-z0-9_:.~-]{1,64}$/;
/** How long a refresh lease lasts: the refresh request's own 10 s timeout
 *  plus the store writes. A waiting request polls every LEASE_POLL_MS. */
export const LEASE_MS = 15_000;
export const LEASE_POLL_MS = 1_000;
const MAX_CAS_LOSSES = 3;

export const POLL_INTERVAL_MS = 3_000;
export const POLL_BUDGET_MS = 12_000;

export type TikTokConfig = {
  clientKey: string;
  clientSecret: string;
  /** TIKTOK_REFRESH_TOKEN: seeds (or restarts) the refresh-token chain. */
  bootstrapRefreshToken: string | null;
  /** The verified URL prefix TikTok pulls from, https and ending in "/". */
  pullUrlPrefix: string;
  /** TIKTOK_APP_AUDITED=true once TikTok has audited the app. */
  audited: boolean;
  credentials: CredentialStore;
};

export type TikTokTiming = {
  pollIntervalMs?: number;
  pollBudgetMs?: number;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
};

type Failure = { error: string; retryable: boolean };

// Documented error.code values (direct post, creator info, status fetch).
// Each one is a definite refusal: nothing was posted.
const KNOWN_CODES: Record<string, string> = {
  access_token_invalid: "tiktok_token_rejected",
  scope_not_authorized: "tiktok_scope_missing",
  spam_risk_too_many_posts: "tiktok_daily_post_limit",
  spam_risk_user_banned_from_posting: "tiktok_user_banned_from_posting",
  reached_active_user_cap: "tiktok_active_user_cap",
  unaudited_client_can_only_post_to_private_accounts: "tiktok_unaudited_client",
  url_ownership_unverified: "tiktok_url_not_verified",
  privacy_level_option_mismatch: "tiktok_privacy_level_unavailable",
  invalid_param: "tiktok_invalid_request",
  rate_limit_exceeded: "tiktok_rate_limited",
};

/** Maps a failed request to a fixed identifier. Only `error.code` is read,
 *  and only to look it up in KNOWN_CODES; `error.message` and the rest of the
 *  body are never used. */
function tiktokFailure(res: HttpResult, mayHavePosted: boolean): Failure {
  const unclear = (name: string): Failure => ({ error: `tiktok_${name}`, retryable: !mayHavePosted });
  if (res.kind === "timeout") return unclear("timeout");
  if (res.kind === "network") return unclear("network_error");
  const code = field(res.body, "error", "code");
  if (typeof code === "string" && Object.hasOwn(KNOWN_CODES, code)) {
    return { error: KNOWN_CODES[code], retryable: true };
  }
  if (res.status >= 500) return unclear("server_error");
  if (res.status >= 400) return { error: "tiktok_api_error", retryable: true };
  return unclear("unexpected_response");
}

function fingerprint(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex").slice(0, 16);
}

export class TikTokAdapter implements PlatformAdapter {
  readonly platform = "tiktok" as const;
  private readonly config: TikTokConfig;
  private readonly http: HttpDeps;
  private readonly timing: Required<TikTokTiming>;

  constructor(config: TikTokConfig, http: HttpDeps, timing: TikTokTiming = {}) {
    if (!/^https:\/\/[^\s?#]+\/$/.test(config.pullUrlPrefix)) throw new Error("tiktok: invalid pull url prefix");
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
    return validateVideo("tiktok", video);
  }

  /** Whether TIKTOK_APP_AUDITED is set (the form offers only SELF_ONLY until then). */
  get audited(): boolean {
    return this.config.audited;
  }

  /** Fresh creator info for the upload form ("must retrieve the latest
   *  creator info when rendering the Post to TikTok page"). Read-only: it
   *  posts nothing, though it may refresh the token. */
  async creatorInfo(): Promise<{ info: TikTokCreatorInfo } | Failure> {
    const auth = await this.accessToken();
    if ("error" in auth) return auth;
    return this.queryCreator(auth.token);
  }

  private async queryCreator(token: string): Promise<{ info: TikTokCreatorInfo } | Failure> {
    const res = await this.call(token, "post/publish/creator_info/query/");
    if (res.kind !== "response" || field(res.body, "error", "code") !== "ok") {
      const failure = tiktokFailure(res, false);
      if (failure.error === "tiktok_token_rejected") await this.dropAccessToken();
      return { ...failure, retryable: true };
    }
    const data = (k: string) => field(res.body, "data", k);
    const options = data("privacy_level_options");
    const nickname = data("creator_nickname");
    const max = data("max_video_post_duration_sec");
    return {
      info: {
        nickname: typeof nickname === "string" ? nickname.slice(0, 100) : "",
        privacyOptions: Array.isArray(options)
          ? TIKTOK_PRIVACY_LEVELS.filter((p: TikTokPrivacyLevel) => options.includes(p))
          : [],
        commentDisabled: data("comment_disabled") === true,
        duetDisabled: data("duet_disabled") === true,
        stitchDisabled: data("stitch_disabled") === true,
        maxDurationSec: typeof max === "number" ? max : null,
      },
    };
  }

  /** The URL TikTok pulls the video from (under the verified prefix). */
  pullUrl(video: VideoMeta): string {
    const id = video.publicId.slice(UPLOAD_FOLDER.length + 1);
    return `${this.config.pullUrlPrefix}${id}.${video.format.toLowerCase()}`;
  }

  /** A usable access token, refreshing (and storing the rotated pair) when
   *  the stored one is about to expire.
   *
   *  Refreshes are serialised: a refresh spends the refresh token, so two
   *  requests refreshing at once would leave one of them holding a dead token
   *  (and could void the other's). Only the request that wins the store's
   *  compare-and-swap lease calls TikTok; one that loses re-reads, waits for
   *  the holder's pair to land (at most LEASE_MS) and uses it. A lease left by
   *  a request that died simply expires. */
  private async accessToken(): Promise<{ token: string } | Failure> {
    const seed = this.config.bootstrapRefreshToken;
    const seedPrint = seed ? fingerprint(seed) : undefined;
    const waitUntil = this.timing.now() + LEASE_MS + LEASE_POLL_MS;
    let casLosses = 0;

    for (;;) {
      let record: CredentialRecord | null;
      try {
        record = await this.config.credentials.get("tiktok");
      } catch {
        return { error: "tiktok_token_store_unavailable", retryable: true };
      }
      const now = this.timing.now();
      const stored = record?.credential ?? null;
      // A newly pasted TIKTOK_REFRESH_TOKEN restarts the chain.
      const chain = stored && (!seedPrint || stored.seed === seedPrint) ? stored : null;
      if (chain && chain.accessExpiresAt - REFRESH_MARGIN_MS > now) return { token: chain.accessToken };

      if (record?.leaseUntil != null && record.leaseUntil > now) {
        // Another request is refreshing right now: wait for its pair rather
        // than spend the same refresh token.
        if (now + LEASE_POLL_MS > waitUntil) return { error: "tiktok_token_refresh_busy", retryable: true };
        await this.timing.sleep(LEASE_POLL_MS);
        continue;
      }

      const refreshToken = chain ? chain.refreshToken : seed;
      if (!refreshToken || (chain && chain.refreshExpiresAt <= now)) {
        return { error: "tiktok_reconnect_needed", retryable: true };
      }

      let leased: number | null;
      try {
        leased = await this.config.credentials.lease("tiktok", record?.version ?? null, now + LEASE_MS);
      } catch {
        return { error: "tiktok_token_store_unavailable", retryable: true };
      }
      if (leased === null) {
        // Lost the compare-and-swap: someone else is refreshing (or just
        // did). Re-read and use theirs.
        if (++casLosses > MAX_CAS_LOSSES) return { error: "tiktok_token_refresh_busy", retryable: true };
        continue;
      }
      return this.refresh(refreshToken, leased, now, chain?.seed ?? seedPrint);
    }
  }

  /** The refresh itself, by the lease holder only. */
  private async refresh(refreshToken: string, version: number, now: number, seed: string | undefined): Promise<{ token: string } | Failure> {
    const res = await requestJson(this.http, `${API}/oauth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: this.config.clientKey,
        client_secret: this.config.clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });
    if (res.kind !== "response") return { error: "tiktok_token_refresh_failed", retryable: true };
    const access = field(res.body, "access_token");
    const refresh = field(res.body, "refresh_token");
    const expiresIn = field(res.body, "expires_in");
    const refreshExpiresIn = field(res.body, "refresh_expires_in");
    if (
      res.status >= 300 ||
      typeof access !== "string" || !access ||
      typeof refresh !== "string" || !refresh ||
      typeof expiresIn !== "number" || typeof refreshExpiresIn !== "number"
    ) {
      // An OAuth error body ({error, error_description, log_id}) means the
      // refresh token was refused: the owner has to authorise again.
      return field(res.body, "error") !== undefined
        ? { error: "tiktok_reconnect_needed", retryable: true }
        : { error: "tiktok_token_refresh_failed", retryable: true };
    }

    const next: StoredCredential = {
      accessToken: access,
      accessExpiresAt: now + expiresIn * 1000,
      refreshToken: refresh,
      refreshExpiresAt: now + refreshExpiresIn * 1000,
      seed,
    };
    let saved = false;
    try {
      saved = await this.config.credentials.put("tiktok", next, version);
    } catch {
      saved = false;
    }
    // The old refresh token is spent; without the new one stored, the next
    // refresh would fail. Stop here rather than post with a chain we lose.
    if (!saved) return { error: "tiktok_token_save_failed", retryable: true };
    return { token: access };
  }

  /** After TikTok rejects the access token, forget it so the next attempt
   *  refreshes instead of reusing it. Conditional on the version read, and
   *  skipped while a refresh holds the lease (its pair replaces the token
   *  anyway; overwriting would make the holder's save fail). */
  private async dropAccessToken(): Promise<void> {
    try {
      const record = await this.config.credentials.get("tiktok");
      if (!record?.credential) return;
      if (record.leaseUntil != null && record.leaseUntil > this.timing.now()) return;
      await this.config.credentials.put("tiktok", { ...record.credential, accessExpiresAt: 0 }, record.version);
    } catch {
      // Best effort: the stored token expires within 2 hours anyway.
    }
  }

  private call(token: string, path: string, body?: unknown) {
    return requestJson(this.http, `${API}/${path}`, {
      method: "POST",
      headers: { ...JSON_HEADERS, Authorization: `Bearer ${token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  async publish(video: VideoMeta, caption: PlatformCaption, ctx?: PublishContext): Promise<PublishResult> {
    const checked = this.validate(video);
    if (!checked.ok) return { error: checked.code, retryable: false };
    // The admin's own choices, or nothing is sent. Not retryable: they are
    // stored with the post, so a retry would be refused the same way.
    const chosen = parseTikTokChoices(ctx?.tiktok);
    if (!chosen.ok) return { error: chosen.code, retryable: false };
    const choices = chosen.choices;

    const auth = await this.accessToken();
    if ("error" in auth) return auth;

    // 1. Creator info: allowed privacy levels, interaction settings and the
    // account's max duration, checked against the admin's choices.
    const creator = await this.queryCreator(auth.token);
    if ("error" in creator) return creator;
    const { info } = creator;
    if (info.maxDurationSec !== null && video.durationSec != null && video.durationSec > info.maxDurationSec) {
      return { error: "video_too_long", retryable: false };
    }
    const refused = choicesRefusedBy(choices, info, this.config.audited);
    if (refused) return { error: refused, retryable: true };

    // 2. Init. This is the request that posts.
    const init = await this.call(auth.token, "post/publish/video/init/", {
      post_info: { title: caption.text, ...postInfoFields(choices) },
      source_info: { source: "PULL_FROM_URL", video_url: this.pullUrl(video) },
    });
    const publishId = init.kind === "response" && field(init.body, "error", "code") === "ok"
      ? field(init.body, "data", "publish_id")
      : undefined;
    if (typeof publishId !== "string" || !PUBLISH_ID.test(publishId)) {
      if (init.kind === "response" && field(init.body, "error", "code") === "ok") {
        return { error: "tiktok_unexpected_response", retryable: false };
      }
      const failure = tiktokFailure(init, true);
      if (failure.error === "tiktok_token_rejected") await this.dropAccessToken();
      return failure;
    }

    // 3. Status, bounded. TikTok downloads and processes asynchronously; if
    // it hasn't finished in time the target is posted with a "still
    // processing" notice (never re-sent: TikTok has the post).
    const privateNote = this.config.audited ? undefined : "tiktok_private_unaudited";
    const deadline = this.timing.now() + this.timing.pollBudgetMs;
    for (;;) {
      const res = await this.call(auth.token, "post/publish/status/fetch/", { publish_id: publishId });
      const status = res.kind === "response" ? field(res.body, "data", "status") : undefined;
      if (status === "PUBLISH_COMPLETE") return privateNote ? { id: publishId, notice: privateNote } : { id: publishId };
      if (status === "FAILED") return { error: "tiktok_publish_failed", retryable: true };
      if (this.timing.now() + this.timing.pollIntervalMs > deadline) {
        return { id: publishId, notice: privateNote ? "tiktok_processing_private" : "tiktok_processing" };
      }
      await this.timing.sleep(this.timing.pollIntervalMs);
    }
  }
}
