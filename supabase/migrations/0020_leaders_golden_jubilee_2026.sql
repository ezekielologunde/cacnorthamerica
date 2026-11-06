-- 0020 (APPLIED to the live project 2026-11-05 as "leaders_golden_jubilee_2026"): update cacna.leaders from the Golden Jubilee brochure (10 Oct 2026), page 12
-- "CAC Latunde Region Superintendents", at the site owner's instruction ("follow brochure").
--
-- Changes (each guarded by the previous value so a re-run is a no-op):
--  1. Four superintendents replaced. The previous person's photo and bio are cleared so the
--     new name never shows someone else's portrait; the page falls back to initials.
--  2. Three zones added (Staten Island, Ontario, Winnipeg), text only, no photo.
--  3. Chancellor role for Pastor Agbeja added to the Bible Institute list.
--  4. Regional roles printed on the brochure appended to seven superintendents' titles.
--  5. Two spellings follow the brochure (Aroniyi, Zaccheaus).
-- zone_name values are NOT renamed: lib/churches.ts matches them exactly for the church
-- directory (the brochure now says "Vineyard of Comfort" where the table says "Agbala Itura";
-- that rename needs a coordinated code change and is left for a follow-up).

begin;

-- 1. Replaced superintendents.
update cacna.leaders set full_name = 'Pastor Richard B. Olowomeye, Ph.D.', photo_url = null, bio = null, person_key = null, updated_at = now()
  where zone_name = 'Bethel DCC' and full_name like 'Pastor John Oluwatimilehin%';
update cacna.leaders set full_name = 'Pastor Johnson Adeleke', title = 'Superintendent', photo_url = null, bio = null, person_key = null, updated_at = now()
  where zone_name = 'Western DCC' and full_name like 'Pastor Samuel Olomoniyi%';
update cacna.leaders set full_name = 'Pastor Gabriel Olukitibi', photo_url = null, bio = null, person_key = null, updated_at = now()
  where zone_name = 'South Florida DCC' and full_name = 'Pastor Sola Rotimi';
update cacna.leaders set full_name = 'Pastor Joseph Ademoye', photo_url = null, bio = null, person_key = null, updated_at = now()
  where zone_name = 'Philadelphia' and full_name = 'Pastor Chris Ogunleye';

-- 2. New zones.
insert into cacna.leaders (full_name, title, category, zone_name, sort_order)
select v.full_name, 'Superintendent', 'zonal_superintendent', v.zone_name, v.sort_order
from (values
  ('Pastor Olumide Abikoye', 'Staten Island', 13),
  ('Pastor Elisha Ayantokun', 'Ontario', 14),
  ('Pastor Samuel Fela Keshinro', 'Winnipeg', 15)
) as v(full_name, zone_name, sort_order)
where not exists (select 1 from cacna.leaders l where l.zone_name = v.zone_name and l.category = 'zonal_superintendent');

-- 3. Chancellor, CACNA Bible Institute (same person as the Regional Superintendent).
insert into cacna.leaders (full_name, title, category, photo_url, sort_order, person_key)
select full_name, 'Chancellor, CACNA Bible Institute', 'bible_institute', photo_url, 0, person_key
from cacna.leaders
where category = 'cacna_regional' and person_key = 'timothy-agbeja' and title = 'Regional Superintendent, CACNA'
  and not exists (select 1 from cacna.leaders where category = 'bible_institute' and title = 'Chancellor, CACNA Bible Institute');

-- 4. Regional roles printed on the brochure.
update cacna.leaders set title = 'Superintendent · Chairman, Public Relations (PRO)', updated_at = now() where full_name = 'Pastor Ademola Oyeniyi' and title = 'Superintendent';
update cacna.leaders set title = 'Superintendent · Supervisor, Good Women', updated_at = now() where person_key = 'hezekiah-ilufoye' and category = 'dcc_superintendent' and title = 'Superintendent';
update cacna.leaders set title = 'Superintendent · Chairman, Christian Education', updated_at = now() where full_name like 'Pastor Gbenga Famojuro%' and category = 'dcc_superintendent' and title = 'Superintendent';
update cacna.leaders set title = 'Superintendent · Chairman, Business Group', updated_at = now() where full_name = 'Pastor Gabriel Idowu' and category = 'dcc_superintendent' and title = 'Superintendent';
update cacna.leaders set title = 'Superintendent · Chairman, CACMA', updated_at = now() where full_name like 'Pastor Amos Dada%' and category = 'zonal_superintendent' and title = 'Superintendent';
update cacna.leaders set title = 'Superintendent · Chairman, Hope for All', updated_at = now() where full_name like 'Pastor Rufus Adeagbo%' and category = 'dcc_superintendent' and title = 'Superintendent';
update cacna.leaders set title = 'Superintendent · Empowerment Chairman', updated_at = now() where full_name in ('Pastor Zacheous Oloba','Pastor Zaccheaus Oloba') and category = 'zonal_superintendent' and title = 'Superintendent';

-- 5. Spellings as printed.
update cacna.leaders set full_name = 'Pastor Samson Kunle Aroniyi', updated_at = now() where category = 'zonal_superintendent' and zone_name = 'Atlanta' and full_name = 'Pastor Samson Kunle Aroniyo';
update cacna.leaders set full_name = 'Pastor Zaccheaus Oloba',      updated_at = now() where category = 'zonal_superintendent' and zone_name = 'VOC Atlanta' and full_name = 'Pastor Zacheous Oloba';

commit;
