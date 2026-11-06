-- 0021: the Golden Jubilee brochure (p12) renames the "Agbala Itura" zones to
-- "Vineyard of Comfort". lib/churches.ts zoneName values are changed in the same PR;
-- the two must stay identical or the church directory loses its leader link.
-- Guarded by the old value, so a re-run is a no-op.
begin;
update cacna.leaders set zone_name = 'Vineyard of Comfort DCC, USA', updated_at = now() where zone_name = 'Agbala Itura DCC, USA';
update cacna.leaders set zone_name = 'Vineyard of Comfort Canada',  updated_at = now() where zone_name = 'Agbala Itura Canada';
commit;
