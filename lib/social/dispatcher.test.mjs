import test from "node:test";
import assert from "node:assert/strict";
import {
  submitPost, runPost, retryTarget, markNotPosted, postNow, sanitizeErrorCode, STALE_POSTING_MS,
  ACTION_BUDGET_MS, PLATFORM_RESERVE_MS,
} from "./dispatcher.ts";
import { FakeAdapter } from "./fake-adapter.ts";

// In-memory SocialStore with the same guarantees as the migration and
// lib/social/supabase-store.ts: unique (video_public_id, dry_run), unique
// (post_id, platform), and conditional updates that only one caller can win.
// Every method yields first, so concurrent calls genuinely interleave.
function memoryStore(settingsPatch = {}, clock = () => new Date()) {
  const settings = {
    postingEnabled: true,
    dryRun: false,
    platforms: { facebook: true, instagram: true, tiktok: true },
    ...settingsPatch,
  };
  const posts = new Map();
  const targets = new Map();
  let seq = 0;
  const tick = () => new Promise((r) => setImmediate(r));
  const copy = (x) => (x ? structuredClone(x) : null);

  return {
    settings,
    posts,
    targets,
    async getSettings() {
      await tick();
      return structuredClone(settings);
    },
    async findPost(publicId, dryRun) {
      await tick();
      return copy([...posts.values()].find((p) => p.video.publicId === publicId && p.dryRun === dryRun));
    },
    async insertPost(p) {
      await tick();
      if ([...posts.values()].some((x) => x.video.publicId === p.video.publicId && x.dryRun === p.dryRun)) return "conflict";
      const row = { ...structuredClone(p), id: `post-${++seq}`, createdAt: clock().toISOString() };
      posts.set(row.id, row);
      return copy(row);
    },
    async insertTargets(postId, list) {
      await tick();
      for (const t of list) {
        if ([...targets.values()].some((x) => x.postId === postId && x.platform === t.platform)) continue;
        const id = `target-${++seq}`;
        targets.set(id, {
          id, postId, platform: t.platform, status: t.status, captionTitle: t.captionTitle,
          captionSent: t.captionSent, platformPostId: null, containerId: null, errorCode: t.errorCode, retryable: false,
          attempts: 0, claimedAt: null, finishedAt: t.status === "skipped" ? clock().toISOString() : null,
        });
      }
    },
    async getPost(id) { await tick(); return copy(posts.get(id)); },
    async getTarget(id) { await tick(); return copy(targets.get(id)); },
    async listTargets(postId) {
      await tick();
      return [...targets.values()].filter((t) => t.postId === postId).map(copy);
    },
    async claim(id, from, requireRetryable) {
      await tick();
      const t = targets.get(id);
      if (!t || !from.includes(t.status) || (requireRetryable && !t.retryable)) return false;
      Object.assign(t, { status: "posting", attempts: t.attempts + 1, claimedAt: clock().toISOString(), errorCode: null, retryable: false });
      return true;
    },
    async transition(id, from, patch, opts = {}) {
      await tick();
      const t = targets.get(id);
      if (!t || !from.includes(t.status)) return false;
      if (opts.requireRetryable && !t.retryable) return false;
      if (opts.olderThan && !(t.claimedAt && t.claimedAt <= opts.olderThan)) return false;
      t.status = patch.status;
      if ("platformPostId" in patch) t.platformPostId = patch.platformPostId;
      if ("errorCode" in patch) t.errorCode = patch.errorCode;
      if ("retryable" in patch) t.retryable = patch.retryable;
      if (patch.finished) t.finishedAt = clock().toISOString();
      return true;
    },
    async setContainer(id, containerId) {
      await tick();
      const t = targets.get(id);
      if (!t || t.status !== "posting") return false;
      t.containerId = containerId;
      return true;
    },
  };
}

const VIDEO = {
  publicId: "social/abc123",
  url: "https://res.cloudinary.com/demo/video/upload/v1/social/abc123.mp4",
  bytes: 20 * 1024 * 1024,
  format: "mp4",
  width: 1080,
  height: 1920,
  durationSec: 42,
};

