# Social cross-post: upload once in admin, post to Facebook, Instagram, TikTok

Date: 2026-11-08. Status: task 1 (core, fake adapter) and task 2 (real adapters, see the end)
built on `feat/social-crosspost`; neither has run against a real platform yet.

## Goal

Staff upload one video plus a title and caption in `/admin/social`. The site then posts it,
without a further approval step, to the church's Facebook Page, Instagram (as a Reel) and
TikTok. X and YouTube are out of scope for v1.

Because posting is fully automatic, these safeguards are part of the core, not extras:

| | Safeguard | Where |
|---|---|---|
| a | Master kill switch (default OFF) and per-platform toggles (default OFF) | `social_settings`, re-read before every single publish |
| b | Dry-run mode (default ON): the whole pipeline runs with `FakeAdapter`, and the post log records the exact caption and video that would have gone out | `social_settings.dry_run`, `social_posts.dry_run`, `social_post_targets.caption_sent` |
| c | Idempotency: one post per (video, platform); retries and double clicks never double-post | unique `(video_public_id, dry_run)` on posts, unique `(post_id, platform)` on targets, atomic status claim in the dispatcher |
| d | Post log with per-platform status `queued / posting / posted / failed / skipped`, platform post id, sanitised error code | `social_post_targets`, shown on `/admin/social` |
| e | Nothing posts unless an admin submitted that video | the only entry point that creates a post is the `submitVideo` server action; there is no cron, webhook or public route that creates or publishes posts |
| f | Captions cleaned and length-limited per platform | `lib/social/limits.ts` `buildCaption` |
| g | Only `requireAdmin()` server actions can sign uploads, submit, retry or change settings; CSRF-safe; rate-limited | `app/admin/(protected)/social/actions.ts` |

## Architecture

```
browser (admin)                        server action (Vercel function)              Cloudinary            platforms
---------------                        -------------------------------              ----------            ---------
1. signVideoUpload() ────────────────▶ requireAdmin, rate limit, sign fixed params
2. POST chunks (20 MB each) ─────────────────────────────────────────────────────▶ video/upload
   ◀────────────────────────────────────────────────────────── public_id (social/...)
3. submitVideo(public_id, title,  ───▶ requireAdmin, rate limit
   caption)                            read metadata from Cloudinary Admin API ───▶ resources/video/upload/<id>
                                       dispatcher.submitPost
                                         ├ settings, captions, per-platform video checks
                                         ├ insert post + targets (idempotent)
                                         └ runPost: per target, claim, then adapter.publish ────────────▶ FB / IG / TikTok
                                                                                                          (task 2; fake now)
4. the page re-renders the post log
```

The video bytes never pass through a Vercel function (the ~4.5 MB request body limit makes that
impossible for video). The browser uploads straight to Cloudinary; the server only ever handles the
Cloudinary `public_id` and reads the metadata back from Cloudinary itself, so the browser can't
lie about size, format or URL.

`lib/social/`:

- `types.ts`: platform list, statuses, `VideoMeta`, the `PlatformAdapter` interface
  (`validate(video)`, `publish(video, caption)` returning `{ id }` or `{ error, retryable }`), and
  the `SocialStore` interface the dispatcher talks to.
- `limits.ts`: per-platform video rules and caption rules (pure, unit-tested).
- `dispatcher.ts`: the state machine (`submitPost`, `runPost`, `retryTarget`, `markNotPosted`).
  It takes the store and adapters as arguments, so tests run it against an in-memory store.
- `fake-adapter.ts`: `FakeAdapter`, used for dry runs and tests. Never touches the network.
- `adapters.ts`: the real-adapter registry. Task 1 has none, so a real (non-dry-run) post with a
  platform switched on is recorded as `skipped / not_configured`.
- `supabase-store.ts`: the `SocialStore` over the `cacna` schema via the service-role client.
- `cloudinary.ts`: signs the upload parameters and reads a video's metadata (server only).

## Data model (migration `0026_social_crosspost.sql`, written, not applied)

