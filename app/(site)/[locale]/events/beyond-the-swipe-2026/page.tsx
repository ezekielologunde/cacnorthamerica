import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import Link from "next/link";
import { MapPin, ArrowLeft, MessageCircle, Utensils, HeartHandshake } from "lucide-react";
import { specialEvents, isEventPast } from "@/lib/events";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}/events/beyond-the-swipe-2026`]));
  return {
    title: "Beyond the Swipe: Rediscovering Real Connections | CAC North America",
    description:
      "CAC House of Praise's L.E.D. Singles Ministry hosted Beyond the Swipe on September 5, 2026 — an evening of real conversation, food, and community in the DMV.",
    alternates: { canonical: `${SITE_URL}/${locale}/events/beyond-the-swipe-2026`, languages },
  };
}

const ev = specialEvents.find((e) => e.id === "beyond-the-swipe-2026")!;

const moments = [
  { icon: MessageCircle, label: "Let's Talk", desc: "Meaningful conversation, not another feed to scroll." },
  { icon: Utensils, label: "Let's Eat", desc: "Great food shared around the same table." },
  { icon: HeartHandshake, label: "Let's Connect", desc: "The kind of connection that starts once the phone goes down." },
];

export default async function BeyondTheSwipe2026Page({
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
    startDate: "2026-09-05T17:30:00-04:00",
    endDate: "2026-09-05T21:00:00-04:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: "CAC House of Praise", address: { "@type": "PostalAddress", streetAddress: "4909 Edmonston Rd", addressLocality: "Hyattsville", addressRegion: "MD", postalCode: "20781", addressCountry: "US" } },
    organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
    url: `${SITE_URL}/events/beyond-the-swipe-2026`,
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/calendar" }, { name: ev.navLabel ?? ev.title, path: "/events/beyond-the-swipe-2026" }])).replace(/</g, "\\u003c") }} />
      <Nav heroDark />
      {isPast && (
        <div role="status" style={{ background: "#2c2825", padding: "13px clamp(20px,5vw,64px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px 20px", fontSize: 14, fontWeight: 600, color: "rgba(245,246,250,.7)" }}>
          <span>This event has passed — page kept as a recap.</span>
          <Link href="/calendar" style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>See upcoming events →</Link>
        </div>
      )}

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) clamp(80px,10vw,120px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 640, height: 520, background: "radial-gradient(circle,rgba(232,163,61,.28),transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/calendar" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 32 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> All events
            </Link>
          </Reveal>

          <Reveal>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>
              CAC House of Praise · L.E.D. Singles Ministry
            </div>
          </Reveal>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6.5vw,86px)", letterSpacing: "-0.035em", color: "#fff", margin: "0 0 16px", lineHeight: 0.94, textWrap: "balance" }}>
            <RevealText immediate>Beyond</RevealText>
            <br />
            <RevealText immediate delay={0.12} style={{ color: "var(--red)" }}>
              the Swipe
            </RevealText>
          </h1>

          <Reveal delay={140}>
            <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(17px,2.2vw,22px)", color: "var(--gold)", margin: "0 0 20px" }}>
              Rediscovering Real Connections
            </p>
          </Reveal>

          <Reveal delay={180}>
            <p style={{ fontSize: "clamp(16px,1.9vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.72, maxWidth: 600, margin: "0 0 8px", textWrap: "pretty" }}>
              In a world where connections can start and end with a swipe, it was time to go beyond it. Singles and couples across the DMV gathered for an evening of meaningful conversation, great food, and real community.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 28, color: "rgba(245,246,250,.65)", fontSize: 15 }}>
              <MapPin size={16} strokeWidth={2} aria-hidden color="var(--gold)" />
              Christ Apostolic Church (CAC House of Praise), 4909 Edmonston Rd, Hyattsville, MD 20781 — Saturday, September 5, 2026, doors 5:30 PM
            </div>
          </Reveal>
        </div>
      </section>

      {/* Moments */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>Because the best connections happen once the phone goes down</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,50px)", letterSpacing: "-.8px", color: "var(--ink)", margin: 0 }}>
              Open to both singles and couples.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
            {moments.map((m, i) => (
              <Reveal key={m.label} delay={i * 70}>
                <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "26px 24px", height: "100%" }}>
                  <div style={{ display: "grid", placeItems: "center", width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,var(--gold),var(--red))", marginBottom: 16 }}>
                    <m.icon size={22} color="#fff" strokeWidth={1.9} aria-hidden />
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.65 }}>{m.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Follow */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,42px)", letterSpacing: "-.8px", color: "#fff", margin: "0 0 18px", lineHeight: 1.06 }}>
              Follow L.E.D. Singles Ministry for the next one.
            </h2>
            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
              <a href="https://www.instagram.com/CACHOPSM" target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "14px 24px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
                <InstagramIcon size={17} /> @CACHOPSM
              </a>
              <a href="https://www.tiktok.com/@CACHOPSM" target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "14px 24px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
                <TikTokIcon size={17} /> @CACHOPSM
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
