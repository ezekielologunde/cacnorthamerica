import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { FacebookAdapter, PUBLISH_TIMEOUT_MS as FB_PUBLISH_TIMEOUT_MS } from "./adapters/facebook.ts";
import { InstagramAdapter } from "./adapters/instagram.ts";
import { DEFAULT_TIMEOUT_MS } from "./http.ts";
import { TikTokAdapter } from "./adapters/tiktok.ts";
import { GRAPH_BASE } from "./adapters/graph.ts";
import { encryptSecret, decryptSecret, parseKey } from "./token-crypto.ts";

// Every request goes to a scripted fake fetch: nothing here can reach a real
// platform. Each step is a JSON response, "hang" (never answers, so the
// adapter's timeout fires) or "network" (fetch rejects).

const PAGE_TOKEN = "EAAB-page-token-SECRET-1111";
const TT_SECRET = "tt-client-secret-SECRET-2222";
const TT_SEED = "rft-seed-SECRET-3333";
const TT_ACCESS = "act-access-SECRET-4444";
const TT_REFRESH2 = "rft-rotated-SECRET-5555";
const TITLE = "Sunday service CAPTION-TITLE-MARK";
const TEXT = "Join us live CAPTION-TEXT-MARK #CACNA";
const PREFIX = "https://cacna.org/social-video/";

const VIDEO = {
  publicId: "social/abc123",
  url: "https://res.cloudinary.com/demo/video/upload/v1/social/abc123.mp4",
  bytes: 20 * 1024 * 1024,
  format: "mp4",
  width: 1080,
  height: 1920,
  durationSec: 42,
};

function mockFetch(steps) {
  const calls = [];
  const fn = async (url, init = {}) => {
    calls.push({ url, init });
    const step = steps.shift();
    if (!step) throw new Error(`unexpected request to ${url}`);
    if (step === "hang") {
      return new Promise((_, reject) => init.signal.addEventListener("abort", () => reject(init.signal.reason)));
    }
    if (step === "network") throw new TypeError(`fetch failed ${url} Bearer ${PAGE_TOKEN}`);
    if (step.delayMs) {
      // Answers late (or not at all, if the request's timeout fires first).
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, step.delayMs);
        init.signal.addEventListener("abort", () => { clearTimeout(timer); reject(init.signal.reason); });
      });
    }
    return new Response(JSON.stringify(step.body ?? {}), {
      status: step.status ?? 200,
      headers: { "content-type": "application/json" },
    });
  };
  fn.calls = calls;
  return fn;
}

const http = (fetch) => ({ fetch, timeoutMs: 25 });
const form = (call) => new URLSearchParams(call.init.body);
const json = (call) => JSON.parse(call.init.body);

function fakeClock(start = 1_800_000_000_000) {
  let t = start;
  return { now: () => t, sleep: async (ms) => { t += ms; } };
}

const tick = () => new Promise((r) => setImmediate(r));

// In-memory CredentialStore with the migration's compare-and-swap semantics:
// every write succeeds only at the version last read. Each method yields
// first, so concurrent callers genuinely interleave.
function memoryCredentials(initial = null) {
  const store = {
    value: initial ? { ...initial } : null,
    exists: initial !== null,
    version: initial ? 1 : 0,
    leaseUntil: null,
    puts: 0,
    leases: 0,
    failPut: false,
  };
  return {
    store,
    async get() {
      await tick();
      if (!store.exists) return null;
      return { credential: store.value ? { ...store.value } : null, version: store.version, leaseUntil: store.leaseUntil };
    },
    async lease(_platform, version, until) {
      await tick();
      if (version === null ? store.exists : !store.exists || store.version !== version) return null;
      store.exists = true;
      store.version = version === null ? 1 : version + 1;
      store.leaseUntil = until;
      store.leases += 1;
      return store.version;
    },
    async put(_platform, cred, version) {
      await tick();
      if (store.failPut) throw new Error("db down");
      if (!store.exists || store.version !== version) return false;
      store.puts += 1;
      store.value = { ...cred };
      store.version += 1;
      store.leaseUntil = null;
      return true;
    },
  };
}

const facebook = (fetch) =>
  new FacebookAdapter({ pageId: "1234567890", pageAccessToken: PAGE_TOKEN }, http(fetch), { publishTimeoutMs: 300 });