const TIKTOK_CHOICES = { privacyLevel: "SELF_ONLY", allowComment: false, allowDuet: true, allowStitch: false, commercial: null, consent: true };

function setup(settingsPatch, opts = {}) {
  const store = memoryStore(settingsPatch, opts.clock);
  const real = { facebook: new FakeAdapter("facebook"), instagram: new FakeAdapter("instagram"), tiktok: new FakeAdapter("tiktok") };
  const dry = { facebook: new FakeAdapter("facebook"), instagram: new FakeAdapter("instagram"), tiktok: new FakeAdapter("tiktok") };
  const deps = {
    store,
    realAdapter: opts.realAdapter ?? ((p) => real[p]),
    fakeAdapter: (p) => dry[p],
    now: opts.clock,
  };
  const input = { video: VIDEO, title: "Sunday service", caption: "Join us #CACNA", submittedBy: "admin-1", tiktok: TIKTOK_CHOICES };
  const callCount = (set) => Object.values(set).reduce((n, a) => n + a.calls.length, 0);
  const statuses = () => Object.fromEntries([...store.targets.values()].map((t) => [t.platform, t.status]));
  return { store, real, dry, deps, input, callCount, statuses };
}

test("double submit: sequential and concurrent submits of one video publish once per platform", async () => {
  const { deps, input, real, store, callCount } = setup();
  const [a, b] = await Promise.all([submitPost(deps, input), submitPost(deps, input)]);
  const c = await submitPost(deps, input);
  assert.equal(a.ok && b.ok && c.ok, true);
  assert.equal(a.postId, b.postId);
  assert.equal(c.postId, a.postId);
  assert.equal(c.duplicate, true);
  assert.equal(store.posts.size, 1);
  assert.equal(store.targets.size, 3);
  for (const p of ["facebook", "instagram", "tiktok"]) assert.equal(real[p].calls.length, 1, p);
  assert.equal(callCount(real), 3);
});

test("concurrent runs of the same post publish each platform once", async () => {
  const { deps, input, real, store, statuses } = setup();
  // A post whose targets are queued but not started (as if its first request
  // died right after the inserts), then three runs at once.
  const post = await store.insertPost({ video: VIDEO, title: input.title, caption: "", dryRun: false, submittedBy: "admin-1" });
  await store.insertTargets(post.id, ["facebook", "instagram", "tiktok"].map((platform) => ({
    platform, status: "queued", captionTitle: "", captionSent: input.title, errorCode: null,
  })));
  await Promise.all([runPost(deps, post.id), runPost(deps, post.id), runPost(deps, post.id)]);
  for (const a of Object.values(real)) assert.equal(a.calls.length, 1, a.platform);
  assert.deepEqual(statuses(), { facebook: "posted", instagram: "posted", tiktok: "posted" });
});

test("retry after a definite failure posts once; retrying a posted target is refused", async () => {
  const { deps, input, real, store } = setup();
  real.instagram.script.push({ error: "rate_limited", retryable: true });
  await submitPost(deps, input);
  const ig = [...store.targets.values()].find((t) => t.platform === "instagram");
  assert.equal(ig.status, "failed");
  assert.equal(ig.errorCode, "rate_limited");
  assert.equal(ig.retryable, true);

  const [r1, r2] = await Promise.all([retryTarget(deps, ig.id), retryTarget(deps, ig.id)]);
  assert.equal([r1, r2].filter((r) => r.ok).length, 1, "exactly one concurrent retry wins");
  assert.equal(store.targets.get(ig.id).status, "posted");
  assert.equal(store.targets.get(ig.id).attempts, 2);
  assert.deepEqual(await retryTarget(deps, ig.id), { ok: false, code: "not_retryable" });
  assert.equal(real.instagram.calls.length, 2);
  assert.equal(real.facebook.calls.length, 1);
});

