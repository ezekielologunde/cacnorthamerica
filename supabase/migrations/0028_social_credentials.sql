-- 0028: encrypted platform credentials for social cross-post, plus a fix to
-- 0027's platform_post_id check. Design:
-- docs/superpowers/specs/2026-11-08-social-crosspost-design.md
--
-- !!! Apply ONLY with the site owner's say-so, after 0027.
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

-- Refreshes are serialised so two requests never spend the same refresh
-- token (the loser of such a race would store a dead token, or TikTok would
-- void the winner's). Every write is a compare-and-swap on `version`: a
-- request first takes the refresh lease (version + 1, refresh_lease_until =
-- now + 15 s) and only the lease holder calls TikTok and stores the rotated
-- pair (version + 1 again, lease cleared). Anyone else re-reads and uses the
-- holder's token once it lands. A lease row may exist before the first pair
-- does (seeding from TIKTOK_REFRESH_TOKEN), so secret and the expiries are
-- null until then.
create table cacna.social_credentials (
  platform text primary key check (platform in ('tiktok')),
  -- "v1:<iv>:<tag>:<ciphertext>" (base64 parts); never plaintext.
  secret text check (secret ~ '^v1:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$'),
  access_expires_at timestamptz,
  refresh_expires_at timestamptz,
  version integer not null default 1 check (version >= 1),
  refresh_lease_until timestamptz,
  updated_at timestamptz not null default now(),
  check ((secret is null) = (access_expires_at is null) and (secret is null) = (refresh_expires_at is null))
);

alter table cacna.social_credentials enable row level security;
alter table cacna.social_credentials force row level security;
revoke all on cacna.social_credentials from anon, authenticated;
grant all on cacna.social_credentials to service_role;

-- TikTok documents publish_id only as a string of up to 64 characters; the
-- dispatcher's id check allows "~", 0027's did not, so a publish id with one
-- would have failed the status update. Align the two.
alter table cacna.social_post_targets
  drop constraint social_post_targets_platform_post_id_check;
alter table cacna.social_post_targets
  add constraint social_post_targets_platform_post_id_check
  check (platform_post_id ~ '^[A-Za-z0-9_:.~-]{1,128}$');