const instagram = (fetch, clock = fakeClock()) =>
  new InstagramAdapter({ igUserId: "17841400000000000", accessToken: PAGE_TOKEN }, http(fetch), {
    pollIntervalMs: 4000, pollBudgetMs: 28000, sleep: clock.sleep, now: clock.now,
  });
function tiktok(fetch, opts = {}) {
  const clock = opts.clock ?? fakeClock();
  const credentials = opts.credentials ?? memoryCredentials();
  const adapter = new TikTokAdapter({
    clientKey: "client-key",
    clientSecret: TT_SECRET,
    bootstrapRefreshToken: "seed" in opts ? opts.seed : TT_SEED,
    pullUrlPrefix: PREFIX,
    audited: opts.audited ?? false,
    credentials,
  }, http(fetch), { pollIntervalMs: 3000, pollBudgetMs: 12000, sleep: clock.sleep, now: clock.now });
  return { adapter, credentials, clock };
}

const REFRESH_OK = { body: { access_token: TT_ACCESS, expires_in: 7200, refresh_token: TT_REFRESH2, refresh_expires_in: 15552000, open_id: "o", scope: "video.publish", token_type: "Bearer" } };
const CREATOR_OK = (options = ["PUBLIC_TO_EVERYONE", "MUTUAL_FOLLOW_FRIENDS", "SELF_ONLY"], max = 600) => ({
  body: { data: { privacy_level_options: options, max_video_post_duration_sec: max }, error: { code: "ok", message: "", log_id: "l" } },
});
const INIT_OK = { body: { data: { publish_id: "v_pub_url~v2.123456" }, error: { code: "ok", message: "", log_id: "l" } } };
const STATUS = (status) => ({ body: { data: { status }, error: { code: "ok", message: "", log_id: "l" } } });
const ttError = (status, code) => ({ status, body: { error: { code, message: `bad ${TT_ACCESS} ${TEXT}`, log_id: "l" } } });
const graphError = (status, code, sub) => ({
  status,
  body: { error: { message: `Invalid token ${PAGE_TOKEN} for ${TEXT}`, type: "OAuthException", code, error_subcode: sub, error_user_msg: TITLE, fbtrace_id: "x" } },
});

// ---------- Facebook ----------

test("facebook: success posts file_url, title and description with the token in a header only", async () => {
  const fetch = mockFetch([{ body: { id: "987654321" } }]);
  const res = await facebook(fetch).publish(VIDEO, { title: TITLE, text: TEXT });
  assert.deepEqual(res, { id: "987654321" });
  assert.equal(fetch.calls.length, 1);
  const [call] = fetch.calls;
  assert.equal(call.url, `${GRAPH_BASE}/1234567890/videos`);
  assert.equal(call.init.method, "POST");
  assert.equal(call.init.headers.Authorization, `Bearer ${PAGE_TOKEN}`);
  assert.equal(call.init.redirect, "error");
  const body = form(call);
  assert.equal(body.get("file_url"), VIDEO.url);
  assert.equal(body.get("title"), TITLE);
  assert.equal(body.get("description"), TEXT);
  assert.equal(body.get("published"), "true");
  assert.equal(body.get("access_token"), null);
  assert.ok(!call.url.includes(PAGE_TOKEN));
});

test("facebook: expired token is 'reconnect needed' and retryable; rate limit is retryable; duplicate is not", async () => {
  assert.deepEqual(await facebook(mockFetch([graphError(400, 190, 463)])).publish(VIDEO, { title: TITLE, text: TEXT }),
    { error: "facebook_reconnect_needed", retryable: true });
  assert.deepEqual(await facebook(mockFetch([graphError(400, 4)])).publish(VIDEO, { title: TITLE, text: TEXT }),
    { error: "facebook_rate_limited", retryable: true });
  assert.deepEqual(await facebook(mockFetch([graphError(400, 506)])).publish(VIDEO, { title: TITLE, text: TEXT }),
    { error: "facebook_duplicate_post", retryable: false });
  assert.deepEqual(await facebook(mockFetch([graphError(400, 100, 33)])).publish(VIDEO, { title: TITLE, text: TEXT }),
    { error: "facebook_api_error_100_33", retryable: true });
});