test("an unknown outcome (adapter throws) is never retried until an admin confirms", async () => {
  const { deps, input, real, store } = setup();
  real.tiktok.script.push(() => { throw new Error("socket hang up token=SECRET"); });
  await submitPost(deps, input);
  const tt = [...store.targets.values()].find((t) => t.platform === "tiktok");
  assert.equal(tt.status, "failed");
  assert.equal(tt.errorCode, "adapter_exception");
  assert.equal(tt.retryable, false);
  assert.deepEqual(await retryTarget(deps, tt.id), { ok: false, code: "not_retryable" });
  assert.equal(real.tiktok.calls.length, 1);

  assert.deepEqual(await markNotPosted(deps, tt.id), { ok: true });
  assert.deepEqual(await retryTarget(deps, tt.id), { ok: true });
  assert.equal(store.targets.get(tt.id).status, "posted");
  assert.equal(real.tiktok.calls.length, 2);
});

test("a target stuck in posting can be released only once it is stale", async () => {
  let now = new Date("2026-11-08T12:00:00Z");
  const clock = () => now;
  const { deps, input, store } = setup({}, { clock });
  await submitPost(deps, input);
  const fb = [...store.targets.values()].find((t) => t.platform === "facebook");
  Object.assign(store.targets.get(fb.id), { status: "posting", claimedAt: now.toISOString() });

  await runPost(deps, fb.postId);
  assert.equal(store.targets.get(fb.id).status, "posting", "runPost never touches a posting target");
  assert.deepEqual(await markNotPosted(deps, fb.id), { ok: false, code: "not_applicable" });
  now = new Date(now.getTime() + STALE_POSTING_MS + 1000);
  assert.deepEqual(await markNotPosted(deps, fb.id), { ok: true });
  assert.equal(store.targets.get(fb.id).status, "failed");
  assert.equal(store.targets.get(fb.id).retryable, true);
});

test("kill switch off: nothing is published and every target is skipped", async () => {
  const { deps, input, real, store, callCount, statuses } = setup({ postingEnabled: false });
  const res = await submitPost(deps, input);
  assert.equal(res.ok, true);
  assert.equal(callCount(real), 0);
  assert.deepEqual(statuses(), { facebook: "skipped", instagram: "skipped", tiktok: "skipped" });
  for (const t of store.targets.values()) assert.equal(t.errorCode, "kill_switch_off");
});

test("kill switch flipped off mid-run stops the remaining platforms", async () => {
  const { deps, input, real, store, statuses } = setup();
  real.facebook.script.push(() => {
    store.settings.postingEnabled = false;
    return { id: "123_456" };
  });
  await submitPost(deps, input);
  assert.deepEqual(statuses(), { facebook: "posted", instagram: "skipped", tiktok: "skipped" });
  assert.equal(real.instagram.calls.length + real.tiktok.calls.length, 0);
});

test("a failed target is not retried while the kill switch is off", async () => {
  const { deps, input, real, store } = setup();
  real.facebook.script.push({ error: "temporarily_unavailable", retryable: true });
  await submitPost(deps, input);
  const fb = [...store.targets.values()].find((t) => t.platform === "facebook");
  store.settings.postingEnabled = false;
  assert.deepEqual(await retryTarget(deps, fb.id), { ok: false, code: "kill_switch_off" });
  assert.equal(store.targets.get(fb.id).status, "failed");
  assert.equal(real.facebook.calls.length, 1);
});

test("dry run: only the fake adapter runs, even with the kill switch off, and the log keeps what would be sent", async () => {
  const { deps, input, real, dry, store, callCount } = setup({ dryRun: true, postingEnabled: false });
  deps.realAdapter = () => assert.fail("a dry run must never reach a real adapter");
  const res = await submitPost(deps, input);
  assert.equal(res.ok, true);
  assert.equal(callCount(real), 0);
  assert.equal(callCount(dry), 3);
  assert.equal(store.posts.get(res.postId).dryRun, true);
  const byPlatform = Object.fromEntries([...store.targets.values()].map((t) => [t.platform, t]));
  for (const t of Object.values(byPlatform)) {
    assert.equal(t.status, "posted");
    assert.match(t.platformPostId, /^fake-/);
  }
  assert.equal(byPlatform.facebook.captionTitle, "Sunday service");
  assert.equal(byPlatform.facebook.captionSent, "Join us #CACNA");
  assert.equal(byPlatform.instagram.captionSent, "Sunday service\n\nJoin us #CACNA");
  assert.deepEqual(dry.tiktok.calls[0].caption, { title: "", text: "Sunday service\n\nJoin us #CACNA" });

  // The same upload can still go out for real once dry run is off.
  store.settings.dryRun = false;
  store.settings.postingEnabled = true;
  deps.realAdapter = (p) => real[p];
  const live = await submitPost(deps, input);
  assert.notEqual(live.postId, res.postId);
  assert.equal(callCount(real), 3);
});

