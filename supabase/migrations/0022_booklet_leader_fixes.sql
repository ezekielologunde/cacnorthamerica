-- 0022: leader corrections, at the site owner's instruction ("follow the booklet", "remove Isaac").
--  1. Dallas North superintendent's middle name follows the 2026 convention booklet.
--  2. Pastor Isaac Abiara (VOC Texas) is not listed in the booklet and is removed. The church
--     entry for CAC Vineyard of Comfort — Dallas stays in lib/churches.ts; only the leader row goes.
-- Each statement is guarded by the old value, so a re-run is a no-op.
begin;
update cacna.leaders set full_name = 'Pastor Ezekiel Olusunmbo Adebunmi', updated_at = now()
  where id = '47bc8f50-c4bb-4309-9535-3ccf1d1c0fa4' and full_name = 'Pastor Ezekiel Olasumbo Adebunmi';
delete from cacna.leaders
  where id = '3943e7fe-f19c-46b4-941b-70c3e5d6f2d1' and full_name = 'Pastor Isaac Abiara' and zone_name = 'VOC Texas';
commit;
