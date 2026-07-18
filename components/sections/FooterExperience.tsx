'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TikTokIcon } from '@/components/ui/SocialIcons';
import { haptic } from '@/lib/haptics';
import { MapPin, Phone, Mail } from 'lucide-react';
import { NewsletterForm } from '@/components/sections/NewsletterForm';

const socials = [
  { icon: <FacebookIcon />, title: 'Facebook', href: 'https://www.facebook.com/CacSalvationCenterBaltimore' },
  { icon: <InstagramIcon />, title: 'Instagram', href: 'https://www.instagram.com/salvationcenterbaltimore/' },
  { icon: <YoutubeIcon />, title: 'YouTube', href: 'https://www.youtube.com/channel/UCoogH4HuVXSn4okSpRlsDQA' },
  { icon: <TikTokIcon />, title: 'TikTok', href: 'https://www.tiktok.com/@salvationcenterus' },
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
  ['/building', 'Building Project'],
  // Resources
  ['/blog', 'Blog & News'],
  ['/gallery', 'Gallery'],
  ['/venue', 'Venue Hire'],
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
          borderBottom: '1px solid rgba(255,247,239,.1)',
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Image src="/images/logo.png" alt="CAC Salvation Center" width={42} height={42}
                style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: 9.5, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>Christ Apostolic Church</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', marginTop: 3 }}>Salvation Center</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,247,239,.55)', margin: '16px 0 22px', lineHeight: 1.7, maxWidth: 280 }}>
              Real food for the soul, from a real local family of believers. Welcome home.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {socials.map(s => (
                <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.title} onClick={() => haptic('selection')} className="press"
                  style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,247,239,.07)', border: '1px solid rgba(255,247,239,.11)', display: 'grid', placeItems: 'center', textDecoration: 'none', color: 'rgba(255,247,239,.75)', flexShrink: 0 }}>
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
                  style={{ color: 'rgba(255,247,239,.6)', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </div>

          {/* Services + contact */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--gold)', marginBottom: 18 }}>Services</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14, color: 'rgba(255,247,239,.6)', marginBottom: 28 }}>
              <span>Sunday · 9:25 &amp; 10:30 AM ET</span>
              <span>Wednesday · 7:00 PM ET</span>
              <span>Friday · 7:00 PM ET (Yoruba)</span>
              <span>Prayer Line · 5:00 AM daily</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 14 }}>
              <a href="tel:+14432726794" style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'rgba(255,247,239,.6)', textDecoration: 'none' }}>
                <Phone size={14} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden /> (443) 272-6794
              </a>
              <a href="mailto:info@cacsalvationcenter.org" style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'rgba(255,247,239,.6)', textDecoration: 'none', wordBreak: 'break-word' }}>
                <Mail size={14} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden /> info@cacsalvationcenter.org
              </a>
              <a href="https://maps.google.com/?q=10710+Marriottsville+Rd+Randallstown+MD" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'flex-start', gap: 9, color: 'rgba(255,247,239,.6)', textDecoration: 'none' }}>
                <MapPin size={14} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
                10710 Marriottsville Rd,<br />Randallstown, MD 21133
              </a>
            </div>
          </div>

        </div>

        {/* Newsletter */}
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '36px 0', borderBottom: '1px solid rgba(255,247,239,.1)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
            <div style={{ flex: '1 1 260px' }}>
              <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--gold)', marginBottom: 6 }}>Stay connected</div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#fff', margin: '0 0 4px', letterSpacing: '-.3px' }}>Get updates from the family.</p>
              <p style={{ fontSize: 13.5, color: 'rgba(255,247,239,.45)', margin: 0 }}>Sermons, events, and encouragement — straight to your inbox.</p>
            </div>
            <div style={{ flex: '1 1 340px' }}>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '20px 0 28px', fontSize: 12.5, color: 'rgba(255,247,239,.3)' }}>
          <span>© 2026 Christ Apostolic Church Salvation Center · Baltimore DCC · Registered 501(c)(3) nonprofit — donations are tax-deductible</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
            <a href="https://cackingdomembassy.org" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,247,239,.3)', textDecoration: 'none' }}>CAC Kingdom Embassy</a>
            <a href="https://cacpalaceofpeace.org" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,247,239,.3)', textDecoration: 'none' }}>CAC Palace of Peace</a>
            <Link href="/ilorin" style={{ color: 'rgba(255,247,239,.3)', textDecoration: 'none' }}>CAC Ilorin HQ</Link>
            <Link href="/salvationcity" style={{ color: 'rgba(255,247,239,.3)', textDecoration: 'none' }}>Salvation City</Link>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
