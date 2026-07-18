import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, MapPin, CalendarDays, Clock, Navigation,
  UtensilsCrossed, Music, Drama, Film, Gamepad2, Mic2,
  CalendarPlus, Download, Video,
} from "lucide-react";
import { specialEvents, googleCalUrl, icsDataUri, isEventPast } from "@/lib/events";
import { SITE, SITE_URL, breadcrumbJsonLd } from "@/lib/site";

export const revalidate = 3600;

export const metadata = {
  title: "24th Church Anniversary — Make a Joyful Noise | CAC Salvation Center",
  description:
    "Celebrate 24 years of God's faithfulness at CAC Salvation Center — July 24–26, 2026 (Fri–Sun), theme “Make a Joyful Noise to the Lord” (Psalm 95:1). Friday revival on Zoom, a Saturday Star Event (movie, games, lunch), and the Sunday Thanksgiving Service.",
  alternates: { canonical: "/events/24th-anniversary" },
  openGraph: {
    title: "24th Church Anniversary — Make a Joyful Noise",
    description:
      "Three days celebrating 24 years of God's faithfulness at CAC Salvation Center — July 24–26, 2026. Theme: “Make a Joyful Noise to the Lord” (Psalm 95:1).",
    images: [{ url: "/images/24th-anniversary-flyer.png", width: 1536, height: 1024, alt: "24th Church Anniversary — Make a Joyful Noise, July 24–26, 2026" }],
  },
};

const ev = specialEvents.find((e) => e.id === "church-anniversary-2026")!;

const fullAddress = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

const week = [
  { day: "Fri", date: "Jul 24", label: "Revival Night — on Zoom", time: "7:00 PM ET", items: ["Prayer & Praise", "Word Ministration", "Revival", "Special Blessings"] },
  { day: "Sat", date: "Jul 25", label: "Star Event — Family Day", time: "11:00 AM ET", badge: "Star Event", highlight: true, items: ["Movie Time", "Exciting Games", "Lunch with the Salvation Center"] },
  { day: "Sun", date: "Jul 26", label: "Grand Finale — Thanksgiving Service", time: "10:30 AM ET", badge: "Grand Finale", highlight: true, items: ["Anointed Word", "Powerful Worship", "Youth Playlet", "Special Choir", "Word of Salvation"] },
];

const lineup = [
  { icon: UtensilsCrossed, t: "Lunch with the Salvation Center", s: "Break bread together as one family." },
  { icon: Film, t: "Movie Time", s: "A family screening for all ages." },
  { icon: Gamepad2, t: "Exciting Games", s: "Fun and friendly competition for everyone." },
  { icon: Mic2, t: "Power Music Ministration", s: "Live praise & worship to lift the roof." },
  { icon: Drama, t: "Youth Playlet", s: "Drama and testimony from our young ones." },
  { icon: Music, t: "Special Choir", s: "Voices raised in a joyful noise to the Lord." },
];

const ministers = [
  { name: "Pastor Dr. H.O. Ilufoye", role: "BDCC Superintendent" },
  { name: "Pastor S.O. Oladele", role: "C.A.C. President" },
  { name: "Pastor Dr. T.O.A. Agbeja", role: "Latunde Regional Superintendent" },
];

const details = [
  { icon: CalendarDays, label: "Dates", detail: "Friday July 24 – Sunday July 26, 2026" },
  { icon: Clock, label: "Times", detail: "Fri 7:00 PM (Zoom) · Sat 11:00 AM · Sun 10:30 AM ET" },
  { icon: MapPin, label: "Venue", detail: `Church Auditorium — ${fullAddress}` },
  { icon: Video, label: "Friday is on Zoom", detail: "The Friday revival streams live on Zoom and online — join from anywhere." },
];

