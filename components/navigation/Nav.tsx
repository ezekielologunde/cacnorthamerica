'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Search, CalendarDays } from 'lucide-react';
import { haptic } from '@/lib/haptics';
import { SearchModal } from '@/components/ui/SearchModal';
import { currentOrNextConvention, isConventionPast } from '@/lib/conventions';

interface NavItem {
  label: string;
  href?: string;
  dropdown?: { href: string; label: string; desc: string; external?: boolean }[];
  /** Renders the dropdown panel as a 2-column grid instead of a single
   *  stack — for menus with enough items that one column would run long. */
  layout?: 'grid';
}

const isExternalHref = (href: string) => href.startsWith('http');

// Whichever convention is current/next — once this year's dates pass, the
// nav's "Register" CTA automatically points at the next confirmed year.
// Locale-independent business logic (which year is "next"), so this stays
// at module scope; only the hrefs built from it get locale-prefixed inside
// the component, where the active locale is actually known.
const nextConvention = currentOrNextConvention();
const conventionCtaHref = nextConvention.registrationUrl ?? nextConvention.href;

// Prefixes an internal path with the active locale; external (http/https)
// links pass through untouched. Every href in `navItems` below goes through
// this before being rendered.
function withLocale(href: string, locale: string): string {
  return isExternalHref(href) ? href : `/${locale}${href}`;
}

interface NavProps {
  dark?: boolean;
  /** Hero behind the nav is dark at the top of the page (so the bar needs light text until scrolled). */
  heroDark?: boolean;
}

