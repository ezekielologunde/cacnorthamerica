import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { MapPin, Phone, Mail } from 'lucide-react';

export function PlanVisit() {
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: 'clamp(70px,9vw,120px) clamp(20px,5vw,64px)' }}>
      <div className="r2c" style={{ maxWidth: 1240, margin: '0 auto', gap: 56 }}>
        <Reveal>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)' }}>Come visit</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-1.5px', margin: '12px 0 22px', lineHeight: 1 }}>
            There&apos;s a seat with your name on it.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: .8, maxWidth: 440 }}>
            Salvation Center — Baltimore DCC. Join us in person this Sunday; come as you are.
          </p>
          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 15.5 }}>
            {[
              { icon: MapPin, text: '10710 Marriottsville Rd, Randallstown, MD 21133' },
              { icon: Phone, text: '+1 443-272-6794 · +1 410-701-8315' },
              { icon: Mail, text: 'info@cacsalvationcenter.org' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(255,255,255,.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <item.icon size={18} strokeWidth={1.75} color="var(--gold)" aria-hidden />
                </span>
                {item.text}
              </div>
            ))}
          </div>
          <Link href="/visit" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            marginTop: 34, background: 'var(--red)', color: '#fff',
            fontWeight: 700, fontSize: 16, padding: '16px 28px', borderRadius: 999,
            textDecoration: 'none', boxShadow: '0 14px 30px rgba(214,40,40,.4)',
          }}>
            Plan your visit →
          </Link>
        </Reveal>

        <Reveal delay={120}>
          <div style={{ width: '100%', height: 440, borderRadius: 26, overflow: 'hidden', boxShadow: '0 26px 54px rgba(0,0,0,.4)', position: 'relative' }}>
            <iframe
              title="Map to CAC Salvation Center, 10710 Marriottsville Rd, Randallstown MD"
              src="https://maps.google.com/maps?q=10710%20Marriottsville%20Rd%20Randallstown%20MD%2021133&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
