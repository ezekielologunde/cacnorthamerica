-- 0011: close direct anon/authenticated INSERT into the two public-form tables
-- (security finding admin-auth-2).
--
-- !!! APPLY ORDER: apply this migration ONLY AFTER the PR that moves
-- !!! app/newsletter/actions.ts (subscribeAction) off the anon/session client
-- !!! and onto createServiceClient() has been merged AND deployed to
-- !!! production. Until then subscribeAction still upserts as anon, and
-- !!! applying this would break newsletter signup on the live site.
--
-- Why: 0010 granted INSERT on these tables to anon + authenticated with
-- WITH CHECK (true) policies, and the cacna schema is exposed to PostgREST.
-- Anyone holding the public anon key could POST straight to
-- /rest/v1/contact_submissions or /rest/v1/newsletter_subscribers and skip
-- every server-side check (rate limit, honeypot, spam filter, length caps),
-- e.g. planting thousands of addresses that the next admin broadcast emails.
--
-- Writers after this migration (all server-side, service_role, which keeps
-- its 0010 "grant all" and bypasses RLS):
--   contact_submissions    <- app/api/contact/route.ts (createServiceClient)
--   newsletter_subscribers <- app/newsletter/actions.ts (createServiceClient,
--                             once the PR above lands)
-- Admin reads/updates already go through the service client, so the admin
-- select/update/delete policies from 0010 are left as they are.

revoke insert on cacna.contact_submissions from anon, authenticated;
revoke insert on cacna.newsletter_subscribers from anon, authenticated;

drop policy if exists "contact_submissions_public_insert" on cacna.contact_submissions;
drop policy if exists "newsletter_subscribers_public_insert" on cacna.newsletter_subscribers;