- `social_settings`: a single row (`id = 1`). `posting_enabled` (master kill switch, default
  false), `dry_run` (default true), `facebook_enabled`, `instagram_enabled`, `tiktok_enabled`
  (default false), `updated_at`, `updated_by`.
- `social_posts`: one per submitted video. Cloudinary `video_public_id` and `video_url`, the
  metadata read from Cloudinary (bytes, format, width, height, duration), `title`, `caption`,
  `dry_run` (frozen at submit time), `submitted_by`, `created_at`. Unique
  `(video_public_id, dry_run)`: the same upload can be dry-run once and posted for real once.
- `social_post_targets`: one per (post, platform), unique `(post_id, platform)`. `status`,
  `caption_sent` (exactly what was or would be sent), `platform_post_id`, `error_code` (checked
  against `^[a-z0-9_]{1,64}$` so no free text, token or URL can land there), `retryable`,
  `attempts`, `claimed_at`, `finished_at`, `updated_at`.

All three: RLS enabled and forced, no policies, all privileges revoked from `anon` and
`authenticated`, granted to `service_role` only. The admin pages read them through the
service-role client after `requireAdmin()`. No platform token is stored in these tables; tokens
live in server env vars (task 2). If a refreshable token ever has to be stored, it goes in an
encrypted column readable only by the service role, decided in task 2.

## State machine (per target)

```
            platform off / kill switch off / no adapter / video breaks platform rules
 queued ───────────────────────────────────────────────────────────────────────────▶ skipped
   │ claim (atomic: UPDATE ... WHERE status = 'queued')
   ▼
 posting ──── publish ok ────▶ posted   (terminal: never published again)
   │
   └──── publish error ──────▶ failed (retryable true|false, error_code)
                                  │ admin Retry, only if retryable
                                  │ claim (atomic: WHERE status = 'failed' AND retryable)
                                  ▼
                               posting ...
```

- The claim is the idempotency point: whoever's conditional `UPDATE` changes the row publishes;
  everyone else (a double click, a second tab, a resubmit of the same video) gets zero rows and
  publishes nothing. Postgres re-checks the `WHERE` after waiting on a concurrent writer's row
  lock, so two concurrent claims can't both win.
- Resubmitting the same video returns the existing post and only resumes targets still `queued`
  (for example if the first request died before reaching them).
- The kill switch and the platform toggle are re-read immediately before each publish, so turning
  the switch off mid-run stops the remaining platforms.
- A thrown adapter error, a timeout or a lost response means the outcome is unknown: the post may
  exist. Those land as `failed` with `retryable = false`. A target stuck in `posting` (the
  function died mid-publish) stays there. Neither is ever retried automatically. After checking
  the platform by hand, an admin presses "Not posted, allow retry" (`markNotPosted`), which sets
  `failed / retryable = true` (code `admin_confirmed_not_posted`); only then can Retry run. A
  `posting` row can only be released this way once it is 15 minutes old.
- Errors the platform reports definitively (bad parameter, rate limit, expired token) are
  `retryable` as the adapter decides.

## Large-file path (decided from the docs)

