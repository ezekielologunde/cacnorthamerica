import { Nav } from "@/components/navigation/Nav";
import "@/app/(site)/[locale]/mobile-events-media.css";
import { PastEventBanner } from "@/components/events/PastEventBanner";
import { MobileStickyCta } from "@/components/events/MobileStickyCta";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Flame, Waves, Landmark, Eye, ArrowLeft, Phone, Mail } from "lucide-react";
import { specialEvents, isEventPast } from "@/lib/events";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Holy Land Pilgrimage — Postponed to May 2027 | CACNA Latunde Region",
    description:
      "CACNA Latunde Region Pilgrimage to Israel & Egypt, postponed to May 2027. Exact dates and price to be confirmed. Led by Pastor Dr. H.O. Ilufoye & L/Evang. Bola Mustapha.",
    alternates: { canonical: `${SITE_URL}/events/pilgrimage-2026` },
  };
}

const ev = specialEvents.find((e) => e.id === "holy-land-pilgrimage-2026")!;

const highlights = [
  {
    icon: Flame,
    label: "Burning Bush, Ten Commandments & Mount Horeb",
    desc: "Walk in Moses's footsteps in Egypt — visit the site of the Burning Bush, view the Ten Commandments, and ascend holy Mount Horeb.",
  },
  {
    icon: MapPin,
    label: "Bethlehem, Nazareth & Jerusalem",
    desc: "Follow Jesus's steps through the towns where He was born, raised, taught, and gave His life and resurrection for the world.",
  },
  {
    icon: Waves,
    label: "The Dead Sea",
    desc: "Float in the mineral-rich waters of the lowest point on earth.",
  },
  {
    icon: Landmark,
    label: "The Garden Tomb",
    desc: "Celebrate holy communion at the place of the resurrection.",
  },
  {
    icon: Eye,
    label: "Jericho & Mount of Temptation",
    desc: "Stand in ancient Jericho — the world's oldest city — and see the wilderness mountain where Jesus overcame every temptation.",
  },
];

const included = [
  "Round-trip flights from JFK (airport taxes & fuel surcharge included)",
  "Meeting & assistance on arrival in Israel",
  "8-night accommodation — 7 nights in Israel, 1 night in St. Catherine, Egypt",
  "Daily breakfast & dinner at hotels; 1 lunch en route in Egypt (drinks excluded)",
  "Private licensed English-speaking government tour guide",
  "Luxury air-conditioned private group coach per itinerary",
  "Entrance fees per itinerary",
  "PCR tests (2) covered",
  "Portage at airport & hotels (1 suitcase per person)",
  "Personal Pilgrimage Certificate",
];

