-- 0023: the Golden Jubilee brochure (pp. 6 and 8) names Pastor Oluwagbemiga Famojuro as the
-- new Chairman of the Convention & Conference Committee; Pastor Adenodi is the former chairman.
-- Applied at the site owner's instruction. Guarded by the old titles, so a re-run is a no-op.
begin;
update cacna.leaders
   set title = 'Member, CACNA Coordinating Council · Former Chairman, CACNA Convention', updated_at = now()
 where id = '8d2ef8f2-732f-4d2d-a817-755252f268b9'
   and title = 'Chairman, CACNA Convention · Member, CACNA Coordinating Council';
update cacna.leaders
   set title = 'Superintendent · Chairman, Christian Education · Chairman, CACNA Convention', updated_at = now()
 where id = 'ca95f5f9-f641-48d9-bed7-eb8a1bd0c7cd'
   and title = 'Superintendent · Chairman, Christian Education';
commit;
