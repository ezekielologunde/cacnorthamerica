import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";
import { MapPin, CalendarDays, Car, Package, Clock, Users, Heart, ArrowLeft, Phone, Ticket, Sparkles, Landmark, Send, Wallet, ListOrdered } from "lucide-react";
import { googleCalUrl, icsDataUri, isEventPast } from "@/lib/events";
import { CalendarPlus, Download } from "lucide-react";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";
import { conventionYears, conventionChurchEvent } from "@/lib/conventions";

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
  { day: "Tue · Jul 14", label: "Ministers' Sessions & Registration", desc: "Registration continues alongside Ministers' Session 2 — “Divine Guide for Our Living” with Pastor Simeon Oladokun, Regional Superintendent, Anosike Region." },
  { day: "Wed · Jul 15", label: "Theme Sessions, Break-Outs & Picnic", desc: "Ministers' Session 3 — “The Bible as an Encourager in Times of Trials, Tribulations and Challenges” with Rt. Rev. Prof. Dapo F. Asaju, Bishop of Ilesa Anglican Diocese — and Ministers' Session 4 with Pastor S.O. Oladele, President. Break-out sessions for CACMWF, CACMA, CACNAGWA, Youth/Young Adult, and Children, an afternoon picnic with sports and games, and a Revival Night with Prophet H. Oladeji, General Evangelist." },
  { day: "Thu · Jul 16", label: "Sunday School, Business Group & Prayer Night", desc: "Sunday School General Session for all, the Business Group General Session, more break-out sessions, a Ministers' Prayer Night, and a Revival Night with Prophet H. Oladeji." },
  { day: "Fri · Jul 17", label: "Convention Program, Ordination & Impartation Night", desc: "The main Convention Program (10am–2pm), an Ordination Service, and an Impartation Night with Prophet H. Oladeji, General Evangelist." },
  { day: "Sat · Jul 18", label: "Holy Communion & Closing Service", desc: "The convention closes with Holy Communion and a Closing Service led by Pastor S.O. Oladele, President, CAC Nigeria and Overseas." },
];

const ORDER_OF_SERVICE = [
  "Praise and Worship",
  "Opening Hymn: CACGHB. 92 — “O Magnify the Lord with Me”",
  "Prayer",
  "Lesson",
  "Introductions",
  "Choir Ministration",
  "Message by the President",
  "Award Presentation",
  "Convention Thanksgiving",
  "Special Prayer",
  "Closing Hymn: Various #6 — “O Thou Who Love Us, We Shall Serve for Ever”",
  "Watchword",
  "Closing Prayer and Benediction",
];

const CONVENTION_GIVING = [
  { icon: Landmark, label: "Chase Bank", value: "Ac# 823936908" },
  { icon: Send, label: "Zelle", value: "cacnaconvention@gmail.com" },
  { icon: Wallet, label: "CashApp", value: "$cacnaconvention" },
];

const fees = [
  { tier: "Adults", age: "Age 30 & above", free: false, rows: [
    { when: "Oct 1 – Jan 31, 2026", price: "$125" },
    { when: "Feb 1 – Apr 30, 2026", price: "$150" },
    { when: "May 1 – Jul 10, 2026", price: "$200" },
    { when: "At the Convention Ground", price: "$250" },
  ] },
  { tier: "Young Adults", age: "Age 20 – 29", free: false, rows: [
    { when: "Oct 1 – Jan 31, 2026", price: "$100" },
    { when: "Feb 1 – Apr 30, 2026", price: "$125" },
    { when: "May 1 – Jul 10, 2026", price: "$150" },
    { when: "At the Convention Ground", price: "$150" },
  ] },
  { tier: "Children", age: "Age 1 – 19", free: true, rows: [] },
];

const contacts = [
  { name: "Dr. David Adenodi", role: "Chairman", phone: "301 440 7033", tel: "+13014407033" },
  { name: "Dr. Timothy Famojuro", role: "Secretary", phone: "917 709 1892", tel: "+19177091892" },
];

const packList = [
  "Bible with writing margins — messages are rich and worth noting",
  "Journal — spiritual highlights from the village stay with you",
  "Layers for all conditions (warm mornings, hot afternoons, cool evenings)",
  "Comfortable walking shoes — the village grounds are spread out",
  "Modest dress for services (the culture of the CAC family applies)",
  "Your registration confirmation and ID for check-in",
];