test("facebook: timeout, network failure and 5xx are unknown outcomes (not retryable)", async () => {
  assert.deepEqual(await facebook(mockFetch(["hang"])).publish(VIDEO, { title: TITLE, text: TEXT }),
    { error: "facebook_timeout", retryable: false });
  assert.deepEqual(await facebook(mockFetch(["network"])).publish(VIDEO, { title: TITLE, text: TEXT }),
    { error: "facebook_network_error", retryable: false });
  assert.deepEqual(await facebook(mockFetch([{ status: 502, body: {} }])).publish(VIDEO, { title: TITLE, text: TEXT }),
    { error: "facebook_server_error", retryable: false });
  assert.deepEqual(await facebook(mockFetch([{ status: 200, body: { ok: true } }])).publish(VIDEO, { title: TITLE, text: TEXT }),
    { error: "facebook_unexpected_response", retryable: false });
});

test("facebook: a video it doesn't accept is refused before any request", async () => {
  const fetch = mockFetch([]);
  assert.deepEqual(await facebook(fetch).publish({ ...VIDEO, format: "mov" }, { title: TITLE, text: TEXT }),
    { error: "video_format_unsupported", retryable: false });
  assert.equal(fetch.calls.length, 0);
  assert.throws(() => new FacebookAdapter({ pageId: "../me", pageAccessToken: PAGE_TOKEN }, http(fetch)), (err) => !String(err).includes(PAGE_TOKEN));
});

test("facebook: the publish request waits longer than the default request timeout", async () => {
  // Other requests time out after 25 ms here; publishing gets its own, longer timeout.
  const fetch = mockFetch([{ delayMs: 120, body: { id: "987654321" } }]);
  assert.deepEqual(await facebook(fetch).publish(VIDEO, { title: TITLE, text: TEXT }), { id: "987654321" });
  assert.ok(FB_PUBLISH_TIMEOUT_MS > DEFAULT_TIMEOUT_MS);
});

// ---------- Instagram ----------

test("instagram: container, polling until FINISHED, then media_publish", async () => {
  const fetch = mockFetch([
    { body: { id: "1790000000001" } },
    { body: { status_code: "IN_PROGRESS", id: "1790000000001" } },
    { body: { status_code: "FINISHED", id: "1790000000001" } },
    { body: { id: "1790000000999" } },
  ]);
  const res = await instagram(fetch).publish(VIDEO, { title: "", text: `${TITLE}\n\n${TEXT}` });
  assert.deepEqual(res, { id: "1790000000999" });
  const [create, poll1, , publish] = fetch.calls;
  assert.equal(create.url, `${GRAPH_BASE}/17841400000000000/media`);
  assert.equal(form(create).get("media_type"), "REELS");
  assert.equal(form(create).get("video_url"), VIDEO.url);
  assert.equal(form(create).get("caption"), `${TITLE}\n\n${TEXT}`);
  assert.equal(poll1.url, `${GRAPH_BASE}/1790000000001?fields=status_code`);
  assert.equal(publish.url, `${GRAPH_BASE}/17841400000000000/media_publish`);
  assert.equal(form(publish).get("creation_id"), "1790000000001");
  for (const c of fetch.calls) {
    assert.equal(c.init.headers.Authorization, `Bearer ${PAGE_TOKEN}`);
    assert.ok(!c.url.includes(PAGE_TOKEN));
  }
});

test("instagram: polling is bounded; an unfinished container is never published and the failure is retryable", async () => {
  const steps = [{ body: { id: "1790000000001" } }];
  for (let i = 0; i < 20; i++) steps.push({ body: { status_code: "IN_PROGRESS" } });
  const fetch = mockFetch(steps);
  const res = await instagram(fetch).publish(VIDEO, { title: "", text: TEXT });
  assert.deepEqual(res, { error: "instagram_processing_timeout", retryable: true });
  assert.ok(fetch.calls.length <= 1 + 8, `polled ${fetch.calls.length - 1} times`);
  assert.ok(fetch.calls.every((c) => !c.url.endsWith("/media_publish")));
});

