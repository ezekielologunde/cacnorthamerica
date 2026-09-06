-- CACNA's own Supabase project no longer exists -- confirmed 2026-09-06 via
-- the Supabase management API: it's not in the account's project list, and
-- its hostname doesn't resolve. Every admin_profiles/blog_posts/events/etc.
-- query had been silently failing since (createServiceClient() falls back
-- to the anon key and swallows errors by design), with no visible symptom
-- other than "admin login doesn't work" and the DB announcement banner
-- never once showing.
--
-- Repointed at the sibling cac-salvation-center Supabase project, but NOT
-- its public schema -- that already has same-named tables (blog_posts,
-- events, admin_profiles, contact_submissions with real rows) serving that
-- live site. Applied directly via the Supabase MCP (like migration 0003
-- before it) rather than through the CLI, since this project has no local
-- Supabase CLI link; this file documents that change for history, same as
-- 0003's own note. Schema shape below is reverse-engineered from the
-- pre-rename database.types.ts (all 16 tables it listed under "public",
-- which now live under "cacna" -- see types/database.types.ts's own header
-- comment for why the TypeScript schema key had to be renamed to match).

create schema if not exists cacna;
create extension if not exists "pgcrypto";

create table cacna.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create function cacna.is_admin()
returns boolean
language sql
security definer set search_path = cacna
stable
as $$
  select exists (select 1 from cacna.admin_profiles where id = auth.uid());
$$;

create table cacna.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  active boolean not null default true,
  bg_color text not null default '#9e1b1b',
  text_color text not null default '#ffffff',
  cta_text text,
  cta_url text,
  placement text not null default 'site',
  sort_order integer not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table cacna.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  end_date timestamptz,
  location text,
  event_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cacna.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null default '',
  image_url text,
  image_alt text,
  published boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cacna.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table cacna.gallery_images (
  id uuid primary key default gen_random_uuid(),
  cloudinary_public_id text not null,
  alt_text text,
  caption text,
  category text not null default 'general',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table cacna.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text,
  active boolean default true,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

create table cacna.cac_world_news (
  id uuid primary key default gen_random_uuid(),
  source_url text not null unique,
  title text not null,
  excerpt text,
  image_url text,
  published_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  fetched_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- Legacy (kept for FK compatibility with media/site_content below).
create table cacna.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'editor' check (role in ('super_admin', 'editor')),
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table cacna.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  leader_name text,
  contact_email text,
  contact_phone text,
  image_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cacna.sermons_livestreams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker text,
  stream_url text not null,
  platform text not null default 'youtube' check (platform in ('youtube', 'facebook', 'zoom', 'other')),
  is_live boolean not null default false,
  scheduled_at timestamptz,
  recording_url text,
  thumbnail_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cacna.churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null default '',
  city text not null default '',
  region text not null default '',
  country text not null default 'USA',
  lat double precision,
  lng double precision,
  contact_phone text,
  website_url text,
  category text not null default 'member' check (category in ('member', 'partner')),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cacna.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt_text text not null default '',
  caption text,
  album text not null default 'general',
  sort_order integer not null default 0,
  uploaded_by uuid references cacna.profiles(id),
  created_at timestamptz not null default now()
);

create table cacna.site_content (
  page_key text not null,
  section_key text not null,
  content text not null default '',
  updated_by uuid references cacna.profiles(id),
  updated_at timestamptz not null default now(),
  primary key (page_key, section_key)
);

create table cacna.site_settings (
  id boolean primary key default true check (id),
  church_name text not null default '',
  contact_email text not null default '',
  contact_phone text not null default '',
  address text not null default '',
  facebook_url text,
  instagram_url text,
  twitter_url text,
  youtube_url text,
  prayer_line_number text,
  prayer_line_access_code text,
  prayer_line_time text,
  updated_at timestamptz not null default now()
);

insert into cacna.site_settings (id) values (true);

create table cacna.leaders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text not null default '',
  category text not null check (category in (
    'cacna_regional', 'global_hq', 'zonal_superintendent',
    'past_president', 'past_superintendent', 'past_evangelist',
    'bible_institute', 'dcc_superintendent'
  )),
  bio text,
  photo_url text,
  zone_name text,
  phone text,
  email text,
  -- Bare years only (e.g. 1943); integer, not text -- matches the live
  -- pre-rename database.types.ts, which the first pass of this migration
  -- got wrong by copying an older .sql migration's (text) column type
  -- instead. That mismatch, plus the missing person_key column below
  -- (also undocumented in any .sql migration -- applied directly via MCP
  -- at some point after 0002), made every leaders query error out
  -- silently (lib/leaders.ts only destructures { data }, dropping the
  -- error), which is why Pastor Agbeja's photo and the whole /leadership
  -- page went blank even after the schema/db.schema fix. Both wrong here
  -- from the start in this file for the same reason as the runtime fix
  -- was needed twice.
  tenure_start integer,
  tenure_end integer,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Stable slug linking multiple role-rows to the same real person (e.g.
  -- "david-adenodi" across his cacna_regional, bible_institute, and
  -- dcc_superintendent rows). Null for leaders who only hold one role.
  person_key text
);

