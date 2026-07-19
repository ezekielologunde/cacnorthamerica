-- Widen leaders.category to support the CACNA Bible Institute leadership team
-- (Chancellor/Provost/Dean/Registrar/Lecturer), sourced from the 2026 convention
-- program book.
alter table public.leaders drop constraint leaders_category_check;
alter table public.leaders add constraint leaders_category_check
  check (category in ('cacna_regional', 'global_hq', 'zonal_superintendent',
    'past_president', 'past_superintendent', 'past_evangelist', 'bible_institute'));
