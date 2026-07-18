-- Phase 2: leadership/zones directory, doctrinal tenets, event registration
-- (see plan: glowing-riding-tulip.md, "Phase 2")

create table public.leaders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text not null default '',
  category text not null check (category in (
    'cacna_regional', 'global_hq', 'zonal_superintendent',
    'past_president', 'past_superintendent', 'past_evangelist'
  )),
  bio text,
  photo_url text,
  zone_name text,
  phone text,
  email text,
  tenure_start text,
  tenure_end text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tenets (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  title text not null,
  body text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  category text not null check (category in ('adult', 'young_adult', 'child')),
  price_cents integer not null default 0,
  starts_on date,
  ends_on date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  registration_type text not null default 'individual' check (registration_type in ('individual', 'group')),
  church_name text,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_registrants (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.event_registrations(id) on delete cascade,
  full_name text not null,
  category text not null default 'adult' check (category in ('adult', 'young_adult', 'child')),
  created_at timestamptz not null default now()
);

-- ---------- RLS ----------

alter table public.leaders enable row level security;
alter table public.tenets enable row level security;
alter table public.event_pricing_tiers enable row level security;
alter table public.event_registrations enable row level security;
alter table public.event_registrants enable row level security;

create policy "leaders_public_select" on public.leaders
  for select using (is_published = true or public.is_admin());
create policy "leaders_admin_write" on public.leaders
  for insert with check (public.is_admin());
create policy "leaders_admin_update" on public.leaders
  for update using (public.is_admin()) with check (public.is_admin());
create policy "leaders_admin_delete" on public.leaders
  for delete using (public.is_admin());

create policy "tenets_public_select" on public.tenets
  for select using (is_published = true or public.is_admin());
create policy "tenets_admin_write" on public.tenets
  for insert with check (public.is_admin());
create policy "tenets_admin_update" on public.tenets
  for update using (public.is_admin()) with check (public.is_admin());
create policy "tenets_admin_delete" on public.tenets
  for delete using (public.is_admin());

create policy "pricing_public_select" on public.event_pricing_tiers
  for select using (true);
create policy "pricing_admin_write" on public.event_pricing_tiers
  for insert with check (public.is_admin());
create policy "pricing_admin_update" on public.event_pricing_tiers
  for update using (public.is_admin()) with check (public.is_admin());
create policy "pricing_admin_delete" on public.event_pricing_tiers
  for delete using (public.is_admin());

-- registrations/registrants: anyone can submit (insert), only admins can read/manage
create policy "registrations_public_insert" on public.event_registrations
  for insert with check (true);
create policy "registrations_admin_select" on public.event_registrations
  for select using (public.is_admin());
create policy "registrations_admin_update" on public.event_registrations
  for update using (public.is_admin()) with check (public.is_admin());
create policy "registrations_admin_delete" on public.event_registrations
  for delete using (public.is_admin());

create policy "registrants_public_insert" on public.event_registrants
  for insert with check (true);
create policy "registrants_admin_select" on public.event_registrants
  for select using (public.is_admin());
create policy "registrants_admin_update" on public.event_registrants
  for update using (public.is_admin()) with check (public.is_admin());
create policy "registrants_admin_delete" on public.event_registrants
  for delete using (public.is_admin());
