'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { InstagramIcon, YoutubeIcon } from '@/components/ui/SocialIcons';
import { haptic } from '@/lib/haptics';
import { MapPin, Phone, Mail } from 'lucide-react';
import { NewsletterForm } from '@/components/sections/NewsletterForm';

const socials = [
  { icon: <YoutubeIcon />, title: 'YouTube', href: 'https://youtube.com/@cacnorthamericalatunderegi1330' },
  { icon: <InstagramIcon />, title: 'Instagram', href: 'https://instagram.com/cacnorthamericalatunderegion' },
];

const quickLinks = [
  // Who We Are
  ['/about', 'Who We Are'],
  ['/leadership', 'Leadership'],
  ['/ministries', 'Ministries'],
  // Watch & Grow
  ['/online', 'Watch Online'],
  ['/devotional', 'Devotional'],
  ['/bible-plan', 'Bible Reading Plan'],
  ['/prayer', 'Prayer'],
  ['/salvation', 'Salvation'],
  ['/testimonies', 'Testimonies'],
  // Events
  ['/events', 'Events'],
  ['/calendar', 'Calendar'],
  // Visit & Give
  ['/visit', 'Plan a Visit'],
  ['/giving', 'Giving'],
  // Resources
  ['/blog', 'Blog & News'],
  ['/gallery', 'Gallery'],
  ['/store', 'Store'],
  ['/contact', 'Contact'],
] as const;

export function FooterExperience() {
  return (
    <footer style={{ background: 'var(--ink)', padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,64px) 0' }}>
      <Reveal>
        <div style={{
          maxWidth: 1240, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,220px), 1fr))',
          gap: 'clamp(36px,4vw,56px)',
          paddingBottom: 44,
          borderBottom: '1px solid rgba(245,246,250,.1)',
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Image src="/images/logo.png" alt="Christ Apostolic Church North America" width={42} height={42}
                style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: 9.5, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>Christ Apostolic Church</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', marginTop: 3 }}>North America</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(245,246,250,.55)', margin: '16px 0 22px', lineHeight: 1.7, maxWidth: 280 }}>
              Uniting CAC member churches across the United States and Canada — one family, many homes.
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

          {/* Quick links */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--gold)', marginBottom: 18 }}>Explore</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', fontSize: 14 }}>
              {quickLinks.map(([href, label]) => (
                <Link key={href} href={href}
                  style={{ color: 'rgba(245,246,250,.6)', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </div>

          {/* Services + contact */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--gold)', marginBottom: 18 }}>How We Gather</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14, color: 'rgba(245,246,250,.6)', marginBottom: 28 }}>
              <span>Annual Convention · July, CAC Village PA</span>
              <span>Ministers Retreat · Annually</span>
              <span>Sunday School Rally · Annually</span>
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

        {/* Newsletter */}
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '36px 0', borderBottom: '1px solid rgba(245,246,250,.1)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
            <div style={{ flex: '1 1 260px' }}>
              <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--gold)', marginBottom: 6 }}>Stay connected</div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#fff', margin: '0 0 4px', letterSpacing: '-.3px' }}>Get updates from the family.</p>
              <p style={{ fontSize: 13.5, color: 'rgba(245,246,250,.45)', margin: 0 }}>Sermons, events, and encouragement — straight to your inbox.</p>
            </div>
            <div style={{ flex: '1 1 340px' }}>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '20px 0 28px', fontSize: 12.5, color: 'rgba(245,246,250,.3)' }}>
          <span>© 2026 Christ Apostolic Church North America · 24 Zones &amp; DCCs across the U.S. &amp; Canada</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
            <Link href="/tenets" style={{ color: 'rgba(245,246,250,.3)', textDecoration: 'none' }}>Our Tenets</Link>
            <Link href="/leadership" style={{ color: 'rgba(245,246,250,.3)', textDecoration: 'none' }}>Leadership</Link>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