test("per-platform toggle: only enabled platforms are published", async () => {
  const { deps, input, real, store, statuses } = setup({ platforms: { facebook: false, instagram: true, tiktok: false } });
  await submitPost(deps, input);
  assert.deepEqual(statuses(), { facebook: "skipped", instagram: "posted", tiktok: "skipped" });
  assert.equal(real.facebook.calls.length + real.tiktok.calls.length, 0);
  assert.equal(real.instagram.calls.length, 1);
  assert.equal([...store.targets.values()].find((t) => t.platform === "facebook").errorCode, "platform_disabled");
});

test("a platform with no real adapter is skipped as not_configured", async () => {
  const { deps, input, store, statuses } = setup({}, { realAdapter: () => null });
  await submitPost(deps, input);
  assert.deepEqual(statuses(), { facebook: "skipped", instagram: "skipped", tiktok: "skipped" });
  for (const t of store.targets.values()) assert.equal(t.errorCode, "not_configured");
});

test("a video that breaks one platform's rules skips only that platform", async () => {
  const { deps, input, statuses, store } = setup();
  await submitPost(deps, { ...input, video: { ...VIDEO, format: "mov" } });
  assert.deepEqual(statuses(), { facebook: "skipped", instagram: "posted", tiktok: "posted" });
  assert.equal([...store.targets.values()].find((t) => t.platform === "facebook").errorCode, "video_format_unsupported");
});

test("an over-limit caption refuses the whole submission and stores nothing", async () => {
  const { deps, input, store, callCount, real } = setup();
  const res = await submitPost(deps, { ...input, caption: "x".repeat(2200) });
  assert.equal(res.ok, false);
  assert.equal(res.code, "caption_too_long");
  const tags = Array.from({ length: 31 }, (_, i) => `#t${i}`).join(" ");
  assert.equal((await submitPost(deps, { ...input, caption: tags })).code, "caption_too_many_hashtags");
  assert.equal(store.posts.size, 0);
  assert.equal(callCount(real), 0);
});

test("error codes and post ids from adapters are reduced to safe identifiers", async () => {
  const { deps, input, real, store } = setup();
  real.facebook.script.push({ error: "Invalid OAuth access token EAAB123secret", retryable: false });
  real.instagram.script.push({ id: "https://evil.example/?token=abc" });
  await submitPost(deps, input);
  const by = Object.fromEntries([...store.targets.values()].map((t) => [t.platform, t]));
  assert.equal(by.facebook.errorCode, "unrecognised_error");
  assert.equal(by.instagram.status, "posted");
  assert.equal(by.instagram.platformPostId, null);
  assert.equal(sanitizeErrorCode("Rate_Limited"), "rate_limited");
  assert.equal(sanitizeErrorCode(42), "unrecognised_error");
});

test("a success notice from an adapter is stored beside the posted status, sanitised", async () => {
  const { deps, input, real, store } = setup();
  real.tiktok.script.push({ id: "v_pub_url~v2.1", notice: "tiktok_private_unaudited" });
  real.facebook.script.push({ id: "123", notice: "Posted privately, token=EAAB123" });
  await submitPost(deps, input);
  const by = Object.fromEntries([...store.targets.values()].map((t) => [t.platform, t]));
  assert.equal(by.tiktok.status, "posted");
  assert.equal(by.tiktok.platformPostId, "v_pub_url~v2.1");
  assert.equal(by.tiktok.errorCode, "tiktok_private_unaudited");
  assert.equal(by.facebook.errorCode, "unrecognised_error");
  assert.equal(by.instagram.errorCode, null);
});

// ---------- Round A review fixes ----------

const targetOf = (store, platform) => [...store.targets.values()].find((t) => t.platform === platform);

