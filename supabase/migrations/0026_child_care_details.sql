-- 0026: cacna.child_care_details -- Children's Ministry care details for
-- every child aged 12 or under in a Youth & Child convention registration:
-- allergies, medical notes, medications, dietary and special needs, photo
-- consent, emergency contact, authorized pickup people and the guardian's
-- consent. One row per child, keyed (ref, idx) like cacna.checkin_people.
-- Design: docs/superpowers/specs/2026-11-08-children-parent-info-design.md
--
-- !!! Apply ONLY with the site owner's say-so, and BEFORE deploying the code
-- !!! that writes it. The writer (lib/childCareStore.ts) fails closed: until
-- !!! this table exists, every Youth & Child registration that includes a
-- !!! child 12 or under is refused with "please try again".
--
-- Writer (server-side only, service_role, which bypasses RLS):
--   app/api/register/route.ts (youth track) via lib/childCareStore.ts.
-- Reader (server-side only, service_role, after requireAdmin()):
--   app/admin/(protected)/check-in/page.tsx and check-in/children/page.tsx.
--
-- Children's medical data: RLS is enabled with NO policies, and every
-- privilege is revoked from anon, authenticated and public, so neither the
-- public anon key nor a signed-in admin's own session can read or write it
-- through PostgREST. 0010's "alter default privileges ... grant select on
-- tables to anon, authenticated" would otherwise hand this table to both.
--
-- Retention: rows are only needed for the convention they belong to. Purge a
-- year once it is over (delete from cacna.child_care_details where year = N).

create table cacna.child_care_details (
  id uuid primary key default gen_random_uuid(),
  year integer not null,
  ref text not null,
  idx integer not null check (idx >= 0),
  child_name text not null check (char_length(child_name) <= 241),
  age integer not null check (age between 1 and 12),
  has_allergies boolean not null,
  -- [{ "type": "food"|"medication"|"other", "name": text, "severity":
  -- "mild"|"moderate"|"severe" }], at most 6 (lib/childCare.ts).
  allergies jsonb not null default '[]'::jsonb
    check (jsonb_typeof(allergies) = 'array' and jsonb_array_length(allergies) <= 6),
  max_allergy_severity text check (max_allergy_severity in ('mild', 'moderate', 'severe')),
  medical_notes text check (char_length(medical_notes) <= 300),
  medications text check (char_length(medications) <= 300),
  dietary_needs text check (char_length(dietary_needs) <= 200),
  special_needs text check (char_length(special_needs) <= 300),
  photo_consent boolean not null,
  emergency_name text not null check (char_length(emergency_name) <= 120),
  emergency_phone text not null check (char_length(emergency_phone) <= 40),
  emergency_relationship text check (char_length(emergency_relationship) <= 60),
  -- [{ "name": text, "phone": text }], at most 4.
  pickups jsonb not null default '[]'::jsonb
    check (jsonb_typeof(pickups) = 'array' and jsonb_array_length(pickups) <= 4),
  guardian_name text not null check (char_length(guardian_name) <= 120),
  guardian_phone text not null check (char_length(guardian_phone) <= 120),
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (ref, idx),
  check (has_allergies = (jsonb_array_length(allergies) > 0))
);

create index child_care_details_year_idx on cacna.child_care_details (year);

-- ---------- RLS ----------

alter table cacna.child_care_details enable row level security;
alter table cacna.child_care_details force row level security;
-- No policies on purpose: with RLS on and no policy, every non-bypass role
-- is denied every row.

-- ---------- Grants ----------

revoke all on cacna.child_care_details from public, anon, authenticated;
grant all on cacna.child_care_details to service_role;
