-- CACNA site content schema (see plan: glowing-riding-tulip.md)

create extension if not exists "pgcrypto";

-- ---------- profiles (admin users) ----------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'editor' check (role in ('super_admin', 'editor')),
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true
  );
$$;

-- ---------- events ----------

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  event_type text not null default 'service' check (event_type in ('convention', 'service', 'special')),
  start_date date not null,
  end_date date not null,
  location text not null default '',
  banner_image_url text,
  theme_text text,
  is_published boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- departments ----------

create table public.departments (
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

-- ---------- sermons / livestreams ----------

create table public.sermons_livestreams (
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

-- ---------- announcements ----------

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  starts_at date,
  expires_at date,
  is_pinned boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- member church directory ----------

create table public.churches (
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

-- ---------- media ----------

create table public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt_text text not null default '',
  caption text,
  album text not null default 'general',
  sort_order integer not null default 0,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ---------- flexible page content ----------

create table public.site_content (
  page_key text not null,
  section_key text not null,
  content text not null default '',
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  primary key (page_key, section_key)
);

-- ---------- global site settings (singleton) ----------

create table public.site_settings (
  id boolean primary key default true check (id),
  church_name text not null default '',
  contact_email text not null default '',
  contact_phone text not null default '',
  address text not null default '',
  facebook_url text,
  instagram_url text,
  youtube_url text,
  prayer_line_number text,
  prayer_line_access_code text,
  prayer_line_time text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (true);

-- ---------- RLS ----------

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.departments enable row level security;
alter table public.sermons_livestreams enable row level security;
alter table public.announcements enable row level security;
alter table public.churches enable row level security;
alter table public.media enable row level security;
alter table public.site_content enable row level security;
alter table public.site_settings enable row level security;

-- profiles: users can read their own row; admins can read/manage all
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- public-readable content tables: published rows to anyone, everything to admins
create policy "events_public_select" on public.events
  for select using (is_published = true or public.is_admin());
create policy "events_admin_write" on public.events
  for insert with check (public.is_admin());
create policy "events_admin_update" on public.events
  for update using (public.is_admin()) with check (public.is_admin());
create policy "events_admin_delete" on public.events
  for delete using (public.is_admin());

create policy "departments_public_select" on public.departments
  for select using (is_published = true or public.is_admin());
create policy "departments_admin_write" on public.departments
  for insert with check (public.is_admin());
create policy "departments_admin_update" on public.departments
  for update using (public.is_admin()) with check (public.is_admin());
create policy "departments_admin_delete" on public.departments
  for delete using (public.is_admin());

create policy "sermons_public_select" on public.sermons_livestreams
  for select using (is_published = true or public.is_admin());
create policy "sermons_admin_write" on public.sermons_livestreams
  for insert with check (public.is_admin());
create policy "sermons_admin_update" on public.sermons_livestreams
  for update using (public.is_admin()) with check (public.is_admin());
create policy "sermons_admin_delete" on public.sermons_livestreams
  for delete using (public.is_admin());

create policy "announcements_public_select" on public.announcements
  for select using (is_published = true or public.is_admin());
create policy "announcements_admin_write" on public.announcements
  for insert with check (public.is_admin());
create policy "announcements_admin_update" on public.announcements
  for update using (public.is_admin()) with check (public.is_admin());
create policy "announcements_admin_delete" on public.announcements
  for delete using (public.is_admin());

create policy "churches_public_select" on public.churches
  for select using (is_published = true or public.is_admin());
create policy "churches_admin_write" on public.churches
  for insert with check (public.is_admin());
create policy "churches_admin_update" on public.churches
  for update using (public.is_admin()) with check (public.is_admin());
create policy "churches_admin_delete" on public.churches
  for delete using (public.is_admin());

create policy "media_public_select" on public.media
  for select using (true);
create policy "media_admin_write" on public.media
  for insert with check (public.is_admin());
create policy "media_admin_delete" on public.media
  for delete using (public.is_admin());

create policy "site_content_public_select" on public.site_content
  for select using (true);
create policy "site_content_admin_write" on public.site_content
  for insert with check (public.is_admin());
create policy "site_content_admin_update" on public.site_content
  for update using (public.is_admin()) with check (public.is_admin());

create policy "site_settings_public_select" on public.site_settings
  for select using (true);
create policy "site_settings_admin_update" on public.site_settings
  for update using (public.is_admin()) with check (public.is_admin());