test("instagram: processing ERROR, expired token at create, and a timeout while publishing", async () => {
  assert.deepEqual(
    await instagram(mockFetch([{ body: { id: "1" } }, { body: { status_code: "ERROR" } }])).publish(VIDEO, { title: "", text: TEXT }),
    { error: "instagram_processing_failed", retryable: true });
  assert.deepEqual(await instagram(mockFetch([graphError(400, 190)])).publish(VIDEO, { title: "", text: TEXT }),
    { error: "instagram_reconnect_needed", retryable: true });
  // A timeout creating the container posted nothing; one while publishing may have.
  assert.deepEqual(await instagram(mockFetch(["hang"])).publish(VIDEO, { title: "", text: TEXT }),
    { error: "instagram_timeout", retryable: true });
  assert.deepEqual(
    await instagram(mockFetch([{ body: { id: "1" } }, { body: { status_code: "FINISHED" } }, "hang"])).publish(VIDEO, { title: "", text: TEXT }),
    { error: "instagram_timeout", retryable: false });
});

function igContext(containerId = null, deadline = Number.MAX_SAFE_INTEGER) {
  const ctx = {
    deadline,
    containerId,
    saved: [],
    failSave: false,
    async saveContainer(id) {
      if (ctx.failSave) throw new Error("db down");
      ctx.saved.push(id);
      ctx.containerId = id;
    },
  };
  return ctx;
}

test("instagram: a container still processing is saved, and the retry polls that same container", async () => {
  const clock = fakeClock();
  const ctx = igContext();
  const first = [{ body: { id: "1790000000001" } }];
  for (let i = 0; i < 20; i++) first.push({ body: { status_code: "IN_PROGRESS" } });
  const fetch1 = mockFetch(first);
  assert.deepEqual(await instagram(fetch1, clock).publish(VIDEO, { title: "", text: TEXT }, ctx),
    { error: "instagram_processing_timeout", retryable: true });
  assert.deepEqual(ctx.saved, ["1790000000001"], "saved right after it was created");

  const fetch2 = mockFetch([
    { body: { status_code: "IN_PROGRESS" } },
    { body: { status_code: "FINISHED" } },
    { body: { id: "1790000000999" } },
  ]);
  assert.deepEqual(await instagram(fetch2, clock).publish(VIDEO, { title: "", text: TEXT }, ctx), { id: "1790000000999" });
  assert.ok(fetch2.calls.every((c) => !c.url.endsWith("/17841400000000000/media")), "no second container");
  assert.equal(fetch2.calls[0].url, `${GRAPH_BASE}/1790000000001?fields=status_code`);
  assert.equal(form(fetch2.calls[2]).get("creation_id"), "1790000000001");
});

test("instagram: a resumed container that is already PUBLISHED is never published again", async () => {
  const fetch = mockFetch([{ body: { status_code: "PUBLISHED" } }]);
  assert.deepEqual(await instagram(fetch).publish(VIDEO, { title: "", text: TEXT }, igContext("1790000000001")),
    { error: "instagram_already_published", retryable: false });
  assert.equal(fetch.calls.length, 1);
});

test("instagram: an EXPIRED or ERROR container is cleared so the next attempt starts over", async () => {
  for (const [status, error] of [["EXPIRED", "instagram_container_expired"], ["ERROR", "instagram_processing_failed"]]) {
    const ctx = igContext("1790000000001");
    assert.deepEqual(await instagram(mockFetch([{ body: { status_code: status } }])).publish(VIDEO, { title: "", text: TEXT }, ctx),
      { error, retryable: true });
    assert.deepEqual(ctx.saved, [null]);
  }
});

test("instagram: if the new container can't be saved, nothing more happens and it isn't auto-retried", async () => {
  const ctx = igContext();
  ctx.failSave = true;
  const fetch = mockFetch([{ body: { id: "1790000000001" } }]);
  assert.deepEqual(await instagram(fetch).publish(VIDEO, { title: "", text: TEXT }, ctx),
    { error: "instagram_container_save_failed", retryable: false });
  assert.equal(fetch.calls.length, 1);
});

test("instagram: waiting stops in time for the dispatcher's deadline", async () => {
  const clock = fakeClock();
  const steps = [{ body: { id: "1790000000001" } }];
  for (let i = 0; i < 20; i++) steps.push({ body: { status_code: "IN_PROGRESS" } });
  const fetch = mockFetch(steps);
  const adapter = new InstagramAdapter({ igUserId: "17841400000000000", accessToken: PAGE_TOKEN }, http(fetch), {
    pollIntervalMs: 30_000, pollBudgetMs: 300_000, sleep: clock.sleep, now: clock.now,
  });
  const deadline = clock.now() + 100_000;
  assert.deepEqual(await adapter.publish(VIDEO, { title: "", text: TEXT }, igContext(null, deadline)),
    { error: "instagram_processing_timeout", retryable: true });
  assert.ok(clock.now() <= deadline, "finished before the deadline");
  assert.equal(fetch.calls.length, 1 + 4, "polled at 0, 30, 60 and 90 s");
});

