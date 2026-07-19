-- The Convention registration/schedule feature (Phase 16) was reverted:
-- the standalone Convention project (cacna-convention.vercel.app /
-- cacnaconvention.org) remains the single source for the convention
-- website and its registration system, not CACNA. All 4 tables were
-- empty except convention_schedule_sessions (22 rows, a duplicate of
-- data that already lives in the Convention project's own database).
drop table if exists public.convention_registrants;
drop table if exists public.convention_registrations;
drop table if exists public.convention_pricing_tiers;
drop table if exists public.convention_schedule_sessions;
