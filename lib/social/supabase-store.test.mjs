import test from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// lib/social/supabase-store.ts against a recording query-builder fake: every
// PostgREST builder call is recorded, so these tests pin the exact filters
// that make the SocialStore's guarantees hold in Postgres (the conditional
// claim, the retryable and claimed_at checks, unique-violation mapping, and
// ignore-duplicates target inserts). The in-memory store in
// dispatcher.test.mjs only models those guarantees; this checks the real
// store asks the database for them.
//
// "server-only" is Next's build-time guard and isn't installed as a package;
// here it resolves to an empty module.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "server-only") return { url: "data:text/javascript,", shortCircuit: true };
    return next(specifier, context);
  },
});
const { supabaseSocialStore } = await import("./supabase-store.ts");

/** A client whose from() returns a builder that records every call and,
 *  when awaited, resolves to the next scripted response. */
function recordingDb(responses = []) {
  const queries = [];
  return {
    queries,
    from(table) {
      const q = { table, calls: [] };
      queries.push(q);
      const result = responses.shift() ?? { data: null, error: null };
      const builder = new Proxy({}, {
        get(_target, prop) {
          if (prop === "then") return (resolve, reject) => Promise.resolve(result).then(resolve, reject);
          return (...args) => { q.calls.push([prop, ...args]); return builder; };
        },
      });
      return builder;
    },
  };
}

const calls = (q, name) => q.calls.filter(([m]) => m === name).map(([, ...args]) => args);

const TARGET_ROW = {
  id: "t-1", post_id: "p-1", platform: "tiktok", status: "queued", caption_title: "", caption_sent: "x",
  platform_post_id: null, platform_container_id: null, error_code: null, retryable: false, attempts: 2,
  claimed_at: null, finished_at: null, updated_at: "2026-11-08T00:00:00Z",
};

const POST_ROW = {
  id: "p-1", video_public_id: "social/abc", video_url: "https://res.cloudinary.com/demo/video/upload/social/abc.mp4",
  video_bytes: 10, video_format: "mp4", video_width: null, video_height: null, video_duration_s: 12,
  video_frame_rate: null, video_codec: null, title: "T", caption: "", dry_run: false, submitted_by: "u",
  created_at: "2026-11-08T00:00:00Z", tiktok_choices: null,
};

test("claim: one conditional UPDATE on id and status IN (from); wins only with exactly one row back", async () => {
  const db = recordingDb([{ data: TARGET_ROW, error: null }, { data: [{ id: "t-1" }], error: null }]);
  assert.equal(await supabaseSocialStore(db).claim("t-1", ["queued"], false), true);
  const update = db.queries[1];
  assert.equal(update.table, "social_post_targets");
  const [[patch]] = calls(update, "update");
  assert.equal(patch.status, "posting");
  assert.equal(patch.attempts, 3);
  assert.equal(patch.retryable, false);
  assert.equal(patch.error_code, null);
  assert.ok(patch.claimed_at);
  assert.deepEqual(calls(update, "eq"), [["id", "t-1"]]);
  assert.deepEqual(calls(update, "in"), [["status", ["queued"]]]);
  assert.deepEqual(calls(update, "select"), [["id"]]);

  const lost = recordingDb([{ data: TARGET_ROW, error: null }, { data: [], error: null }]);
  assert.equal(await supabaseSocialStore(lost).claim("t-1", ["queued"], false), false);
});

test("claim of a failed target also requires retryable = true", async () => {
  const db = recordingDb([{ data: { ...TARGET_ROW, status: "failed" }, error: null }, { data: [{ id: "t-1" }], error: null }]);
  assert.equal(await supabaseSocialStore(db).claim("t-1", ["failed"], true), true);
  assert.deepEqual(calls(db.queries[1], "eq"), [["id", "t-1"], ["retryable", true]]);
  assert.deepEqual(calls(db.queries[1], "in"), [["status", ["failed"]]]);
});

test("transition: status IN (from), plus retryable and claimed_at <= olderThan when asked", async () => {
  const db = recordingDb([{ data: [{ id: "t-1" }], error: null }]);
  const olderThan = "2026-11-08T10:00:00.000Z";
  const changed = await supabaseSocialStore(db).transition("t-1", ["posting"],
    { status: "failed", errorCode: "admin_confirmed_not_posted", retryable: true, finished: true },
    { olderThan, requireRetryable: true });
  assert.equal(changed, true);
  const q = db.queries[0];
  const [[patch]] = calls(q, "update");
  assert.equal(patch.status, "failed");
  assert.equal(patch.error_code, "admin_confirmed_not_posted");
  assert.equal(patch.retryable, true);
  assert.ok(patch.finished_at);
  assert.deepEqual(calls(q, "eq"), [["id", "t-1"], ["retryable", true]]);
  assert.deepEqual(calls(q, "in"), [["status", ["posting"]]]);
  assert.deepEqual(calls(q, "lte"), [["claimed_at", olderThan]]);

  // Without options: no extra filters, and fields the patch omits are left alone.
  const plain = recordingDb([{ data: [], error: null }]);
  assert.equal(await supabaseSocialStore(plain).transition("t-1", ["queued"], { status: "skipped" }), false);
  assert.deepEqual(calls(plain.queries[0], "lte"), []);
  assert.deepEqual(calls(plain.queries[0], "eq"), [["id", "t-1"]]);
  const [[plainPatch]] = calls(plain.queries[0], "update");
  assert.deepEqual(Object.keys(plainPatch).sort(), ["status", "updated_at"]);
});