const logistics = [
  { icon: MapPin, label: "Location", detail: "CAC Village, 14051 Stahley Rd, Blue Ridge Summit, PA 17214" },
  { icon: Car, label: "Carpooling", detail: "Reach out to your local zone or member church to coordinate carpooling to the village" },
  { icon: CalendarDays, label: "Dates", detail: "Monday July 13 – Saturday July 18, 2026" },
  { icon: Clock, label: "Registration", detail: "Opens Monday July 13 · Ministers' prayers the same day" },
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
    image: `${SITE_URL}/images/congregation.jpg`,
    url: `${SITE_URL}/events/cacna-2026`,
    location: { "@type": "Place", name: "CAC Village", address: { "@type": "PostalAddress", streetAddress: "14051 Stahley Rd", addressLocality: "Blue Ridge Summit", addressRegion: "PA", postalCode: "17214", addressCountry: "US" } },
    organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
    offers: { "@type": "Offer", url: CACNA_REG, availability: "https://schema.org/InStock" },
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/events" }, { name: ev.navLabel ?? ev.title, path: "/events/cacna-2026" }])).replace(/</g, "\\u003c") }} />
      <Nav heroDark />
      {isPast && (
        <div role="status" style={{ background: '#2c2825', padding: '13px clamp(20px,5vw,64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px 20px', fontSize: 14, fontWeight: 600, color: 'rgba(245,246,250,.7)' }}>
          <span>This event has passed — page kept as an archive.</span>
          <Link href="/events" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>See upcoming events →</Link>
        </div>
      )}

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) clamp(80px,10vw,120px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -140, right: -120, width: 760, height: 600, background: "radial-gradient(circle,rgba(253,200,65,.25),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 18s ease-in-out infinite" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -80, left: -80, width: 500, height: 400, background: "radial-gradient(circle,rgba(200,30,58,.15),transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 32 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> All events
            </Link>
          </Reveal>

          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 80, height: 80, borderRadius: 20, background: "linear-gradient(150deg,#FDC841,#2D42C9)", boxShadow: "0 20px 44px rgba(253,200,65,.4)" }}>
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
                The Christ Apostolic Church North America National Convention brings together the entire CAC family across the United States and Canada for one week at CAC Village — a dedicated conference and retreat center in the mountains of southern Pennsylvania.
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

      {/* Order of Service */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>
              <ListOrdered size={16} strokeWidth={2.5} style={{ verticalAlign: "middle", marginRight: 8, color: "var(--flame)" }} aria-hidden />
              Convention Order of Service
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-.6px", color: "var(--ink)", margin: 0 }}>What to expect in the room.</h2>
          </Reveal>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {ORDER_OF_SERVICE.map((item, i) => (
              <Reveal key={i} delay={i * 30}>
                <li style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 18px" }}>
                  <span style={{ flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--red)", minWidth: 22 }}>{i + 1}</span>
                  <span style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6 }}>{item}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* What to pack + Logistics */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "clamp(36px,5vw,60px)" }}>

          {/* Pack list */}
          <Reveal>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 16 }}>Before you pack</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,40px)", letterSpacing: "-.6px", color: "var(--ink)", margin: "0 0 24px" }}>
                <Package size={28} strokeWidth={2} style={{ verticalAlign: "middle", marginRight: 10, color: "var(--flame)" }} aria-hidden />
                What to bring
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {packList.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                    <span style={{ flexShrink: 0, marginTop: 4, width: 8, height: 8, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Logistics */}
          <Reveal delay={120}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 16 }}>Getting there</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,40px)", letterSpacing: "-.6px", color: "var(--ink)", margin: "0 0 24px" }}>Logistics</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {logistics.map((l, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "18px 20px", boxShadow: "0 6px 16px rgba(18,20,30,.06)" }}>
                    <div style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,var(--flame),var(--red))" }}>
                      <l.icon size={18} color="#fff" strokeWidth={2} aria-hidden />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "var(--ink)", marginBottom: 4 }}>{l.label}</div>
                      <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}>{l.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 20, lineHeight: 1.6 }}>
                Carpooling is often organized by individual member churches — speak to your zone superintendent to join a car.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Registration fees + contacts */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 16 }}>
              <Ticket size={16} strokeWidth={2.5} style={{ verticalAlign: "middle", marginRight: 8, color: "var(--flame)" }} aria-hidden />
              Registration
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,4vw,48px)", letterSpacing: "-.8px", color: "var(--ink)", margin: 0 }}>Fees by age group</h2>
          </Reveal>
          <Reveal delay={80} style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 620 }}>Rates rise as the convention approaches, so register early — children attend completely free.</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 18 }}>
            {fees.map((f, i) => (
              <Reveal key={f.tier} delay={i * 90}>
                <div style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "26px 24px", boxShadow: "0 10px 26px rgba(18,20,30,.06)", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)", letterSpacing: "-.3px" }}>{f.tier}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginTop: 4, marginBottom: 18 }}>{f.age}</div>
                  {f.free ? (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, minHeight: 120 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 46, color: "var(--flame)", lineHeight: 1 }}>FREE</div>
                      <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.5 }}>All children are welcome at no cost.</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                      {f.rows.map((r, j) => (
                        <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, paddingBottom: 10, borderBottom: j < f.rows.length - 1 ? "1px solid var(--line)" : "none" }}>
                          <span style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.4 }}>{r.when}</span>
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{r.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 16 }}>
              {contacts.map((c) => (
                <a key={c.name} href={`tel:${c.tel}`} className="press" style={{ display: "flex", gap: 14, alignItems: "center", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "18px 20px", textDecoration: "none", boxShadow: "0 6px 16px rgba(18,20,30,.05)" }}>
                  <div style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,var(--flame),var(--red))" }}>
                    <Phone size={18} color="#fff" strokeWidth={2} aria-hidden />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{c.role} · {c.phone}</div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={280}>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 20, lineHeight: 1.6, textAlign: "center" }}>
              <strong style={{ color: "var(--ink)" }}>Book your hotel early.</strong> For further information, contact the Chairman or Secretary above.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Give at the Convention */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Give at the Convention</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,40px)", letterSpacing: "-1px", color: "var(--ink)", margin: "10px 0 0" }}>
              Offerings & Donations
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, margin: "14px auto 0", maxWidth: 560 }}>
              Make checks payable to CACNA Convention, or give directly using any of the options below.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
            {CONVENTION_GIVING.map((a, i) => (
              <Reveal key={a.label} delay={i * 70}>
                <div style={{ background: "var(--paper)", borderRadius: 20, padding: "22px 20px", border: "1px solid var(--line)", boxShadow: "0 8px 22px rgba(18,20,30,.05)", height: "100%", textAlign: "center" }}>
                  <div style={{ display: "grid", placeItems: "center", width: 44, height: 44, margin: "0 auto 14px", borderRadius: 12, background: "linear-gradient(135deg,var(--flame),var(--red))" }}>
                    <a.icon size={20} color="#fff" strokeWidth={2} aria-hidden />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 6 }}>
                    {a.label}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--ink)" }}>
                    {a.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
