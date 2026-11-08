-- 0027: encrypted platform credentials for social cross-post, plus a fix to
-- 0026's platform_post_id check. Design:
-- docs/superpowers/specs/2026-11-08-social-crosspost-design.md
--
-- !!! Apply ONLY with the site owner's say-so, after 0026.
--
-- TikTok's refresh token changes on every refresh (the old one stops
-- working), so it can't live in an env var: the current access/refresh pair
-- is kept here, sealed with AES-256-GCM by the server
-- (lib/social/token-crypto.ts). The key is the SOCIAL_TOKEN_ENCRYPTION_KEY env
-- var and is never stored in the database. Facebook and Instagram use
-- non-expiring Page tokens from env vars and have no row here.
--
-- Reader and writer: lib/social/credential-store.ts through the service-role
-- client only. RLS forced, no policies, nothing granted to anon/authenticated.

create table cacna.social_credentials (
  platform text primary key check (platform in ('tiktok')),
  -- "v1:<iv>:<tag>:<ciphertext>" (base64 parts); never plaintext.
  secret text not null check (secret ~ '^v1:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$'),
  access_expires_at timestamptz not null,
  refresh_expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table cacna.social_credentials enable row level security;
alter table cacna.social_credentials force row level security;
revoke all on cacna.social_credentials from anon, authenticated;
grant all on cacna.social_credentials to service_role;

-- TikTok documents publish_id only as a string of up to 64 characters; the
-- dispatcher's id check allows "~", 0026's did not, so a publish id with one
-- would have failed the status update. Align the two.
alter table cacna.social_post_targets
  drop constraint social_post_targets_platform_post_id_check;
alter table cacna.social_post_targets
  add constraint social_post_targets_platform_post_id_check
  check (platform_post_id ~ '^[A-Za-z0-9_:.~-]{1,128}$');
