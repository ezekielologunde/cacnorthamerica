import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";
import { Sparkles, Users, MapPin, HandHeart, ArrowLeft, CalendarPlus, Download, PartyPopper, ClipboardList } from "lucide-react";
import { specialEvents, googleCalUrl, icsDataUri, isEventPast } from "@/lib/events";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";

export const revalidate = 3600;

export const metadata = {
  title: "50th Anniversary Celebration — CAC North America",
  description:
    "Christ Apostolic Church North America celebrates 50 years since its founding in 1976 — October 10, 2026, at CAC Village, Blue Ridge Summit, PA. RSVP to help with planning.",
  alternates: { canonical: "/events/cacna-50th-anniversary-2026" },
};

const ev = specialEvents.find((e) => e.id === "cacna-50th-anniversary-2026")!;
const RSVP_URL = "https://forms.gle/FBzNzoXH76SK14Ah9";
const rsvpFields = ["Your full name", "A contact phone number", "Your church", "Your DCC or Zone", "How many in your group"];

const pillars = [
  { icon: Sparkles, label: "50 Years of Faithfulness", desc: "Est. 1976 — five decades of ministry across North America." },
  { icon: Users, label: "One Family, Many Homes", desc: "24 Zones & DCCs across the United States, Canada, and South America." },
  { icon: MapPin, label: "Same Grounds", desc: "CAC Village, Blue Ridge Summit, PA — home to the Annual Convention, now hosting this milestone too." },
  { icon: HandHeart, label: "A Season of Thanksgiving", desc: "A day set apart to thank God for five decades of grace and growth." },
];

export default function Cacna50thAnniversaryPage() {
  const isPast = isEventPast(ev);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    description: ev.desc,
    startDate: "2026-10-10T11:00:00-04:00",
    endDate: "2026-10-10T17:00:00-04:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "CAC Village",
      address: `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`,
    },
    organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
    url: `${SITE_URL}/events/cacna-50th-anniversary-2026`,
    offers: { "@type": "Offer", url: RSVP_URL, price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock", validFrom: "2026-01-01T00:00:00-05:00" },
  };
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/calendar" }, { name: ev.navLabel ?? ev.title, path: "/events/cacna-50th-anniversary-2026" }])).replace(/</g, "\\u003c") }} />
      <Nav heroDark />
      {isPast && (
        <div role="status" style={{ background: "#2c2825", padding: "13px clamp(20px,5vw,64px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px 20px", fontSize: 14, fontWeight: 600, color: "rgba(245,246,250,.7)" }}>
          <span>This event has passed — page kept as an archive.</span>
          <Link href="/calendar" style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>See upcoming events →</Link>
        </div>
      )}

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) clamp(80px,10vw,120px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 640, height: 520, background: "radial-gradient(circle,rgba(253,200,65,.28),transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/calendar" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 32 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> All events
            </Link>
          </Reveal>

          <Reveal>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>
              CAC North America · Est. 1976
            </div>
          </Reveal>

          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, background: "rgba(253,200,65,.14)", border: "1px solid rgba(253,200,65,.4)", borderRadius: 999, padding: "8px 18px" }}>
              <PartyPopper size={15} strokeWidth={2.5} color="var(--gold)" aria-hidden />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>October 10, 2026 · CAC Village, PA</span>
            </div>
          </Reveal>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6.5vw,86px)", letterSpacing: "-0.035em", color: "#fff", margin: "0 0 20px", lineHeight: 0.94, textWrap: "balance" }}>
            <RevealText immediate>50 Years.</RevealText>
            <br />
            <RevealText immediate delay={0.12} style={{ color: "var(--red)" }}>
              One Family.
            </RevealText>
          </h1>

          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.9vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.72, maxWidth: 580, margin: "0 0 8px", textWrap: "pretty" }}>
              Christ Apostolic Church North America celebrates 50 years since its founding in 1976, at CAC Village — the same grounds that host the Annual Convention.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 36 }}>
              <a href={RSVP_URL} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(253,200,65,.35)" }}>
                RSVP Now →
              </a>
              <a href={googleCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "16px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
                <CalendarPlus size={17} strokeWidth={2} aria-hidden /> Add to Calendar
              </a>
              <a href={icsDataUri(ev)} download="cacna-50th-anniversary-2026.ics" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "16px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
                <Download size={16} strokeWidth={2} aria-hidden /> Apple / Outlook
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>Marking the milestone</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,50px)", letterSpacing: "-.8px", color: "var(--ink)", margin: 0 }}>
              Fifty years, one grace.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
            {pillars.map((p, i) => (
              <Reveal key={p.label} delay={i * 70}>
                <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "26px 24px", height: "100%" }}>
                  <div style={{ display: "grid", placeItems: "center", width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,var(--flame),var(--red))", marginBottom: 16 }}>
                    <p.icon size={22} color="#fff" strokeWidth={1.9} aria-hidden />
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", marginBottom: 6 }}>{p.label}</div>
                  <div style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.65 }}>{p.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      {!isPast && (
        <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <Reveal>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>
                <ClipboardList size={16} strokeWidth={2.5} style={{ verticalAlign: "middle", marginRight: 8 }} aria-hidden />
                Why RSVP
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", color: "#fff", margin: "0 0 18px", lineHeight: 1.04 }}>
                Help us prepare for you.
              </h2>
              <p style={{ fontSize: 16, color: "rgba(245,246,250,.65)", lineHeight: 1.72, marginBottom: 32 }}>
                This is a free gathering, but organizers need a headcount to plan the celebration properly. The form takes a minute and asks for:
              </p>
            </Reveal>
            <Reveal delay={80}>
              <ul style={{ margin: "0 0 36px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12, textAlign: "left", maxWidth: 380, marginInline: "auto" }}>
                {rsvpFields.map((f, i) => (
                  <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "rgba(245,246,250,.75)", lineHeight: 1.6 }}>
                    <span style={{ flexShrink: 0, marginTop: 4, width: 8, height: 8, borderRadius: "50%", background: "var(--gold)", display: "inline-block" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={140}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
                <a href={RSVP_URL} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 15, padding: "15px 28px", borderRadius: 999, textDecoration: "none" }}>
                  RSVP Now →
                </a>
                <Link href="/contact" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 14, padding: "15px 26px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
                  Questions? Contact CACNA
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