test("instagram: an oversize video is refused before any request", async () => {
  const fetch = mockFetch([]);
  assert.deepEqual(await instagram(fetch).publish({ ...VIDEO, bytes: 301 * 1024 * 1024 }, { title: "", text: TEXT }),
    { error: "video_too_large", retryable: false });
  assert.equal(fetch.calls.length, 0);
});

// ---------- TikTok ----------

test("tiktok: unaudited app refreshes the seed token, stores the rotated pair, posts SELF_ONLY and says it's private", async () => {
  const fetch = mockFetch([REFRESH_OK, CREATOR_OK(), INIT_OK, STATUS("PROCESSING_DOWNLOAD"), STATUS("PUBLISH_COMPLETE")]);
  const { adapter, credentials, clock } = tiktok(fetch);
  const res = await adapter.publish(VIDEO, { title: "", text: `${TITLE}\n\n${TEXT}` });
  assert.deepEqual(res, { id: "v_pub_url~v2.123456", notice: "tiktok_private_unaudited" });

  const [refresh, info, init, status] = fetch.calls;
  assert.equal(refresh.url, "https://open.tiktokapis.com/v2/oauth/token/");
  assert.equal(form(refresh).get("grant_type"), "refresh_token");
  assert.equal(form(refresh).get("refresh_token"), TT_SEED);
  assert.equal(info.url, "https://open.tiktokapis.com/v2/post/publish/creator_info/query/");
  assert.equal(info.init.headers.Authorization, `Bearer ${TT_ACCESS}`);
  assert.equal(init.url, "https://open.tiktokapis.com/v2/post/publish/video/init/");
  assert.deepEqual(json(init), {
    post_info: { title: `${TITLE}\n\n${TEXT}`, privacy_level: "SELF_ONLY" },
    source_info: { source: "PULL_FROM_URL", video_url: `${PREFIX}abc123.mp4` },
  });
  assert.equal(status.url, "https://open.tiktokapis.com/v2/post/publish/status/fetch/");
  assert.deepEqual(json(status), { publish_id: "v_pub_url~v2.123456" });
  for (const c of fetch.calls) assert.ok(!c.url.includes("SECRET"));

  const stored = credentials.store.value;
  assert.equal(stored.refreshToken, TT_REFRESH2);
  assert.equal(stored.accessToken, TT_ACCESS);
  assert.ok(stored.accessExpiresAt > clock.now());
  assert.match(stored.seed, /^[0-9a-f]{16}$/);
});

test("tiktok: a valid stored token is reused; an audited app posts publicly with no notice", async () => {
  const clock = fakeClock();
  const { adapter: seeding, credentials } = tiktok(mockFetch([REFRESH_OK, CREATOR_OK(), INIT_OK, STATUS("PUBLISH_COMPLETE")]), { clock });
  await seeding.publish(VIDEO, { title: "", text: TEXT });
  const fetch = mockFetch([CREATOR_OK(), INIT_OK, STATUS("PUBLISH_COMPLETE")]);
  const { adapter } = tiktok(fetch, { clock, credentials, audited: true });
  assert.deepEqual(await adapter.publish(VIDEO, { title: "", text: TEXT }), { id: "v_pub_url~v2.123456" });
  assert.equal(fetch.calls.length, 3, "no refresh call");
  assert.equal(json(fetch.calls[1]).post_info.privacy_level, "PUBLIC_TO_EVERYONE");
});

test("tiktok: refused or expired refresh token is 'reconnect needed' and nothing is posted", async () => {
  const refused = mockFetch([{ status: 400, body: { error: "invalid_grant", error_description: `bad ${TT_SEED}`, log_id: "l" } }]);
  assert.deepEqual(await tiktok(refused).adapter.publish(VIDEO, { title: "", text: TEXT }),
    { error: "tiktok_reconnect_needed", retryable: true });
  assert.equal(refused.calls.length, 1);

  const clock = fakeClock();
  const expired = memoryCredentials({ accessToken: "a", accessExpiresAt: 0, refreshToken: "r", refreshExpiresAt: clock.now() - 1, seed: undefined });
  const none = mockFetch([]);
  assert.deepEqual(await tiktok(none, { clock, credentials: expired, seed: null }).adapter.publish(VIDEO, { title: "", text: TEXT }),
    { error: "tiktok_reconnect_needed", retryable: true });
  assert.equal(none.calls.length, 0);
});

