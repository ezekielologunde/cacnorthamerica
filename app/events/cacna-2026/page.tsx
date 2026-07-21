import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Image from "next/image";
import Link from "next/link";
import { MapPin, CalendarDays, Users, Heart, ArrowLeft, Sparkles, ListOrdered, BedDouble, Plane, ShieldCheck, Phone } from "lucide-react";
import { googleCalUrl, icsDataUri, isEventPast } from "@/lib/events";
import { CalendarPlus, Download } from "lucide-react";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";
import { conventionYears, conventionChurchEvent } from "@/lib/conventions";
import {
  CONVENTION_HOTELS, CONVENTION_HOTEL_NOTE, CONVENTION_PRIMARY_AIRPORT,
  CONVENTION_NEARBY_AIRPORTS, CONVENTION_RULES,
} from "@/lib/convention-visit";

export const revalidate = 3600;

export const metadata = {
  title: "CACNA 2026 Annual Convention — Christ Apostolic Church North America",
  description:
    "Join CACNA member churches at the 2026 National Convention — July 13–18 at CAC Village, Blue Ridge Summit, PA. Theme: “The Bible: God’s Message to Man.” Six days of worship, the Word, and the whole CAC family in one place.",
  alternates: { canonical: "/events/cacna-2026" },
};

const cy2026 = conventionYears.find((cy) => cy.year === 2026)!;
const ev = conventionChurchEvent(cy2026);
const CACNA_REG = cy2026.registrationUrl!;

const THEME = "The Bible: God’s Message to Man";

// The real, published 2026 schedule (from the convention program book) —
// specific to this year's speaker assignments, unlike the generic recurring
// pattern used for future years that haven't been announced yet.
const sessions = [
  { day: "Mon · Jul 13", label: "Daily Opening: Praise, Worship & Prayer", desc: "Registration opens for the week, followed by the Daily General Opening Session of praise, worship, and prayer, and Ministers' Session 1 — “Transformative Power of the Word” with Pastor T.A.O. Agbeja, Regional Superintendent, Latunde Region." },
  { day: "Tue · Jul 14", label: "Ministers' Sessions & Registration", desc: "Registration continues alongside Ministers' Session 2 — “The Divine Word as a Guide for Our Daily Living” with Pastor Simeon Oladokun, Ph.D., D.Th., Regional Superintendent, CAC Anosike (Europe) Region." },
  { day: "Wed · Jul 15", label: "Theme Sessions & Break-Outs", desc: "Ministers' Session 3 — “The Bible as an Encourager in Times of Trials, Tribulations and Challenges” with Rt. Rev. Prof. Dapo F. Asaju, Bishop of Ilesa Anglican Diocese — and Ministers' Session 4 with Pastor S.O. Oladele, President. Break-out sessions for CACMWF, CACMA, CACNAGWA, Youth/Young Adult, and Children, plus a Revival Night with Prophet H. Oladeji, General Evangelist." },
  { day: "Thu · Jul 16", label: "Picnic, Sunday School & Business Group", desc: "An afternoon picnic with games and sports, the Sunday School General Session, the Business Group General Session, more break-out sessions, a Ministers' Prayer Night, and a Revival Night with Prophet H. Oladeji." },
  { day: "Fri · Jul 17", label: "Convention Program, Ordination & Impartation Night", desc: "The main Convention Program (10am–2pm), an Ordination Service, and an Impartation Night with Prophet H. Oladeji, General Evangelist." },
  { day: "Sat · Jul 18", label: "Holy Communion & Closing Service", desc: "The convention closes with Holy Communion and a Closing Service led by Pastor S.O. Oladele, President, CAC Nigeria and Overseas." },
];

