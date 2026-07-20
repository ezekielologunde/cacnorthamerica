import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";
import { BookOpen, Users, Podium, HandHeart, ArrowLeft, CalendarPlus, Download, Video } from "lucide-react";
import { specialEvents, googleCalUrl, icsDataUri, isEventPast } from "@/lib/events";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";

export const revalidate = 3600;

export const metadata = {
  title: "2027 Ministers Retreat — CAC North America",
  description:
    "CAC North America's 2027 Ministers Retreat, on Zoom, March 22–26, 2027 — a time of refreshing, renewal & equipping.",
  alternates: { canonical: "/events/ministers-retreat-2027" },
};

const ev = specialEvents.find((e) => e.id === "ministers-retreat-2027")!;

const pillars = [
  { icon: BookOpen, label: "Spiritual Refreshment", desc: "Be renewed in God's Word and presence." },
  { icon: Users, label: "Unity & Fellowship", desc: "Strengthen bonds and build lasting connections." },
  { icon: Podium, label: "Empowerment", desc: "Be equipped to lead with impact." },
  { icon: HandHeart, label: "Prayer & Intercession", desc: "Seek God together for our church and communities." },
];

export default function MinistersRetreat2027Page() {
  const isPast = isEventPast(ev);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    description: ev.desc,
    startDate: "2027-03-22T09:00:00-04:00",
    endDate: "2027-03-26T17:00:00-04:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: { "@type": "VirtualLocation", url: `${SITE_URL}/events/ministers-retreat-2027` },
    organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
    url: `${SITE_URL}/events/ministers-retreat-2027`,
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/calendar" }, { name: ev.navLabel ?? ev.title, path: "/events/ministers-retreat-2027" }])).replace(/</g, "\\u003c") }} />
      <Nav heroDark />
      {isPast && (
        <div role="status" style={{ background: "#2c2825", padding: "13px clamp(20px,5vw,64px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px 20px", fontSize: 14, fontWeight: 600, color: "rgba(245,246,250,.7)" }}>
          <span>This event has passed — page kept as an archive.</span>
          <Link href="/calendar" style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>See upcoming events →</Link>
        </div>
      )}

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) clamp(80px,10vw,120px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 640, height: 520, background: "radial-gradient(circle,rgba(45,66,201,.3),transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/calendar" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 32 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> All events
            </Link>
          </Reveal>

          <Reveal>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>
              CAC North America
            </div>
          </Reveal>

          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, background: "rgba(45,66,201,.18)", border: "1px solid rgba(45,66,201,.4)", borderRadius: 999, padding: "8px 18px" }}>
              <Video size={15} strokeWidth={2.5} color="var(--gold)" aria-hidden />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>On Zoom</span>
            </div>
          </Reveal>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6.5vw,86px)", letterSpacing: "-0.035em", color: "#fff", margin: "0 0 20px", lineHeight: 0.94, textWrap: "balance" }}>
            <RevealText immediate>2027 Ministers</RevealText>
            <br />
            <RevealText immediate delay={0.12} style={{ color: "var(--red)" }}>
              Retreat
            </RevealText>
          </h1>

          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.9vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.72, maxWidth: 560, margin: "0 0 8px", textWrap: "pretty" }}>
              A time of refreshing, renewal & equipping — Monday, March 22 to Friday, March 26, 2027.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 36 }}>
              <a href={googleCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(253,200,65,.35)" }}>
                <CalendarPlus size={17} strokeWidth={2} aria-hidden /> Add to Calendar
              </a>
              <a href={icsDataUri(ev)} download="ministers-retreat-2027.ics" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "16px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
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
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>A time of refreshing, renewal & equipping</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,50px)", letterSpacing: "-.8px", color: "var(--ink)", margin: 0 }}>
              Four days set apart.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
            {pillars.map((p, i) => (
              <Reveal key={p.label} delay={i * 70}>
                <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "26px 24px", height: "100%" }}>
                  <div style={{ display: "grid", placeItems: "center", width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,#2D42C9,#12141E)", marginBottom: 16 }}>
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

      {/* Contact CTA */}
      {!isPast && (
        <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <Reveal>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", color: "#fff", margin: "0 0 18px", lineHeight: 1.04 }}>
                Registration details coming soon.
              </h2>
              <p style={{ fontSize: 16, color: "rgba(245,246,250,.65)", lineHeight: 1.72, marginBottom: 32 }}>
                Zoom access and full retreat details will be shared closer to the date. In the meantime, reach out to CACNA with any questions.
              </p>
              <Link href="/contact" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 15, padding: "15px 28px", borderRadius: 999, textDecoration: "none" }}>
                Contact CACNA →
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <FooterExperience />
    </main>
  );
}
