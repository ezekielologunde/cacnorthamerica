import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";
import { MapPin, Flame, Waves, Landmark, Eye, ArrowLeft, CalendarPlus, Download, Phone, Mail, CreditCard } from "lucide-react";
import { specialEvents, googleCalUrl, icsDataUri, isEventPast } from "@/lib/events";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";

export const revalidate = 3600;

export const metadata = {
  title: "Holy Land Pilgrimage 2026 — CAC Salvation Center",
  description:
    "CACNA Latunde Region Pilgrimage to Israel & Egypt, November 2–12, 2026. Led by Pastor Dr. H.O. Ilufoye & L/Evang. Bola Mustapha. From JFK, $4,795.",
  alternates: { canonical: "/events/pilgrimage-2026" },
};

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
    desc: "Float in the mineral-rich waters of the lowest point on earth and rejuvenate your body and soul in this ancient, sacred landscape.",
  },
  {
    icon: Landmark,
    label: "The Garden Tomb",
    desc: "Celebrate holy communion at the place of the resurrection — a moment of worship that will mark your faith for the rest of your life.",
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

export default function PilgrimagePage() {
  const isPast = isEventPast(ev);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    description: ev.desc,
    startDate: "2026-11-02T06:00:00-05:00",
    endDate: "2026-11-12T23:00:00+02:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `${SITE_URL}/images/congregation.jpg`,
    url: `${SITE_URL}/events/pilgrimage-2026`,
    location: { "@type": "Place", name: "Israel & Egypt (departing JFK)", address: { "@type": "PostalAddress", addressCountry: "IL" } },
    organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
    offers: { "@type": "Offer", price: "4795", priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE_URL}/events/pilgrimage-2026` },
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/events" }, { name: ev.navLabel ?? ev.title, path: "/events/pilgrimage-2026" }])).replace(/</g, "\\u003c") }} />
      <Nav heroDark />
      {isPast && (
        <div role="status" style={{ background: '#2c2825', padding: '13px clamp(20px,5vw,64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px 20px', fontSize: 14, fontWeight: 600, color: 'rgba(255,247,239,.7)' }}>
          <span>This event has passed — page kept as an archive.</span>
          <Link href="/events" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>See upcoming events →</Link>
        </div>
      )}

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) clamp(80px,10vw,120px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 640, height: 520, background: "radial-gradient(circle,rgba(232,163,61,.3),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 20s ease-in-out infinite" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -60, left: -60, width: 480, height: 380, background: "radial-gradient(circle,rgba(214,40,40,.12),transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(255,247,239,.6)", textDecoration: "none", marginBottom: 32 }}>
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
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 80, height: 80, borderRadius: 20, background: "linear-gradient(150deg,#E8A33D,#B8860B)", boxShadow: "0 20px 44px rgba(232,163,61,.4)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 12, color: "#fff", letterSpacing: 1 }}>NOV</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "#fff", lineHeight: 1 }}>2</span>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 44, color: "#fff", lineHeight: 1 }}>–12, 2026</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", letterSpacing: 1 }}>ISRAEL & EGYPT · DEPARTING JFK</div>
              </div>
            </div>
          </Reveal>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6.5vw,90px)", letterSpacing: "-0.035em", color: "#fff", margin: "0 0 24px", lineHeight: 0.92, textWrap: "balance" }}>
            <RevealText immediate>Holy Land</RevealText>
            <br />
            <RevealText immediate delay={0.12} style={{ background: "linear-gradient(100deg,#E8A33D,#F15F22,#D62828)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Pilgrimage 2026
            </RevealText>
          </h1>

          <Reveal delay={200}>
            <p style={{ fontSize: "clamp(16px,1.9vw,20px)", color: "rgba(255,247,239,.72)", lineHeight: 1.72, maxWidth: 600, margin: "0 0 44px", textWrap: "pretty" }}>
              Walk where Jesus walked. Stand where Moses stood. Ten days in the land of Scripture — Israel and Egypt — with your CAC family.
            </p>
          </Reveal>

          {!isPast && (
          <Reveal delay={280}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <a href="mailto:info@cacnapilgrimage.org?subject=Holy Land Pilgrimage 2026 — Registration" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(232,163,61,.4)" }}>
                Register — $500 Deposit →
              </a>
              {ev && (
                <>
                  <a href={googleCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,247,239,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "16px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(255,247,239,.2)" }}>
                    <CalendarPlus size={17} strokeWidth={2} aria-hidden /> Add to Calendar
                  </a>
                  <a href={icsDataUri(ev)} download="holy-land-pilgrimage-2026.ics" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,247,239,.06)", color: "rgba(255,247,239,.7)", fontWeight: 700, fontSize: 14, padding: "16px 22px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(255,247,239,.14)" }}>
                    <Download size={16} strokeWidth={2} aria-hidden /> Apple / Outlook
                  </a>
                </>
              )}
            </div>
          </Reveal>
          )}
        </div>
      </section>

      {/* Leadership */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>The journey</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-.8px", color: "var(--ink)", margin: "0 0 16px", lineHeight: 1 }}>
              Walk where it all happened.
            </h2>
            <p style={{ fontSize: "clamp(15px,1.7vw,18px)", color: "var(--ink-soft)", lineHeight: 1.72, maxWidth: 640, margin: "0 0 36px" }}>
              For 10 days your CAC family will journey from JFK to the Holy Land — tracing the footsteps of Moses through Egypt and the life, death, and resurrection of Jesus Christ across Israel.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {[
              { label: "Led by", names: ["Pastor Dr. H.O. Ilufoye", "L/Evang. Bola Mustapha"] },
              { label: "Directed by", names: ["Pastor S.O. Oladele", "Pastor Dr. T.O.A. Agbeja"] },
            ].map((g, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "24px 26px", boxShadow: "0 8px 20px rgba(27,19,14,.06)" }}>
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
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 44 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>Pilgrimage highlights</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,50px)", letterSpacing: "-.8px", color: "var(--cream)", margin: 0 }}>
              Ten days of sacred sites.
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {highlights.map((h, i) => (
              <Reveal key={i} delay={i * 60}>
                <div style={{ display: "flex", gap: "clamp(16px,3vw,28px)", alignItems: "flex-start", background: "rgba(255,247,239,.05)", border: "1px solid rgba(255,247,239,.1)", borderRadius: 20, padding: "clamp(18px,3vw,26px)" }}>
                  <div style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,#E8A33D,#B8860B)", boxShadow: "0 8px 20px rgba(232,163,61,.3)" }}>
                    <h.icon size={22} color="#fff" strokeWidth={1.9} aria-hidden />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "var(--cream)", marginBottom: 6 }}>{h.label}</div>
                    <div style={{ fontSize: 15, color: "rgba(255,247,239,.65)", lineHeight: 1.68 }}>{h.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Package + Pricing */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "clamp(36px,5vw,60px)" }}>

          {/* Included */}
          <Reveal>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 16 }}>Package inclusions</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-.6px", color: "var(--ink)", margin: "0 0 24px" }}>
              Everything covered.
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
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 16 }}>Pricing & payment</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-.6px", color: "var(--ink)", margin: "0 0 24px" }}>
                Investment
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                <div style={{ background: "var(--ink)", borderRadius: 18, padding: "22px 24px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,247,239,.5)", marginBottom: 6 }}>Total trip price</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 48, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>$4,795</div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "18px 20px" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 6 }}>Deposit to register</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--ink)" }}>$500</div>
                  </div>
                  <div style={{ flex: 1, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "18px 20px" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 4 }}>2nd payment</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--ink)" }}>$2,000</div>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 3 }}>Due by October 31</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <CreditCard size={18} color="var(--red)" strokeWidth={2} aria-hidden />
                    <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>Zelle Transfer</div>
                  </div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)", fontFamily: "monospace" }}>cacnapilgrimage@gmail.com</div>
                </div>
                <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <Landmark size={18} color="var(--red)" strokeWidth={2} aria-hidden />
                    <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>Truist Bank — Wire / Transfer</div>
                  </div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7 }}>
                    Routing: <strong style={{ color: "var(--ink)", fontFamily: "monospace" }}>055003308</strong><br />
                    Account: <strong style={{ color: "var(--ink)", fontFamily: "monospace" }}>1210006673307</strong>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0, lineHeight: 1.6 }}>
                  Send all payment confirmations to L/Evang. Bola Mustapha or Pastor Dr. H.O. Ilufoye (contacts below).
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact CTA */}
      {!isPast && (
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 20 }}>Reserve your space</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,5vw,68px)", letterSpacing: "-1.2px", color: "#fff", margin: "0 0 20px", lineHeight: 0.96 }}>
              Seats are limited.<br />Don&apos;t wait.
            </h2>
            <p style={{ fontSize: "clamp(15px,1.8vw,18px)", color: "rgba(255,247,239,.65)", lineHeight: 1.72, marginBottom: 40 }}>
              Send your $500 deposit and reach out to one of the contacts below to confirm your registration.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 44 }}>
              <a href="mailto:info@cacnapilgrimage.org?subject=Holy Land Pilgrimage 2026 — Registration" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "17px 32px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(232,163,61,.4)" }}>
                Email to Register →
              </a>
              <a href="mailto:cacnapilgrimage@gmail.com" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,247,239,.08)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "17px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(255,247,239,.18)" }}>
                <Mail size={16} strokeWidth={2} aria-hidden /> Gmail
              </a>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
              {[
                { name: "L/Evang. Bola Mustapha", phone: "2142135464", display: "(214) 213-5464" },
                { name: "Pastor Dr. H.O. Ilufoye", phone: "4432268748", display: "(443) 226-8748" },
              ].map((c, i) => (
                <Reveal key={i} delay={i * 80}>
                  <a href={`tel:${c.phone}`} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,247,239,.07)", border: "1px solid rgba(255,247,239,.14)", borderRadius: 18, padding: "18px 22px", textDecoration: "none" }}>
                    <div style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#E8A33D,#B8860B)" }}>
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
    </main>
  );
}