test("dry run switched back on: Retry and Post now never send a real post (dry_run_on)", async () => {
  const { deps, input, real, dry, store, callCount } = setup();
  real.instagram.script.push({ error: "rate_limited", retryable: true });
  await submitPost(deps, input);
  const ig = targetOf(store, "instagram");
  assert.equal(ig.status, "failed");

  store.settings.dryRun = true;
  assert.deepEqual(await retryTarget(deps, ig.id), { ok: false, code: "dry_run_on" });
  assert.equal(store.targets.get(ig.id).status, "failed", "the failure is left as it was");
  assert.equal(real.instagram.calls.length, 1);
  assert.equal(callCount(dry), 0);

  // A queued real target (e.g. deferred) is skipped, not sent, and can be
  // posted once dry run is off again.
  const fb = targetOf(store, "facebook");
  Object.assign(store.targets.get(fb.id), { status: "queued", errorCode: null });
  assert.deepEqual(await postNow(deps, fb.id), { ok: false, code: "dry_run_on" });
  assert.equal(store.targets.get(fb.id).status, "skipped");
  assert.equal(store.targets.get(fb.id).errorCode, "dry_run_on");
  assert.equal(real.facebook.calls.length, 1);
  store.settings.dryRun = false;
  assert.deepEqual(await postNow(deps, fb.id), { ok: true });
  assert.equal(real.facebook.calls.length, 2);
});

test("Post now: a target skipped by a setting is queued again once the setting allows it, and posts once", async () => {
  const { deps, input, real, store } = setup({ platforms: { facebook: true, instagram: false, tiktok: true } });
  await submitPost(deps, input);
  const ig = targetOf(store, "instagram");
  assert.equal(ig.status, "skipped");
  assert.equal(ig.errorCode, "platform_disabled");

  assert.deepEqual(await postNow(deps, ig.id), { ok: false, code: "platform_disabled" });
  assert.equal(store.targets.get(ig.id).status, "skipped");
  assert.equal(real.instagram.calls.length, 0);

  store.settings.platforms.instagram = true;
  const results = await Promise.all([postNow(deps, ig.id), postNow(deps, ig.id)]);
  assert.equal(results.filter((r) => r.ok).length, 1, "exactly one concurrent Post now publishes");
  assert.equal(store.targets.get(ig.id).status, "posted");
  assert.equal(real.instagram.calls.length, 1);
  assert.deepEqual(await postNow(deps, ig.id), { ok: false, code: "not_applicable" });
  assert.deepEqual(await postNow(deps, targetOf(store, "facebook").id), { ok: false, code: "not_applicable" });
});

test("Post now: a skip caused by the video itself is final; a newly applicable video rule is recorded", async () => {
  const { deps, input, real, store } = setup({ platforms: { facebook: false, instagram: true, tiktok: true } });
  await submitPost(deps, { ...input, video: { ...VIDEO, format: "mov" } });
  const fb = targetOf(store, "facebook");
  assert.equal(fb.errorCode, "platform_disabled");
  store.settings.platforms.facebook = true;
  // Facebook takes mp4 only: the rule now applies, so it stays skipped with that reason.
  assert.deepEqual(await postNow(deps, fb.id), { ok: false, code: "video_format_unsupported" });
  assert.equal(store.targets.get(fb.id).status, "skipped");
  assert.equal(store.targets.get(fb.id).errorCode, "video_format_unsupported");
  assert.deepEqual(await postNow(deps, fb.id), { ok: false, code: "not_applicable" });
  assert.equal(real.facebook.calls.length, 0);
});

test("time budget: a platform is never started without enough time left; it stays queued for Post now", async () => {
  let now = new Date("2026-11-08T12:00:00Z");
  const start = now.getTime();
  const clock = () => now;
  const { deps, input, real, store } = setup({}, { clock });
  real.facebook.script.push((ctx) => {
    // Facebook, first of three, must finish before the time kept for the other two.
    assert.equal(ctx.deadline, start + ACTION_BUDGET_MS - 2 * PLATFORM_RESERVE_MS);
    now = new Date(start + ACTION_BUDGET_MS - 60_000);
    return { id: "123_456" };
  });
  await submitPost(deps, input);
  assert.equal(targetOf(store, "facebook").status, "posted");
  for (const p of ["instagram", "tiktok"]) {
    assert.equal(targetOf(store, p).status, "queued", p);
    assert.equal(targetOf(store, p).errorCode, "deferred_time_budget", p);
    assert.equal(real[p].calls.length, 0, p);
  }
  // A later action has its own budget.
  assert.deepEqual(await postNow(deps, targetOf(store, "instagram").id), { ok: true });
  assert.equal(targetOf(store, "instagram").status, "posted");
  assert.equal(real.instagram.calls.length, 1);
});