create table cacna.tenets (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  title text not null,
  body text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- RLS ----------

alter table cacna.admin_profiles enable row level security;
alter table cacna.announcements enable row level security;
alter table cacna.events enable row level security;
alter table cacna.blog_posts enable row level security;
alter table cacna.contact_submissions enable row level security;
alter table cacna.gallery_images enable row level security;
alter table cacna.newsletter_subscribers enable row level security;
alter table cacna.cac_world_news enable row level security;
alter table cacna.profiles enable row level security;
alter table cacna.departments enable row level security;
alter table cacna.sermons_livestreams enable row level security;
alter table cacna.churches enable row level security;
alter table cacna.media enable row level security;
alter table cacna.site_content enable row level security;
alter table cacna.site_settings enable row level security;
alter table cacna.leaders enable row level security;
alter table cacna.tenets enable row level security;

create policy "admin_profiles_self_select" on cacna.admin_profiles for select using (auth.uid() = id);
create policy "admin_profiles_admin_all" on cacna.admin_profiles for all using (cacna.is_admin()) with check (cacna.is_admin());

create policy "announcements_public_select" on cacna.announcements for select using (active = true or cacna.is_admin());
create policy "announcements_admin_write" on cacna.announcements for all using (cacna.is_admin()) with check (cacna.is_admin());

create policy "events_public_select" on cacna.events for select using (published = true or cacna.is_admin());
create policy "events_admin_write" on cacna.events for all using (cacna.is_admin()) with check (cacna.is_admin());

create policy "blog_posts_public_select" on cacna.blog_posts for select using (published = true or cacna.is_admin());
create policy "blog_posts_admin_write" on cacna.blog_posts for all using (cacna.is_admin()) with check (cacna.is_admin());

create policy "contact_submissions_public_insert" on cacna.contact_submissions for insert with check (true);
create policy "contact_submissions_admin_all" on cacna.contact_submissions for select using (cacna.is_admin());
create policy "contact_submissions_admin_update" on cacna.contact_submissions for update using (cacna.is_admin()) with check (cacna.is_admin());
create policy "contact_submissions_admin_delete" on cacna.contact_submissions for delete using (cacna.is_admin());

create policy "gallery_images_public_select" on cacna.gallery_images for select using (published = true or cacna.is_admin());
create policy "gallery_images_admin_write" on cacna.gallery_images for all using (cacna.is_admin()) with check (cacna.is_admin());

create policy "newsletter_subscribers_public_insert" on cacna.newsletter_subscribers for insert with check (true);
create policy "newsletter_subscribers_admin_all" on cacna.newsletter_subscribers for select using (cacna.is_admin());
create policy "newsletter_subscribers_admin_update" on cacna.newsletter_subscribers for update using (cacna.is_admin()) with check (cacna.is_admin());
create policy "newsletter_subscribers_admin_delete" on cacna.newsletter_subscribers for delete using (cacna.is_admin());

create policy "cac_world_news_public_select" on cacna.cac_world_news for select using (status = 'approved' or cacna.is_admin());
create policy "cac_world_news_admin_write" on cacna.cac_world_news for all using (cacna.is_admin()) with check (cacna.is_admin());

create policy "profiles_self_select" on cacna.profiles for select using (auth.uid() = id);
create policy "profiles_admin_all" on cacna.profiles for all using (cacna.is_admin()) with check (cacna.is_admin());

create policy "departments_public_select" on cacna.departments for select using (is_published = true or cacna.is_admin());
create policy "departments_admin_write" on cacna.departments for insert with check (cacna.is_admin());
create policy "departments_admin_update" on cacna.departments for update using (cacna.is_admin()) with check (cacna.is_admin());
create policy "departments_admin_delete" on cacna.departments for delete using (cacna.is_admin());

create policy "sermons_public_select" on cacna.sermons_livestreams for select using (is_published = true or cacna.is_admin());
create policy "sermons_admin_write" on cacna.sermons_livestreams for insert with check (cacna.is_admin());
create policy "sermons_admin_update" on cacna.sermons_livestreams for update using (cacna.is_admin()) with check (cacna.is_admin());
create policy "sermons_admin_delete" on cacna.sermons_livestreams for delete using (cacna.is_admin());

create policy "churches_public_select" on cacna.churches for select using (is_published = true or cacna.is_admin());
create policy "churches_admin_write" on cacna.churches for insert with check (cacna.is_admin());
create policy "churches_admin_update" on cacna.churches for update using (cacna.is_admin()) with check (cacna.is_admin());
create policy "churches_admin_delete" on cacna.churches for delete using (cacna.is_admin());

create policy "media_public_select" on cacna.media for select using (true);
create policy "media_admin_write" on cacna.media for insert with check (cacna.is_admin());
create policy "media_admin_delete" on cacna.media for delete using (cacna.is_admin());

create policy "site_content_public_select" on cacna.site_content for select using (true);
create policy "site_content_admin_write" on cacna.site_content for insert with check (cacna.is_admin());
create policy "site_content_admin_update" on cacna.site_content for update using (cacna.is_admin()) with check (cacna.is_admin());

create policy "site_settings_public_select" on cacna.site_settings for select using (true);
create policy "site_settings_admin_update" on cacna.site_settings for update using (cacna.is_admin()) with check (cacna.is_admin());

create policy "leaders_public_select" on cacna.leaders for select using (is_published = true or cacna.is_admin());
create policy "leaders_admin_write" on cacna.leaders for insert with check (cacna.is_admin());
create policy "leaders_admin_update" on cacna.leaders for update using (cacna.is_admin()) with check (cacna.is_admin());
create policy "leaders_admin_delete" on cacna.leaders for delete using (cacna.is_admin());

create policy "tenets_public_select" on cacna.tenets for select using (is_published = true or cacna.is_admin());
create policy "tenets_admin_write" on cacna.tenets for insert with check (cacna.is_admin());
create policy "tenets_admin_update" on cacna.tenets for update using (cacna.is_admin()) with check (cacna.is_admin());
create policy "tenets_admin_delete" on cacna.tenets for delete using (cacna.is_admin());

-- ---------- Grants (a brand new schema has none of these by default,
-- even for tables the roles above are allowed to touch per RLS) ----------

grant usage on schema cacna to anon, authenticated, service_role;
grant all on all tables in schema cacna to service_role;
grant all on all sequences in schema cacna to service_role;
grant all on all routines in schema cacna to service_role;
grant select on all tables in schema cacna to anon, authenticated;
grant insert on cacna.contact_submissions to anon, authenticated;
grant insert on cacna.newsletter_subscribers to anon, authenticated;
alter default privileges in schema cacna grant all on tables to service_role;
alter default privileges in schema cacna grant select on tables to anon, authenticated;

-- Expose the schema to PostgREST (Supabase's dashboard "Exposed schemas"
-- setting does the same thing but wasn't available from this MCP-only
-- flow -- worth doing there too at some point so the Supabase security
-- advisor can actually see this schema).
alter role authenticator set pgrst.db_schemas = 'public, cacna';
select pg_notify('pgrst', 'reload config');

-- ---------- Seed: the one leader record actually needed right now ----------
-- (Pastor Agbeja's photo not showing on the homepage was the reported bug;
-- the rest of the real leadership roster needs the site owner's input to
-- reconstruct properly rather than guessing from scraps in the codebase.)

insert into cacna.leaders (full_name, title, category, photo_url, sort_order, is_published)
values ('Pastor Dr. T.O. Agbeja', 'Regional Superintendent, CACNA', 'cacna_regional', '/images/pastor-agbeja-portrait.jpg', 0, true);
