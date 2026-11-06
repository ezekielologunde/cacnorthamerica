'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { InstagramIcon, TikTokIcon, XIcon, YoutubeIcon } from '@/components/ui/SocialIcons';
import { haptic } from '@/lib/haptics';
import { Phone, Mail, MapPin, ArrowUp, ArrowRight } from 'lucide-react';
import { NewsletterForm } from '@/components/sections/NewsletterForm';
import { currentOrNextConvention } from '@/lib/conventions';
import { SITE } from '@/lib/site';
import { CACNA_X_URL, youthSocialLinks, type SocialPlatform } from '@/lib/youthSocials';
import '@/components/navigation/chrome-mobile.css';

const isExternalHref = (href: string) => href.startsWith('http');

// Whichever convention is current/next, same source Nav.tsx uses for its
// own CTA -- the "Annual Convention" footer link used to hardcode an
// external URL to the (now-retired) standalone Convention site; it points
// here instead so it always resolves to whatever CACNA's own register/save-
// the-date page for that year actually is.
const nextConvention = currentOrNextConvention();
const conventionHref = nextConvention.registrationUrl ?? nextConvention.href;
// Same rule as the Youth page: the youth form lives at <register>/youth when
// registration is on-site; until then, point at the Youth page's register
// section, which says registration opens soon.
const internalReg = nextConvention.registrationUrl?.startsWith('/') ? nextConvention.registrationUrl : undefined;
const youthRegisterHref = internalReg ? `${internalReg}/youth` : '/youth#register';