test("a container saved during one attempt is handed to the retry, never replaced", async () => {
  const { deps, input, real, store } = setup();
  real.instagram.script.push(async (ctx) => {
    assert.equal(ctx.containerId, null);
    await ctx.saveContainer("17900000000001");
    return { error: "instagram_processing_timeout", retryable: true };
  });
  real.instagram.script.push(async (ctx) => {
    assert.equal(ctx.containerId, "17900000000001");
    return { id: "17900000000999" };
  });
  await submitPost(deps, input);
  const ig = targetOf(store, "instagram");
  assert.equal(ig.status, "failed");
  assert.equal(ig.retryable, true);
  assert.equal(ig.containerId, "17900000000001");
  assert.deepEqual(await retryTarget(deps, ig.id), { ok: true });
  assert.equal(store.targets.get(ig.id).status, "posted");
  assert.equal(store.targets.get(ig.id).containerId, "17900000000001");
  assert.equal(real.instagram.calls.length, 2);

  // A container id that isn't an identifier is refused, and only a claimer can save one.
  real.tiktok.script.push(async (ctx) => {
    await assert.rejects(ctx.saveContainer("https://evil.example/x?token=abc"));
    return { id: "v1" };
  });
  const other = await submitPost(deps, { ...input, video: { ...VIDEO, publicId: "social/other" } });
  assert.equal(other.ok, true);
  assert.equal(await store.setContainer(targetOf(store, "facebook").id, "1"), false);
});

test("tiktok choices: stored with the post and handed to the adapter as made", async () => {
  const { deps, input, real, store } = setup();
  await submitPost(deps, input);
  assert.deepEqual([...store.posts.values()][0].tiktok, TIKTOK_CHOICES);
  assert.deepEqual(real.tiktok.calls[0].ctx.tiktok, TIKTOK_CHOICES);
});

test("tiktok choices: without them TikTok is skipped for good and the others still post", async () => {
  const { deps, input, real, store, statuses } = setup();
  const noTikTok = { ...input, tiktok: undefined };
  await submitPost(deps, noTikTok);
  assert.deepEqual(statuses(), { facebook: "posted", instagram: "posted", tiktok: "skipped" });
  const tt = [...store.targets.values()].find((t) => t.platform === "tiktok");
  assert.equal(tt.errorCode, "tiktok_choices_missing");
  assert.equal(real.tiktok.calls.length, 0);
  assert.deepEqual(await postNow(deps, tt.id), { ok: false, code: "not_applicable" });
  assert.equal(real.tiktok.calls.length, 0);
});

test("tiktok choices: a TikTok target skipped by a setting, on a post without choices, stays unposted after Post now", async () => {
  const { deps, input, real, store } = setup({ platforms: { facebook: true, instagram: true, tiktok: false } });
  await submitPost(deps, { ...input, tiktok: null });
  store.settings.platforms.tiktok = true;
  const tt = [...store.targets.values()].find((t) => t.platform === "tiktok");
  assert.deepEqual(await postNow(deps, tt.id), { ok: false, code: "tiktok_choices_missing" });
  assert.equal(real.tiktok.calls.length, 0);
});

test("tiktok choices: invalid ones refuse the whole submit and nothing is stored", async () => {
  const { deps, input, real, store, callCount } = setup();
  const res = await submitPost(deps, { ...input, tiktok: { ...TIKTOK_CHOICES, consent: false } });
  assert.deepEqual(res, { ok: false, code: "tiktok_consent_missing", platform: "tiktok" });
  assert.equal(store.posts.size, 0);
  assert.equal(callCount(real), 0);
});