test("tiktok: pasting a new seed token restarts the chain from it", async () => {
  const clock = fakeClock();
  const old = memoryCredentials({ accessToken: "old-access", accessExpiresAt: clock.now() + 3_600_000, refreshToken: "old-refresh", refreshExpiresAt: clock.now() + 1e9, seed: "0000000000000000" });
  const fetch = mockFetch([REFRESH_OK, CREATOR_OK(), INIT_OK, STATUS("PUBLISH_COMPLETE")]);
  await tiktok(fetch, { clock, credentials: old }).adapter.publish(VIDEO, { title: "", text: TEXT });
  assert.equal(form(fetch.calls[0]).get("refresh_token"), TT_SEED);
  assert.equal(old.store.value.refreshToken, TT_REFRESH2);
});

test("tiktok: rejected access token is dropped so the next attempt refreshes", async () => {
  const clock = fakeClock();
  const creds = memoryCredentials({ accessToken: TT_ACCESS, accessExpiresAt: clock.now() + 3_600_000, refreshToken: "r", refreshExpiresAt: clock.now() + 1e9 });
  const { adapter } = tiktok(mockFetch([ttError(401, "access_token_invalid")]), { clock, credentials: creds, seed: null });
  assert.deepEqual(await adapter.publish(VIDEO, { title: "", text: TEXT }), { error: "tiktok_token_rejected", retryable: true });
  assert.equal(creds.store.value.accessExpiresAt, 0);
});

test("tiktok: definite init errors are retryable; an init timeout is an unknown outcome", async () => {
  const run = (initStep) => tiktok(mockFetch([REFRESH_OK, CREATOR_OK(), initStep])).adapter.publish(VIDEO, { title: "", text: TEXT });
  assert.deepEqual(await run(ttError(403, "url_ownership_unverified")), { error: "tiktok_url_not_verified", retryable: true });
  assert.deepEqual(await run(ttError(403, "unaudited_client_can_only_post_to_private_accounts")), { error: "tiktok_unaudited_client", retryable: true });
  assert.deepEqual(await run(ttError(429, "rate_limit_exceeded")), { error: "tiktok_rate_limited", retryable: true });
  assert.deepEqual(await run(ttError(400, "something_new")), { error: "tiktok_api_error", retryable: true });
  assert.deepEqual(await run("hang"), { error: "tiktok_timeout", retryable: false });
  assert.deepEqual(await run({ status: 503, body: {} }), { error: "tiktok_server_error", retryable: false });
});

test("tiktok: still processing when polling stops is posted with a notice; FAILED is a definite failure", async () => {
  const steps = [REFRESH_OK, CREATOR_OK(), INIT_OK];
  for (let i = 0; i < 10; i++) steps.push(STATUS("PROCESSING_DOWNLOAD"));
  const fetch = mockFetch(steps);
  assert.deepEqual(await tiktok(fetch).adapter.publish(VIDEO, { title: "", text: TEXT }),
    { id: "v_pub_url~v2.123456", notice: "tiktok_processing_private" });
  assert.ok(fetch.calls.length <= 3 + 5);
  assert.deepEqual(
    await tiktok(mockFetch([REFRESH_OK, CREATOR_OK(), INIT_OK, STATUS("FAILED")])).adapter.publish(VIDEO, { title: "", text: TEXT }),
    { error: "tiktok_publish_failed", retryable: true });
});

test("tiktok: oversize, over the creator's max duration, or no private option: refused before init", async () => {
  const none = mockFetch([]);
  assert.deepEqual(await tiktok(none).adapter.publish({ ...VIDEO, bytes: 5 * 1024 ** 3 }, { title: "", text: TEXT }),
    { error: "video_too_large", retryable: false });
  assert.equal(none.calls.length, 0);
  const long = mockFetch([REFRESH_OK, CREATOR_OK(undefined, 30)]);
  assert.deepEqual(await tiktok(long).adapter.publish(VIDEO, { title: "", text: TEXT }), { error: "video_too_long", retryable: false });
  assert.equal(long.calls.length, 2);
  const noPrivate = mockFetch([REFRESH_OK, CREATOR_OK(["PUBLIC_TO_EVERYONE"])]);
  assert.deepEqual(await tiktok(noPrivate).adapter.publish(VIDEO, { title: "", text: TEXT }),
    { error: "tiktok_privacy_level_unavailable", retryable: true });
});

