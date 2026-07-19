-- Admin-reviewed feed of CAC World (cacworldnews.com) articles relevant to CACNA/North America.
-- Candidates are fetched server-side into status='pending'; an admin approves or rejects each one.
-- Only approved rows are ever shown publicly, and only as a summary card + outbound link (never a full repost).
create table public.cac_world_news (
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

alter table public.cac_world_news enable row level security;

create policy "cac_world_news_public_select" on public.cac_world_news for select using (status = 'approved' or public.is_admin());
create policy "cac_world_news_admin_write" on public.cac_world_news for all using (public.is_admin()) with check (public.is_admin());
