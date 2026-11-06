-- 0025: publishers for blog posts (name, role, profile picture). A post can have several.
-- Additive: existing rows get an empty list and show "CACNA" as the publisher.
-- Apply BEFORE deploying the code that selects this column.
alter table cacna.blog_posts add column if not exists authors jsonb not null default '[]'::jsonb;
