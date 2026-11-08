-- 0015: cacna.checkin_people -- one row per registrant of every successful
-- convention registration, so staff can look people up at the door by name
-- or by their 4-character check-in code (lib/checkinCode.ts).
--
-- !!! Apply ONLY with the site owner's say-so. Waiting until the code that
-- !!! writes this table is deployed is NOT required, in either order: the
-- !!! writer (lib/checkinStore.ts) is best-effort, so until this table exists
-- !!! each registration just logs "[checkin] ... failed" with its ref and
-- !!! carries on (no-op on failure), and the table sits empty until that
-- !!! code ships.
--
-- (0014 is reserved by another, unpushed branch.)
--
-- Writer (server-side only, service_role, which bypasses RLS):
--   lib/checkinStore.ts recordCheckinPeople(), called from
--     app/api/register/route.ts       free adult + free Youth & Child paths
--     app/api/stripe/webhook/route.ts paid registrations, after the sheet row
-- It upserts with on conflict (ref, idx) do nothing, so Stripe redeliveries
-- and retries never add a second row or overwrite checked_in_at.
--
-- The Google Sheet stays the record staff already use; this table is a
-- lookup copy of it. Codes are NOT globally unique (four characters, about
-- 1M combinations, see lib/checkinCode.ts): two registrations can share one,
-- so (year, code) is indexed but not unique, and staff verify the name.
--
-- PII (names, contact details, allergies): nothing public. No anon access at
-- all, and authenticated users see rows only through the admin select policy
-- below. 0010's "alter default privileges ... grant select on tables to anon,
-- authenticated" would otherwise hand every new cacna table to both roles,
-- hence the explicit revoke.

create table cacna.checkin_people (
  id uuid primary key default gen_random_uuid(),
  year integer not null,
  -- RegistrationSummary.ref and the person's position in summary.registrants:
  -- together they identify the person and derive their code.
  ref text not null,
  idx integer not null,
  full_name text not null,
  -- Crockford base32, as printed (no I, L, O or U).
  code text not null check (code ~ '^[0-9A-HJKMNP-TV-Z]{4}$'),
  category text not null,
  age integer,
  church_name text,
  dcc text,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  -- Human-readable, as on the sheet; null when meals were never asked
  -- (adult group-mode registrations).
  meals text,
  allergies text,
  payment_status text not null check (payment_status in ('free', 'paid')),
  stripe_session text,
  checked_in_at timestamptz,
  checked_in_by text,
  created_at timestamptz not null default now(),
  unique (ref, idx)
);

create index checkin_people_year_code_idx on cacna.checkin_people (year, code);

-- ---------- RLS ----------

alter table cacna.checkin_people enable row level security;

create policy "checkin_people_admin_select" on cacna.checkin_people
  for select to authenticated using (cacna.is_admin());

-- ---------- Grants ----------

revoke all on cacna.checkin_people from anon, authenticated;
grant select on cacna.checkin_people to authenticated;
grant all on cacna.checkin_people to service_role;