// Contact details come only from SITE (lib/site.ts).
const telDigits = SITE.telephone.replace(/[^\d+]/g, '');
const telDisplay = SITE.telephone.replace(/^\+1-(\d{3})-(\d{3})-(\d{4})$/, '($1) $2-$3');
const fullAddress = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`;
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

const ICONS: Record<SocialPlatform | 'youtube', ReactNode> = {
  youtube: <YoutubeIcon size={18} />,
  instagram: <InstagramIcon size={18} />,
  tiktok: <TikTokIcon size={17} />,
  x: <XIcon size={16} />,
  whatsapp: null,
};

// CACNA's own accounts: the two in SITE.sameAs plus the main X account.
const cacnaSocials: { platform: SocialPlatform | 'youtube'; href: string; label: string }[] = [
  ...SITE.sameAs.map(href => (href.includes('youtube')
    ? { platform: 'youtube' as const, href, label: 'YouTube' }
    : { platform: 'instagram' as const, href, label: 'Instagram' })),
  { platform: 'x', href: CACNA_X_URL, label: 'X @christ_north' },
];
const PLATFORM_NAME: Record<SocialPlatform, string> = { instagram: 'Instagram', tiktok: 'TikTok', x: 'X', whatsapp: 'WhatsApp' };
const youthSocials = youthSocialLinks()
  .filter(l => l.owner === 'youth' && (l.platform === 'instagram' || l.platform === 'tiktok'))
  .map(l => ({ platform: l.platform, href: l.url, label: `${PLATFORM_NAME[l.platform]} ${l.handle}` }));

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return isExternalHref(href)
    ? <a href={href} target="_blank" rel="noopener noreferrer" className="ft-link">{children}</a>
    : <Link href={href} className="ft-link">{children}</Link>;
}

function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => { haptic('selection'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      className="press ft-top"
    >
      <ArrowUp size={14} strokeWidth={2.5} aria-hidden /> {label}
    </button>
  );
}

export function FooterExperience() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');

  // Directory-style link columns. Contact/Visit is rendered separately since
  // phone/email/address aren't plain page links.
  const columns: { heading: string; links: readonly (readonly [string, string])[] }[] = [
    {
      heading: t('attendHeading'),
      links: [
        [conventionHref, t('register')],
        [youthRegisterHref, t('youthRegister')],
        ['/about#convention', t('aboutConvention')],
        [`${nextConvention.href}/schedule`, t('schedule')],
        ['/plan-your-visit', t('planYourVisit')],
        ['/serve', t('serve')],
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
        ['/about', t('aboutCacna')],
        ['/history', t('history')],
        ['/leadership', t('leadership')],
        ['/zones', t('zonesDccs')],
        ['/bible-institute', t('bibleInstitute')],
        // CAC North America is one region of the global Christ Apostolic
        // Church movement headquartered in Nigeria -- linking out to the
        // parent body's own site rather than just mentioning it in prose.
        ['https://cacworld.org/', 'CAC World Headquarters'],
      ],
    },
  ];

  const legalLinks: [string, string][] = [
    ['/about#tenets', t('ourTenets')],
    ['/statement-of-faith', t('statementOfFaith')],
    ['/faq', t('faq')],
    ['/leadership/past', t('pastLeaders')],
    ['/privacy', t('privacy')],
    ['/terms', t('terms')],
    ['/refunds', t('refunds')],
    ['/accessibility', t('accessibility')],
    ['/sitemap', t('sitemap')],
  ];

  const registerCta = (
    <>{t('registerNowCta')} <ArrowRight size={14} strokeWidth={2.5} aria-hidden /></>
  );

  return (
    <footer className="ft">
      <Reveal>
        <div className="ft-inner">
          {/* Brand + newsletter */}
          <div className="ft-top-row">
            <div className="ft-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Image src="/images/logo.png" alt={t('logoAlt')} width={48} height={48}
                  style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                  <span style={{ fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>{t('orgKicker')}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#fff', marginTop: 4, letterSpacing: '-.3px' }}>{t('orgName')}</span>
                </div>
              </div>

              <p className="ft-blurb">{t('blurb')}</p>

              <div className="ft-cta-row">
                {isExternalHref(conventionHref) ? (
                  <a href={conventionHref} target="_blank" rel="noopener noreferrer" onClick={() => haptic('medium')} className="press ft-cta ft-cta-gold">{registerCta}</a>
                ) : (
                  <Link href={conventionHref} onClick={() => haptic('medium')} className="press ft-cta ft-cta-gold">{registerCta}</Link>
                )}
                <Link href="/contact#convention-committee" className="press ft-cta ft-cta-ghost">
                  {t('contactConventionCommittee')}
                </Link>
              </div>

              <Link href="/events/cacna-50th-anniversary-2026" className="ft-badge">
                {t('anniversaryBadge')}
              </Link>
            </div>

            <div className="ft-news">
              <h2 className="ft-news-h">{t('newsletterHeading')}</h2>
              <p className="ft-news-p">{t('newsletterBody')}</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Directory */}
          <nav aria-label={t('navLabel')} className="ft-grid">
            {columns.map((col) => (
              <div key={col.heading} className="ft-col">
                <h2 className="ft-h">{col.heading}</h2>
                <ul className="ft-links">
                  {col.links.map(([href, label]) => (
                    <li key={href}><FooterLink href={href}>{label}</FooterLink></li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="ft-col ft-contact">
              <h2 className="ft-h">{t('contactHeading')}</h2>
              <ul className="ft-links">
                <li><Link href="/contact" className="ft-link">{t('contact')}</Link></li>
                <li>
                  <a href={`tel:${telDigits}`} className="ft-link ft-link-icon">
                    <Phone size={15} strokeWidth={2} aria-hidden /> {telDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`} className="ft-link ft-link-icon" style={{ wordBreak: 'break-word' }}>
                    <Mail size={15} strokeWidth={2} aria-hidden /> {SITE.email}
                  </a>
                </li>
                <li>
                  <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="ft-link ft-link-icon ft-address">
                    <MapPin size={15} strokeWidth={2} aria-hidden />
                    <span>
                      {SITE.address.street}<br />
                      {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
                      <span className="ft-directions">{t('directions')}</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          {/* Socials, grouped by who runs the account */}
          <div className="ft-follow">
            <h2 className="ft-h ft-follow-h">{t('followHeading')}</h2>
            <div className="ft-follow-groups">
              {[
                { name: t('followCacna'), links: cacnaSocials },
                { name: t('followYouth'), links: youthSocials },
              ].filter(g => g.links.length > 0).map(group => (
                <div key={group.name} className="ft-follow-group">
                  <span className="ft-follow-name">{group.name}</span>
                  <ul className="ft-socials">
                    {group.links.map(s => (
                      <li key={s.href}>
                        <a href={s.href} target="_blank" rel="noopener noreferrer"
                          onClick={() => haptic('selection')} className="press ft-social"
                          aria-label={`${group.name}: ${s.label}`}>
                          {ICONS[s.platform]}<span>{s.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="ft-bottom">
            <nav aria-label={t('legalNavLabel')}>
              <ul className="ft-legal">
                {legalLinks.map(([href, label]) => (
                  <li key={href}><Link href={href} className="ft-link">{label}</Link></li>
                ))}
              </ul>
            </nav>
            <p style={{ margin: 0 }}>{t('taxStatus')}</p>
            <div className="ft-bottom-row">
              <span>{t('copyright')}</span>
              <BackToTop label={t('backToTop')} />
            </div>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
