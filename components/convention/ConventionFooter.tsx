'use client';

import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { currentOrNextConvention, dateRangeLabel, CONVENTION_VENUE_SHORT } from '@/lib/conventions';

const quickLinks: [string, string][] = [
  ['/convention/register', 'Register'],
  ['/convention/schedule', 'Schedule'],
  ['/convention/plan-your-visit', 'Plan Your Visit'],
  ['/convention/business-group', 'Business Group'],
  ['/convention/cacma', 'CACMA'],
  ['/convention/children', "Children's Convention"],
  ['/convention/christian-education', 'Christian Education'],
  ['/convention/good-women', 'Good Women'],
  ['/convention/ministers-wives', "Ministers' Wives"],
  ['/convention/youth', 'Youth & Young Adult'],
  ['/convention/gallery', 'Gallery'],
  ['/convention/archive', 'Archive'],
  ['/convention/live', 'Live'],
  ['/convention/news', 'News'],
  ['/convention/give', 'Give'],
  ['/convention/contact', 'Contact'],
  ['/convention/about', 'About'],
];

export function ConventionFooter() {
  const cy = currentOrNextConvention();

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
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: 9.5, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>CACNA</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', marginTop: 3 }}>Annual Convention</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(245,246,250,.55)', margin: '16px 0 12px', lineHeight: 1.7, maxWidth: 280 }}>
              Six days of worship, teaching, and family — {dateRangeLabel(cy)} at {CONVENTION_VENUE_SHORT}.
            </p>
            <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', textDecoration: 'none' }}>
              ← Christ Apostolic Church North America
            </Link>
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--gold)', marginBottom: 18 }}>Convention</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', fontSize: 14 }}>
              {quickLinks.slice(0, 9).map(([href, label]) => (
                <Link key={href} href={href} style={{ color: 'rgba(245,246,250,.6)', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--gold)', marginBottom: 18 }}>More</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', fontSize: 14 }}>
              {quickLinks.slice(9).map(([href, label]) => (
                <Link key={href} href={href} style={{ color: 'rgba(245,246,250,.6)', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '20px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 12.5, color: 'rgba(245,246,250,.4)', margin: 0 }}>
          © {cy.year} CACNA Annual Convention — a ministry of Christ Apostolic Church North America
        </p>
      </div>
    </footer>
  );
}
