'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { InstagramIcon, YoutubeIcon } from '@/components/ui/SocialIcons';
import { haptic } from '@/lib/haptics';
import { Phone, Mail, ArrowUp, ArrowRight } from 'lucide-react';
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
  const tNav = useTranslations('Nav');

  // Four simple link-list columns -- directory style, mirroring the
  // Convention site's own footer layout (Attend/Programs/Connect + a
  // Who We Are column for CACNA's org-wide pages that layout didn't carry).
  // Contact is rendered separately below since phone/email aren't plain
  // internal/external hrefs.
  const columns: { heading: string; links: readonly (readonly [string, string])[] }[] = [
    {
      heading: t('attendHeading'),
      links: [
        [conventionHref, t('register')],
        ['/about#convention', t('aboutConvention')],
        [`${nextConvention.href}/schedule`, t('schedule')],
        ['/plan-your-visit', t('planYourVisit')],
      ],
    },
    {
      heading: t('programsHeading'),
      links: [
        ['/youth', tNav('youth')],
        ['/children', tNav('children')],
        ['/good-women', tNav('goodWomen')],
        ['/ministers-wives', tNav('ministersWives')],
        ['/cacma', tNav('cacma')],
        ['/christian-education', tNav('christianEducation')],
        ['/business-group', tNav('businessGroup')],
      ],
    },
    {
      heading: t('connectHeading'),
      links: [
        ['/giving', tNav('give')],
        ['/store', t('store')],
        ['/online', t('watchOnline')],
        ['/blog', t('news')],
        ['/archive', t('archive')],
        ['/watchwords', t('watchwords')],
        ['/gallery', t('gallery')],
        ['/calendar', t('calendarEvents')],
      ],
    },
    {
      heading: t('whoWeAre'),
      links: [
        // CAC North America is one region of the global Christ Apostolic
        // Church movement headquartered in Nigeria -- linking out to the
        // parent body's own site rather than just mentioning it in prose.
        ['https://cacworld.org/', 'CAC World Headquarters'],
        ['/about', t('aboutCacna')],
        ['/leadership', t('leadership')],
        ['/zones', t('zonesDccs')],
        ['/bible-institute', t('bibleInstitute')],
      ],
    },
  ];

  const registerCtaProps = {
    onClick: () => haptic('medium'),
    className: 'press',
    style: {
      display: 'inline-flex' as const, alignItems: 'center' as const, gap: 7,
      background: 'var(--gold)', color: 'var(--ink)',
      fontWeight: 800, fontSize: 13.5, padding: '11px 18px', borderRadius: 999, textDecoration: 'none',
    },
  };

  return (
    <footer style={{ background: 'var(--ink)', padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,64px) 0' }}>
      <Reveal>
        {/* Sidebar + link columns + contact */}
        <div style={{
          maxWidth: 1240, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,210px), 1fr))',
          gap: 'clamp(32px,4vw,48px)',
          paddingBottom: 44,
        }}>

          {/* Sidebar */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Image src="/images/logo.png" alt={t('logoAlt')} width={42} height={42}
                style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: 9.5, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>{t('orgKicker')}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', marginTop: 3 }}>{t('orgName')}</span>
              </div>
            </div>

            <Link href={withLocale('/contact#convention-committee', locale)} className="press" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 18,
              background: 'linear-gradient(135deg,var(--red),var(--red-deep))', color: '#fff',
              fontWeight: 700, fontSize: 13, padding: '11px 16px', borderRadius: 999, textDecoration: 'none',
            }}>
              {t('contactConventionCommittee')} <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
            </Link>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              <Link href={withLocale('/events/cacna-50th-anniversary-2026', locale)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                border: '1px solid rgba(253,200,65,.4)', borderRadius: 999, padding: '6px 14px',
                fontSize: 11, fontWeight: 800, color: 'var(--gold)', textDecoration: 'none',
              }}>
                {t('anniversaryBadge')}
              </Link>
              <a href="https://cacworld.org/" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                border: '1px solid rgba(245,246,250,.2)', borderRadius: 999, padding: '6px 14px',
                fontSize: 11, fontWeight: 800, color: 'rgba(245,246,250,.8)', textDecoration: 'none',
              }}>
                CAC Worldwide ↗
              </a>
            </div>

            <p style={{ fontSize: 14, color: 'rgba(245,246,250,.55)', margin: '16px 0 20px', lineHeight: 1.7, maxWidth: 260 }}>
              {t('blurb')}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {isExternalHref(conventionHref) ? (
                <a href={conventionHref} target="_blank" rel="noopener noreferrer" {...registerCtaProps}>
                  {t('registerNowCta')} <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
                </a>
              ) : (
                <Link href={withLocale(conventionHref, locale)} {...registerCtaProps}>
                  {t('registerNowCta')} <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
                </Link>
              )}
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
              <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'rgba(245,246,250,.4)', marginBottom: 18 }}>{col.heading}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                {col.links.map(([href, label]) => (
                  isExternalHref(href) ? (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(245,246,250,.65)', textDecoration: 'none' }}>{label}</a>
                  ) : (
                    <Link key={href} href={withLocale(href, locale)} style={{ color: 'rgba(245,246,250,.65)', textDecoration: 'none' }}>{label}</Link>
                  )
                ))}
              </div>
            </div>
          ))}

          {/* Contact */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'rgba(245,246,250,.4)', marginBottom: 18 }}>{t('contactHeading')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
              <Link href={withLocale('/contact', locale)} style={{ color: 'rgba(245,246,250,.65)', textDecoration: 'none' }}>{t('contact')}</Link>
              <a href="tel:+13054690346" style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'rgba(245,246,250,.65)', textDecoration: 'none' }}>
                <Phone size={14} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden /> (305) 469-0346
              </a>
              <a href="mailto:info@cacnorthamerica.com" style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'rgba(245,246,250,.65)', textDecoration: 'none', wordBreak: 'break-word' }}>
                <Mail size={14} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden /> info@cacnorthamerica.com
              </a>
            </div>
          </div>

        </div>

        {/* Newsletter — below the columns, matching the reference layout */}
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

        {/* Bottom bar */}
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '24px 0 28px', fontSize: 12.5, color: 'rgba(245,246,250,.3)', borderTop: '1px solid rgba(245,246,250,.1)' }}>
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
