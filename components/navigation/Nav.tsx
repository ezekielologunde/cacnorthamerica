'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { haptic } from '@/lib/haptics';
import { SearchModal } from '@/components/ui/SearchModal';

interface NavItem {
  label: string;
  href?: string;
  dropdown?: { href: string; label: string; desc: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Who We Are',
    href: '/about',
    dropdown: [
      { href: '/leadership', label: 'Leadership', desc: 'Meet our five pastors' },
      { href: '/ministries', label: 'Ministries', desc: 'Find your place to serve' },
      { href: '/salvationcity', label: 'Salvation City', desc: 'Our Rosedale, MD assembly' },
      { href: '/ilorin', label: 'Ilorin', desc: 'Our parent assembly in Nigeria' },
    ],
  },
  {
    label: 'Watch & Grow',
    href: '/online',
    dropdown: [
      { href: '/online', label: 'Watch Online', desc: 'Live & on-demand services' },
      { href: '/devotional', label: 'Devotional', desc: 'Daily Word & podcast' },
      { href: '/bible-plan', label: 'Bible Reading Plan', desc: 'Hope for Today — weekly readings' },
      { href: '/prayer', label: 'Prayer', desc: 'Submit a prayer request' },
      { href: '/salvation', label: 'Salvation', desc: 'Accept Christ today' },
      { href: '/testimonies', label: 'Testimonies', desc: 'Stories of what God has done' },
    ],
  },
  {
    label: 'Events',
    href: '/events',
    dropdown: [
      { href: '/events', label: 'Upcoming Events', desc: 'Special gatherings & anniversaries' },
      { href: '/calendar', label: 'Full Calendar', desc: 'Weekly, monthly & annual rhythm' },
    ],
  },
  { label: 'Visit', href: '/visit' },
  {
    label: 'Give',
    href: '/giving',
    dropdown: [
      { href: '/giving', label: 'Giving', desc: 'Tithe & offering — support the work' },
      { href: '/building', label: 'Building Project', desc: 'A house for His Name' },
    ],
  },
  {
    label: 'Resources',
    href: '/blog',
    dropdown: [
      { href: '/blog', label: 'Blog & News', desc: 'Stories from the family' },
      { href: '/gallery', label: 'Gallery', desc: 'Moments from our church family' },
      { href: '/venue', label: 'Venue Hire', desc: 'Book our hall & parking for your event' },
      { href: '/store', label: 'Store', desc: 'Apparel, Bibles, music & prints' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

interface NavProps {
  dark?: boolean;
  /** Hero behind the nav is dark at the top of the page (so the bar needs light text until scrolled). */
  heroDark?: boolean;
}

export function Nav({ dark = false, heroDark = false }: NavProps) {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const update = () => {
      const isScrolled = window.scrollY > 36;
      setScrolled(isScrolled);
      nav.style.background = open
        ? dark ? 'rgba(12,14,19,.97)' : 'rgba(255,247,239,.97)'
        : isScrolled
        ? dark ? 'rgba(12,14,19,.85)' : 'rgba(255,247,239,.92)'
        : 'transparent';
      nav.style.boxShadow = isScrolled && !open
        ? dark ? '0 6px 24px rgba(0,0,0,.4)' : '0 6px 24px rgba(27,19,14,.08)'
        : 'none';
      nav.style.backdropFilter = isScrolled || open ? 'blur(12px)' : 'none';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [dark, open]);

  useEffect(() => { setOpen(false); setOpenMobileSection(null); }, [pathname]);

  // Light up "Watch Live" during the Sunday service window (≈9 AM–1 PM ET).
  useEffect(() => {
    const check = () => {
      try {
        const et = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
        setIsLive(et.getDay() === 0 && et.getHours() >= 9 && et.getHours() < 13);
      } catch { /* timezone unsupported — leave as not-live */ }
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const ink = dark ? 'var(--cream)' : 'var(--ink)';
  const accent = dark ? 'var(--gold)' : 'var(--red)';
  // Top-bar link colors are scroll-aware so they stay legible over a dark hero
  // at the top, then flip to ink once the cream nav background fades in.
  const lightBar = dark || (heroDark && !scrolled && !open);
  const barInk = lightBar ? 'var(--cream)' : 'var(--ink)';
  const barAccent = lightBar ? 'var(--gold)' : 'var(--red)';

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed', top: 'var(--bar-h, 0px)', left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px clamp(20px,5vw,64px)',
          transition: 'background .4s, box-shadow .4s',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: barInk, flexShrink: 0, transition: 'color .4s' }}>
          <Image src="/images/logo.png" alt="CAC Salvation Center" width={42} height={42} style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: barAccent, fontWeight: 700, transition: 'color .4s' }}>Christ Apostolic Church</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, letterSpacing: '-.3px', marginTop: 3 }}>Salvation Center</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-desktop" style={{ alignItems: 'center', gap: 2 }}>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.dropdown?.some(d => pathname === d.href));
            const isOpen = openDropdown === item.label;

            if (item.dropdown) {
              return (
                <div
                  key={item.label}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link href={item.href!} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    fontSize: 14.5, fontWeight: active ? 700 : 600,
                    color: active ? barAccent : barInk,
                    textDecoration: 'none', transition: 'color .4s',
                    padding: '7px 10px', borderRadius: 8,
                  }}>
                    {item.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </Link>
                  {isOpen && (
                    // Outer wrapper is positioned flush to the trigger (top: 100%) and
                    // uses paddingTop as a transparent "bridge" so the cursor never
                    // crosses a dead zone on its way to the panel — which would fire
                    // mouseleave and collapse the menu before a click could land.
                    <div style={{
                      position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                      paddingTop: 8, zIndex: 10,
                    }}>
                      <div style={{
                        background: dark ? 'rgba(18,20,26,.97)' : 'var(--paper)',
                        borderRadius: 16, padding: 8,
                        boxShadow: '0 20px 50px rgba(27,19,14,.16)',
                        border: `1px solid ${dark ? 'rgba(255,255,255,.1)' : 'var(--line)'}`,
                        minWidth: 200,
                      }}>
                        {item.dropdown.map(d => (
                          <Link key={d.href} href={d.href} style={{ display: 'block', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', transition: 'background .15s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,.06)' : 'var(--cream-2)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <div style={{ fontWeight: 700, fontSize: 14, color: dark ? 'var(--cream)' : 'var(--ink)' }}>{d.label}</div>
                            <div style={{ fontSize: 12, color: dark ? 'rgba(255,247,239,.5)' : 'var(--ink-soft)', marginTop: 2 }}>{d.desc}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.label} href={item.href!} style={{
                fontSize: 14.5, fontWeight: active ? 700 : 600,
                color: active ? barAccent : barInk,
                textDecoration: 'none', padding: '7px 10px', borderRadius: 8,
                transition: 'color .4s',
              }}>
                {item.label}
              </Link>
            );
          })}

          {/* Search + Watch Live group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              title="Search (Ctrl+K)"
              style={{ background: lightBar ? 'rgba(255,247,239,.1)' : 'var(--cream-2)', border: `1px solid ${lightBar ? 'rgba(255,247,239,.18)' : 'var(--line)'}`, borderRadius: 999, cursor: 'pointer', padding: '9px 13px', color: barInk, display: 'flex', alignItems: 'center', transition: 'all .4s' }}
            >
              <Search size={16} strokeWidth={2} />
            </button>
            <Link
              href="/online"
              onClick={() => haptic('medium')}
              className="press"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: isLive ? 'var(--red)' : (dark ? 'var(--red)' : 'var(--ink)'), color: 'var(--cream)', fontWeight: 700, fontSize: 14, padding: '10px 18px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: isLive ? '0 8px 24px rgba(214,40,40,.5)' : 'none' }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5252', animation: 'pulse-red 1.8s infinite', display: 'inline-block' }} />
              {isLive ? 'LIVE NOW' : 'Watch Live'}
            </Link>
          </div>
        </div>

        {/* Mobile search icon */}
        <button
          className="nav-hbg"
          onClick={() => { haptic('light'); setSearchOpen(true); }}
          aria-label="Search"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: barInk, flexDirection: 'row', gap: 0, alignItems: 'center', justifyContent: 'center', transition: 'color .4s' }}
        >
          <Search size={20} strokeWidth={2} />
        </button>

        {/* Hamburger */}
        <button
          className="nav-hbg"
          onClick={() => { haptic('light'); setOpen(o => !o); }}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: barInk, gap: 5, alignItems: 'center', transition: 'color .4s' }}
        >
          <span style={{ display: 'block', width: 24, height: 2, background: 'currentColor', borderRadius: 2, transition: 'transform .25s', transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 24, height: 2, background: 'currentColor', borderRadius: 2, transition: 'opacity .25s', opacity: open ? 0 : 1 }} />
          <span style={{ display: 'block', width: 24, height: 2, background: 'currentColor', borderRadius: 2, transition: 'transform .25s', transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: dark ? 'rgba(12,14,19,.97)' : 'rgba(255,247,239,.97)',
          backdropFilter: 'blur(14px)',
          display: 'flex', flexDirection: 'column',
          padding: '110px 32px 48px',
          overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {navItems.map((item) => {
              const active = pathname === item.href || (item.dropdown?.some(d => pathname === d.href));
              const mobileOpen = openMobileSection === item.label;

              return (
                <div key={item.label} style={{ borderBottom: `1px solid ${dark ? 'rgba(255,247,239,.1)' : 'var(--line)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link
                      href={item.href ?? (item.dropdown?.[0]?.href ?? '/')}
                      onClick={() => !item.dropdown && setOpen(false)}
                      style={{
                        fontFamily: 'var(--font-display)', fontWeight: 800,
                        fontSize: 'clamp(28px,7vw,44px)',
                        color: active ? accent : ink,
                        textDecoration: 'none', letterSpacing: '-1px',
                        padding: '16px 0', flex: 1,
                      }}
                    >
                      {item.label}
                    </Link>
                    {item.dropdown && (
                      <button
                        onClick={() => setOpenMobileSection(mobileOpen ? null : item.label)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: ink, padding: '8px 4px' }}
                        aria-label={mobileOpen ? 'Collapse' : 'Expand'}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: mobileOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {item.dropdown && mobileOpen && (
                    <div style={{ paddingBottom: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {item.dropdown.map(d => (
                        <Link key={d.href} href={d.href} onClick={() => setOpen(false)} style={{
                          display: 'block', padding: '10px 16px', borderRadius: 12,
                          textDecoration: 'none',
                          background: dark ? 'rgba(255,255,255,.06)' : 'var(--cream-2)',
                        }}>
                          <div style={{ fontWeight: 700, fontSize: 16, color: ink }}>{d.label}</div>
                          <div style={{ fontSize: 13, color: dark ? 'rgba(255,247,239,.5)' : 'var(--ink-soft)', marginTop: 2 }}>{d.desc}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
            <Link
              href="/online"
              onClick={() => { haptic('medium'); setOpen(false); }}
              className="press"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--red)', color: '#fff', fontWeight: 700, fontSize: 17, padding: '18px 24px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 14px 30px rgba(214,40,40,.4)' }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff', animation: 'pulse-red 1.8s infinite', display: 'inline-block' }} />
              {isLive ? 'LIVE NOW' : 'Watch Live'}
            </Link>
            <Link href="/visit" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17, padding: '18px 24px', borderRadius: 999, textDecoration: 'none', border: `1.5px solid ${dark ? 'rgba(255,247,239,.3)' : 'var(--ink)'}`, color: ink }}>
              Plan a Visit
            </Link>
            <p style={{ fontSize: 12.5, color: dark ? 'rgba(255,247,239,.4)' : 'var(--ink-soft)', textAlign: 'center', margin: '8px 0 0' }}>
              Sundays 10:30 AM · 10710 Marriottsville Rd, Randallstown MD
            </p>
          </div>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
