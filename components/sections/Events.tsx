import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { specialEvents, splitByDate, type ChurchEvent } from '@/lib/events';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// Reuse the original three-tone rhythm, indexed by card position.
const dateBg = [
  'linear-gradient(150deg,#D62828,#9E1B1B)',
  'linear-gradient(150deg,#F15F22,#D62828)',
  'var(--ink)',
];

const chipMonth = (ev: ChurchEvent) => ev.month ?? MONTHS[Math.max(0, parseInt(ev.startLocal.slice(4, 6), 10) - 1)];
const chipDay = (ev: ChurchEvent) => ev.day ?? ev.startLocal.slice(6, 8);

export function Events() {
  // Computed per render so ISR (revalidate=60 on the homepage) drops past
  // events and surfaces new ones automatically — single source of truth.
  const upcoming = splitByDate(specialEvents).upcoming.slice(0, 3);

  return (
    <section style={{ padding: 'clamp(70px,9vw,120px) clamp(20px,5vw,64px)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal style={{ marginBottom: 46 }}>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--red)' }}>Mark your calendar</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px,5vw,68px)', letterSpacing: '-1.5px', margin: '12px 0 0', lineHeight: 1 }}>Upcoming events</h2>
        </Reveal>

        {upcoming.length === 0 ? (
          <Reveal>
            <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
              New events are being planned — check back soon.
            </p>
          </Reveal>
        ) : (
          <div className="r2" style={{ gap: 22 }}>
            {upcoming.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 120} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: 'var(--paper)', borderRadius: 24, padding: 28, boxShadow: '0 10px 26px rgba(27,19,14,.06)' }}>
                <div style={{
                  flexShrink: 0, width: 80, height: 80, borderRadius: 16,
                  background: dateBg[i % dateBg.length],
                  color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                  marginTop: 2,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{chipMonth(ev)}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32 }}>{chipDay(ev)}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(17px,4vw,24px)', letterSpacing: '-.4px', lineHeight: 1.2 }}>{ev.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.desc}</div>
                  {ev.href && (
                    <Link href={ev.href} className="press" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 13.5, fontWeight: 700, color: 'var(--red)', textDecoration: 'none' }}>
                      Full details <span aria-hidden style={{ fontSize: 15 }}>→</span>
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
        <Reveal delay={120} style={{ marginTop: 32 }}>
          <Link href="/events" className="press" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15, color: 'var(--red)', textDecoration: 'none' }}>
            View all events &amp; add to calendar <span aria-hidden style={{ fontSize: 17 }}>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
