-- 0016: Zelle registrations in cacna.checkin_people.
--
-- !!! Apply ONLY with the site owner's say-so, and BEFORE deploying the code
-- !!! that ships with it: the admin check-in page selects zelle_ref, so until
-- !!! this runs that page shows "Couldn't load the check-in list". The
-- !!! register route's writer (lib/checkinStore.ts) stays best-effort: until
-- !!! then Zelle rows fail to insert and are logged ("[checkin] ...") while
-- !!! free and card rows are unaffected (they never send zelle_ref).
--
-- A registrant who chooses Zelle (app/api/register/route.ts) is stored as
-- payment_status 'awaiting_zelle' with the registration's Zelle reference
-- (lib/zelleReference.ts, "ZEL-" + 8 Crockford characters). An admin marks
-- them paid from /admin/check-in once the money arrives
-- (markZellePaid: 'awaiting_zelle' -> 'paid' only).
--
-- 0015's check constraint was unnamed, so Postgres named it
-- checkin_people_payment_status_check; it is replaced with a named one.

alter table cacna.checkin_people
  drop constraint checkin_people_payment_status_check;

alter table cacna.checkin_people
  add constraint checkin_people_payment_status_allowed
  check (payment_status in ('free', 'paid', 'awaiting_zelle'));

alter table cacna.checkin_people
  add column zelle_ref text
  check (zelle_ref is null or zelle_ref ~ '^ZEL-[0-9A-HJKMNP-TV-Z]{8}$');
