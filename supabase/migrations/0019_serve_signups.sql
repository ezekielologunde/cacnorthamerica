-- 0019: cacna.serve_signups -- one row per "Serve at the Convention" sign-up
-- from the public /serve page.
--
-- !!! Apply ONLY with the site owner's say-so. Until it is applied the route
-- !!! still sends the committee notice and logs the Google Sheet row, but
-- !!! saves no row and sends no confirmation email to the volunteer (the
-- !!! one-a-day check reads this table and fails closed).
--
-- Writer (server-side only, service_role, which bypasses RLS):
--   app/api/serve/route.ts. It also reads this table to cap the volunteer's
--   confirmation email at one per address per day. Public forms never get anon
--   INSERT (see 0011_revoke_public_form_inserts.sql). An admin may read. 0010's
--   default privileges would grant select to anon and authenticated on every
--   new cacna table, hence the explicit revoke.
--
-- teams holds ids from lib/serveTeams.ts (e.g. 'ushers', 'choir').

create table cacna.serve_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  teams text[] not null check (cardinality(teams) > 0),
  note text,
  under_18 boolean not null default false,
  guardian_consent boolean not null default false,
  convention_year integer,
  created_at timestamptz not null default now()
);

-- The confirmation cap filters on created_at (last 24 hours), then email.
create index serve_signups_created_idx on cacna.serve_signups (created_at);

-- ---------- RLS ----------

alter table cacna.serve_signups enable row level security;

create policy "serve_signups_admin_select" on cacna.serve_signups
  for select to authenticated using (cacna.is_admin());

-- ---------- Grants ----------

revoke all on cacna.serve_signups from anon, authenticated;
grant select on cacna.serve_signups to authenticated;
grant all on cacna.serve_signups to service_role;