| Option | Per-file cap | Public https URL for Instagram | Already in repo |
|---|---|---|---|
| Cloudinary signed direct upload | Free 100 MB, Plus 2 GB, Advanced 4 GB per video ([compare plans](https://cloudinary.com/pricing/compare-plans)) | yes, `res.cloudinary.com` | yes: API key and secret, signing pattern, `res.cloudinary.com` in CSP |
| Supabase Storage signed upload URL | Free 50 MB, Pro up to 500 GB ([file limits](https://supabase.com/docs/guides/storage/uploads/file-limits)) | only from a public bucket | no buckets in use |

Decision: **Cloudinary**, direct from the browser, signed by a `requireAdmin()` server action.
The signature covers fixed values only (`folder=social`, `allowed_formats=mp4,mov`,
`timestamp`); no `public_id`, so Cloudinary generates a fresh id and an upload can never replace
an existing asset. Uploads go in chunks (`X-Unique-Upload-Id`, `Content-Range`; every chunk but
the last over 5 MB; files over 100 MB must be chunked:
[chunked upload](https://cloudinary.com/documentation/upload_images#chunked_asset_upload)), 20 MB
per chunk, so the same code works after a plan upgrade. The site's cap is
`UPLOAD_MAX_BYTES = 100 MB` in `lib/social/limits.ts`, matching the Free plan; raise it only after
confirming the account's plan. CSP `connect-src` gains `https://api.cloudinary.com`.

How each platform gets the video (task 2):

- **Instagram Reels**: `POST graph.facebook.com/<IG_ID>/media` with `media_type=REELS`,
  `video_url` = the Cloudinary https URL, `caption`; poll the container's `status_code` until
  `FINISHED`, then `POST /<IG_ID>/media_publish` with `creation_id`
  ([IG media](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media),
  [content publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing)).
- **Facebook Page**: `POST /<PAGE_ID>/videos` with `file_url` = the Cloudinary URL, `title`,
  `description` ([Page videos](https://developers.facebook.com/docs/graph-api/reference/page/videos/));
  the alternative is the Resumable Upload API
  ([publishing](https://developers.facebook.com/docs/video-api/guides/publishing)). Meta has
  deprecated the `graph-video.facebook.com` host; use `graph.facebook.com`
  ([overview](https://developers.facebook.com/docs/video-api/overview)).
- **TikTok**: `PULL_FROM_URL` needs a verified domain or URL prefix and does not follow redirects
  ([media transfer](https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide)),
  so `res.cloudinary.com` can't be used directly. Options for task 2: (1) verify a `cacna.org`
  URL prefix and serve the video through a proxied Vercel rewrite to Cloudinary (not a 3xx
  redirect; confirm the rewrite runs at the edge, not in a function with a body limit), or
  (2) `FILE_UPLOAD` ([direct post](https://developers.tiktok.com/doc/content-posting-api-reference-direct-post)):
  the server streams the file from Cloudinary to TikTok's `upload_url` in 5 to 64 MB chunks,
  which at 100 MB should fit a 60 s function but needs measuring.

### Function time

Hobby functions get 10 to 60 s. Instagram containers need polling ("once per minute, for no more
than 5 minutes") and TikTok publishing is asynchronous
([status fetch](https://developers.tiktok.com/doc/content-posting-api-reference-get-video-status)).
So task 2 must split a real publish into *start* (returns a container or publish id, stored on
the target) and *check* (polls once); the `/admin/social` page polls *check* while it's open, and
the daily cron can sweep what's left. Task 1 keeps the single-call `publish()` the fake needs;
extending it with a pending result is task 2's first step. `maxDuration = 60` is set on the page
so its server actions get the plan's maximum.

## Video and caption limits (validated before posting)

Checks run on the metadata Cloudinary reports (bytes, format, width, height, duration). Codec and
frame-rate rules are checked when the metadata carries them. Cloudinary's docs don't confirm that
the Admin API returns `duration`, codec or frame rate for video, so unknown values pass and the
platform's own check is the backstop (a rejected post becomes a `failed` row, never a silent
loss).

| | Facebook Page | Instagram Reels | TikTok |
|---|---|---|---|
| Container | mp4 (the resumable-upload doc lists mp4 as the video type) | mp4, mov | mp4, webm, mov |
| Codec | not documented | H.264, HEVC | H.264, H.265, VP8, VP9 |
| Max size | not documented in the developer docs | 300 MB | 4 GB |
| Duration | not documented | 3 s to 15 min | up to 10 min (and the creator's `max_video_post_duration_sec`) |
| Frame rate | not documented | 23 to 60 fps | 23 to 60 fps |
| Dimensions | not documented | width up to 1920, aspect 0.01:1 to 10:1 (9:16 recommended) | 360 to 4096 px each side |
| Caption | title up to 100 and text up to 2200 (our own caps; Meta documents none) | up to 2200 chars, 30 hashtags, 20 @ tags | `title` up to 2200 UTF-16 units |

Effective cap today: 100 MB (Cloudinary Free). A `.mov` file is skipped on Facebook until the
`file_url` path is confirmed to accept it (task 2).

Caption handling (`buildCaption`): Unicode NFC; control characters (except newline and tab) and
bidi-override characters removed; CRLF normalised; three or more line breaks collapsed to two;
trimmed. Facebook gets `title` and `description` separately; Instagram and TikTok get
`title + blank line + caption`. Over-limit text is rejected at submit (the admin edits it), never
silently truncated. A video that breaks one platform's rules skips only that platform
(`skipped / video_*` code); the others still post.

## Failure modes

| Failure | Result |
|---|---|
| Double click, two tabs, resubmit | same post returned; claims stop a second publish |
| Function times out mid-publish | target stays `posting`; admin checks the platform, then "Not posted, allow retry" |
| Adapter throws, network drop | `failed`, `retryable=false`, `adapter_exception`; same manual confirm |
| Platform rejects (definite) | `failed` with the sanitised code; Retry if `retryable` |
| Kill switch off at submit or flipped mid-run | remaining targets `skipped / kill_switch_off` |
| Platform toggle off | `skipped / platform_disabled` |
| Real posting on, adapter not built or not configured | `skipped / not_configured` |
| Cloudinary metadata unreachable, or public id outside `social/` | submit refused, nothing stored |
| Caption too long, too many hashtags or tags | submit refused with the reason, nothing stored |
| Rate limit hit | action refused (in-memory per-instance limiter, `lib/rateLimit.ts`) |
| Upload abandoned before submit | orphaned Cloudinary asset in `social/`, never posted (e) |

## Security notes

- Platform tokens: server env only (task 2), never sent to the client, never logged, never in an
  error code (codes are regex-checked identifiers; adapter messages are never stored).
- Server actions get Next's Origin/Host CSRF check and each runs `requireAdmin()` itself; the
  sign action signs only fixed values; `submitVideo` takes a `public_id` that must match
  `^social/[A-Za-z0-9_-]+$` and reads the URL from Cloudinary, never from the client.
- The tables are service-role only (RLS forced, no policies).

## Owner setup checklist (before switching real posting on)

1. Apply migration `0026_social_crosspost.sql` (default state: everything off, dry run on).
2. Confirm the Cloudinary plan; if above Free, raise `UPLOAD_MAX_BYTES`.
3. **Meta**: create a Meta developer app (Business type). The Instagram account must be a
   professional (Business or Creator) account linked to the church's Facebook Page; complete
   Page Publishing Authorization if the Page requires it. Request `pages_show_list`,
   `pages_read_engagement`, `pages_manage_posts` (Page videos) and `instagram_basic`,
   `instagram_content_publish` (Reels); a live app needs Meta App Review for Advanced Access.
   Generate a long-lived Page access token from a person with the CREATE_CONTENT task on the
   Page. Instagram allows 100 API-published posts per 24 h (the carousel section says 50; check
   `content_publishing_limit`).
4. **TikTok**: create an app on TikTok for Developers, add the Content Posting API, enable Direct
   Post, get `video.publish` approved and authorise the church account via Login Kit. Until
   TikTok audits the app every post is private ("All content posted by unaudited clients will be
   restricted to private viewing mode"), so plan the audit before relying on TikTok. If using
   `PULL_FROM_URL`, verify the `cacna.org` domain or URL prefix in the portal.
5. Put the tokens in Vercel env vars (names and lifetimes in `.env.example`), never in code or in
   the database in clear. Apply migration 0027 and set `SOCIAL_TOKEN_ENCRYPTION_KEY` before TikTok.
6. Run a dry run from `/admin/social` and check the log; then switch on one platform at a time
   with dry run off.

## Out of scope / later

Real adapters and the start/check split (task 2), cron sweep, X, YouTube, scheduling, editing or
deleting a published post, cleanup of orphaned uploads.

## Task 2: real adapters (built, not yet run against a real platform)

`lib/social/adapters/{facebook,instagram,tiktok}.ts`, wired in `lib/social/adapters.ts` from
server env vars only (names in `.env.example`). A platform with missing or malformed variables has
no adapter and is logged `skipped / not_configured`. Every request goes through
`lib/social/http.ts`: per-request timeout (10 s), `redirect: "error"`, and no error text is ever
passed on. Each adapter re-validates the video first, then maps every failure to a fixed
identifier; only numeric Graph codes or documented TikTok `error.code` values are read, never
`message`. Tokens travel only in the `Authorization` header (or the TikTok token request body),
never in a URL. Tests: `lib/social/adapters.test.mjs`, fake fetch only.

`PublishResult` gained an optional success `notice` (stored in `error_code` beside `posted`), so
"posted, but private" is visible rather than silent.

| | Facebook Page | Instagram Reels | TikTok |
|---|---|---|---|
| Calls | `POST /{page}/videos` `file_url,title,description,published` | `POST /{ig}/media` (REELS) → poll `status_code` → `POST /{ig}/media_publish` | refresh token if needed → `creator_info/query` → `video/init` (PULL_FROM_URL) → poll `status/fetch` |
| Polling | none (Facebook processes after accepting) | every 4 s, at most 28 s; unfinished → `instagram_processing_timeout`, retryable, nothing published | every 3 s, at most 12 s; unfinished → posted with notice `tiktok_processing[_private]` |
| Token | long-lived Page token, no expiry date | same Page token (default) | access 2 h, refresh 180 days, refresh token rotates every refresh |
| When it lapses | `facebook_reconnect_needed`: new `FACEBOOK_PAGE_ACCESS_TOKEN` | `instagram_reconnect_needed` | `tiktok_reconnect_needed`: new `TIKTOK_REFRESH_TOKEN` (restarts the chain); settings page shows the expiry date |

Retryable rules: a definite error response means nothing was posted (retryable). For the request
that makes the post public (Page `/videos`, `media_publish`, TikTok `init`), a timeout, network
error, 5xx or Graph code 1/2 is an unknown outcome (not retryable; the admin checks the platform
first). Graph 506 (duplicate post) is never retryable.

TikTok specifics:

- Rotating refresh token: `TIKTOK_REFRESH_TOKEN` seeds the chain; the current pair is then kept in
  `cacna.social_credentials` (migration 0027), sealed with AES-256-GCM under
  `SOCIAL_TOKEN_ENCRYPTION_KEY` (`lib/social/token-crypto.ts`, platform as AAD). A different
  env token (by fingerprint) restarts the chain. If the rotated pair can't be saved, the post
  stops (`tiktok_token_save_failed`).
- Privacy: unaudited (`TIKTOK_APP_AUDITED` not `true`) sends `SELF_ONLY` and marks the target
  `posted` with notice `tiktok_private_unaudited`. Audited sends `PUBLIC_TO_EVERYONE` (or
  `FOLLOWER_OF_CREATOR` for a private account) if the creator info offers it.
- Video source: `TIKTOK_PULL_URL_PREFIX` + `<id>.<ext>`, which `next.config.ts` serves through an
  external rewrite `/social-video/:file` → `res.cloudinary.com/<cloud>/video/upload/social/:file`
  (mp4/mov, one path segment; `proxy.ts` skips dotted paths). The prefix must be verified in the
  TikTok portal.
- `publish_id` may contain `~`; migration 0027 widens 0026's `platform_post_id` check to match the
  dispatcher.

Still open: the start/check split (polling across requests, cron sweep) is not built: each
publish is bounded inside one call, so a worst-case run of all three platforms can approach the
60 s Hobby limit. The rewrite's behaviour with a 100 MB file on Vercel, Facebook's acceptance of
`.mov` via `file_url`, and every real request are unverified until credentials exist.
