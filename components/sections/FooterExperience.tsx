'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { InstagramIcon, YoutubeIcon } from '@/components/ui/SocialIcons';
import { haptic } from '@/lib/haptics';
import { MapPin, Phone, Mail, ArrowUp, ArrowRight } from 'lucide-react';
import { NewsletterForm } from '@/components/sections/NewsletterForm';

const socials = [
  { icon: <YoutubeIcon />, title: 'YouTube', href: 'https://youtube.com/@cacnorthamericalatunderegi1330' },
  { icon: <InstagramIcon />, title: 'Instagram', href: 'https://instagram.com/cacnorthamericalatunderegion' },
];

const columns: { heading: string; links: readonly (readonly [string, string])[] }[] = [
  {
    heading: 'Who We Are',
    links: [
      ['/about', 'About CACNA'],
      ['/leadership', 'Leadership'],
      ['/zones', 'Zones & DCCs'],
      ['/ministries', 'Ministries'],
      ['/bible-institute', 'Bible Institute'],
    ],
  },
  {
    heading: 'Media',
    links: [
      ['/online', 'Watch Online'],
      ['/watchwords', 'Watchwords'],
      ['/calendar', 'Calendar & Events'],
      ['/blog', 'Blog & News'],
      ['/gallery', 'Gallery'],
    ],
  },
];

function BackToTop() {
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
      <ArrowUp size={13} strokeWidth={2.5} aria-hidden /> Back to top
    </button>
  );
}

export function FooterExperience() {
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
            <div style={{ fontWeight: 800, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--gold)', marginBottom: 8 }}>Stay connected</div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(20px,2.4vw,26px)', color: '#fff', margin: '0 0 6px', letterSpacing: '-.4px' }}>Get updates from the family.</p>
            <p style={{ fontSize: 13.5, color: 'rgba(245,246,250,.5)', margin: 0 }}>Sermons, events, and encouragement — straight to your inbox.</p>
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
              <Image src="/images/logo.png" alt="Christ Apostolic Church North America" width={42} height={42}
                style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: 9.5, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>Christ Apostolic Church</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', marginTop: 3 }}>North America</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(245,246,250,.55)', margin: '16px 0 22px', lineHeight: 1.7, maxWidth: 260 }}>
              The corporate family of Christ Apostolic Church across North America — part of the global CAC movement headquartered in Nigeria. One family, many homes.
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
                  <Link key={href} href={href} style={{ color: 'rgba(245,246,250,.6)', textDecoration: 'none' }}>{label}</Link>
                ))}
              </div>
            </div>
          ))}

          {/* Find a church + contact */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--gold)', marginBottom: 18 }}>Find a Church</div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13.5, color: 'rgba(245,246,250,.6)', lineHeight: 1.6, margin: '0 0 12px' }}>
                24 Zones &amp; DCCs across the U.S., Canada &amp; South America — find the one nearest you.
              </p>
              <Link href="/zones" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 800, color: 'var(--gold)', textDecoration: 'none' }}>
                Browse the Zone Directory <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
              </Link>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(245,246,250,.35)', marginBottom: 11 }}>
              Regional Office &amp; CAC Village
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
          <span>© 2026 Christ Apostolic Church North America · 24 Zones &amp; DCCs across the U.S., Canada &amp; South America</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 20px' }}>
            <Link href="/tenets" style={{ color: 'rgba(245,246,250,.3)', textDecoration: 'none' }}>Our Tenets</Link>
            <Link href="/leadership/past" style={{ color: 'rgba(245,246,250,.3)', textDecoration: 'none' }}>Past Leaders</Link>
            <Link href="/contact" style={{ color: 'rgba(245,246,250,.3)', textDecoration: 'none' }}>Contact</Link>
            <BackToTop />
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
