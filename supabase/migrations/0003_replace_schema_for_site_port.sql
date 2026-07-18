-- Full site replacement: drop the CACNA-specific CMS schema's colliding
-- tables (events/announcements) and their dependents, then create the
-- cac-salvation-center schema exactly (reverse-engineered from its
-- committed types/database.types.ts, since it ships no .sql migrations).
--
-- Applied directly via the Supabase MCP; this file documents that change
-- for history. Pre-existing tables from the phase-1/phase-2 CACNA CMS
-- (churches, departments, leaders, media, profiles, sermons_livestreams,
-- site_content, site_settings, tenets) are left in place, unused by the
-- new codebase, in case any of that data is still wanted later.

drop table if exists public.event_registrants cascade;
drop table if exists public.event_registrations cascade;
drop table if exists public.event_pricing_tiers cascade;
drop table if exists public.events cascade;
drop table if exists public.announcements cascade;

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from public.admin_profiles where id = auth.uid());
$$;

create table public.announcements (
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

create table public.events (
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

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null default '',
  published boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  cloudinary_public_id text not null,
  alt_text text,
  caption text,
  category text not null default 'general',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text,
  active boolean default true,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'general',
  description text,
  price_cents integer not null default 0,
  price_display text not null default '',
  badge text,
  image_url text,
  image_alt text,
  is_digital boolean not null default false,
  digital_file_url text,
  order_method text not null default 'stripe',
  external_label text,
  external_link text,
  stripe_price_id text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent text,
  customer_email text not null,
  customer_name text,
  customer_phone text,
  amount_total integer not null,
  currency text default 'usd',
  line_items jsonb not null default '[]'::jsonb,
  shipping_name text,
  shipping_line1 text,
  shipping_line2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal_code text,
  shipping_country text,
  status text default 'pending',
  tracking_number text,
  shipped_at timestamptz,
  refunded_amount integer,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  request text not null,
  urgent boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.testimonies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  content text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- RLS ----------

alter table public.admin_profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.gallery_images enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.testimonies enable row level security;

create policy "admin_profiles_self_select" on public.admin_profiles for select using (auth.uid() = id);
create policy "admin_profiles_admin_all" on public.admin_profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "announcements_public_select" on public.announcements for select using (active = true or public.is_admin());
create policy "announcements_admin_write" on public.announcements for all using (public.is_admin()) with check (public.is_admin());

create policy "events_public_select" on public.events for select using (published = true or public.is_admin());
create policy "events_admin_write" on public.events for all using (public.is_admin()) with check (public.is_admin());

create policy "blog_posts_public_select" on public.blog_posts for select using (published = true or public.is_admin());
create policy "blog_posts_admin_write" on public.blog_posts for all using (public.is_admin()) with check (public.is_admin());

create policy "gallery_images_public_select" on public.gallery_images for select using (published = true or public.is_admin());
create policy "gallery_images_admin_write" on public.gallery_images for all using (public.is_admin()) with check (public.is_admin());

create policy "products_public_select" on public.products for select using (published = true or public.is_admin());
create policy "products_admin_write" on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy "testimonies_public_select" on public.testimonies for select using (approved = true or public.is_admin());
create policy "testimonies_public_insert" on public.testimonies for insert with check (true);
create policy "testimonies_admin_write" on public.testimonies for update using (public.is_admin()) with check (public.is_admin());
create policy "testimonies_admin_delete" on public.testimonies for delete using (public.is_admin());

create policy "contact_submissions_public_insert" on public.contact_submissions for insert with check (true);
create policy "contact_submissions_admin_all" on public.contact_submissions for select using (public.is_admin());
create policy "contact_submissions_admin_update" on public.contact_submissions for update using (public.is_admin()) with check (public.is_admin());
create policy "contact_submissions_admin_delete" on public.contact_submissions for delete using (public.is_admin());

create policy "prayer_requests_public_insert" on public.prayer_requests for insert with check (true);
create policy "prayer_requests_admin_all" on public.prayer_requests for select using (public.is_admin());
create policy "prayer_requests_admin_update" on public.prayer_requests for update using (public.is_admin()) with check (public.is_admin());
create policy "prayer_requests_admin_delete" on public.prayer_requests for delete using (public.is_admin());

create policy "newsletter_subscribers_public_insert" on public.newsletter_subscribers for insert with check (true);
create policy "newsletter_subscribers_admin_all" on public.newsletter_subscribers for select using (public.is_admin());
create policy "newsletter_subscribers_admin_update" on public.newsletter_subscribers for update using (public.is_admin()) with check (public.is_admin());
create policy "newsletter_subscribers_admin_delete" on public.newsletter_subscribers for delete using (public.is_admin());

create policy "orders_admin_all" on public.orders for select using (public.is_admin());
create policy "orders_service_insert" on public.orders for insert with check (true);
create policy "orders_admin_update" on public.orders for update using (public.is_admin()) with check (public.is_admin());
