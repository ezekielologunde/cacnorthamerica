import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Magnetic } from '@/components/ui/Magnetic';

/** Used to publicly list every zone superintendent's name and personal phone
 *  number on the homepage — replaced with a simple, honest prompt pointing to
 *  the real filterable directory (/zones), which already handles search and
 *  displays that same contact info in the right context (a directory a
 *  visitor is actively looking through, not incidental homepage scroll).
 *  Closing-CTA treatment: --gradient-cta band, matches the sibling
 *  Convention homepage's closing band. */
export function GlobalChurches() {
  return (
    <section style={{ background: 'var(--gradient-cta)', padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,64px)', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', top: -100, left: -80, width: 400, height: 320, background: 'radial-gradient(circle,rgba(253,200,65,.12),transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 22px',
            background: 'rgba(255,255,255,.12)',
            display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,.18)',
          }}>
            <MapPin size={26} strokeWidth={2} color="var(--gold)" aria-hidden />
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)' }}>
            24 Zones &amp; DCCs · U.S., Canada &amp; South America
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(32px,4.6vw,58px)', letterSpacing: '-1.4px', margin: '14px 0 0', lineHeight: 1.05, color: '#fff' }}>
            Find a CAC church near you.
          </h2>
          <p style={{ fontSize: 16.5, color: 'rgba(245,246,250,.78)', lineHeight: 1.7, margin: '18px auto 0', maxWidth: 560 }}>
            CACNA organizes its member churches into Zones and DCCs (District Church Councils), each shepherded by a Superintendent. Search or browse the full directory to find the one nearest you.
          </p>
        </Reveal>

        <Reveal delay={100} style={{ marginTop: 30 }}>
          <Magnetic strength={0.35}>
            <Link href="/zones" className="btn-sheen press" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#fff', color: 'var(--red-deep)', fontWeight: 800, fontSize: 16,
              padding: '16px 30px', borderRadius: 999, textDecoration: 'none',
              boxShadow: '0 14px 34px rgba(0,0,0,.25)',
            }}>
              Browse the Zone Directory <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
