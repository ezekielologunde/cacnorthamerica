import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { ZoneNetworkMap } from './ZoneNetworkMap';
import { getLeaders } from '@/lib/leaders';

export type MapZone = { zone: string; superintendent: string; phone?: string; x: number; y: number };

const pinSvg = (color: string) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
  </svg>
);

// Stylized map positions (percent), by zone name — placed by the zone's
// metro area, not surveyed coordinates. The zones themselves come live from
// the `leaders` table (same source as /zones) so this never drifts out of
// sync; only the pin layout is curated here.
//
// KNOWN RISK: `zone_name` is free-text on the `leaders` row, not a foreign
// key — a typo or rename there silently falls through to FALLBACK_POSITIONS
// below instead of erroring. Not worth a full `zones` table + FK migration
// yet; revisit if zone data keeps growing or this starts drifting visibly.
const ZONE_POSITIONS: Record<string, { x: number; y: number }> = {
  'Atlanta': { x: 50, y: 56 },
  'Philadelphia': { x: 83, y: 25 },
  'North Washington': { x: 74, y: 33 },
  'Cornerstone': { x: 79, y: 43 },
  'SW Houston': { x: 13, y: 76 },
  'VOC Atlanta': { x: 56, y: 66 },
  'Dallas North': { x: 8, y: 61 },
  'Agbala Itura Canada': { x: 66, y: 7 },
  'Bethel Canada': { x: 71, y: 12 },
  'Orlando': { x: 62, y: 82 },
  'VOC Texas': { x: 14, y: 68 },
  'Tampa': { x: 58, y: 87 },
  'Baltimore': { x: 78, y: 27 },
};
// Fallback for any real zone not yet given a curated pin position — spread
// along a gentle arc so it doesn't collide with the hub or other pins.
const FALLBACK_POSITIONS = [
  { x: 30, y: 20 }, { x: 45, y: 15 }, { x: 20, y: 45 }, { x: 90, y: 55 }, { x: 35, y: 90 },
];

function ZoneCard({ z }: { z: MapZone }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        background: 'var(--paper)', borderRadius: 18, padding: '20px 20px 18px',
        boxShadow: '0 8px 22px rgba(18,20,30,.05)', border: '1px solid var(--line)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--red)', fontSize: 12, fontWeight: 800, marginBottom: 9 }}>
        {pinSvg('var(--red)')} {z.zone} Zone
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-.3px', lineHeight: 1.15, marginBottom: 6 }}>{z.superintendent}</div>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, flex: 1 }}>{z.phone}</div>
    </div>
  );
}

export async function GlobalChurches() {
  const superintendents = await getLeaders(['zonal_superintendent']);
  let fallbackIndex = 0;
  const zones: MapZone[] = superintendents.map((s) => {
    const zoneName = s.zone_name ?? 'Zone';
    const pos = ZONE_POSITIONS[zoneName] ?? FALLBACK_POSITIONS[fallbackIndex++ % FALLBACK_POSITIONS.length];
    return { zone: zoneName, superintendent: s.full_name, phone: s.phone ?? undefined, x: pos.x, y: pos.y };
  });

  return (
    <section style={{ background: 'var(--cream-2)', padding: 'clamp(70px,9vw,120px) clamp(20px,5vw,64px)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--red)' }}>One family, many homes</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(34px,5vw,66px)', letterSpacing: '-1.5px', margin: '12px 0 0', lineHeight: 1 }}>
            CACNA Zones Across North America
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 560, margin: '16px auto 0' }}>
            Christ Apostolic Church North America is organized into DCCs (District Church Councils) / zones across the United States, Canada, and South America, each led by a Zonal Superintendent.
          </p>
        </Reveal>

        {zones.length > 0 && (
          <Reveal>
            <ZoneNetworkMap zones={zones} />
          </Reveal>
        )}

        <div className="r4" style={{ gap: 16 }}>
          {zones.map((z, i) => (
            <Reveal key={z.zone} delay={i * 40}><ZoneCard z={z} /></Reveal>
          ))}
        </div>

        <Reveal style={{ textAlign: 'center', marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          <Link href="/visit" className="press" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15, color: 'var(--ink)', textDecoration: 'none', padding: '14px 24px', borderRadius: 999, border: '1.5px solid var(--ink)' }}>
            Find a Church Near You <span aria-hidden style={{ fontSize: 17 }}>→</span>
          </Link>
          <Link href="/zones" className="press" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15, color: 'var(--ink-soft)', textDecoration: 'none', padding: '14px 24px' }}>
            View the full zone directory →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
