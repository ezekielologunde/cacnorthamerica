import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Heart, ArrowLeft, Sparkles, ListOrdered } from "lucide-react";
import { googleCalUrl, icsDataUri, isEventPast } from "@/lib/events";
import { CalendarPlus, Download } from "lucide-react";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";
import { conventionYears, conventionChurchEvent } from "@/lib/conventions";
import { setRequestLocale } from "next-intl/server";

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

export default async function CACNA2026Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

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
    <main id="main-content">
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

      {/* Full details live on the Convention website */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 16 }}>
              <ListOrdered size={16} strokeWidth={2.5} style={{ verticalAlign: "middle", marginRight: 8, color: "var(--flame)" }} aria-hidden />
              {isPast ? "This Convention's Archive" : "Registration & Full Details"}
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,4vw,48px)", letterSpacing: "-.8px", color: "var(--ink)", margin: "0 0 20px" }}>
              {isPast ? "This convention has come and gone." : "Registration, hotels, travel, and the full order of service."}
            </h2>
            <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: "0 0 32px" }}>
              {isPast
                ? "See the full day-by-day order of service from this convention below."
                : "Online registration, fees by category, hotels, travel, and the full order of service are all right here on this site."}
            </p>
            {isPast ? (
              <Link href="/events/cacna-2026/schedule" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>
                View Full Schedule →
              </Link>
            ) : (
              <Link href="/plan-your-visit" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>
                Plan Your Visit →
              </Link>
            )}
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
                Register on the Convention Site →
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
