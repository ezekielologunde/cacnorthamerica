-- Widen leaders.category to support DCC (District Church Council) Superintendents
-- as a tier distinct from Zonal Superintendents, per the 2026 convention program's
-- "CAC Latunde Region Superintendents" DCC roster.
alter table public.leaders drop constraint leaders_category_check;
alter table public.leaders add constraint leaders_category_check
  check (category in ('cacna_regional', 'global_hq', 'zonal_superintendent',
    'past_president', 'past_superintendent', 'past_evangelist', 'bible_institute', 'dcc_superintendent'));
