'use client';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FocusEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, CalendarDays } from 'lucide-react';
import { haptic } from '@/lib/haptics';
import { isConventionPast } from '@/lib/conventions';
import {
  navGroups, linksFor, navText, isExternalHref,
  nextConvention, conventionCtaHref, NAV_CONTACT, NAV_GIVE,
  type NavLink, type NavText,
} from '@/lib/nav';
import { activeGroupId, isCurrentPage, isWithin } from '@/lib/navMatch';
import './chrome-mobile.css';

// The search modal (and its index) only ships once someone opens it.
const SearchModal = dynamic(() => import('@/components/ui/SearchModal').then(m => m.SearchModal), { ssr: false });

const menuId = (id: string) => `nav-menu-${id}`;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
const visibleFocusables = (root: HTMLElement | null) =>
  root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => el.getClientRects().length > 0) : [];

// Sections come from lib/nav.ts, the same list the footer renders; the
// footer-only sections (Get Involved) are left out of the header.
const groups = navGroups().filter(g => !g.footerOnly);
const noopSubscribe = () => () => {};

interface NavProps {
  dark?: boolean;
  /** Hero behind the nav is dark at the top of the page (so the bar needs light text until scrolled). */
  heroDark?: boolean;
}

export function Nav({ dark = false, heroDark = false }: NavProps) {
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const focusFirstOnOpen = useRef(false);
  const pathname = usePathname();
  const t = useTranslations('Nav');
  const say = (text: NavText) => navText(t, text);
  const conventionCtaLabel = t('conventionCta', { year: nextConvention.year });
  const activeId = activeGroupId(pathname, groups);
  const contactActive = isWithin(pathname, NAV_CONTACT.href);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  // Convention registration is CACNA's flagship annual CTA — keep it live in
  // the nav until the event itself has passed, then fall back to the general
  // Events page instead of an outdated "Register" prompt. The server render
  // (and hydration) show it; the client then checks against today's date.
  const conventionOpen = useSyncExternalStore(
    noopSubscribe,
    () => !isConventionPast(nextConvention),
    () => true,
  );

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let last: boolean | null = null;
    const paint = (isScrolled: boolean) => {
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
    // Only touch the DOM / React state when the threshold is actually crossed,
    // not on every scroll event.
    const update = () => {
      const isScrolled = window.scrollY > 36;
      if (isScrolled === last) return;
      last = isScrolled;
      setScrolled(isScrolled);
      paint(isScrolled);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [dark, open]);

  // Close the mobile menu on navigation (reset during render, not in an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
    setOpenMobileSection(null);
    setOpenDropdown(null);
  }

  const closeMobileMenu = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) requestAnimationFrame(() => hamburgerRef.current?.focus());
  };

  // Mobile menu: Esc closes and returns focus to the toggle; Tab / Shift+Tab
  // stay inside the bar + menu while it is open (focus trap). Paused while the
  // search modal is on top, which owns the keyboard then.
  useEffect(() => {
    if (!open || searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeMobileMenu(true); return; }
      if (e.key !== 'Tab') return;
      const items = [...visibleFocusables(navRef.current), ...visibleFocusables(overlayRef.current)];
      if (items.length === 0) return;
      const first = items[0];
      const lastItem = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (!current || !items.includes(current)) { e.preventDefault(); first.focus(); return; }
      if (e.shiftKey && current === first) { e.preventDefault(); lastItem.focus(); }
      else if (!e.shiftKey && current === lastItem) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, searchOpen]);

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

  // Keyboard-opened dropdowns move focus to their first item once rendered.
  useEffect(() => {
    if (!openDropdown || !focusFirstOnOpen.current) return;
    focusFirstOnOpen.current = false;
    panelRefs.current[openDropdown]?.querySelector<HTMLElement>('a')?.focus();
  }, [openDropdown]);

  const closeDropdown = (id: string, returnFocus: boolean) => {
    setOpenDropdown(cur => (cur === id ? null : cur));
    if (returnFocus) triggerRefs.current[id]?.focus();
  };

  const onDropdownKeyDown = (id: string) => (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && openDropdown === id) {
      e.preventDefault();
      closeDropdown(id, true);
      return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const panel = panelRefs.current[id];
    // Only arrow keys pressed on a panel item move between items; ArrowDown on
    // the trigger is handled there (it focuses the first item, which must not
    // then be skipped as this handler sees the already-moved focus).
    if (!panel || !panel.contains(e.target as Node)) return;
    e.preventDefault();
    const links = Array.from(panel.querySelectorAll<HTMLElement>('a'));
    const i = links.indexOf(document.activeElement as HTMLElement);
    const next = e.key === 'ArrowDown' ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
    links[next]?.focus();
  };

  const onTriggerKeyDown = (id: string) => (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusFirstOnOpen.current = true;
      if (openDropdown === id) panelRefs.current[id]?.querySelector<HTMLElement>('a')?.focus();
      else setOpenDropdown(id);
    }
  };

  // Close when focus leaves the trigger + panel group entirely.
  const onDropdownBlur = (id: string) => (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeDropdown(id, false);
  };

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

  // One quiet secondary action (Give) beside the one strong CTA (Convention);
  // Store and the rest live in the Get Involved menu.
  const giveLabel = say(NAV_GIVE.label);
  const giveCurrent = isCurrentPage(pathname, NAV_GIVE.href);
  const ctaGradient = 'linear-gradient(135deg,var(--red-deep),var(--gold))';
  // Convention CTA: same props/content whether the href is internal (Link) or external (<a>).
  const deskCtaProps = {
    onClick: () => haptic('medium'),
    className: 'btn-sheen press',
    style: { display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 44, background: ctaGradient, color: '#fff', fontWeight: 800, fontSize: 14, padding: '10px 18px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 8px 22px rgba(122,17,40,.45)' } satisfies CSSProperties,
  };
  const deskCtaContent = <><CalendarDays size={14} strokeWidth={2.5} aria-hidden />{conventionCtaLabel} →</>;
  // Compact bar CTA for tablet widths where the desktop row is collapsed but
  // there is still room beside the logo (shown by CSS only, see chrome-mobile.css).
  const barCtaProps = {
    onClick: () => haptic('medium'),
    className: 'press nav-bar-cta',
    style: { alignItems: 'center', gap: 6, minHeight: 44, background: ctaGradient, color: '#fff', fontWeight: 800, fontSize: 13.5, padding: '0 16px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: 'auto', marginRight: 6 } satisfies CSSProperties,
  };
  const mobileCtaProps = {
    onClick: () => { haptic('medium'); setOpen(false); },
    className: 'press',
    style: { display: 'flex', order: 1, alignItems: 'center', justifyContent: 'center', gap: 8, background: ctaGradient, color: '#fff', fontWeight: 800, fontSize: 17, padding: '14px 24px', minHeight: 52, borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 24px rgba(122,17,40,.35)' } satisfies CSSProperties,
  };
  const mobileCtaContent = <><CalendarDays size={17} strokeWidth={2.5} aria-hidden />{conventionCtaLabel} →</>;

  const topLinkStyle = (active: boolean): CSSProperties => ({
    display: 'flex', alignItems: 'center', minHeight: 44,
    fontSize: 14.5, fontWeight: active ? 700 : 600,
    color: active ? barAccent : barInk,
    textDecoration: 'none', transition: 'color .4s, border-color .4s',
    // 8px, not 10: six sections must fit the row at the 1481px breakpoint
    // (globals.css .nav-desktop) with the scrollbar showing.
    padding: '0 8px', whiteSpace: 'nowrap',
    borderBottom: `2px solid ${active ? 'var(--red)' : 'transparent'}`,
    borderTop: '2px solid transparent',
  });

  const openMenu = () => {
    haptic('light');
    // Opening the menu expands the section you're already in, so its sibling
    // pages are one tap away.
    if (!open) setOpenMobileSection(activeId);
    setOpen(o => !o);
  };

  const ddItem = (d: NavLink) => {
    const external = isExternalHref(d.href);
    const current = isCurrentPage(pathname, d.href);
    const className = `nav-dd-item${d.feature ? ' is-feature' : ''}${current ? ' is-current' : ''}`;
    const content = (
      <>
        <span className="nav-dd-label">{say(d.label)}</span>
        {d.desc && <span className="nav-dd-desc">{say(d.desc)}</span>}
      </>
    );
    return external
      ? <a key={d.href} href={d.href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
      : <Link key={d.href} href={d.href} className={className} aria-current={current ? 'page' : undefined}>{content}</Link>;
  };

  const mobileItem = (d: NavLink) => {
    const external = isExternalHref(d.href);
    const current = isCurrentPage(pathname, d.href);
    const style: CSSProperties = {
      display: 'block', padding: '12px 16px', borderRadius: 12, minHeight: 52,
      textDecoration: 'none',
      background: d.feature || current ? 'rgba(253,200,65,.22)' : (dark ? 'rgba(255,255,255,.06)' : 'var(--cream-2)'),
      outline: current ? `1.5px solid ${accent}` : 'none', outlineOffset: -1.5,
    };
    const content = (
      <>
        <div style={{ fontWeight: d.feature ? 800 : 700, fontSize: 16, color: ink }}>{say(d.label)}</div>
        {d.desc && <div style={{ fontSize: 13, color: dark ? 'rgba(245,246,250,.7)' : 'var(--ink-soft)', marginTop: 2 }}>{say(d.desc)}</div>}
      </>
    );
    return external ? (
      <a key={d.href} href={d.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} style={style}>{content}</a>
    ) : (
      <Link key={d.href} href={d.href} onClick={() => setOpen(false)} style={style} aria-current={current ? 'page' : undefined}>{content}</Link>
    );
  };

  const mobileTopStyle = (active: boolean): CSSProperties => ({
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: 'clamp(24px,6.6vw,32px)',
    color: active ? accent : ink,
    textDecoration: 'none', letterSpacing: '-.5px',
    padding: '12px 0', flex: 1, minHeight: 56,
    display: 'flex', alignItems: 'center', gap: 10,
  });
  const mobileDivider = `1px solid ${dark ? 'rgba(245,246,250,.1)' : 'var(--line)'}`;

  return (
    <>
      <nav
        ref={navRef}
        aria-label={t('mainNavLabel')}
        style={{
          position: 'fixed', top: 'var(--bar-h, 0px)', left: 0, right: 0, zIndex: 100,
          padding: '13px clamp(20px,5vw,64px)',
          transition: 'background .4s, box-shadow .4s',
        }}
      >
        {/* Content is centered to the same column as FooterExperience and the
            page body, so the bar's logo/links align with the rest of the site
            instead of hugging the viewport edges on wide screens -- the <nav>
            itself stays full-bleed for its background/border. */}
        <div style={{ maxWidth: 1340, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: barInk, flexShrink: 0, transition: 'color .4s' }}>
          <Image src="/images/logo.png" alt={t('logoAlt')} width={42} height={42} style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, minWidth: 0 }}>
            <span className="nav-logo-kicker" style={{ fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: barAccent, fontWeight: 700, transition: 'color .4s' }}>{t('orgKicker')}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, letterSpacing: '-.3px', marginTop: 3 }}>{t('orgName')}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="nav-desktop" style={{ alignItems: 'center', gap: 2, listStyle: 'none', margin: 0, padding: 0 }}>
          {groups.map((g) => {
            const label = say(g.label);
            const active = activeId === g.id;
            const isOpen = openDropdown === g.id;
            const id = menuId(g.id);
            const links = linksFor(g, 'header');
            return (
              <li
                key={g.id}
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => setOpenDropdown(g.id)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }} onKeyDown={onDropdownKeyDown(g.id)} onBlur={onDropdownBlur(g.id)}>
                  <Link href={g.href} style={{ ...topLinkStyle(active), paddingRight: 2 }} aria-current={isCurrentPage(pathname, g.href) ? 'page' : undefined}>
                    {label}
                  </Link>
                  <button
                    type="button"
                    ref={el => { triggerRefs.current[g.id] = el; }}
                    className="nav-dd-trigger"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-controls={id}
                    aria-label={t('showSubmenu', { section: label })}
                    onClick={() => setOpenDropdown(isOpen ? null : g.id)}
                    onKeyDown={onTriggerKeyDown(g.id)}
                    style={{ color: active ? barAccent : barInk }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {isOpen && (
                    // Outer wrapper is positioned flush to the trigger (top: 100%) and
                    // uses paddingTop as a transparent "bridge" so the cursor never
                    // crosses a dead zone on its way to the panel — which would fire
                    // mouseleave and collapse the menu before a click could land.
                    <div style={{
                      position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                      paddingTop: 8, zIndex: 10,
                    }}>
                      <div
                        id={id}
                        ref={el => { panelRefs.current[g.id] = el; }}
                        className={dark ? 'nav-dd nav-dd-dark' : 'nav-dd'}
                        style={{
                          minWidth: g.layout === 'grid' ? 440 : 240,
                          ...(g.layout === 'grid'
                            ? { display: 'grid' as const, gridTemplateColumns: '1fr 1fr', gap: 2 }
                            : {}),
                        }}
                      >
                        {links.map(ddItem)}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}

          <li style={{ display: 'flex' }}>
            <Link href={NAV_CONTACT.href} style={topLinkStyle(contactActive)} aria-current={isCurrentPage(pathname, NAV_CONTACT.href) ? 'page' : undefined}>
              {say(NAV_CONTACT.label)}
            </Link>
          </li>

          {/* Search, Give, Register — spaced out as their own cluster
              rather than packed tight, so each reads as its own control
              instead of a run-on row (matches the reference nav). */}
          <li style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 14 }}>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t("search")}
              title={t("searchShortcut")}
              style={{ background: lightBar ? 'rgba(245,246,250,.1)' : 'var(--cream-2)', border: `1px solid ${lightBar ? 'rgba(245,246,250,.18)' : 'var(--line)'}`, borderRadius: 999, cursor: 'pointer', width: 44, height: 44, color: barInk, display: 'grid', placeItems: 'center', transition: 'background .4s, border-color .4s, color .4s' }}
            >
              <Search size={16} strokeWidth={2} aria-hidden />
            </button>
            <Link
              href={NAV_GIVE.href}
              aria-current={giveCurrent ? 'page' : undefined}
              style={{
                display: 'inline-flex', alignItems: 'center', minHeight: 44,
                border: `1.5px solid ${giveCurrent ? barAccent : lightBar ? 'rgba(245,246,250,.4)' : 'var(--ink)'}`,
                color: giveCurrent ? barAccent : barInk, fontWeight: 700, fontSize: 13.5,
                padding: '0 16px', borderRadius: 999, textDecoration: 'none',
                transition: 'color .4s, border-color .4s', whiteSpace: 'nowrap',
              }}
            >
              {giveLabel}
            </Link>
            {conventionOpen && (
              isExternalHref(conventionCtaHref) ? (
                <a href={conventionCtaHref} target="_blank" rel="noopener noreferrer" {...deskCtaProps}>{deskCtaContent}</a>
              ) : (
                <Link href={conventionCtaHref} {...deskCtaProps}>{deskCtaContent}</Link>
              )
            )}
          </li>
        </ul>

        {/* Tablet bar CTA (CSS-gated) */}
        {conventionOpen && (
          isExternalHref(conventionCtaHref) ? (
            <a href={conventionCtaHref} target="_blank" rel="noopener noreferrer" {...barCtaProps}><CalendarDays size={14} strokeWidth={2.5} aria-hidden />{conventionCtaLabel}</a>
          ) : (
            <Link href={conventionCtaHref} {...barCtaProps}><CalendarDays size={14} strokeWidth={2.5} aria-hidden />{conventionCtaLabel}</Link>
          )
        )}

        {/* Mobile search icon */}
        <button
          type="button"
          className="nav-hbg nav-tap"
          onClick={() => { haptic('light'); setSearchOpen(true); }}
          aria-label={t("search")}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: barInk, flexDirection: 'row', gap: 0, alignItems: 'center', justifyContent: 'center', transition: 'color .4s' }}
        >
          <Search size={20} strokeWidth={2} aria-hidden />
        </button>

        {/* Hamburger */}
        <button
          type="button"
          ref={hamburgerRef}
          className="nav-hbg nav-tap"
          onClick={openMenu}
          aria-label={open ? t('closeMenu') : t('openMenu')}
          aria-expanded={open}
          aria-controls="mobile-menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: barInk, gap: 5, alignItems: 'center', transition: 'color .4s' }}
        >
          <span aria-hidden style={{ display: 'block', width: 24, height: 2, background: 'currentColor', borderRadius: 2, transition: 'transform .25s', transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span aria-hidden style={{ display: 'block', width: 24, height: 2, background: 'currentColor', borderRadius: 2, transition: 'opacity .25s', opacity: open ? 0 : 1 }} />
          <span aria-hidden style={{ display: 'block', width: 24, height: 2, background: 'currentColor', borderRadius: 2, transition: 'transform .25s', transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
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

      {/* Mobile overlay: one accordion row per section, each section's name
          still a link to its landing page. */}
      {open && (
        <div id="mobile-menu" ref={overlayRef} className="nav-m-overlay" style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: dark ? 'rgb(12,14,19)' : 'rgb(255,255,255)',
          display: 'flex', flexDirection: 'column',
          padding: 'calc(var(--bar-h, 0px) + 76px) 20px 0',
          overflowY: 'auto', overscrollBehavior: 'contain',
        }}>
          <nav aria-label={t('mobileNavLabel')} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {groups.map((g) => {
              const label = say(g.label);
              const active = activeId === g.id;
              const mobileOpen = openMobileSection === g.id;
              const sectionId = `${menuId(g.id)}-m`;
              return (
                <div key={g.id} style={{ borderBottom: mobileDivider }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link
                      href={g.href}
                      onClick={() => setOpen(false)}
                      style={mobileTopStyle(active)}
                      aria-current={isCurrentPage(pathname, g.href) ? 'page' : undefined}
                    >
                      {active && <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }} />}
                      {label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setOpenMobileSection(mobileOpen ? null : g.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: ink, width: 48, height: 48, display: 'grid', placeItems: 'center', flexShrink: 0 }}
                      aria-expanded={mobileOpen}
                      aria-controls={sectionId}
                      aria-label={t('showSubmenu', { section: label })}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden style={{ transform: mobileOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>
                  {mobileOpen && (
                    <div id={sectionId} style={{ paddingBottom: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {linksFor(g, 'header').map(mobileItem)}
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ borderBottom: mobileDivider }}>
              <Link
                href={NAV_CONTACT.href}
                onClick={() => setOpen(false)}
                style={mobileTopStyle(contactActive)}
                aria-current={isCurrentPage(pathname, NAV_CONTACT.href) ? 'page' : undefined}
              >
                {contactActive && <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }} />}
                {say(NAV_CONTACT.label)}
              </Link>
            </div>
          </nav>

          <div className="nav-m-actions" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24, position: 'sticky', bottom: 0, padding: '12px 0 calc(14px + env(safe-area-inset-bottom))', background: dark ? 'rgb(12,14,19)' : 'rgb(255,255,255)', borderTop: mobileDivider }}>
            <Link
              href={NAV_GIVE.href}
              onClick={() => setOpen(false)}
              className="press"
              aria-current={giveCurrent ? 'page' : undefined}
              style={{
                order: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1.5px solid ${ink}`, color: ink, fontWeight: 700, fontSize: 16,
                padding: '12px 16px', minHeight: 48, borderRadius: 999, textDecoration: 'none',
              }}
            >
              {giveLabel}
            </Link>
            {conventionOpen && (
              isExternalHref(conventionCtaHref) ? (
                <a href={conventionCtaHref} target="_blank" rel="noopener noreferrer" {...mobileCtaProps}>{mobileCtaContent}</a>
              ) : (
                <Link href={conventionCtaHref} {...mobileCtaProps}>{mobileCtaContent}</Link>
              )
            )}
            <p style={{ fontSize: 12.5, color: dark ? 'rgba(245,246,250,.65)' : 'var(--ink-soft)', textAlign: 'center', margin: '0', order: 3 }}>
              {t('mobileFooterNote')}
            </p>
          </div>
        </div>
      )}

      {searchOpen && <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />}
    </>
  );
}