// A fetch that answers by URL, so two adapters can run at once.
function routedTikTokFetch() {
  const calls = [];
  const fn = async (url, init = {}) => {
    calls.push({ url, init });
    await tick();
    const reply = (body) => new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });
    if (url.endsWith("/oauth/token/")) {
      // The refresh takes a few turns, so the other request runs meanwhile.
      await tick(); await tick(); await tick();
      return reply(REFRESH_OK.body);
    }
    if (url.endsWith("/creator_info/query/")) return reply(CREATOR_OK().body);
    if (url.endsWith("/video/init/")) return reply(INIT_OK.body);
    if (url.endsWith("/status/fetch/")) return reply(STATUS("PUBLISH_COMPLETE").body);
    throw new Error(`unexpected request to ${url}`);
  };
  fn.calls = calls;
  return fn;
}

function yieldingClock(start = 1_800_000_000_000) {
  let t = start;
  return { now: () => t, sleep: async (ms) => { t += ms; await tick(); } };
}

test("tiktok: two interleaved refreshes spend the refresh token once; the loser uses the winner's pair", async () => {
  for (const initial of ["seed", "stored"]) {
    const clock = yieldingClock();
    // "seed": no row yet (both start from TIKTOK_REFRESH_TOKEN); "stored":
    // an expired access token with a live refresh token.
    const credentials = initial === "seed"
      ? memoryCredentials()
      : memoryCredentials({ accessToken: "old-access", accessExpiresAt: 0, refreshToken: "old-refresh", refreshExpiresAt: clock.now() + 1e9, seed: undefined });
    const fetch = routedTikTokFetch();
    const opts = { clock, credentials, ...(initial === "stored" ? { seed: null } : {}) };
    const a = tiktok(fetch, opts).adapter;
    const b = tiktok(fetch, opts).adapter;
    const [ra, rb] = await Promise.all([a.publish(VIDEO, { title: "", text: TEXT }), b.publish(VIDEO, { title: "", text: TEXT })]);

    assert.ok("id" in ra && "id" in rb, `${initial}: ${JSON.stringify([ra, rb])}`);
    const refreshes = fetch.calls.filter((c) => c.url.endsWith("/oauth/token/"));
    assert.equal(refreshes.length, 1, `${initial}: the refresh token was spent more than once`);
    assert.equal(credentials.store.leases, 1);
    assert.equal(credentials.store.puts, 1);
    assert.equal(credentials.store.value.refreshToken, TT_REFRESH2);
    for (const c of fetch.calls.filter((c) => !c.url.endsWith("/oauth/token/"))) {
      assert.equal(c.init.headers.Authorization, `Bearer ${TT_ACCESS}`, `${initial}: a request used a token other than the winner's`);
    }
  }
});

test("tiktok: a lease left by a request that died expires and is taken over; a live one makes others wait, then give up", async () => {
  const clock = yieldingClock();
  const creds = memoryCredentials({ accessToken: "a", accessExpiresAt: 0, refreshToken: "r", refreshExpiresAt: clock.now() + 1e9 });
  creds.store.leaseUntil = clock.now() + 5_000;
  const fetch = mockFetch([REFRESH_OK, CREATOR_OK(), INIT_OK, STATUS("PUBLISH_COMPLETE")]);
  assert.ok("id" in await tiktok(fetch, { clock, credentials: creds, seed: null }).adapter.publish(VIDEO, { title: "", text: TEXT }));
  assert.equal(form(fetch.calls[0]).get("refresh_token"), "r");
  assert.ok(clock.now() >= 1_800_000_005_000, "waited for the old lease to run out");

  // A lease that keeps being renewed (another request refreshing) is never
  // raced: after LEASE_MS of waiting the attempt stops, nothing spent.
  const busyClock = yieldingClock();
  const busy = memoryCredentials({ accessToken: "a", accessExpiresAt: 0, refreshToken: "r", refreshExpiresAt: busyClock.now() + 1e9 });
  const realGet = busy.get;
  busy.get = async (p) => { busy.store.leaseUntil = busyClock.now() + 60_000; return realGet(p); };
  const none = mockFetch([]);
  assert.deepEqual(await tiktok(none, { clock: busyClock, credentials: busy, seed: null }).adapter.publish(VIDEO, { title: "", text: TEXT }),
    { error: "tiktok_token_refresh_busy", retryable: true });
  assert.equal(none.calls.length, 0);
  assert.equal(busy.store.leases, 0);
});

