'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { specialEvents, splitByDate, type ChurchEvent } from '@/lib/events';

type BannerAnn = { id: string; title: string; cta_text: string | null; cta_url: string | null; bg_color: string; text_color: string };

export function SiteOverlays({ bannerAnn }: { bannerAnn?: BannerAnn | null }) {
  const pathname = usePathname();
  const [bar, setBar] = useState(false);
  const [barEvents, setBarEvents] = useState<ChurchEvent[]>([]);
  const [barIndex, setBarIndex] = useState(0);
  const [barPaused, setBarPaused] = useState(false);
  const [dbBar, setDbBar] = useState(false);

  useEffect(() => {
    // Overlays never appear in the admin area
    if (pathname.startsWith('/admin')) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // 1a. DB banner announcement — takes priority over CACNA bar
    if (bannerAnn && !localStorage.getItem(`ann-db-${bannerAnn.id}`)) {
      setDbBar(true);
      document.documentElement.style.setProperty('--bar-h', '50px');
    } else {
      // 1b. Up to 3 upcoming events with a detail page, rotated in the bar.
      // splitByDate drops past events, so the set advances on its own with no
      // manual expiry date to maintain.
      const events = splitByDate(specialEvents).upcoming
        .filter((e) => e.href && !localStorage.getItem(`ann-${e.id}`))
        .slice(0, 3);
      if (events.length) {
        setBarEvents(events);
        setBar(true);
        document.documentElement.style.setProperty('--bar-h', '50px');
      }
    }

    return () => timers.forEach(clearTimeout);
    // Run once on mount; pathname/bannerAnn are captured intentionally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rotate through the events every 6s — paused on hover/focus, and never
  // auto-advances for visitors who prefer reduced motion.
  useEffect(() => {
    if (barEvents.length < 2 || barPaused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setBarIndex((i) => (i + 1) % barEvents.length);
    }, 6000);
    return () => clearInterval(id);
  }, [barEvents.length, barPaused]);

  function dismissBar() {
    setBar(false);
    barEvents.forEach((e) => localStorage.setItem(`ann-${e.id}`, '1'));
    document.documentElement.style.setProperty('--bar-h', '0px');
  }

  function dismissDbBar() {
    setDbBar(false);
    if (bannerAnn) localStorage.setItem(`ann-db-${bannerAnn.id}`, '1');
    document.documentElement.style.setProperty('--bar-h', '0px');
  }

  const currentBarEvent = barEvents.length ? barEvents[barIndex % barEvents.length] : null;

  // All hooks run above this line — safe to bail out of rendering here.
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* ── 1a. DB banner announcement ──────────────────────────── */}
      {dbBar && bannerAnn && (
        <div
          role="banner"
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
            background: bannerAnn.bg_color, height: 50,
            display: 'flex', alignItems: 'center',
            padding: '0 clamp(16px,4vw,48px)', gap: 14,
          }}
        >
          <span style={{ color: bannerAnn.text_color, fontSize: 14.5, fontWeight: 700, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {bannerAnn.title}
          </span>
          {bannerAnn.cta_text && bannerAnn.cta_url && (
            <a
              href={bannerAnn.cta_url}
              style={{ color: bannerAnn.text_color, fontSize: 14, fontWeight: 800, textDecoration: 'underline', whiteSpace: 'nowrap', flexShrink: 0, opacity: 0.9 }}
            >
              {bannerAnn.cta_text} →
            </a>
          )}
          <button
            onClick={dismissDbBar}
            aria-label="Dismiss announcement"
            style={{ background: 'none', border: 'none', color: bannerAnn.text_color, cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: '0 0 0 8px', flexShrink: 0, opacity: 0.5 }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── 1b. Upcoming-events announcement bar (auto-rotating) ─────── */}
      {bar && currentBarEvent && (
        <div
          role="banner"
          onMouseEnter={() => setBarPaused(true)}
          onMouseLeave={() => setBarPaused(false)}
          onFocus={() => setBarPaused(true)}
          onBlur={() => setBarPaused(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
            background: '#12141E', height: 50,
            display: 'flex', alignItems: 'center',
            padding: '0 clamp(16px,4vw,48px)', gap: 12,
          }}
        >
          <div aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: '#FDC841', flexShrink: 0 }} />
          <div key={currentBarEvent.id} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, animation: 'barFade .5s ease' }}>
            <span style={{ color: 'rgba(245,246,250,.9)', fontSize: 14, fontWeight: 700, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentBarEvent.navLabel ?? currentBarEvent.title} · {currentBarEvent.dateLabel}
            </span>
            <Link
              href={currentBarEvent.href!}
              style={{ color: '#FDC841', fontSize: 14, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              Learn more →
            </Link>
          </div>
          <button
            onClick={dismissBar}
            aria-label="Dismiss announcement"
            style={{ background: 'none', border: 'none', color: 'rgba(245,246,250,.4)', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: '0 0 0 8px', flexShrink: 0 }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
