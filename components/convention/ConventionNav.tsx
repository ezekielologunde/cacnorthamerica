'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePathname } from 'next/navigation';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import { haptic } from '@/lib/haptics';

interface NavItem {
  label: string;
  href?: string;
  dropdown?: { href: string; label: string }[];
}

const navItems: NavItem[] = [
  { label: 'Schedule', href: '/convention/schedule' },
  {
    label: 'Programs',
    href: '/convention/business-group',
    dropdown: [
      { href: '/convention/business-group', label: 'Business Group' },
      { href: '/convention/cacma', label: 'CACMA' },
      { href: '/convention/children', label: "Children's Convention" },
      { href: '/convention/christian-education', label: 'Christian Education' },
      { href: '/convention/good-women', label: 'Good Women' },
      { href: '/convention/ministers-wives', label: "Ministers' Wives" },
      { href: '/convention/youth', label: 'Youth & Young Adult' },
    ],
  },
  {
    label: 'Visit',
    href: '/convention/plan-your-visit',
    dropdown: [
      { href: '/convention/plan-your-visit', label: 'Plan Your Visit' },
      { href: '/convention/gallery', label: 'Gallery' },
      { href: '/convention/archive', label: 'Archive' },
    ],
  },
  {
    label: 'Media',
    href: '/convention/live',
    dropdown: [
      { href: '/convention/live', label: 'Live' },
      { href: '/convention/news', label: 'News' },
    ],
  },
  {
    label: 'About',
    href: '/convention/about',
    dropdown: [
      { href: '/convention/about', label: 'About' },
      { href: '/convention/give', label: 'Give' },
      { href: '/convention/contact', label: 'Contact' },
    ],
  },
];

export function ConventionNav() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const update = () => {
      const isScrolled = window.scrollY > 36;
      setScrolled(isScrolled);
      nav.style.background = open
        ? 'rgba(12,14,19,.97)'
        : isScrolled ? 'rgba(12,14,19,.85)' : 'transparent';
      nav.style.boxShadow = isScrolled && !open ? '0 6px 24px rgba(0,0,0,.4)' : 'none';
      nav.style.backdropFilter = isScrolled || open ? 'blur(12px)' : 'none';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [open]);

  useEffect(() => { setOpen(false); setOpenMobileSection(null); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const barInk = 'var(--cream)';
  const barAccent = 'var(--gold)';

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px clamp(20px,5vw,64px)',
          transition: 'background .4s, box-shadow .4s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Link
            href="/convention/about"
            style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, textDecoration: 'none', color: barInk }}
          >
            <span style={{ fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: barAccent, fontWeight: 700 }}>CACNA</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, letterSpacing: '-.3px', marginTop: 3 }}>Annual Convention</span>
          </Link>
          <Link
            href="/"
            className="nav-desktop"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600,
              color: 'rgba(245,246,250,.55)', textDecoration: 'none', paddingLeft: 18, borderLeft: '1px solid rgba(245,246,250,.15)',
            }}
          >
            <ArrowLeft size={12} strokeWidth={2.5} aria-hidden /> CACNA Home
          </Link>
        </div>

        <div className="nav-desktop" style={{ alignItems: 'center', gap: 2 }}>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.dropdown?.some(d => pathname === d.href));
            const isOpen = openDropdown === item.label;
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
                  textDecoration: 'none', padding: '7px 10px', borderRadius: 8,
                }}>
                  {item.label}
                  {item.dropdown && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </Link>
                {item.dropdown && isOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: 8, zIndex: 10 }}>
                    <div style={{
                      background: 'rgba(18,20,26,.97)', borderRadius: 16, padding: 8,
                      boxShadow: '0 20px 50px rgba(18,20,30,.16)', border: '1px solid rgba(255,255,255,.1)', minWidth: 200,
                    }}>
                      {item.dropdown.map(d => {
                        const style: CSSProperties = { display: 'block', padding: '10px 14px', borderRadius: 10, textDecoration: 'none' };
                        return (
                          <Link key={d.href} href={d.href} style={style}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.06)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cream)' }}>{d.label}</div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href="/convention/register"
            onClick={() => haptic('medium')}
            className="btn-sheen press"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginLeft: 10, background: 'linear-gradient(135deg,#7A1128,#FDC841)', color: '#fff', fontWeight: 800, fontSize: 14, padding: '10px 18px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 8px 22px rgba(122,17,40,.45)' }}
          >
            <CalendarDays size={14} strokeWidth={2.5} aria-hidden /> Register →
          </Link>
        </div>

        <button
          className="nav-hbg"
          onClick={() => { haptic('light'); setOpen(o => !o); }}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: barInk, gap: 5, alignItems: 'center' }}
        >
          <span style={{ display: 'block', width: 24, height: 2, background: 'currentColor', borderRadius: 2, transition: 'transform .25s', transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 24, height: 2, background: 'currentColor', borderRadius: 2, transition: 'opacity .25s', opacity: open ? 0 : 1 }} />
          <span style={{ display: 'block', width: 24, height: 2, background: 'currentColor', borderRadius: 2, transition: 'transform .25s', transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(12,14,19,.97)', backdropFilter: 'blur(14px)',
          display: 'flex', flexDirection: 'column', padding: '110px 32px 48px', overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Link href="/" onClick={() => setOpen(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: 'rgba(245,246,250,.6)', textDecoration: 'none', marginBottom: 24 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> CACNA Home
            </Link>
            {navItems.map((item) => {
              const active = pathname === item.href || (item.dropdown?.some(d => pathname === d.href));
              const mobileOpen = openMobileSection === item.label;
              return (
                <div key={item.label} style={{ borderBottom: '1px solid rgba(245,246,250,.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link
                      href={item.href!}
                      onClick={() => !item.dropdown && setOpen(false)}
                      style={{
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(26px,7vw,40px)',
                        color: active ? 'var(--gold)' : 'var(--cream)', textDecoration: 'none', letterSpacing: '-1px', padding: '16px 0', flex: 1,
                      }}
                    >
                      {item.label}
                    </Link>
                    {item.dropdown && (
                      <button
                        onClick={() => setOpenMobileSection(mobileOpen ? null : item.label)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream)', padding: '8px 4px' }}
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
                        <Link key={d.href} href={d.href} onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 16px', borderRadius: 12, textDecoration: 'none', background: 'rgba(255,255,255,.06)' }}>
                          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--cream)' }}>{d.label}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Link
            href="/convention/register"
            onClick={() => { haptic('medium'); setOpen(false); }}
            className="press"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg,#7A1128,#FDC841)', color: '#fff', fontWeight: 800, fontSize: 17, padding: '18px 24px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 14px 30px rgba(122,17,40,.45)', marginTop: 32 }}
          >
            <CalendarDays size={17} strokeWidth={2.5} aria-hidden /> Register →
          </Link>
        </div>
      )}
    </>
  );
}
