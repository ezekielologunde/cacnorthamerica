'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Parallax } from '@/components/ui/Parallax';
import type { MapZone } from './GlobalChurches';

const HUB = { x: 58, y: 50 };

export function ZoneNetworkMap({ zones }: { zones: MapZone[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  return (
    <Parallax distance={reduce ? 0 : 18} style={{ marginBottom: 48 }}>
      <div
        style={{
          position: 'relative', width: '100%', aspectRatio: '16 / 10',
          borderRadius: 28, overflow: 'hidden',
          background: 'linear-gradient(160deg, var(--ink) 0%, var(--red-deep) 130%)',
          boxShadow: '0 30px 70px rgba(122,17,40,.35)',
        }}
      >
        {/* Dot-grid texture */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, opacity: 0.5,
            backgroundImage: 'radial-gradient(rgba(245,246,250,.14) 1px, transparent 1.5px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute', top: '-20%', left: '55%', width: '60%', aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(253,200,65,.16), transparent 65%)',
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
              stroke={active === z.zone ? 'var(--gold)' : 'rgba(245,246,250,.18)'}
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
              background: 'var(--gold)', border: '2px solid rgba(245,246,250,.9)',
              cursor: 'pointer', padding: 0,
              boxShadow: active === z.zone ? '0 0 0 8px rgba(253,200,65,.25)' : '0 0 0 0 rgba(253,200,65,0)',
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
        <div style={{ position: 'absolute', left: 20, bottom: 18, color: 'rgba(245,246,250,.55)', fontSize: 12, fontWeight: 600, letterSpacing: '.3px' }}>
          16 DCCs/Zones · hover a pin
        </div>
      </div>
    </Parallax>
  );
}