export default async function PilgrimagePage({
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
    startDate: "2027-05",
    previousStartDate: "2026-11-02",
    eventStatus: "https://schema.org/EventPostponed",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `${SITE_URL}/images/pilgrimage-2026-flyer.jpg`,
    url: `${SITE_URL}/events/pilgrimage-2026`,
    location: { "@type": "Place", name: "Israel & Egypt (departing JFK)", address: { "@type": "PostalAddress", addressCountry: "IL" } },
    organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
    performer: { "@type": "Church", name: SITE.name, url: SITE_URL },
  };
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/calendar" }, { name: ev.navLabel ?? ev.title, path: "/events/pilgrimage-2026" }])).replace(/</g, "\\u003c") }} />
      <Nav heroDark />
      {isPast && <PastEventBanner />}

      {/* Hero */}
      <section className="mm-hero" style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) clamp(80px,10vw,120px)", position: "relative", overflow: "hidden" }}>
        <style>{`
          .pilgrimage-hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: clamp(32px,5vw,60px); align-items: center; }
          @media (max-width: 900px) { .pilgrimage-hero-grid { grid-template-columns: 1fr; } }
        `}</style>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 640, height: 520, background: "radial-gradient(circle,rgba(253,200,65,.3),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 20s ease-in-out infinite" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -60, left: -60, width: 480, height: 380, background: "radial-gradient(circle,rgba(200,30,58,.12),transparent 65%)", pointerEvents: "none" }} />

        <div className="pilgrimage-hero-grid" style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div>
            <Reveal>
              <Link href="/calendar" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 32 }}>
                <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> All events
              </Link>
            </Reveal>

            <Reveal>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>
                Christ Apostolic Church North America · Latunde Region Pilgrimage
              </div>
            </Reveal>

            <Reveal>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 80, height: 80, borderRadius: 20, background: "linear-gradient(150deg,var(--gold),#B8860B)", boxShadow: "0 20px 44px rgba(253,200,65,.4)" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 12, color: "#fff", letterSpacing: 1 }}>MAY</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "#fff", lineHeight: 1 }}>TBA</span>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 44, color: "#fff", lineHeight: 1 }}>2027</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", letterSpacing: 1 }}>POSTPONED · DATES TO BE CONFIRMED</div>
                </div>
              </div>
            </Reveal>

            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6.5vw,90px)", letterSpacing: "-0.035em", color: "#fff", margin: "0 0 24px", lineHeight: 0.92, textWrap: "balance" }}>
              <RevealText immediate>Holy Land</RevealText>
              <br />
              <RevealText immediate delay={0.12} style={{ color: "var(--red)" }}>
                Pilgrimage
              </RevealText>
            </h1>

            <Reveal delay={200}>
              <p style={{ fontSize: "clamp(16px,1.9vw,20px)", color: "rgba(245,246,250,.72)", lineHeight: 1.72, maxWidth: 600, margin: "0 0 44px", textWrap: "pretty" }}>
                Walk where Jesus walked. Stand where Moses stood. The pilgrimage to Israel and Egypt has been postponed to sometime in May 2027. Exact dates and the final price are still to be confirmed.
              </p>
            </Reveal>

            {!isPast && (
            <Reveal delay={280}>
              <div className="mm-actions" style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <a href="mailto:info@cacnapilgrimage.org?subject=Holy Land Pilgrimage — Update request" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(253,200,65,.4)" }}>
                  Contact the Team for Updates →
                </a>
              </div>
            </Reveal>
            )}
          </div>

          <Reveal delay={160}>
            <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.45)", border: "1px solid rgba(245,246,250,.12)" }}>
              <Image
                src="/images/pilgrimage-2026-flyer.jpg"
                alt="Christ Apostolic Church North America Latunde Region Pilgrimage — original 2026 flyer for the Special Pilgrimage to Israel and Egypt. Dates and price on this flyer have changed: the pilgrimage is postponed to May 2027"
                width={1600}
                height={1035}
                style={{ width: "100%", height: "auto", display: "block" }}
                preload
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Leadership */}
      <section className="mm-sec" style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-.8px", color: "var(--ink)", margin: "0 0 16px", lineHeight: 1 }}>
              From JFK to the Holy Land.
            </h2>
            <p style={{ fontSize: "clamp(15px,1.7vw,18px)", color: "var(--ink-soft)", lineHeight: 1.72, maxWidth: 640, margin: "0 0 36px" }}>
              The route traces the footsteps of Moses through Egypt and the life, death, and resurrection of Jesus Christ across Israel.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {[
              { label: "Led by", names: ["Pastor Dr. H.O. Ilufoye", "L/Evang. Bola Mustapha"] },
              { label: "Directed by", names: ["Pastor S.O. Oladele", "Pastor Dr. T.O.A. Agbeja"] },
            ].map((g, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "24px 26px", boxShadow: "0 8px 20px rgba(18,20,30,.06)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>{g.label}</div>
                  {g.names.map((n, j) => (
                    <div key={j} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "var(--ink)", lineHeight: 1.3, marginBottom: 4 }}>{n}</div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mm-sec" style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 44 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,50px)", letterSpacing: "-.8px", color: "var(--cream)", margin: 0 }}>
              Pilgrimage highlights
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {highlights.map((h, i) => (
              <Reveal key={i} delay={i * 60}>
                <div style={{ display: "flex", gap: "clamp(16px,3vw,28px)", alignItems: "flex-start", background: "rgba(245,246,250,.05)", border: "1px solid rgba(245,246,250,.1)", borderRadius: 20, padding: "clamp(18px,3vw,26px)" }}>
                  <div style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,var(--gold),#B8860B)", boxShadow: "0 8px 20px rgba(253,200,65,.3)" }}>
                    <h.icon size={22} color="#fff" strokeWidth={1.9} aria-hidden />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "var(--cream)", marginBottom: 6 }}>{h.label}</div>
                    <div style={{ fontSize: 15, color: "rgba(245,246,250,.65)", lineHeight: 1.68 }}>{h.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Package + Pricing */}
      <section className="mm-sec" style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "clamp(36px,5vw,60px)" }}>

          {/* Included */}
          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-.6px", color: "var(--ink)", margin: "0 0 24px" }}>
              What&apos;s included
            </h2>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {included.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                  <span style={{ flexShrink: 0, marginTop: 7, width: 7, height: 7, borderRadius: "50%", background: "var(--gold)", display: "inline-block" }} />
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 20, padding: "16px 20px", background: "var(--cream)", border: "1px solid var(--line)", borderRadius: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 8 }}>Not included</div>
              <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                Visa/border fees to Egypt — $90 per person (subject to change by Israel/Egypt authorities)
              </div>
            </div>
          </Reveal>

          {/* Pricing + Payment */}
          <Reveal delay={120}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-.6px", color: "var(--ink)", margin: "0 0 24px" }}>
                Price &amp; payment
              </h2>

              <div style={{ background: "var(--ink)", borderRadius: 18, padding: "22px 24px", marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.5)", marginBottom: 6 }}>Total trip price</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "#fff", letterSpacing: "-.5px", lineHeight: 1.1 }}>To be confirmed</div>
                <p style={{ fontSize: 14, color: "rgba(245,246,250,.65)", margin: "10px 0 0", lineHeight: 1.6 }}>
                  The pilgrimage is postponed to May 2027. The price and payment schedule on the original flyer no longer apply and will be announced once confirmed. Please do not send any payment until then.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0, lineHeight: 1.6 }}>
                  Questions about the postponement? Contact L/Evang. Bola Mustapha or Pastor Dr. H.O. Ilufoye (contacts below).
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact CTA */}
      {!isPast && (
      <section className="mm-sec" style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 20 }}>Reserve your space</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,5vw,68px)", letterSpacing: "-1.2px", color: "#fff", margin: "0 0 20px", lineHeight: 0.96 }}>
              Stay in the loop.
            </h2>
            <p style={{ fontSize: "clamp(15px,1.8vw,18px)", color: "rgba(245,246,250,.65)", lineHeight: 1.72, marginBottom: 40 }}>
              The pilgrimage has been postponed to May 2027 and the final price is not yet confirmed. Reach out to one of the contacts below for the latest update before sending any payment.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 44 }}>
              <a href="mailto:info@cacnapilgrimage.org?subject=Holy Land Pilgrimage — Update request" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "17px 32px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(253,200,65,.4)" }}>
                Email for Updates →
              </a>
              <a href="mailto:cacnapilgrimage@gmail.com" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(245,246,250,.08)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "17px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.18)" }}>
                <Mail size={16} strokeWidth={2} aria-hidden /> Gmail
              </a>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
              {[
                { name: "L/Evang. Bola Mustapha", phone: "2142135464", display: "(214) 213-5464" },
                { name: "Pastor Dr. H.O. Ilufoye", phone: "4432268748", display: "(443) 226-8748" },
              ].map((c, i) => (
                <Reveal key={i} delay={i * 80}>
                  <a href={`tel:${c.phone}`} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(245,246,250,.07)", border: "1px solid rgba(245,246,250,.14)", borderRadius: 18, padding: "18px 22px", textDecoration: "none" }}>
                    <div style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,var(--gold),#B8860B)" }}>
                      <Phone size={19} color="#fff" strokeWidth={2} aria-hidden />
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--cream)", marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "var(--gold)", fontFamily: "monospace" }}>{c.display}</div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      )}

      <FooterExperience />
      {!isPast && <MobileStickyCta href="mailto:info@cacnapilgrimage.org?subject=Holy Land Pilgrimage — Update request" label="Contact for updates" external={false} />}
    </main>
  );
}
