import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { IconBadge } from '@/components/ui/IconBadge';
import { BookOpen, Target } from 'lucide-react';

export function Youth() {
  return (
    <section style={{ background: 'var(--cream-2)', padding: 'clamp(70px,9vw,120px) clamp(20px,5vw,64px)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 50 }}>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--red)' }}>Grow daily</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px,5vw,68px)', letterSpacing: '-1.5px', margin: '12px 0 0', lineHeight: 1 }}>
            Inspiring resources for a better you
          </h2>
        </Reveal>

        <div className="r3" style={{ gap: 22 }}>
          <Reveal>
            <Link
              href="/devotional"
              style={{ textDecoration: 'none', color: '#fff', background: 'var(--ink)', borderRadius: 24, padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280, position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,var(--gold),transparent 68%)', opacity: .4 }} />
              <div style={{ position: 'relative' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,162,39,.18)', color: 'var(--gold)', fontWeight: 800, fontSize: 12, padding: '7px 13px', borderRadius: 999 }}>DAILY DEVOTIONAL</span>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 38, lineHeight: 1, letterSpacing: '-1px' }}>Daily Bread<br />for the Soul</div>
                <div style={{ marginTop: 14, fontSize: 14.5, opacity: .8, display: 'flex', alignItems: 'center', gap: 8 }}>Read today&apos;s word <span style={{ fontSize: 18 }}>→</span></div>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <Link
              href="/bible-plan"
              className="card-lift"
              style={{ textDecoration: 'none', color: 'inherit', background: 'var(--paper)', borderRadius: 24, padding: 32, boxShadow: '0 10px 26px rgba(16,22,29,.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 260, height: '100%' }}
            >
              <IconBadge icon={BookOpen} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-.5px', lineHeight: 1.05 }}>Weekly Bible Reading Plan</div>
                <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 10 }}>A chapter a day, walked through together as one family.</div>
                <div style={{ marginTop: 14, fontSize: 14, fontWeight: 700, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 7 }}>Open the weekly plan <span style={{ fontSize: 17 }}>→</span></div>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={200}>
            <Link
              href="/bible-plan"
              className="card-lift"
              style={{ textDecoration: 'none', color: 'inherit', background: 'var(--paper)', borderRadius: 24, padding: 32, boxShadow: '0 10px 26px rgba(16,22,29,.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 260, height: '100%' }}
            >
              <IconBadge icon={Target} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-.5px', lineHeight: 1.05 }}>Daily Goal Setting</div>
                <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 10 }}>Anchored to the weekly reading plan — a steady rhythm for your faith and your week.</div>
                <div style={{ marginTop: 14, fontSize: 14, fontWeight: 700, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 7 }}>Open the weekly plan <span style={{ fontSize: 17 }}>→</span></div>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
