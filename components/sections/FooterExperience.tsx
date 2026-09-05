'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { InstagramIcon, YoutubeIcon } from '@/components/ui/SocialIcons';
import { haptic } from '@/lib/haptics';
import { MapPin, Phone, Mail, ArrowUp, ArrowRight } from 'lucide-react';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { currentOrNextConvention } from '@/lib/conventions';

const socials = [
  { icon: <YoutubeIcon />, title: 'YouTube', href: 'https://youtube.com/@cacnorthamericalatunderegi1330' },
  { icon: <InstagramIcon />, title: 'Instagram', href: 'https://instagram.com/cacnorthamericalatunderegion' },
];

const isExternalHref = (href: string) => href.startsWith('http');
function withLocale(href: string, locale: string): string {
  return isExternalHref(href) ? href : `/${locale}${href}`;
}

// Whichever convention is current/next, same source Nav.tsx uses for its
// own CTA -- the "Annual Convention" footer link used to hardcode an
// external URL to the (now-retired) standalone Convention site; it points
// here instead so it always resolves to whatever CACNA's own register/save-
// the-date page for that year actually is.
const nextConvention = currentOrNextConvention();
const conventionHref = nextConvention.registrationUrl ?? nextConvention.href;

function BackToTop({ label }: { label: string }) {
  return (
    <button
      onClick={() => { haptic('selection'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      className="press"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(245,246,250,.07)', border: '1px solid rgba(245,246,250,.14)',
        color: 'rgba(245,246,250,.75)', fontSize: 12.5, fontWeight: 700,
        padding: '9px 16px', borderRadius: 999, cursor: 'pointer',
      }}
    >
      <ArrowUp size={13} strokeWidth={2.5} aria-hidden /> {label}
    </button>
  );
}

export function FooterExperience() {
  const locale = useLocale();
  const t = useTranslations('Footer');

  const columns: { heading: string; links: readonly (readonly [string, string])[] }[] = [
    {
      heading: t('whoWeAre'),
      links: [
        ['/about', t('aboutCacna')],
        ['/leadership', t('leadership')],
        ['/zones', t('zonesDccs')],
        ['/ministries', t('ministries')],
        ['/bible-institute', t('bibleInstitute')],
        [conventionHref, t('annualConvention')],
      ],
    },
    {
      heading: t('media'),
      links: [
        ['/online', t('watchOnline')],
        ['/watchwords', t('watchwords')],
        ['/calendar', t('calendarEvents')],
        ['/blog', t('blogNews')],
        ['/gallery', t('gallery')],
      ],
    },
  ];

  return (
    <footer style={{ background: 'var(--ink)', padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,64px) 0' }}>
      <Reveal>
        {/* Newsletter — leads the footer as its own highlighted band */}
        <div style={{
          maxWidth: 1240, margin: '0 auto 44px', borderRadius: 24,
          background: 'linear-gradient(120deg,rgba(253,200,65,.1),rgba(200,30,58,.12))',
          border: '1px solid rgba(253,200,65,.2)',
          padding: 'clamp(28px,4vw,40px)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24,
        }}>
          <div style={{ flex: '1 1 260px' }}>
            <div style={{ fontWeight: 800, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--gold)', marginBottom: 8 }}>{t('stayConnected')}</div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(20px,2.4vw,26px)', color: '#fff', margin: '0 0 6px', letterSpacing: '-.4px' }}>{t('newsletterHeading')}</p>
            <p style={{ fontSize: 13.5, color: 'rgba(245,246,250,.5)', margin: 0 }}>{t('newsletterBody')}</p>
          </div>
          <div style={{ flex: '1 1 340px' }}>
            <NewsletterForm />
          </div>
        </div>

        <div style={{
          maxWidth: 1240, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,200px), 1fr))',
          gap: 'clamp(32px,4vw,48px)',
          paddingBottom: 44,
          borderBottom: '1px solid rgba(245,246,250,.1)',
        }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Image src="/images/logo.png" alt={t('logoAlt')} width={42} height={42}
                style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: 9.5, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>{t('orgKicker')}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', marginTop: 3 }}>{t('orgName')}</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(245,246,250,.55)', margin: '16px 0 22px', lineHeight: 1.7, maxWidth: 260 }}>
              {t('blurb')}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {socials.map(s => (
                <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.title} onClick={() => haptic('selection')} className="press"
                  style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(245,246,250,.07)', border: '1px solid rgba(245,246,250,.11)', display: 'grid', placeItems: 'center', textDecoration: 'none', color: 'rgba(245,246,250,.75)', flexShrink: 0 }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--gold)', marginBottom: 18 }}>{col.heading}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                {col.links.map(([href, label]) => (
                  isExternalHref(href) ? (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(245,246,250,.6)', textDecoration: 'none' }}>{label}</a>
                  ) : (
                    <Link key={href} href={withLocale(href, locale)} style={{ color: 'rgba(245,246,250,.6)', textDecoration: 'none' }}>{label}</Link>
                  )
                ))}
              </div>
            </div>
          ))}

          {/* Find a church + contact */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--gold)', marginBottom: 18 }}>{t('findAChurch')}</div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13.5, color: 'rgba(245,246,250,.6)', lineHeight: 1.6, margin: '0 0 12px' }}>
                {t('findAChurchBody')}
              </p>
              <Link href={withLocale('/zones', locale)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 800, color: 'var(--gold)', textDecoration: 'none' }}>
                {t('browseZoneDirectory')} <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
              </Link>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(245,246,250,.35)', marginBottom: 11 }}>
              {t('regionalOffice')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 14 }}>
              <a href="tel:+13054690346" style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'rgba(245,246,250,.6)', textDecoration: 'none' }}>
                <Phone size={14} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden /> (305) 469-0346
              </a>
              <a href="mailto:info@cacnorthamerica.com" style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'rgba(245,246,250,.6)', textDecoration: 'none', wordBreak: 'break-word' }}>
                <Mail size={14} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden /> info@cacnorthamerica.com
              </a>
              <a href="https://maps.google.com/?q=14051+Stahley+Road+Blue+Ridge+Summit+PA+17214" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'flex-start', gap: 9, color: 'rgba(245,246,250,.6)', textDecoration: 'none' }}>
                <MapPin size={14} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
                14051 Stahley Road,<br />Blue Ridge Summit, PA 17214
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '24px 0 28px', fontSize: 12.5, color: 'rgba(245,246,250,.3)' }}>
          <span>{t('copyright')}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 20px' }}>
            <Link href={withLocale('/about#tenets', locale)} style={{ color: 'rgba(245,246,250,.3)', textDecoration: 'none' }}>{t('ourTenets')}</Link>
            <Link href={withLocale('/statement-of-faith', locale)} style={{ color: 'rgba(245,246,250,.3)', textDecoration: 'none' }}>{t('statementOfFaith')}</Link>
            <Link href={withLocale('/leadership/past', locale)} style={{ color: 'rgba(245,246,250,.3)', textDecoration: 'none' }}>{t('pastLeaders')}</Link>
            <Link href={withLocale('/contact', locale)} style={{ color: 'rgba(245,246,250,.3)', textDecoration: 'none' }}>{t('contact')}</Link>
            <Link href={withLocale('/sitemap', locale)} style={{ color: 'rgba(245,246,250,.3)', textDecoration: 'none' }}>{t('sitemap')}</Link>
            <BackToTop label={t('backToTop')} />
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