export default function AnniversaryPage() {
  const isPast = isEventPast(ev);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    description: ev.desc,
    startDate: "2026-07-24T19:00:00-04:00",
    endDate: "2026-07-26T14:00:00-04:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    image: `${SITE_URL}/images/24th-anniversary-flyer.png`,
    url: `${SITE_URL}/events/24th-anniversary`,
    location: [
      { "@type": "Place", name: `${SITE.name} — Church Auditorium`, address: { "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: SITE.address.city, addressRegion: SITE.address.region, postalCode: SITE.address.postalCode, addressCountry: SITE.address.country } },
      { "@type": "VirtualLocation", url: `${SITE_URL}/online` },
    ],
    organizer: { "@type": "Church", name: SITE.name, url: SITE_URL },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Events", path: "/events" }, { name: ev.navLabel ?? ev.title, path: "/events/24th-anniversary" }])).replace(/</g, "\\u003c") }} />
      <Nav heroDark />

      {isPast && (
        <div role="status" style={{ background: "#2c2825", padding: "13px clamp(20px,5vw,64px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px 20px", fontSize: 14, fontWeight: 600, color: "rgba(255,247,239,.7)" }}>
          <span>This celebration has passed — page kept as an archive.</span>
          <Link href="/events" style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>See upcoming events →</Link>
        </div>
      )}

      {/* Hero — the joyful-noise burst */}
      <section style={{ background: "radial-gradient(120% 80% at 50% -10%, #5A1A0E 0%, var(--ink) 46%, #120a07 100%)", padding: "138px clamp(20px,5vw,64px) clamp(70px,9vw,110px)", position: "relative", overflow: "hidden", textAlign: "center" }}>
        {/* radiant rays behind the numeral */}
        <div aria-hidden style={{ position: "absolute", top: "-12%", left: "50%", width: "min(1200px,150%)", aspectRatio: "1", transform: "translateX(-50%)", background: "repeating-conic-gradient(from 0deg at 50% 50%, rgba(232,163,61,.10) 0deg 6deg, transparent 6deg 12deg)", WebkitMaskImage: "radial-gradient(closest-side,#000 0%,#000 34%,transparent 70%)", maskImage: "radial-gradient(closest-side,#000 0%,#000 34%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div aria-hidden style={{ position: "absolute", bottom: -90, left: "50%", transform: "translateX(-50%)", width: 700, height: 420, background: "radial-gradient(circle,rgba(214,40,40,.28),transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(255,247,239,.6)", textDecoration: "none", marginBottom: 30 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> All events
            </Link>
          </Reveal>

          <Reveal from="scale">
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: "var(--gold)" }}>
              Christ Apostolic Church · Salvation Center
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(120px,22vw,220px)", lineHeight: 0.82, letterSpacing: "-0.05em", color: "var(--gold)", textShadow: "0 3px 0 #B97A22, 0 0 70px rgba(232,163,61,.4)", margin: "12px 0 2px" }}>
              24<span style={{ fontSize: "0.34em", verticalAlign: "0.95em", color: "var(--gold-soft, #F2C879)" }}>th</span>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(18px,3.4vw,30px)", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--cream)", paddingLeft: "0.4em" }}>
              Anniversary
            </div>
          </Reveal>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,5.5vw,64px)", letterSpacing: "-0.02em", color: "#fff", margin: "26px auto 0", lineHeight: 1.02, maxWidth: "16ch", textWrap: "balance" }}>
            <RevealText immediate>Make a Joyful</RevealText>{" "}
            <RevealText immediate delay={0.12} style={{ background: "linear-gradient(100deg,#F15F22,#D62828,#E8A33D)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Noise
            </RevealText>{" "}
            <RevealText immediate delay={0.2}>unto the Lord</RevealText>
          </h1>

          <Reveal delay={220}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, margin: "16px 0 6px", fontSize: "clamp(12px,1.7vw,15px)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, color: "var(--flame)" }}>
              <span aria-hidden style={{ width: 22, height: 1, background: "var(--flame)", opacity: 0.6 }} /> Psalm 95:1 <span aria-hidden style={{ width: 22, height: 1, background: "var(--flame)", opacity: 0.6 }} />
            </div>
          </Reveal>

          <Reveal delay={280}>
            <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,247,239,.74)", lineHeight: 1.7, maxWidth: 620, margin: "12px auto 40px", textWrap: "pretty" }}>
              Three days of celebration — <strong style={{ color: "var(--cream)" }}>July 24–26, 2026</strong> — marking 24 years of God&apos;s faithfulness: a Friday revival on Zoom, a Saturday Star Event, and the Sunday Thanksgiving Service.
            </p>
          </Reveal>

          {!isPast && (
            <Reveal delay={340}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
                <a href={googleCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "16px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(232,163,61,.4)" }}>
                  <CalendarPlus size={18} strokeWidth={2} aria-hidden /> Add to Calendar
                </a>
                <a href={icsDataUri(ev)} download="cac-24th-anniversary.ics" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,247,239,.08)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "16px 26px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(255,247,239,.2)" }}>
                  <Download size={16} strokeWidth={2} aria-hidden /> Apple / Outlook
                </a>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,247,239,.06)", color: "rgba(255,247,239,.72)", fontWeight: 700, fontSize: 14, padding: "16px 22px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(255,247,239,.14)" }}>
                  <Navigation size={16} strokeWidth={2} aria-hidden /> Directions
                </a>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Theme — 24 years of faithfulness */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 16 }}>Twenty-four years of grace</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4.5vw,52px)", letterSpacing: "-.8px", color: "var(--ink)", margin: "0 0 24px", lineHeight: 1.04, textWrap: "balance" }}>
              &ldquo;O come, let us sing unto the Lord.&rdquo;
            </h2>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.8, margin: "0 0 20px" }}>
              Since 2002, God has been faithful to the Salvation Center family. Twenty-four years on, we gather not to celebrate ourselves but to make a joyful noise to the One who has kept us — with thanksgiving, with worship, and with the whole household of faith under one roof.
            </p>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.8, margin: 0 }}>
              Come as you are. Bring your family, bring a friend, and let us give Him the praise He deserves.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Three days of celebration */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>Friday to Sunday</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,50px)", letterSpacing: "-.8px", color: "var(--cream)", margin: 0 }}>Three days of celebration.</h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {week.map((d, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{ display: "flex", gap: "clamp(16px,3vw,32px)", alignItems: "flex-start", background: d.highlight ? "linear-gradient(120deg,rgba(232,163,61,.16),rgba(214,40,40,.10))" : "rgba(255,247,239,.05)", border: d.highlight ? "1px solid rgba(232,163,61,.4)" : "1px solid rgba(255,247,239,.1)", borderRadius: 20, padding: "clamp(20px,3vw,28px)" }}>
                  <div style={{ flexShrink: 0, minWidth: 82, textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,247,239,.55)" }}>{d.day}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: d.highlight ? "var(--gold)" : "var(--cream)", lineHeight: 1.2 }}>{d.date}</div>
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 18, color: "var(--cream)" }}>{d.label}</span>
                      {d.badge && <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", background: "var(--gold)", color: "var(--ink)", padding: "3px 9px", borderRadius: 999 }}>{d.badge}</span>}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--gold)", marginBottom: 12 }}>{d.time}</div>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
                      {d.items.map((it) => (
                        <li key={it} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, color: "rgba(255,247,239,.7)" }}>
                          <span aria-hidden style={{ flexShrink: 0, width: 5, height: 5, borderRadius: "50%", background: "var(--gold)" }} />{it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={420}>
            <p style={{ fontSize: 14, color: "rgba(255,247,239,.45)", marginTop: 22, lineHeight: 1.6 }}>
              The Friday revival streams live on Zoom — <Link href="/online" style={{ color: "rgba(255,247,239,.75)", fontWeight: 700, textDecoration: "none" }}>join online</Link> from anywhere. All are welcome.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The Star Event line-up */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 12, textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>Star Event · Saturday &amp; the weekend</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4.5vw,54px)", letterSpacing: "-.8px", color: "var(--ink)", margin: 0, lineHeight: 1.02 }}>The Star Event line-up</h2>
          </Reveal>
          <Reveal delay={80} style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
              Movie time, games, lunch, and power-packed music — a joyful, Spirit-filled weekend for the whole family.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 16 }}>
            {lineup.map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card-lift" style={{ height: "100%", display: "flex", gap: 16, alignItems: "flex-start", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 22px", boxShadow: "0 8px 20px rgba(27,19,14,.06)" }}>
                  <div style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 12, background: "linear-gradient(135deg,var(--flame),var(--red))", boxShadow: "0 8px 16px rgba(214,40,40,.28)" }}>
                    <item.icon size={22} color="#fff" strokeWidth={2} aria-hidden />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)", marginBottom: 4 }}>{item.t}</div>
                    <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>{item.s}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", textAlign: "center", color: "var(--red)", fontSize: "clamp(15px,2vw,19px)", marginTop: 32 }}>
              …and many more, all to the glory of God. Everyone is welcome!
            </p>
          </Reveal>
        </div>
      </section>

      {/* Ministering */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>Ministering the Word</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,4vw,48px)", letterSpacing: "-.8px", color: "var(--ink)", margin: 0 }}>Our guest ministers</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 18 }}>
            {ministers.map((m, i) => (
              <Reveal key={m.name} delay={i * 90}>
                <div style={{ height: "100%", textAlign: "center", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "30px 24px", boxShadow: "0 10px 26px rgba(27,19,14,.06)" }}>
                  <div aria-hidden style={{ margin: "0 auto 16px", width: 60, height: 60, borderRadius: "50%", display: "grid", placeItems: "center", background: "linear-gradient(140deg,var(--gold),var(--flame))", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22 }}>
                    {m.name.replace(/^Pastor(\sDr\.)?\s/, "").charAt(0)}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-.3px", color: "var(--ink)", lineHeight: 1.2 }}>{m.name}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--red)", marginTop: 6 }}>{m.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The flyer */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 26 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>Spread the word</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-.8px", color: "var(--cream)", margin: 0 }}>The flyer</h2>
          </Reveal>
          <Reveal>
            <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.5)", border: "1px solid rgba(255,247,239,.08)" }}>
              <Image
                src="/images/24th-anniversary-flyer.png"
                alt="24th Church Anniversary official flyer — Make a Joyful Noise to the Lord, July 24–26, 2026"
                width={1536}
                height={1024}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </Reveal>
          <Reveal delay={120} style={{ textAlign: "center", marginTop: 22 }}>
            <a
              href="/images/24th-anniversary-flyer.png"
              download="cac-24th-anniversary-flyer.png"
              className="press"
              style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,247,239,.08)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "14px 26px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(255,247,239,.2)" }}
            >
              <Download size={16} strokeWidth={2} aria-hidden /> Download the flyer
            </a>
          </Reveal>
        </div>
      </section>

      {/* Details + CTA */}
      <section style={{ background: "var(--ink)", padding: "clamp(60px,8vw,100px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 36, textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>Plan your visit</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,5vw,60px)", letterSpacing: "-1.2px", color: "#fff", margin: 0, lineHeight: 0.98 }}>
              We&apos;re saving you a seat.
            </h2>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
            {details.map((d, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "rgba(255,247,239,.05)", border: "1px solid rgba(255,247,239,.1)", borderRadius: 16, padding: "18px 20px" }}>
                  <div style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 11, background: "linear-gradient(135deg,var(--flame),var(--red))" }}>
                    <d.icon size={19} color="#fff" strokeWidth={2} aria-hidden />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "var(--gold)", marginBottom: 4, letterSpacing: ".3px" }}>{d.label}</div>
                    <div style={{ fontSize: 15, color: "rgba(255,247,239,.78)", lineHeight: 1.6 }}>{d.detail}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {!isPast && (
            <Reveal delay={280}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
                <a href={googleCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="btn-sheen press" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 16, padding: "16px 32px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(232,163,61,.35)" }}>
                  <CalendarPlus size={18} strokeWidth={2} aria-hidden /> Add to Calendar
                </a>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,247,239,.08)", color: "var(--cream)", fontWeight: 700, fontSize: 15, padding: "16px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(255,247,239,.18)" }}>
                  <Navigation size={17} strokeWidth={2} aria-hidden /> Get Directions
                </a>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
