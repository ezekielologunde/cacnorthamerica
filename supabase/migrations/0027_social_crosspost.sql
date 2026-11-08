-- 0027: social cross-post (admin uploads one video; the site posts it to the
-- Facebook Page, Instagram Reels and TikTok). Design:
-- docs/superpowers/specs/2026-11-08-social-crosspost-design.md
--
-- !!! Apply ONLY with the site owner's say-so. The default state posts
-- !!! nothing: the master switch and every platform toggle are off, dry run on.
--
-- Reader and writer: server-side only, through the service-role client
-- (lib/social/supabase-store.ts, app/admin/(protected)/social), after
-- requireAdmin(). RLS is enabled and forced with no policies, and anon and
-- authenticated get no privileges at all (0010's default privileges would
-- otherwise grant them select on every new cacna table). No platform token is
-- ever stored here.

-- ---------- Settings (single row) ----------

create table cacna.social_settings (
  id smallint primary key default 1 check (id = 1),
  -- Master kill switch: while false nothing is posted for real.
  posting_enabled boolean not null default false,
  -- Dry run: the whole pipeline runs with the fake adapter and the log shows
  -- what would have been posted.
  dry_run boolean not null default true,
  facebook_enabled boolean not null default false,
  instagram_enabled boolean not null default false,
  tiktok_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid
);

insert into cacna.social_settings (id) values (1);

-- ---------- Posts (one per submitted video) ----------

create table cacna.social_posts (
  id uuid primary key default gen_random_uuid(),
  video_public_id text not null check (video_public_id ~ '^social/[A-Za-z0-9_-]{1,200}$'),
  video_url text not null check (video_url ~ '^https://res\.cloudinary\.com/'),
  video_bytes bigint not null check (video_bytes > 0),
  video_format text not null check (video_format ~ '^[a-z0-9]{1,10}$'),
  video_width integer,
  video_height integer,
  video_duration_s numeric,
  -- From Cloudinary's media metadata (lib/social/cloudinary-meta.ts); null
  -- when Cloudinary didn't report them.
  video_frame_rate numeric,
  video_codec text check (video_codec ~ '^[a-z0-9_.-]{1,32}$'),
  title text not null check (char_length(title) between 1 and 100),
  caption text not null default '' check (char_length(caption) <= 2200),
  -- Frozen at submit time: a dry-run post never becomes a real one.
  dry_run boolean not null,
  submitted_by uuid not null,
  created_at timestamptz not null default now(),
  -- Idempotency: one real post and one dry run per uploaded video.
  unique (video_public_id, dry_run)
);

create index social_posts_created_idx on cacna.social_posts (created_at desc);

-- ---------- Targets (one per post and platform) ----------

create table cacna.social_post_targets (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references cacna.social_posts (id) on delete cascade,
  platform text not null check (platform in ('facebook', 'instagram', 'tiktok')),
  status text not null default 'queued'
    check (status in ('queued', 'posting', 'posted', 'failed', 'skipped')),
  -- Exactly what was (or in a dry run, would have been) sent.
  caption_title text not null default '',
  caption_sent text not null default '',
  platform_post_id text check (platform_post_id ~ '^[A-Za-z0-9_:.-]{1,128}$'),
  -- The platform-side upload a publish is waiting on (an Instagram media
  -- container). Saved while the target is `posting`, before any waiting, so a
  -- retry polls this same container instead of creating a second one.
  platform_container_id text check (platform_container_id ~ '^[A-Za-z0-9_:.~-]{1,128}$'),
  -- A sanitised identifier only: never a message, token or URL.
  error_code text check (error_code ~ '^[a-z0-9_]{1,64}$'),
  retryable boolean not null default false,
  attempts integer not null default 0 check (attempts >= 0),
  claimed_at timestamptz,
  finished_at timestamptz,
  updated_at timestamptz not null default now(),
  -- Idempotency: one target row, so at most one live publish, per platform.
  unique (post_id, platform)
);

-- ---------- RLS: service role only ----------

alter table cacna.social_settings enable row level security;
alter table cacna.social_settings force row level security;
alter table cacna.social_posts enable row level security;
alter table cacna.social_posts force row level security;
alter table cacna.social_post_targets enable row level security;
alter table cacna.social_post_targets force row level security;

revoke all on cacna.social_settings from anon, authenticated;
revoke all on cacna.social_posts from anon, authenticated;
revoke all on cacna.social_post_targets from anon, authenticated;

grant all on cacna.social_settings to service_role;
grant all on cacna.social_posts to service_role;
grant all on cacna.social_post_targets to service_role;
