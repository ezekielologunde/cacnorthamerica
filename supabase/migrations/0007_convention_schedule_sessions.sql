create table public.convention_schedule_sessions (
  id uuid primary key default gen_random_uuid(),
  year integer not null,
  day_date date not null,
  starts_at time not null,
  ends_at time,
  title text not null,
  minister_name text,
  minister_title text,
  track text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index convention_schedule_sessions_year_idx on public.convention_schedule_sessions (year, day_date, sort_order);

alter table public.convention_schedule_sessions enable row level security;

create policy "Public can view schedule sessions"
  on public.convention_schedule_sessions for select
  using (true);

create policy "Admins can manage schedule sessions"
  on public.convention_schedule_sessions for all
  using (is_admin())
  with check (is_admin());
