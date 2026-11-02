import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { MapPin, Phone, Mail } from 'lucide-react';
import "./home-mobile.css";

export function PlanVisit() {
  return (
    <section className="hm-section" style={{ background: 'var(--ink)', color: 'var(--cream)', padding: 'clamp(70px,9vw,120px) clamp(20px,5vw,64px)' }}>
      <div className="r2c" style={{ maxWidth: 1240, margin: '0 auto', gap: 56 }}>
        <Reveal>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-1.5px', margin: '0 0 22px', lineHeight: 1 }}>
            Visit CAC Village.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: .8, maxWidth: 440 }}>
            CACNA&apos;s administrative office sits at CAC Village, also home to our Annual Convention. For Sunday worship and pastoral care, connect with a member church in your zone.
          </p>
          <Link href="/contact" className="hm-btn-block" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            marginTop: 30, background: 'var(--red)', color: '#fff',
            fontWeight: 700, fontSize: 16, padding: '16px 28px', borderRadius: 999,
            textDecoration: 'none', boxShadow: '0 14px 30px rgba(200,30,58,.4)',
          }}>
            Contact the Regional Office →
          </Link>

          <div style={{ marginTop: 40, paddingTop: 30, borderTop: '1px solid rgba(255,255,255,.14)' }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(245,246,250,.5)' }}>
              CACNA Regional Office &amp; CAC Village
            </span>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 15.5 }}>
              {[
                { icon: MapPin, text: '14051 Stahley Road, Blue Ridge Summit, PA 17214', href: 'https://maps.google.com/?q=14051%20Stahley%20Road%20Blue%20Ridge%20Summit%20PA%2017214' },
                { icon: Phone, text: '(305) 469-0346', href: 'tel:+13054690346' },
                { icon: Mail, text: 'info@cacnorthamerica.com', href: 'mailto:info@cacnorthamerica.com' },
              ].map(item => (
                <a key={item.text} href={item.href} className="hm-contact-row" style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'inherit', textDecoration: 'none' }} {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(255,255,255,.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <item.icon size={18} strokeWidth={1.75} color="var(--gold)" aria-hidden />
                  </span>
                  {item.text}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="hm-map" style={{ width: '100%', height: 440, borderRadius: 26, overflow: 'hidden', boxShadow: '0 26px 54px rgba(0,0,0,.4)', position: 'relative' }}>
            <iframe
              title="Map to CAC Village, 14051 Stahley Road, Blue Ridge Summit, PA"
              src="https://maps.google.com/maps?q=14051%20Stahley%20Road%20Blue%20Ridge%20Summit%20PA%2017214&z=13&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: 18, left: 18,
              width: 132, height: 96, borderRadius: 14, overflow: 'hidden',
              border: '3px solid var(--ink)', boxShadow: '0 14px 30px rgba(0,0,0,.45)',
            }}>
              <Image
                src="/images/cac-gathering-crowd.jpg"
                alt="A gathering of the CACNA family"
                fill
                style={{ objectFit: 'cover' }}
                sizes="132px"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
