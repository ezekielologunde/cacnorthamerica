'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { Parallax } from '@/components/ui/Parallax';

const pinSvg = (color: string) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
  </svg>
);

type Zone = { zone: string; superintendent: string; phone?: string; email?: string; x: number; y: number };

// Real CACNA DCC/zonal directory (from cacnorthamerica.com) — a partial list;
// several zones exist that this site hasn't captured contact details for yet.
// x/y are approximate stylized positions (percent) within the network map,
// placed by the zone's metro area — not surveyed coordinates.
const zones: Zone[] = [
  { zone: 'Atlanta', superintendent: 'Pastor Samson Kunle Aroniyo', phone: '404-953-1808', x: 50, y: 56 },
  { zone: 'Philadelphia', superintendent: 'Pastor Chris Ogunleye', phone: '610-517-1842', x: 83, y: 25 },
  { zone: 'North Washington', superintendent: 'Pastor Abayomi Ademuwagun', phone: '443-583-9416', x: 74, y: 33 },
  { zone: 'Cornerstone', superintendent: 'Pastor Amos Adetobi', phone: '301-793-4472', x: 79, y: 43 },
  { zone: 'SW Houston', superintendent: 'Pastor Ebenezer S. Akinyele', phone: '281-948-2329', x: 13, y: 76 },
  { zone: 'VOC Atlanta', superintendent: 'Pastor Zacheous Oloba', phone: '404-597-1270', x: 56, y: 66 },
  { zone: 'Dallas North', superintendent: 'Pastor Ezekiel Olasumbo Adebunmi', phone: '214-622-8506', x: 8, y: 61 },
  { zone: 'Agbala Itura Canada', superintendent: 'Pastor Ademola Oyeniyi', phone: '647-898-1636', x: 66, y: 7 },
  { zone: 'Bethel Canada', superintendent: 'Pastor Amos Dada, Ph.D.', phone: '416-616-2425', x: 71, y: 12 },
  { zone: 'Orlando', superintendent: 'Pastor Michael Ekemode', phone: '706-558-5697', x: 62, y: 82 },
  { zone: 'VOC Texas', superintendent: 'Pastor Isaac Abiara', phone: '469-360-9170', x: 14, y: 68 },
  { zone: 'Tampa', superintendent: 'Pastor Bode Olatunji', phone: '813-416-3562', x: 58, y: 87 },
  { zone: 'Manhattan', superintendent: 'Pastor Timothy Adelani', phone: '917-684-9260', x: 87, y: 21 },
  { zone: 'Baltimore', superintendent: 'Pastor Hezekiah Ilufoye, D.Min.', phone: '443-226-8748', x: 78, y: 27 },
];

const HUB = { x: 58, y: 50 };

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

function NetworkMap() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  return (
    <Parallax distance={reduce ? 0 : 18} style={{ marginBottom: 48 }}>
      <div
        style={{
          position: 'relative', width: '100%', aspectRatio: '16 / 10',
          borderRadius: 28, overflow: 'hidden',
          background: 'linear-gradient(160deg, var(--ink) 0%, var(--red-deep) 130%)',
          boxShadow: '0 30px 70px rgba(18,48,42,.35)',
        }}
      >
        {/* Dot-grid texture */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, opacity: 0.5,
            backgroundImage: 'radial-gradient(rgba(255,247,239,.14) 1px, transparent 1.5px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute', top: '-20%', left: '55%', width: '60%', aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(232,163,61,.16), transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        {/* Connecting lines + pins */}
        <svg viewBox="0 0 100 62.5" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
          {zones.map((z, i) => (
            <motion.line
              key={z.zone}
              x1={HUB.x} y1={HUB.y * 0.625}
              x2={z.x} y2={z.y * 0.625}
              stroke={active === z.zone ? 'var(--gold)' : 'rgba(255,247,239,.18)'}
              strokeWidth={active === z.zone ? 0.35 : 0.2}
              initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
          <circle cx={HUB.x} cy={HUB.y * 0.625} r={1.1} fill="var(--gold)" />
        </svg>

        {/* Zone pins */}
        {zones.map((z, i) => (
          <motion.button
            key={z.zone}
            type="button"
            onMouseEnter={() => setActive(z.zone)}
            onMouseLeave={() => setActive((a) => (a === z.zone ? null : a))}
            onFocus={() => setActive(z.zone)}
            onBlur={() => setActive((a) => (a === z.zone ? null : a))}
            initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
            aria-label={`${z.zone} Zone — ${z.superintendent}`}
            style={{
              position: 'absolute', left: `${z.x}%`, top: `${z.y}%`,
              transform: 'translate(-50%,-50%)',
              width: 14, height: 14, borderRadius: '50%',
              background: 'var(--gold)', border: '2px solid rgba(255,247,239,.9)',
              cursor: 'pointer', padding: 0,
              boxShadow: active === z.zone ? '0 0 0 8px rgba(232,163,61,.25)' : '0 0 0 0 rgba(232,163,61,0)',
              transition: 'box-shadow .25s ease',
              zIndex: active === z.zone ? 3 : 2,
            }}
          >
            {active === z.zone && (
              <span
                role="tooltip"
                style={{
                  position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--paper)', color: 'var(--ink)', borderRadius: 12,
                  padding: '10px 14px', whiteSpace: 'nowrap', fontSize: 12.5,
                  boxShadow: '0 10px 26px rgba(0,0,0,.3)', pointerEvents: 'none',
                }}
              >
                <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{z.zone} Zone</strong>
                <div style={{ color: 'var(--ink-soft)', marginTop: 2 }}>{z.superintendent}</div>
              </span>
            )}
          </motion.button>
        ))}

        {/* Caption */}
        <div style={{ position: 'absolute', left: 20, bottom: 18, color: 'rgba(255,247,239,.55)', fontSize: 12, fontWeight: 600, letterSpacing: '.3px' }}>
          16 DCCs/Zones · hover a pin
        </div>
      </div>
    </Parallax>
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

        <Reveal>
          <NetworkMap />
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
