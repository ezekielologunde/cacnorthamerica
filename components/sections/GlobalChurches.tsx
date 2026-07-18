import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

const pinSvg = (color: string) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
  </svg>
);

type Zone = { zone: string; superintendent: string; phone?: string; email?: string };

// Real CACNA DCC/zonal directory (from cacnorthamerica.com) — a partial list;
// several zones exist that this site hasn't captured contact details for yet.
const zones: Zone[] = [
  { zone: 'Atlanta', superintendent: 'Pastor Samson Kunle Aroniyo', phone: '404-953-1808' },
  { zone: 'Philadelphia', superintendent: 'Pastor Chris Ogunleye', phone: '610-517-1842' },
  { zone: 'North Washington', superintendent: 'Pastor Abayomi Ademuwagun', phone: '443-583-9416' },
  { zone: 'Cornerstone', superintendent: 'Pastor Amos Adetobi', phone: '301-793-4472' },
  { zone: 'SW Houston', superintendent: 'Pastor Ebenezer S. Akinyele', phone: '281-948-2329' },
  { zone: 'VOC Atlanta', superintendent: 'Pastor Zacheous Oloba', phone: '404-597-1270' },
  { zone: 'Dallas North', superintendent: 'Pastor Ezekiel Olasumbo Adebunmi', phone: '214-622-8506' },
  { zone: 'Agbala Itura Canada', superintendent: 'Pastor Ademola Oyeniyi', phone: '647-898-1636' },
  { zone: 'Bethel Canada', superintendent: 'Pastor Amos Dada, Ph.D.', phone: '416-616-2425' },
  { zone: 'Orlando', superintendent: 'Pastor Michael Ekemode', phone: '706-558-5697' },
  { zone: 'VOC Texas', superintendent: 'Pastor Isaac Abiara', phone: '469-360-9170' },
  { zone: 'Tampa', superintendent: 'Pastor Bode Olatunji', phone: '813-416-3562' },
  { zone: 'Manhattan', superintendent: 'Pastor Timothy Adelani', phone: '917-684-9260' },
  { zone: 'Baltimore', superintendent: 'Pastor Hezekiah Ilufoye, D.Min.', phone: '443-226-8748' },
];

function ZoneCard({ z }: { z: Zone }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        background: 'var(--paper)', borderRadius: 18, padding: '20px 20px 18px',
        boxShadow: '0 8px 22px rgba(27,19,14,.05)', border: '1px solid var(--line)',
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

export function GlobalChurches() {
  return (
    <section style={{ background: 'var(--cream-2)', padding: 'clamp(70px,9vw,120px) clamp(20px,5vw,64px)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--red)' }}>One family, many homes</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(34px,5vw,66px)', letterSpacing: '-1.5px', margin: '12px 0 0', lineHeight: 1 }}>
            CACNA Zones Across North America
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 560, margin: '16px auto 0' }}>
            Christ Apostolic Church North America is organized into DCCs (District Church Councils) / zones across the United States and Canada, each led by a Zonal Superintendent.
          </p>
        </Reveal>

        <div className="r4" style={{ gap: 16 }}>
          {zones.map((z, i) => (
            <Reveal key={z.zone} delay={i * 40}><ZoneCard z={z} /></Reveal>
          ))}
        </div>

        <Reveal style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href="/visit" className="press" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15, color: 'var(--ink)', textDecoration: 'none', padding: '14px 24px', borderRadius: 999, border: '1.5px solid var(--ink)' }}>
            Find a Church Near You <span aria-hidden style={{ fontSize: 17 }}>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