test("setContainer: only while the target is posting", async () => {
  const db = recordingDb([{ data: [], error: null }]);
  assert.equal(await supabaseSocialStore(db).setContainer("t-1", "1789"), false);
  assert.deepEqual(calls(db.queries[0], "eq"), [["id", "t-1"], ["status", "posting"]]);
});

test("insertPost: a unique violation (23505) is 'conflict'; any other error throws with the code only", async () => {
  const post = {
    video: { publicId: "social/abc", url: POST_ROW.video_url, bytes: 10, format: "mp4", width: null, height: null, durationSec: 12 },
    title: "T", caption: "", dryRun: false, tiktok: null, submittedBy: "u",
  };
  const dup = recordingDb([{ data: null, error: { code: "23505", message: "duplicate key value violates social_posts_video SECRET" } }]);
  assert.equal(await supabaseSocialStore(dup).insertPost(post), "conflict");
  assert.equal(dup.queries[0].table, "social_posts");
  assert.equal(calls(dup.queries[0], "insert")[0][0].video_public_id, "social/abc");

  const other = recordingDb([{ data: null, error: { code: "42501", message: "permission denied SECRET" } }]);
  await assert.rejects(supabaseSocialStore(other).insertPost(post), (err) => {
    assert.equal(err.message, "social store insertPost failed: 42501");
    return true;
  });

  const ok = recordingDb([{ data: POST_ROW, error: null }]);
  const row = await supabaseSocialStore(ok).insertPost(post);
  assert.equal(row.id, "p-1");
});

test("insertTargets: upsert on (post_id, platform) ignoring duplicates; skipped ones are finished", async () => {
  const db = recordingDb([{ data: null, error: null }]);
  await supabaseSocialStore(db).insertTargets("p-1", [
    { platform: "facebook", status: "queued", captionTitle: "T", captionSent: "x", errorCode: null },
    { platform: "tiktok", status: "skipped", captionTitle: "", captionSent: "x", errorCode: "platform_disabled" },
  ]);
  const [[rows, opts]] = calls(db.queries[0], "upsert");
  assert.deepEqual(opts, { onConflict: "post_id,platform", ignoreDuplicates: true });
  assert.equal(rows.length, 2);
  assert.equal(rows[0].post_id, "p-1");
  assert.equal(rows[0].finished_at, null);
  assert.ok(rows[1].finished_at);
  assert.equal(rows[1].error_code, "platform_disabled");
  assert.deepEqual(calls(db.queries[0], "insert"), [], "never a plain insert");
});

test("stored TikTok choices are re-checked when read: malformed ones read as none", async () => {
  const good = { privacyLevel: "SELF_ONLY", allowComment: false, allowDuet: false, allowStitch: false, commercial: null, consent: true };
  const read = async (tiktok_choices) =>
    (await supabaseSocialStore(recordingDb([{ data: { ...POST_ROW, tiktok_choices }, error: null }])).getPost("p-1")).tiktok;
  assert.deepEqual(await read(good), good);
  assert.equal(await read({ ...good, consent: false }), null);
  assert.equal(await read(null), null);
});

// ---------- Credential store (migration 0028): compare-and-swap writes ----------

const { supabaseCredentialStore } = await import("./credential-store.ts");
const { randomBytes } = await import("node:crypto");

test("credentials: lease and put are conditional on the version read; a lost race returns no row", async () => {
  const key = randomBytes(32);
  const pair = { accessToken: "act-SECRET", accessExpiresAt: 2e12, refreshToken: "rft-SECRET", refreshExpiresAt: 3e12 };

  const lease = recordingDb([{ data: [{ version: 5 }], error: null }]);
  assert.equal(await supabaseCredentialStore(lease, key).lease("tiktok", 4, 1.8e12), 5);
  const [[leasePatch]] = calls(lease.queries[0], "update");
  assert.equal(leasePatch.version, 5);
  assert.equal(leasePatch.refresh_lease_until, new Date(1.8e12).toISOString());
  assert.deepEqual(calls(lease.queries[0], "eq"), [["platform", "tiktok"], ["version", 4]]);

  const lost = recordingDb([{ data: [], error: null }]);
  assert.equal(await supabaseCredentialStore(lost, key).lease("tiktok", 4, 1.8e12), null);

  // No row yet: an insert that ignores an existing row.
  const first = recordingDb([{ data: [], error: null }]);
  assert.equal(await supabaseCredentialStore(first, key).lease("tiktok", null, 1.8e12), null);
  const [[row, opts]] = calls(first.queries[0], "upsert");
  assert.deepEqual(opts, { onConflict: "platform", ignoreDuplicates: true });
  assert.equal(row.version, 1);

  const put = recordingDb([{ data: [{ version: 6 }], error: null }]);
  assert.equal(await supabaseCredentialStore(put, key).put("tiktok", pair, 5), true);
  const [[putPatch]] = calls(put.queries[0], "update");
  assert.equal(putPatch.version, 6);
  assert.equal(putPatch.refresh_lease_until, null);
  assert.ok(!JSON.stringify(putPatch).includes("SECRET"), "tokens are sealed");
  assert.deepEqual(calls(put.queries[0], "eq"), [["platform", "tiktok"], ["version", 5]]);
  assert.deepEqual(calls(put.queries[0], "upsert"), [], "never an unconditional upsert");

  // Read back: the sealed pair decrypts with the same key.
  const read = recordingDb([{ data: { secret: putPatch.secret, version: 6, refresh_lease_until: null }, error: null }]);
  assert.deepEqual(await supabaseCredentialStore(read, key).get("tiktok"), {
    credential: { ...pair, seed: undefined }, version: 6, leaseUntil: null,
  });
});