export default function CACNA2026Page() {
  const isPast = isEventPast(ev);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    description: ev.desc,
    startDate: "2026-07-13T18:00:00-04:00",
    endDate: "2026-07-18T22:00:00-04:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `${SITE_URL}/images/cacna-2026-flyer.jpg`,
    url: `${SITE_URL}/events/cacna-2026`,
    location: { "@type": "Place", name: "CAC Village", address: { "@type": "PostalAddress", streetAddress: "14051 Stahley Rd", addressLocality: "Blue Ridge Summit", addressRegion: "PA", postalCode: "17214", addressCountry: "US" } },
    organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
    offers: { "@type": "Offer", url: CACNA_REG, availability: "https://schema.org/InStock" },
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/calendar" }, { name: ev.navLabel ?? ev.title, path: "/events/cacna-2026" }])).replace(/</g, "\\u003c") }} />
      <Nav heroDark />
      {isPast && (
        <div role="status" style={{ background: '#2c2825', padding: '13px clamp(20px,5vw,64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px 20px', fontSize: 14, fontWeight: 600, color: 'rgba(245,246,250,.7)' }}>
          <span>This event has passed — page kept as an archive.</span>
          <Link href="/calendar" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>See upcoming events →</Link>
        </div>
      )}

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) clamp(80px,10vw,120px)", position: "relative", overflow: "hidden" }}>
        <style>{`
          .cacna2026-hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: clamp(32px,5vw,60px); align-items: center; }
          @media (max-width: 900px) { .cacna2026-hero-grid { grid-template-columns: 1fr; } }
        `}</style>
        <div aria-hidden style={{ position: "absolute", top: -140, right: -120, width: 760, height: 600, background: "radial-gradient(circle,rgba(253,200,65,.25),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 18s ease-in-out infinite" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -80, left: -80, width: 500, height: 400, background: "radial-gradient(circle,rgba(200,30,58,.15),transparent 65%)", pointerEvents: "none" }} />

        <div className="cacna2026-hero-grid" style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div>
          <Reveal>
            <Link href="/calendar" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 32 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> All events
            </Link>
          </Reveal>

          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 80, height: 80, borderRadius: 20, background: "linear-gradient(150deg,var(--gold),var(--blue))", boxShadow: "0 20px 44px rgba(253,200,65,.4)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "#fff", letterSpacing: 1 }}>JUL</span>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 48, color: "#fff", lineHeight: 1 }}>13–18</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", letterSpacing: 1 }}>2026</div>
              </div>
            </div>
          </Reveal>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px,7vw,100px)", letterSpacing: "-0.035em", color: "#fff", margin: "0 0 24px", lineHeight: 0.9, textWrap: "balance" }}>
            <RevealText immediate>CACNA 2026</RevealText>
            <br />
            <RevealText immediate delay={0.12} style={{ color: "var(--red)" }}>
              National Convention
            </RevealText>
          </h1>

          <Reveal delay={160}>
            <div style={{ display: "inline-flex", alignItems: "flex-start", gap: 12, marginBottom: 22, padding: "14px 20px", borderRadius: 16, background: "rgba(253,200,65,.1)", border: "1px solid rgba(253,200,65,.3)", maxWidth: 620 }}>
              <Sparkles size={20} strokeWidth={2} color="var(--gold)" aria-hidden style={{ flexShrink: 0, marginTop: 3 }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 4 }}>Convention Theme</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(18px,2.6vw,26px)", color: "#fff", lineHeight: 1.15, letterSpacing: "-.3px" }}>&ldquo;{THEME}&rdquo;</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 620, margin: "0 0 44px", textWrap: "pretty" }}>
              Six days of worship, the Word, and the whole CAC family in one place. CAC Village, Blue Ridge Summit, PA — July 13–18, 2026. This is the gathering you do not want to miss.
            </p>
          </Reveal>

          {!isPast && (
          <Reveal delay={280}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <a href={CACNA_REG} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(253,200,65,.4)" }}>
                Register Now →
              </a>
              <a href={googleCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "16px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
                <CalendarPlus size={17} strokeWidth={2} aria-hidden /> Add to Calendar
              </a>
              <a href={icsDataUri(ev)} download="cacna-2026.ics" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.06)", color: "rgba(245,246,250,.7)", fontWeight: 700, fontSize: 14, padding: "16px 22px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.14)" }}>
                <Download size={16} strokeWidth={2} aria-hidden /> Apple / Outlook
              </a>
            </div>
          </Reveal>
          )}
          </div>

          <Reveal delay={160}>
            <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.45)", border: "1px solid rgba(245,246,250,.12)" }}>
              <Image
                src="/images/cacna-2026-flyer.jpg"
                alt="CACNA 2026 Annual Convention flyer — theme The Bible: God's Message to Man, July 13-18, 2026, CAC Village, Blue Ridge Summit, PA"
                width={1127}
                height={1600}
                style={{ width: "100%", height: "auto", display: "block" }}
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What is CACNA */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "clamp(36px,5vw,64px)", alignItems: "center" }}>
          <Reveal>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 16 }}>About the convention</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,54px)", letterSpacing: "-.8px", color: "var(--ink)", margin: "0 0 24px", lineHeight: 1.02 }}>
                The whole family.<br />One place.
              </h2>
              <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.78, margin: "0 0 20px" }}>
                The Christ Apostolic Church North America National Convention brings together the entire CAC family across the United States, Canada, and South America for one week at CAC Village — a dedicated conference and retreat center in the mountains of southern Pennsylvania.
              </p>
              <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.78, margin: 0 }}>
                Unlike most conferences, the convention is residential. You eat, sleep, pray, and worship at the village — which means every conversation is a ministry conversation, every meal is fellowship, and every late-night prayer session is available because no one is commuting. It changes people.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: Users, label: "The whole CAC family", desc: "Pastors, deacons, workers, youth, children — everyone from every assembly across North America." },
                { icon: Heart, label: "Six days of Spirit", desc: "Morning and evening sessions of prayer, worship, and the Word. Outdoor prayer walks. Late-night tarrying." },
                { icon: MapPin, label: "CAC Village", desc: "A purpose-built retreat campus in the mountains. Accommodation, dining, and sanctuary — all on site." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 22px", boxShadow: "0 8px 20px rgba(18,20,30,.06)" }}>
                  <div style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,var(--flame),var(--red))", boxShadow: "0 8px 16px rgba(200,30,58,.28)" }}>
                    <item.icon size={20} color="#fff" strokeWidth={2} aria-hidden />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)", marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Session overview */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 44 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>Schedule overview</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,50px)", letterSpacing: "-.8px", color: "var(--cream)", margin: 0 }}>Six days in the village.</h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {sessions.map((s, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{ display: "flex", gap: "clamp(16px,3vw,32px)", alignItems: "flex-start", background: "rgba(245,246,250,.05)", border: "1px solid rgba(245,246,250,.1)", borderRadius: 20, padding: "clamp(20px,3vw,28px)" }}>
                  <div style={{ flexShrink: 0, minWidth: 88, textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--gold)", lineHeight: 1.2 }}>{s.day}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "var(--cream)", marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 14.5, color: "rgba(245,246,250,.62)", lineHeight: 1.68 }}>{s.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={400}>
            <p style={{ fontSize: 14, color: "rgba(245,246,250,.45)", marginTop: 22, lineHeight: 1.6 }}>
              Every night is a <strong style={{ color: "rgba(245,246,250,.7)" }}>combined revival for all</strong>, with <strong style={{ color: "rgba(245,246,250,.7)" }}>free food for all</strong>. Schedule is subject to change — follow <strong style={{ color: "rgba(245,246,250,.7)" }}>@CACNA Latunde Region</strong> or cacnaconvention.org for updates.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Plan Your Visit: hotels, travel, rules */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 44, textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>Plan your visit</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,50px)", letterSpacing: "-.8px", color: "var(--ink)", margin: "0 0 16px" }}>Hotels, travel, and what to expect.</h2>
            <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 620, margin: "0 auto" }}>Registration isn&apos;t open here yet, and this page doesn&apos;t collect your hotel booking — those live at cacnaconvention.org. But everything you need to plan your trip is right here.</p>
          </Reveal>

          {/* Hotels */}
          <Reveal delay={80}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <BedDouble size={20} strokeWidth={2} color="var(--red)" aria-hidden />
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)", margin: 0 }}>Preferred hotels</h3>
            </div>
            <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.65, margin: "0 0 20px", maxWidth: 720 }}>{CONVENTION_HOTEL_NOTE}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12, marginBottom: 48 }}>
              {CONVENTION_HOTELS.map((h) => (
                <div key={h.name} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "16px 18px" }}>
                  <div style={{ fontWeight: 800, fontSize: 14.5, color: "var(--ink)", marginBottom: 4, lineHeight: 1.3 }}>{h.name}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 8 }}>{h.city}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <a href={`tel:${h.phone.replace(/[^\d+]/g, "")}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
                      <Phone size={12} strokeWidth={2.5} aria-hidden /> {h.phone}
                    </a>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-soft)" }}>{h.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Travel */}
          <Reveal delay={120}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <Plane size={20} strokeWidth={2} color="var(--red)" aria-hidden />
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)", margin: 0 }}>Getting there</h3>
            </div>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "22px 24px", marginBottom: 48 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)", marginBottom: 6 }}>{CONVENTION_PRIMARY_AIRPORT.name} ({CONVENTION_PRIMARY_AIRPORT.code})</div>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, margin: "0 0 16px" }}>{CONVENTION_PRIMARY_AIRPORT.note}</p>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 10 }}>Other nearby airports</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CONVENTION_NEARBY_AIRPORTS.map((a) => (
                  <span key={a.code} style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)", background: "var(--cream-2)", padding: "6px 12px", borderRadius: 999 }}>
                    {a.name} ({a.code}) · {a.miles} mi
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Rules & Etiquette */}
          <Reveal delay={160}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <ShieldCheck size={20} strokeWidth={2} color="var(--red)" aria-hidden />
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)", margin: 0 }}>Conference rules &amp; etiquette</h3>
            </div>
            <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "10px 24px", listStyle: "none", margin: 0, padding: 0 }}>
              {CONVENTION_RULES.map((r, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                  <span aria-hidden style={{ flexShrink: 0, width: 6, height: 6, borderRadius: "50%", background: "var(--red)", marginTop: 7 }} />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Full details live on the Convention website */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 16 }}>
              <ListOrdered size={16} strokeWidth={2.5} style={{ verticalAlign: "middle", marginRight: 8, color: "var(--flame)" }} aria-hidden />
              {isPast ? "Registration Fees — Archival Record" : "Registration & Full Schedule"}
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,4vw,48px)", letterSpacing: "-.8px", color: "var(--ink)", margin: "0 0 20px" }}>
              {isPast ? "What registration cost for this convention." : "Registration fees and the day-by-day order of service."}
            </h2>
            {isPast && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 28, textAlign: "left" }}>
                {[
                  { label: "Adults (30+)", price: "$125 – $250", note: "Rose in tiers from Oct. 2025 through the convention ground rate." },
                  { label: "Young Adults (20–29)", price: "$100 – $150", note: "Rose in tiers from Oct. 2025 through the convention ground rate." },
                  { label: "Children (1–19)", price: "Free", note: "No registration fee for children and youth." },
                ].map((f) => (
                  <div key={f.label} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "16px 18px" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 6 }}>{f.label}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--red)", marginBottom: 6 }}>{f.price}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{f.note}</div>
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: "0 0 32px" }}>
              {isPast
                ? "Food was free for all age groups; fees didn't include hotel accommodation. Full details for the next convention will be posted as they're announced."
                : "Online registration, fees by category, and the full order of service live on the official CACNA Convention website."}
            </p>
            <a href="https://cacnaconvention.org/" target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>
              Visit cacnaconvention.org →
            </a>
          </Reveal>
        </div>
      </section>

      {/* Registration CTA */}
      {!isPast && (
      <section style={{ background: "var(--ink)", padding: "clamp(60px,8vw,100px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 20 }}>Secure your spot</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px,5.5vw,72px)", letterSpacing: "-1.5px", color: "#fff", margin: "0 0 22px", lineHeight: 0.95 }}>
              Register before rates rise.
            </h2>
            <p style={{ fontSize: "clamp(15px,1.8vw,18px)", color: "rgba(245,246,250,.68)", lineHeight: 1.72, marginBottom: 40, textWrap: "pretty" }}>
              Registration is open online now, and the price goes up as the convention draws near. Register early to pay less — and remember to book your hotel ahead of time.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
              <a href={CACNA_REG} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 17, padding: "18px 36px", borderRadius: 999, textDecoration: "none", boxShadow: "0 20px 50px rgba(253,200,65,.35)" }}>
                Register on CACNA.org →
              </a>
              <Link href="/giving" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(245,246,250,.08)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "18px 30px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.18)" }}>
                Support the trip
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      )}

      <FooterExperience />
    </main>
  );
}
