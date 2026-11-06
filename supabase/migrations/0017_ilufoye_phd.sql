-- Pastor Hezekiah Ilufoye holds a Ph.D., not a D.Min. (per the site owner,
-- 2026-11-03). Renames both of his rows; person_key links stay as they are.
-- Idempotent.

begin;

update cacna.leaders
   set full_name = 'Pastor Hezekiah Ilufoye, Ph.D.'
 where full_name = 'Pastor Hezekiah Ilufoye, D.Min.';

commit;
