"use client";
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Reveal } from '@/components/ui/Reveal';

const pinSvg = (color: string) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
  </svg>
);

const mapsUrl = (q: string) => `https://maps.google.com/?q=${encodeURIComponent(q)}`;

const US_COLOR = '#C53030';
const NG_COLOR = '#B7791F';

type Church = {
  city: string; name: string; address: string;
  href: string; external: boolean; cta: string;
  lat: number; lng: number;
};

const usChurches: Church[] = [
  { city: 'Philadelphia, PA', name: 'C.A.C Kingdom Embassy', address: '1107 Bleigh Ave, Philadelphia, PA 19111', href: 'https://cackingdomembassy.org', external: true, cta: 'Visit site', lat: 40.0523, lng: -75.0813 },
  { city: 'Catonsville, MD', name: 'C.A.C Palace Of Peace', address: '1451 N Rolling Rd, Catonsville, MD 21228', href: 'https://cacpalaceofpeace.org', external: true, cta: 'Visit site', lat: 39.2783, lng: -76.7347 },
  { city: 'Rosedale, MD', name: 'C.A.C Salvation City', address: '8330 Pulaski Highway, Unit P, Rosedale, MD 21237', href: '/salvationcity', external: false, cta: 'Learn more', lat: 39.3634, lng: -76.5098 },
];

const ngChurches: Church[] = [
  { city: 'Ilorin, Kwara', name: 'C.A.C Salvation Center — Ilorin', address: 'Fate-Tanke Road & Abdullahi Mohammed St, 240102', href: '/ilorin', external: false, cta: 'Learn more', lat: 8.4966, lng: 4.5426 },
  { city: 'Ilorin, Kwara', name: 'C.A.C Holyghost Chapel', address: 'Behind Emmanuel Baptist College, Ilorin, 240102', href: mapsUrl('C.A.C Holyghost Chapel, Behind Emmanuel Baptist College, Ilorin, Nigeria'), external: true, cta: 'Directions', lat: 8.4802, lng: 4.5524 },
  { city: 'Osogbo', name: 'C.A.C Salvation City Osogbo', address: 'Arogun mosa Omobasorun St, Oke-Baale, 230284', href: mapsUrl('C.A.C Salvation City, Arogun mosa Omobasorun St, Oke-Baale, Osogbo, Nigeria'), external: true, cta: 'Directions', lat: 7.7719, lng: 4.5624 },
  { city: 'Ilorin, Kwara', name: 'C.A.C Kingdom Embassy Ilorin', address: 'Reke, Ilorin, Kwara, Nigeria', href: mapsUrl('C.A.C Kingdom Embassy, Reke, Ilorin, Kwara, Nigeria'), external: true, cta: 'Directions', lat: 8.5024, lng: 4.5300 },
  { city: 'Osogbo, Osun', name: 'C.A.C Kingdom Embassy Osogbo', address: 'Osogbo, Osun State, Nigeria', href: mapsUrl('CAC Kingdom Embassy, Osogbo, Osun, Nigeria'), external: true, cta: 'Directions', lat: 7.7650, lng: 4.5750 },
];

function WorldMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let map: any = null;
    let cancelled = false;

    (async () => {
      if (!document.getElementById('lf-css')) {
        const link = document.createElement('link');
        link.id = 'lf-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const L: any = await new Promise(res => {
        if ((window as any).L) { res((window as any).L); return; }
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        s.onload = () => res((window as any).L);
        document.head.appendChild(s);
      });

      if (!ref.current || cancelled) return;

      map = L.map(ref.current, {
        center: [20, -18],
        zoom: 2,
        minZoom: 1,
        maxZoom: 14,
        scrollWheelZoom: false,
        zoomControl: true,
        worldCopyJump: true,
      });

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 20, attribution: '© CARTO' }
      ).addTo(map);

      const dot = (color: string) => L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.5);cursor:pointer;transition:transform .15s" onmouseover="this.style.transform='scale(1.4)'" onmouseout="this.style.transform='scale(1)'"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -10],
      });

      const all = [
        ...usChurches.map(c => ({ ...c, color: US_COLOR })),
        ...ngChurches.map(c => ({ ...c, color: NG_COLOR })),
      ];

      all.forEach(c => {
        const cta = c.href
          ? `<a href="${c.href}" target="${c.external ? '_blank' : '_self'}" rel="noopener noreferrer" style="display:inline-block;margin-top:6px;font-size:11px;font-weight:700;color:${c.color};text-decoration:none">${c.cta} →</a>`
          : '';
        L.marker([c.lat, c.lng], { icon: dot(c.color) })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:Georgia,serif;min-width:190px">
              <div style="font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:${c.color};margin-bottom:4px">${c.city}</div>
              <div style="font-size:13px;font-weight:700;color:#1B130E;line-height:1.3;margin-bottom:3px">${c.name}</div>
              <div style="font-size:11px;color:#888;line-height:1.4">${c.address}</div>
              ${cta}
            </div>`,
            { maxWidth: 260, closeButton: false }
          );
      });
    })();

    return () => { cancelled = true; map?.remove(); };
  }, []);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}

function ChurchCard({ c, accent }: { c: Church; accent: string }) {
  const style: CSSProperties = {
    display: 'flex', flexDirection: 'column', height: '100%',
    background: 'var(--paper)', borderRadius: 18, padding: '20px 20px 18px',
    boxShadow: '0 8px 22px rgba(27,19,14,.05)', border: '1px solid var(--line)',
    textDecoration: 'none', color: 'inherit',
  };
  const inner = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: accent, fontSize: 12, fontWeight: 800, marginBottom: 9 }}>
        {pinSvg(accent)} {c.city}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-.3px', lineHeight: 1.15, marginBottom: 6 }}>{c.name}</div>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 14, flex: 1 }}>{c.address}</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: accent }}>{c.cta} <span aria-hidden style={{ fontSize: 15 }}>→</span></div>
    </>
  );
  return c.external
    ? <a href={c.href} target="_blank" rel="noopener noreferrer" className="card-lift" style={style}>{inner}</a>
    : <Link href={c.href} className="card-lift" style={style}>{inner}</Link>;
}

export function GlobalChurches() {
  return (
    <section style={{ background: 'var(--cream-2)', padding: 'clamp(70px,9vw,120px) clamp(20px,5vw,64px)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--red)' }}>One family, many homes</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(34px,5vw,66px)', letterSpacing: '-1.5px', margin: '12px 0 0', lineHeight: 1 }}>
            Worship with us around the world
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 560, margin: '16px auto 0' }}>
            Find a seat at one of our district churches in the U.S. or our extension churches in Nigeria — tap any pin for details.
          </p>
        </Reveal>

        {/* Single interactive world map */}
        <Reveal style={{ marginBottom: 44 }}>
          <div style={{ borderRadius: 22, overflow: 'hidden', boxShadow: '0 26px 60px rgba(27,19,14,.2)' }}>
            <div style={{ padding: '13px 20px', background: '#1B130E', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: US_COLOR, flexShrink: 0, boxShadow: '0 0 0 2px rgba(197,48,48,.3)' }} />
                <span style={{ fontWeight: 800, fontSize: 12.5, color: 'rgba(255,247,239,.85)' }}>United States · 3 churches</span>
              </div>
              <span style={{ color: 'rgba(255,247,239,.2)', fontSize: 16 }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: NG_COLOR, flexShrink: 0, boxShadow: '0 0 0 2px rgba(183,121,31,.3)' }} />
                <span style={{ fontWeight: 800, fontSize: 12.5, color: 'rgba(255,247,239,.85)' }}>Nigeria · 5 churches</span>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,247,239,.4)', fontStyle: 'italic' }}>Click any pin · scroll to zoom</span>
            </div>
            <div style={{ height: 420 }}>
              <WorldMap />
            </div>
          </div>
        </Reveal>

        {/* US section */}
        <Reveal style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 18px' }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(20px,2.4vw,28px)', letterSpacing: '-.6px', margin: 0 }}>District Churches · United States</h3>
        </Reveal>
        <div className="r3" style={{ gap: 16, marginBottom: 38 }}>
          {usChurches.map((c, i) => (
            <Reveal key={c.name} delay={i * 90}><ChurchCard c={c} accent="var(--red)" /></Reveal>
          ))}
        </div>

        {/* Nigeria section */}
        <Reveal style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 18px' }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(20px,2.4vw,28px)', letterSpacing: '-.6px', margin: 0 }}>Extension Churches · Nigeria</h3>
        </Reveal>
        <div className="r4" style={{ gap: 16 }}>
          {ngChurches.map((c, i) => (
            <Reveal key={c.name} delay={i * 70}><ChurchCard c={c} accent="#B7791F" /></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