test("tiktok: a failed save of the rotated token stops before posting", async () => {
  const creds = memoryCredentials();
  creds.store.failPut = true;
  const fetch = mockFetch([REFRESH_OK]);
  assert.deepEqual(await tiktok(fetch, { credentials: creds }).adapter.publish(VIDEO, { title: "", text: TEXT }),
    { error: "tiktok_token_save_failed", retryable: true });
  assert.equal(fetch.calls.length, 1);
});

// ---------- Redaction ----------

test("redaction: no token, secret or caption text reaches a result or the console, whatever the platform returns", async () => {
  const SECRETS = [PAGE_TOKEN, TT_SECRET, TT_SEED, TT_ACCESS, TT_REFRESH2, "CAPTION-TITLE-MARK", "CAPTION-TEXT-MARK", "SECRET"];
  const caption = { title: TITLE, text: `${TITLE}\n\n${TEXT}` };
  const scenarios = [
    () => facebook(mockFetch([graphError(400, 190)])),
    () => facebook(mockFetch([graphError(400, 999999)])),
    () => facebook(mockFetch([{ status: 500, body: { error: { message: PAGE_TOKEN } } }])),
    () => facebook(mockFetch(["network"])),
    () => facebook(mockFetch(["hang"])),
    () => instagram(mockFetch([graphError(400, 9004, 2207052)])),
    () => instagram(mockFetch([{ body: { id: "1" } }, { status: 400, body: { error: { message: TEXT, code: 24 } } }])),
    () => instagram(mockFetch([{ body: { id: "1" } }, { body: { status_code: "FINISHED" } }, graphError(500, 2)])),
    () => tiktok(mockFetch([{ status: 400, body: { error: "invalid_grant", error_description: `${TT_SEED} ${TT_SECRET}` } }])).adapter,
    () => tiktok(mockFetch([REFRESH_OK, ttError(401, "scope_not_authorized")])).adapter,
    () => tiktok(mockFetch([REFRESH_OK, CREATOR_OK(), ttError(400, `weird ${TT_ACCESS}`)])).adapter,
    () => tiktok(mockFetch([REFRESH_OK, CREATOR_OK(), "network"])).adapter,
  ];

  const logged = [];
  const methods = ["log", "info", "warn", "error", "debug"];
  const saved = methods.map((m) => console[m]);
  methods.forEach((m) => { console[m] = (...args) => logged.push(args.map(String).join(" ")); });
  const results = [];
  try {
    for (const make of scenarios) results.push(await make().publish(VIDEO, caption));
  } finally {
    methods.forEach((m, i) => { console[m] = saved[i]; });
  }

  for (const r of results) {
    assert.ok("error" in r, JSON.stringify(r));
    assert.match(r.error, /^[a-z0-9_]{1,64}$/, `not a bare identifier: ${r.error}`);
  }
  const haystack = JSON.stringify(results) + logged.join("\n");
  for (const s of SECRETS) assert.ok(!haystack.includes(s), `leaked ${s}`);
});

// ---------- Token encryption ----------

test("token-crypto: round trip; wrong key, wrong platform or tampering read as nothing", () => {
  const key = randomBytes(32);
  const sealed = encryptSecret(key, "tiktok", TT_REFRESH2);
  assert.match(sealed, /^v1:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$/);
  assert.ok(!sealed.includes(TT_REFRESH2));
  assert.equal(decryptSecret(key, "tiktok", sealed), TT_REFRESH2);
  assert.equal(decryptSecret(randomBytes(32), "tiktok", sealed), null);
  assert.equal(decryptSecret(key, "facebook", sealed), null);
  const parts = sealed.split(":");
  parts[3] = Buffer.from("x".repeat(20)).toString("base64");
  assert.equal(decryptSecret(key, "tiktok", parts.join(":")), null);
  assert.equal(parseKey(randomBytes(16).toString("base64")), null);
  assert.equal(parseKey(key.toString("base64")).length, 32);
  assert.equal(parseKey(undefined), null);
});
