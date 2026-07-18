'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { specialEvents, splitByDate, type ChurchEvent } from '@/lib/events';

const LIVE_URL = 'https://www.youtube.com/channel/UCoogH4HuVXSn4okSpRlsDQA/live';

type BannerAnn = { id: string; title: string; cta_text: string | null; cta_url: string | null; bg_color: string; text_color: string };

function isSundayService() {
  const et = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const h = et.getHours();
  return et.getDay() === 0 && h >= 9 && h < 13;
}

export function SiteOverlays({ bannerAnn }: { bannerAnn?: BannerAnn | null }) {
  const pathname = usePathname();
  const [bar, setBar] = useState(false);
  const [barEvents, setBarEvents] = useState<ChurchEvent[]>([]);
  const [barIndex, setBarIndex] = useState(0);
  const [barPaused, setBarPaused] = useState(false);
  const [toast, setToast] = useState(false);
  const [slide, setSlide] = useState(false);
  const [dbBar, setDbBar] = useState(false);

  useEffect(() => {
    // Overlays never appear in the admin area
    if (pathname.startsWith('/admin')) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // 1a. DB banner announcement — takes priority over CACNA bar
    if (bannerAnn && !localStorage.getItem(`ann-db-${bannerAnn.id}`)) {
      setDbBar(true);
      document.documentElement.style.setProperty('--bar-h', '44px');
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
        document.documentElement.style.setProperty('--bar-h', '44px');
      }
    }

    // 2. Live toast — Sundays 9 AM–1 PM ET, once per session
    if (isSundayService() && !sessionStorage.getItem('live-toast-seen')) {
      setToast(true);
      timers.push(setTimeout(() => setToast(false), 12000));
    }

    // 3. Prayer slide-in — once per session, 45 s delay
    if (!sessionStorage.getItem('prayer-prompt-seen')) {
      timers.push(setTimeout(() => {
        sessionStorage.setItem('prayer-prompt-seen', '1');
        setSlide(true);
      }, 45000));
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

  function dismissToast() {
    setToast(false);
    sessionStorage.setItem('live-toast-seen', '1');
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
            background: bannerAnn.bg_color, height: 44,
            display: 'flex', alignItems: 'center',
            padding: '0 clamp(16px,4vw,48px)', gap: 12,
          }}
        >
          <span style={{ color: bannerAnn.text_color, fontSize: 13, fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {bannerAnn.title}
          </span>
          {bannerAnn.cta_text && bannerAnn.cta_url && (
            <a
              href={bannerAnn.cta_url}
              style={{ color: bannerAnn.text_color, fontSize: 13, fontWeight: 800, textDecoration: 'underline', whiteSpace: 'nowrap', flexShrink: 0, opacity: 0.9 }}
            >
              {bannerAnn.cta_text} →
            </a>
          )}
          <button
            onClick={dismissDbBar}
            aria-label="Dismiss announcement"
            style={{ background: 'none', border: 'none', color: bannerAnn.text_color, cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 0 0 8px', flexShrink: 0, opacity: 0.5 }}
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
            background: '#1B130E', height: 44,
            display: 'flex', alignItems: 'center',
            padding: '0 clamp(16px,4vw,48px)', gap: 12,
          }}
        >
          <div aria-hidden style={{ width: 7, height: 7, borderRadius: '50%', background: '#E8A33D', flexShrink: 0 }} />
          <div key={currentBarEvent.id} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, animation: 'barFade .5s ease' }}>
            <span style={{ color: 'rgba(255,247,239,.9)', fontSize: 13, fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentBarEvent.navLabel ?? currentBarEvent.title} · {currentBarEvent.dateLabel}
            </span>
            <Link
              href={currentBarEvent.href!}
              style={{ color: '#E8A33D', fontSize: 13, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              Learn more →
            </Link>
          </div>
          <button
            onClick={dismissBar}
            aria-label="Dismiss announcement"
            style={{ background: 'none', border: 'none', color: 'rgba(255,247,239,.4)', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 0 0 8px', flexShrink: 0 }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── 2. Live Sunday toast ─────────────────────────────────── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 900,
            background: '#1C3A2A', borderRadius: 14,
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,.35)',
            maxWidth: 320, width: 'calc(100vw - 48px)',
          }}
        >
          <div aria-hidden style={{ width: 9, height: 9, borderRadius: '50%', background: '#4ade80', flexShrink: 0, boxShadow: '0 0 0 3px rgba(74,222,128,.25)' }} />
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, flex: 1, lineHeight: 1.4 }}>
            Sunday service is live now.
          </span>
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: 'rgba(255,255,255,.18)', color: '#fff', fontSize: 12, fontWeight: 800, padding: '6px 12px', borderRadius: 20, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Watch →
          </a>
          <button
            onClick={dismissToast}
            aria-label="Close"
            style={{ background: 'none', border: 'none', color: 'rgba(255,247,239,.4)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 0, flexShrink: 0 }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── 3. Prayer request slide-in ───────────────────────────── */}
      {slide && (
        <div
          role="complementary"
          aria-label="Prayer request"
          style={{
            position: 'fixed', bottom: toast ? 96 : 24, right: 24, zIndex: 850,
            background: '#fff', borderRadius: 18, maxWidth: 280,
            border: '1px solid rgba(27,19,14,.1)',
            boxShadow: '0 16px 48px rgba(0,0,0,.18)',
            padding: '20px 20px 18px',
          }}
        >
          <button
            onClick={() => setSlide(false)}
            aria-label="Close prayer prompt"
            style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#888780', fontSize: 16, lineHeight: 1 }}
          >
            ×
          </button>
          <div style={{ width: 38, height: 38, background: '#FCEBEB', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Heart size={18} strokeWidth={2} color="#D62828" aria-hidden />
          </div>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#1B130E', marginBottom: 6 }}>Need prayer?</div>
          <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.6, marginBottom: 14 }}>
            Share your request and our pastors will pray with you this week.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link
              href="/prayer"
              onClick={() => setSlide(false)}
              style={{ flex: 1, textAlign: 'center', background: '#D62828', color: '#fff', fontWeight: 700, fontSize: 13, padding: '9px 14px', borderRadius: 20, textDecoration: 'none' }}
            >
              Send request
            </Link>
            <button
              onClick={() => setSlide(false)}
              style={{ background: '#f4f3f1', color: '#1B130E', fontWeight: 600, fontSize: 13, border: 'none', padding: '9px 14px', borderRadius: 20, cursor: 'pointer' }}
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
