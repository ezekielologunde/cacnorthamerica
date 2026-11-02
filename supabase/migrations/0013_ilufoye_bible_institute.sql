-- Pastor Hezekiah Ilufoye (Baltimore DCC superintendent) is also Bible
-- Institute faculty, per the site owner. Link his two rows with a person_key
-- and add the faculty row. The title is generic because no specific faculty
-- role was given. Idempotent; already applied to the live database.

begin;

update cacna.leaders
   set person_key = 'hezekiah-ilufoye'
 where full_name = 'Pastor Hezekiah Ilufoye, D.Min.'
   and category = 'dcc_superintendent'
   and person_key is null;

insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Hezekiah Ilufoye, D.Min.', 'Faculty, CACNA Bible Institute', 'bible_institute', null, '/images/leaders/hezekiah-ilufoye.jpg', null, null, null, null::integer, null::integer, 3, 'hezekiah-ilufoye', true
where not exists (
  select 1 from cacna.leaders
   where full_name = 'Pastor Hezekiah Ilufoye, D.Min.' and category = 'bible_institute'
);

commit;