export function Nav({ dark = false, heroDark = false }: NavProps) {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Nav');
  // `pathname` (from next/navigation) already includes the locale segment
  // (e.g. "/en/about"), matching the locale-prefixed hrefs `navItems` below
  // carries -- so the `pathname === item.href` active-link checks further
  // down need no extra stripping/prefixing of their own.
  const conventionCtaLabel = t('conventionCta', { year: nextConvention.year });
  const navItems: NavItem[] = [
    {
      label: t('eventsConvention'),
      href: withLocale(nextConvention.href, locale),
      dropdown: [
        {
          href: withLocale(conventionCtaHref, locale),
          label: conventionCtaLabel,
          desc: nextConvention.registrationUrl ? t('conventionCtaDescOpen') : t('conventionCtaDescComingSoon'),
          external: isExternalHref(conventionCtaHref),
        },
        { href: withLocale('/calendar', locale), label: t('calendarEvents'), desc: t('calendarEventsDesc') },
        { href: withLocale('/archive', locale), label: t('pastConventions'), desc: t('pastConventionsDesc') },
      ],
    },
    {
      label: t('whoWeAre'),
      href: withLocale('/about', locale),
      dropdown: [
        { href: withLocale('/about', locale), label: t('aboutCacna'), desc: t('aboutCacnaDesc') },
        { href: withLocale('/leadership', locale), label: t('leadership'), desc: t('leadershipDesc') },
        { href: withLocale('/zones', locale), label: t('zonesDccs'), desc: t('zonesDccsDesc') },
        { href: withLocale('/bible-institute', locale), label: t('bibleInstitute'), desc: t('bibleInstituteDesc') },
      ],
    },
    {
      label: t('ministries'),
      href: withLocale('/ministries', locale),
      layout: 'grid',
      dropdown: [
        { href: withLocale('/cacma', locale), label: t('cacma'), desc: t('cacmaDesc') },
        { href: withLocale('/youth', locale), label: t('youth'), desc: t('youthDesc') },
        { href: withLocale('/christian-education', locale), label: t('christianEducation'), desc: t('christianEducationDesc') },
        { href: withLocale('/good-women', locale), label: t('goodWomen'), desc: t('goodWomenDesc') },
        { href: withLocale('/ministers-wives', locale), label: t('ministersWives'), desc: t('ministersWivesDesc') },
        { href: withLocale('/business-group', locale), label: t('businessGroup'), desc: t('businessGroupDesc') },
        { href: withLocale('/children', locale), label: t('children'), desc: t('childrenDesc') },
        { href: withLocale('/ministries', locale), label: t('seeAllMinistries'), desc: t('ministriesDesc') },
      ],
    },
    {
      label: t('media'),
      href: withLocale('/blog', locale),
      dropdown: [
        { href: withLocale('/online', locale), label: t('watchOnline'), desc: t('watchOnlineDesc') },
        { href: withLocale('/blog', locale), label: t('blogNews'), desc: t('blogNewsDesc') },
        { href: withLocale('/watchwords', locale), label: t('watchwords'), desc: t('watchwordsDesc') },
        { href: withLocale('/gallery', locale), label: t('gallery'), desc: t('galleryDesc') },
      ],
    },
    { label: t('contact'), href: withLocale('/contact', locale) },
  ];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [conventionOpen, setConventionOpen] = useState(true);

  // Convention registration is CACNA's flagship annual CTA — keep it live in
  // the nav until the event itself has passed, then fall back to the general
  // Events page instead of an outdated "Register" prompt.
  useEffect(() => {
    setConventionOpen(!isConventionPast(nextConvention));
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const update = () => {
      const isScrolled = window.scrollY > 36;
      setScrolled(isScrolled);
      nav.style.background = open
        ? dark ? 'rgba(12,14,19,.97)' : 'rgba(255,255,255,.98)'
        : isScrolled
        ? dark ? 'rgba(12,14,19,.85)' : 'rgba(255,255,255,.96)'
        : 'transparent';
      nav.style.boxShadow = isScrolled && !open
        ? dark ? '0 6px 24px rgba(0,0,0,.4)' : '0 6px 24px rgba(18,20,30,.08)'
        : 'none';
      nav.style.backdropFilter = isScrolled || open ? 'blur(12px)' : 'none';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [dark, open]);

  useEffect(() => { setOpen(false); setOpenMobileSection(null); }, [pathname]);

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
  // Whenever the bar actually has a background underneath it (i.e. whenever
  // it isn't sitting transparent over a dark hero), show the accent strip
  // along its bottom edge — matches the reference nav's persistent red
  // underline, which only makes sense once there's a bar to underline.
  const hasSolidBg = open || scrolled || !heroDark;

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed', top: 'var(--bar-h, 0px)', left: 0, right: 0, zIndex: 100,
          padding: '13px clamp(20px,5vw,64px)',
          transition: 'background .4s, box-shadow .4s',
        }}
      >
        {/* Content is centered to the same 1240px column as FooterExperience
            and the page body, so the bar's logo/links align with the rest of
            the site instead of hugging the viewport edges on wide screens --
            the <nav> itself stays full-bleed for its background/border. */}
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: barInk, flexShrink: 0, transition: 'color .4s' }}>
          <Image src="/images/logo.png" alt={t('logoAlt')} width={42} height={42} style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: barAccent, fontWeight: 700, transition: 'color .4s' }}>{t('orgKicker')}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, letterSpacing: '-.3px', marginTop: 3 }}>{t('orgName')}</span>
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
                    textDecoration: 'none', transition: 'color .4s, border-color .4s',
                    padding: '7px 10px 5px', borderRadius: 8, whiteSpace: 'nowrap',
                    borderBottom: `2px solid ${active ? 'var(--red)' : 'transparent'}`,
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
                        boxShadow: '0 20px 50px rgba(18,20,30,.16)',
                        border: `1px solid ${dark ? 'rgba(255,255,255,.1)' : 'var(--line)'}`,
                        minWidth: item.layout === 'grid' ? 440 : 200,
                        ...(item.layout === 'grid'
                          ? { display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 2 }
                          : {}),
                      }}>
                        {item.dropdown.map(d => {
                          const itemStyle: CSSProperties = {
                            display: 'block', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', transition: 'background .15s',
                            background: d.external ? (dark ? 'rgba(253,200,65,.12)' : 'var(--cream-2)') : undefined,
                          };
                          const onMouseEnter = (e: MouseEvent<HTMLElement>) => (e.currentTarget.style.background = dark ? 'rgba(255,255,255,.06)' : 'var(--cream-2)');
                          const onMouseLeave = (e: MouseEvent<HTMLElement>) => (e.currentTarget.style.background = d.external ? (dark ? 'rgba(253,200,65,.12)' : 'var(--cream-2)') : 'transparent');
                          const content = (
                            <>
                              <div style={{ fontWeight: 700, fontSize: 14, color: d.external ? (dark ? 'var(--gold)' : 'var(--red-deep)') : dark ? 'var(--cream)' : 'var(--ink)' }}>{d.label}</div>
                              <div style={{ fontSize: 12, color: dark ? 'rgba(245,246,250,.5)' : 'var(--ink-soft)', marginTop: 2 }}>{d.desc}</div>
                            </>
                          );
                          return d.external || isExternalHref(d.href)
                            ? <a key={d.href} href={d.href} target="_blank" rel="noopener noreferrer" style={itemStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{content}</a>
                            : <Link key={d.href} href={d.href} style={itemStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{content}</Link>;
                        })}
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
                textDecoration: 'none', padding: '7px 10px 5px', borderRadius: 8, whiteSpace: 'nowrap',
                borderBottom: `2px solid ${active ? 'var(--red)' : 'transparent'}`,
                transition: 'color .4s, border-color .4s',
              }}>
                {item.label}
              </Link>
            );
          })}

          {/* Search, Give, Store, Register — spaced out as their own cluster
              rather than packed tight, so each reads as its own control
              instead of a run-on row (matches the reference nav). */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginLeft: 16 }}>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label={t("search")}
              title={t("searchShortcut")}
              style={{ background: lightBar ? 'rgba(245,246,250,.1)' : 'var(--cream-2)', border: `1px solid ${lightBar ? 'rgba(245,246,250,.18)' : 'var(--line)'}`, borderRadius: 999, cursor: 'pointer', padding: '9px 13px', color: barInk, display: 'flex', alignItems: 'center', transition: 'all .4s' }}
            >
              <Search size={16} strokeWidth={2} />
            </button>
            <span aria-hidden style={{ width: 1, height: 20, background: lightBar ? 'rgba(245,246,250,.25)' : 'var(--line)', flexShrink: 0 }} />
            {/* Give and Store share one pill style -- previously Give was a
                plain text link next to Store's outlined pill next to
                Convention's gradient CTA, three different visual weights in
                a row. Now there's exactly one strong CTA (Convention). */}
            <Link
              href={withLocale('/giving', locale)}
              style={{
                display: 'inline-flex', alignItems: 'center',
                border: `1.5px solid ${lightBar ? 'rgba(245,246,250,.4)' : 'var(--ink)'}`,
                color: barInk, fontWeight: 700, fontSize: 13.5,
                padding: '8px 16px', borderRadius: 999, textDecoration: 'none',
                transition: 'color .4s, border-color .4s', whiteSpace: 'nowrap',
              }}
            >
              {t('give')}
            </Link>
            <Link
              href={withLocale('/store', locale)}
              style={{
                display: 'inline-flex', alignItems: 'center',
                border: `1.5px solid ${lightBar ? 'rgba(245,246,250,.4)' : 'var(--ink)'}`,
                color: barInk, fontWeight: 700, fontSize: 13.5,
                padding: '8px 16px', borderRadius: 999, textDecoration: 'none',
                transition: 'color .4s, border-color .4s', whiteSpace: 'nowrap',
              }}
            >
              {t('store')}
            </Link>
            {conventionOpen && (
              <span aria-hidden style={{ width: 1, height: 20, background: lightBar ? 'rgba(245,246,250,.25)' : 'var(--line)', flexShrink: 0 }} />
            )}
            {conventionOpen && (
              isExternalHref(conventionCtaHref) ? (
                <a
                  href={conventionCtaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => haptic('medium')}
                  className="btn-sheen press"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg,var(--red-deep),var(--gold))', color: '#fff', fontWeight: 800, fontSize: 14, padding: '10px 18px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 8px 22px rgba(122,17,40,.45)' }}
                >
                  <CalendarDays size={14} strokeWidth={2.5} aria-hidden />
                  {conventionCtaLabel} →
                </a>
              ) : (
                <Link
                  href={conventionCtaHref}
                  onClick={() => haptic('medium')}
                  className="btn-sheen press"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg,var(--red-deep),var(--gold))', color: '#fff', fontWeight: 800, fontSize: 14, padding: '10px 18px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 8px 22px rgba(122,17,40,.45)' }}
                >
                  <CalendarDays size={14} strokeWidth={2.5} aria-hidden />
                  {conventionCtaLabel} →
                </Link>
              )
            )}
          </div>
        </div>

        {/* Mobile search icon */}
        <button
          className="nav-hbg"
          onClick={() => { haptic('light'); setSearchOpen(true); }}
          aria-label={t("search")}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: barInk, flexDirection: 'row', gap: 0, alignItems: 'center', justifyContent: 'center', transition: 'color .4s' }}
        >
          <Search size={20} strokeWidth={2} />
        </button>

        {/* Hamburger */}
        <button
          className="nav-hbg"
          onClick={() => { haptic('light'); setOpen(o => !o); }}
          aria-label={open ? t('closeMenu') : t('openMenu')}
          aria-expanded={open}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: barInk, gap: 5, alignItems: 'center', transition: 'color .4s' }}
        >
          <span style={{ display: 'block', width: 24, height: 2, background: 'currentColor', borderRadius: 2, transition: 'transform .25s', transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 24, height: 2, background: 'currentColor', borderRadius: 2, transition: 'opacity .25s', opacity: open ? 0 : 1 }} />
          <span style={{ display: 'block', width: 24, height: 2, background: 'currentColor', borderRadius: 2, transition: 'transform .25s', transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
        </div>

        {/* Persistent accent strip along the bottom of the bar — only shown
            once the bar itself has a background to sit under (see hasSolidBg). */}
        <div aria-hidden style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 3, background: 'linear-gradient(90deg,var(--red-deep),var(--red))',
          opacity: hasSolidBg && !dark ? 1 : 0, transition: 'opacity .4s',
          pointerEvents: 'none',
        }} />
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: dark ? 'rgba(12,14,19,.97)' : 'rgba(255,255,255,.98)',
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
                <div key={item.label} style={{ borderBottom: `1px solid ${dark ? 'rgba(245,246,250,.1)' : 'var(--line)'}` }}>
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
                        aria-label={mobileOpen ? t('collapse') : t('expand')}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: mobileOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {item.dropdown && mobileOpen && (
                    <div style={{ paddingBottom: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {item.dropdown.map(d => {
                        const external = d.external || isExternalHref(d.href);
                        const style: CSSProperties = {
                          display: 'block', padding: '10px 16px', borderRadius: 12,
                          textDecoration: 'none',
                          background: d.external ? (dark ? 'rgba(253,200,65,.14)' : 'rgba(253,200,65,.14)') : (dark ? 'rgba(255,255,255,.06)' : 'var(--cream-2)'),
                        };
                        const content = (
                          <>
                            <div style={{ fontWeight: d.external ? 800 : 700, fontSize: 16, color: ink }}>{d.label}</div>
                            <div style={{ fontSize: 13, color: dark ? 'rgba(245,246,250,.5)' : 'var(--ink-soft)', marginTop: 2 }}>{d.desc}</div>
                          </>
                        );
                        return external ? (
                          <a key={d.href} href={d.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} style={style}>{content}</a>
                        ) : (
                          <Link key={d.href} href={d.href} onClick={() => setOpen(false)} style={style}>{content}</Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
            <Link
              href={withLocale('/giving', locale)}
              onClick={() => setOpen(false)}
              className="press"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1.5px solid ${dark ? 'rgba(245,246,250,.2)' : 'var(--line)'}`, color: ink, fontWeight: 700, fontSize: 15,
                padding: '14px 24px', borderRadius: 999, textDecoration: 'none',
              }}
            >
              {t('give')}
            </Link>
            <Link
              href={withLocale('/store', locale)}
              onClick={() => setOpen(false)}
              className="press"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1.5px solid ${ink}`, color: ink, fontWeight: 700, fontSize: 15,
                padding: '14px 24px', borderRadius: 999, textDecoration: 'none',
              }}
            >
              {t('store')}
            </Link>
            {conventionOpen && (
              isExternalHref(conventionCtaHref) ? (
                <a
                  href={conventionCtaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { haptic('medium'); setOpen(false); }}
                  className="press"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg,var(--red-deep),var(--gold))', color: '#fff', fontWeight: 800, fontSize: 17, padding: '18px 24px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 14px 30px rgba(122,17,40,.45)' }}>
                  <CalendarDays size={17} strokeWidth={2.5} aria-hidden />
                  {conventionCtaLabel} →
                </a>
              ) : (
                <Link
                  href={conventionCtaHref}
                  onClick={() => { haptic('medium'); setOpen(false); }}
                  className="press"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg,var(--red-deep),var(--gold))', color: '#fff', fontWeight: 800, fontSize: 17, padding: '18px 24px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 14px 30px rgba(122,17,40,.45)' }}>
                  <CalendarDays size={17} strokeWidth={2.5} aria-hidden />
                  {conventionCtaLabel} →
                </Link>
              )
            )}
            <p style={{ fontSize: 12.5, color: dark ? 'rgba(245,246,250,.4)' : 'var(--ink-soft)', textAlign: 'center', margin: '8px 0 0' }}>
              {t('mobileFooterNote')}
            </p>
          </div>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
