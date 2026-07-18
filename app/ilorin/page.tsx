import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { YoutubeIcon, FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { DailyWord } from "@/components/sections/DailyWord";
import { MapPin, Mail, Navigation, Podcast, ArrowUpRight, Music, Clock } from "lucide-react";

export const metadata = {
  title: "C.A.C Salvation Centre, Ilorin — District Headquarters",
  description:
    "Christ Apostolic Church Salvation Centre, Ilorin — the District Headquarters in Kwara State, Nigeria. One Fold, One Shepherd. Worship, watch, and connect with us at Fate-Tanke Road, Oko Erin.",
  alternates: { canonical: "https://ilorin.cacsalvationcenter.org" },
};

// Distinct green identity for the Ilorin HQ micro-site (separate from the main red theme).
const c = {
  deep: "#06311F",
  green: "#0E7A43",
  greenBright: "#2BB673",
  gold: "#E8A33D",
  cream: "#EEF5EE",
  cream2: "#E3EFE4",
  paper: "#FFFFFF",
  ink: "#0A2418",
  inkSoft: "#46604F",
  line: "rgba(8,40,24,.10)",
  onDeep: "rgba(238,245,238,.74)",
  onDeepLine: "rgba(238,245,238,.16)",
};

const ADDRESS = "Fate-Tanke Road & Abdullahi Mohammed Street, Oko Erin, Ilorin, Kwara State, Nigeria — 240102";
const MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent("C.A.C Salvation Centre, Fate-Tanke Road, Oko Erin, Ilorin, Kwara, Nigeria")}&z=15&output=embed`;
const MAPS_LINK = `https://maps.google.com/?q=${encodeURIComponent("C.A.C Salvation Centre, Fate-Tanke Road, Oko Erin, Ilorin, Kwara, Nigeria")}`;
const YT = "https://www.youtube.com/@c.a.csalvationvoicefate-ta5068";
const SPOTIFY = "https://open.spotify.com/show/2VBBGHUo6nMITGmGGrEUoM";
const APPLE_PODCASTS = "https://podcasts.apple.com/search?term=CAC+Salvation+Centre+Ilorin";
const AUDIOMACK = "https://audiomack.com/search?q=RT+Owoseni+CAC+Salvation";
const FB = "https://www.facebook.com/cacsalvationcentre";
const TIKTOK = "https://www.tiktok.com/@cacsalvationdistrict";
const EMAIL = "cacsalvationcentreilorin@gmail.com";

const connect = [
  { label: "YouTube", desc: "C.A.C Salvation Voice — services & messages", href: YT, icon: <YoutubeIcon /> },
  { label: "Spotify", desc: "Pastor Owoseni's messages on the go", href: SPOTIFY, icon: <Podcast size={22} strokeWidth={2} /> },
  { label: "Apple Podcasts", desc: "Subscribe for auto-downloads", href: APPLE_PODCASTS, icon: <Podcast size={22} strokeWidth={2} /> },
  { label: "Audiomack", desc: "Sermons, prayers & Total Restoration", href: AUDIOMACK, icon: <Music size={22} strokeWidth={2} /> },
  { label: "Facebook", desc: "Ministry updates & live events", href: FB, icon: <FacebookIcon /> },
  { label: "Instagram", desc: "Visual excerpts & announcements", href: "https://www.instagram.com/cacsalvationcentreilorin/", icon: <InstagramIcon /> },
  { label: "TikTok", desc: "Short clips & highlights from the District", href: TIKTOK, icon: <TikTokIcon /> },
  { label: "Email", desc: EMAIL, href: `mailto:${EMAIL}`, icon: <Mail size={22} strokeWidth={2} /> },
];

const markers = [
  { k: "1997", t: "Where it began", d: "Established in Ilorin, Kwara State, with a mandate to preach the whole Gospel, undiluted." },
  { k: "HQ", t: "District Headquarters", d: "The seat of the Salvation Centre — worship, teaching, and prayer at Fate-Tanke Road, Oko Erin." },
  { k: "2002", t: "The family went out", d: "From Ilorin, the Baltimore-Maryland DCC was planted in the U.S. — one fold across two continents." },
];

const schedule = [
  { day: "Sunday", services: [
    { name: "First Service", time: "7:00 – 9:00 AM" },
    { name: "Second Service", time: "9:00 AM – 12:00 PM" },
  ] },
  { day: "Monday", services: [{ name: "Morning Dew", time: "6:00 – 7:00 AM" }] },
  { day: "Tuesday", services: [{ name: "Bible Study", time: "5:00 – 7:00 PM" }] },
  { day: "Wednesday", services: [{ name: "Revival Hour", time: "5:00 – 7:00 PM" }] },
  { day: "Friday", services: [{ name: "Youth Connect Fellowship", time: "5:00 – 7:00 PM" }] },
];

// Structured data for the Ilorin HQ — lets Google show service times, address & founding.
const ilorinJsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  "@id": "https://ilorin.cacsalvationcenter.org/#church",
  name: "Christ Apostolic Church Salvation Centre, Ilorin",
  alternateName: "C.A.C Salvation Centre Ilorin",
  url: "https://ilorin.cacsalvationcenter.org",
  email: EMAIL,
  foundingDate: "1997-07-06",
  description:
    "The District Headquarters of the Christ Apostolic Church Salvation Centre — Ilorin, Kwara State, Nigeria. Worship, teaching and prayer at Fate-Tanke Road, Oko Erin.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Fate-Tanke Road & Abdullahi Mohammed Street, Oko Erin",
    addressLocality: "Ilorin",
    addressRegion: "Kwara",
    postalCode: "240102",
    addressCountry: "NG",
  },
  areaServed: ["Ilorin", "Kwara State", "Nigeria"],
  knowsLanguage: ["en", "yo"],
  hasMap: MAPS_LINK,
  employee: { "@type": "Person", name: "Pastor R.T. Owoseni", jobTitle: "District Superintendent" },
  parentOrganization: { "@type": "Church", name: "CAC Salvation Center — Baltimore", url: "https://www.cacsalvationcenter.org" },
  sameAs: [YT, FB, "https://www.instagram.com/cacsalvationcentreilorin/", TIKTOK, SPOTIFY],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "07:00", closes: "09:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "09:00", closes: "12:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "06:00", closes: "07:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "17:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "17:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "17:00", closes: "19:00" },
  ],
};

export default function IlorinPage() {
  return (
    <main style={{ background: c.paper, color: c.ink, fontFamily: "var(--font-body)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ilorinJsonLd).replace(/</g, "\\u003c") }}
      />
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(6,49,31,.92)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${c.onDeepLine}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "13px clamp(18px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Image src="/images/logo.png" alt="C.A.C Salvation Centre" width={36} height={36} style={{ borderRadius: 9, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
              <span style={{ fontSize: 9.5, letterSpacing: "2.5px", textTransform: "uppercase", color: c.gold, fontWeight: 800 }}>Christ Apostolic Church</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-.2px" }}>Salvation Centre · Ilorin</span>
            </div>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="#visit" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 700, color: "#fff", background: c.green, padding: "9px 16px", borderRadius: 999, textDecoration: "none" }}>
              <Navigation size={14} strokeWidth={2.4} aria-hidden /> Visit
            </a>
            <a href="https://www.cacsalvationcenter.org" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: c.onDeep, textDecoration: "none", whiteSpace: "nowrap" }}>
              CAC Baltimore <ArrowUpRight size={14} strokeWidth={2.4} aria-hidden />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" style={{ background: `linear-gradient(170deg, ${c.deep} 0%, #094a2d 100%)`, color: "#fff", padding: "clamp(64px,9vw,118px) clamp(20px,5vw,64px) clamp(72px,10vw,128px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -150, right: -120, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,182,115,.28), transparent 62%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -190, left: -150, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,163,61,.16), transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 940, margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
          <Reveal>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: c.gold, background: "rgba(232,163,61,.1)", border: "1px solid rgba(232,163,61,.3)", padding: "7px 16px", borderRadius: 999 }}>
              <MapPin size={14} strokeWidth={2.5} aria-hidden /> Ilorin · Kwara State · Nigeria
            </span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(46px,8vw,104px)", letterSpacing: "-0.03em", lineHeight: 0.92, margin: "24px 0 0", textWrap: "balance" }}>
            <RevealText immediate>Salvation Centre,</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ color: c.greenBright }}>Ilorin.</RevealText>
          </h1>
          <Reveal delay={320}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 22, fontSize: 12.5, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: c.gold, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ width: 30, height: 1, background: "rgba(232,163,61,.5)" }} aria-hidden /> One Fold, One Shepherd · John 10:16 <span style={{ width: 30, height: 1, background: "rgba(232,163,61,.5)" }} aria-hidden />
            </div>
          </Reveal>
          <Reveal delay={380}>
            <p style={{ fontSize: "clamp(16px,1.9vw,21px)", color: c.onDeep, lineHeight: 1.7, maxWidth: 640, margin: "22px auto 0", textWrap: "pretty" }}>
              The District Headquarters of the Christ Apostolic Church Salvation Centre — where the vision was raised, and from which the family has gone out across the world.
            </p>
          </Reveal>
          <Reveal delay={460}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 13, marginTop: 36 }}>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: c.greenBright, color: c.deep, fontWeight: 800, fontSize: 16, padding: "16px 28px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 36px rgba(43,182,115,.3)" }}>
                <Navigation size={18} strokeWidth={2.3} aria-hidden /> Get Directions
              </a>
              <a href={YT} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "#fff", border: `1.5px solid ${c.onDeepLine}`, background: "rgba(255,255,255,.06)", fontWeight: 700, fontSize: 16, padding: "16px 26px", borderRadius: 999, textDecoration: "none" }}>
                Watch on YouTube
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mandate */}
      <section style={{ background: c.cream, padding: "clamp(60px,8vw,108px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div aria-hidden style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 90, lineHeight: 0.5, color: c.greenBright, marginBottom: 6 }}>&ldquo;</div>
          </Reveal>
          <Reveal delay={80}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(22px,3vw,38px)", letterSpacing: "-0.02em", color: c.ink, lineHeight: 1.32, margin: 0, textWrap: "balance" }}>
              We stand as part of the vast body of Christ across the globe — fulfilling the Great Commission, building every believer to be God&apos;s ambassadors here on earth, and preparing them for Christ&apos;s Kingdom to come.
            </p>
          </Reveal>
        </div>
      </section>

      {/* District HQ / heritage */}
      <section style={{ background: c.paper, padding: "clamp(56px,7vw,100px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 44, maxWidth: 660 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: c.green }}>Since July 6, 1997</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.4vw,56px)", letterSpacing: "-1.4px", color: c.ink, margin: "12px 0 16px", lineHeight: 0.98 }}>The District Headquarters.</h2>
            <p style={{ fontSize: 17, color: c.inkSoft, lineHeight: 1.8, margin: 0 }}>
              Raised in Ilorin under <a href="https://www.cacsalvationcenter.org/leadership" style={{ color: c.green, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3, textDecorationColor: "rgba(14,122,67,.45)" }}>Pastor Dr. H.O. Ilufoye</a>, the Salvation Centre is the headquarters from which the family has multiplied — including the Baltimore-Maryland District Coordinating Council in the United States, planted in 2002, and sister assemblies across two continents.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            {markers.map((x, i) => (
              <Reveal key={x.t} delay={i * 80}>
                <div style={{ height: "100%", background: c.cream, border: `1px solid ${c.line}`, borderRadius: 22, padding: "28px 26px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 34, color: c.green, letterSpacing: "-1px", marginBottom: 12, lineHeight: 1 }}>{x.k}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: c.ink, margin: "0 0 8px", letterSpacing: "-.3px" }}>{x.t}</h3>
                  <p style={{ fontSize: 14.5, color: c.inkSoft, lineHeight: 1.7, margin: 0 }}>{x.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* District Superintendent */}
      <section style={{ background: c.cream2, padding: "clamp(56px,7vw,100px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 44 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: c.green }}>District Superintendent</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.6vw,46px)", letterSpacing: "-1px", color: c.ink, margin: "12px 0 0", lineHeight: 1 }}>Pastoral Leadership.</h2>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 48, alignItems: "center", background: c.paper, borderRadius: 28, overflow: "hidden", border: `1px solid ${c.line}`, boxShadow: "0 18px 44px rgba(8,40,24,.09)" }}>
              <div style={{ position: "relative", minHeight: "clamp(300px,40vw,460px)" }}>
                <Image
                  src="/images/pastor-owoseni.jpg"
                  alt="Pastor R.T. Owoseni — District Superintendent, C.A.C Salvation Centre Ilorin"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  sizes="(max-width: 700px) 100vw, 500px"
                />
              </div>
              <div style={{ padding: "clamp(32px,4vw,52px)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: c.green, marginBottom: 14 }}>District Superintendent</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3vw,38px)", letterSpacing: "-0.8px", color: c.ink, margin: "0 0 18px", lineHeight: 1.08 }}>Pastor R.T. Owoseni</h3>
                <p style={{ fontSize: 16, color: c.inkSoft, lineHeight: 1.8, margin: "0 0 28px", maxWidth: 480 }}>
                  A minister and the lead pastor at C.A.C Salvation Centre, Ilorin. Well known for his deep spiritual teaching, leadership in workers&apos; retreats, and outreach across digital platforms — his messages carry clarity, conviction, and a pastor&apos;s heart.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <a href={SPOTIFY} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1DB954", color: "#fff", fontWeight: 700, fontSize: 13.5, padding: "10px 18px", borderRadius: 999, textDecoration: "none" }}>
                    <Podcast size={15} strokeWidth={2} aria-hidden /> Spotify
                  </a>
                  <a href={APPLE_PODCASTS} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#9B4DC7", color: "#fff", fontWeight: 700, fontSize: 13.5, padding: "10px 18px", borderRadius: 999, textDecoration: "none" }}>
                    <Podcast size={15} strokeWidth={2} aria-hidden /> Apple Podcasts
                  </a>
                  <a href={AUDIOMACK} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FF6600", color: "#fff", fontWeight: 700, fontSize: 13.5, padding: "10px 18px", borderRadius: 999, textDecoration: "none" }}>
                    <Music size={15} strokeWidth={2} aria-hidden /> Audiomack
                  </a>
                  <a href={FB} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1877F2", color: "#fff", fontWeight: 700, fontSize: 13.5, padding: "10px 18px", borderRadius: 999, textDecoration: "none" }}>
                    <FacebookIcon size={15} /> Facebook
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Today's Word — a daily blessing from Pastor Owoseni */}
      <DailyWord />

      {/* Service times */}
      <section style={{ background: c.cream, padding: "clamp(56px,7vw,100px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: c.green }}>Weekly Rhythm</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.6vw,46px)", letterSpacing: "-1px", color: c.ink, margin: "12px 0 0", lineHeight: 1 }}>Service times.</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 18 }}>
            {schedule.map((d, i) => (
              <Reveal key={d.day} delay={i * 70}>
                <div style={{ height: "100%", background: c.paper, border: `1px solid ${c.line}`, borderRadius: 22, padding: "26px 24px" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: c.green, marginBottom: 18 }}>{d.day}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {d.services.map((s) => (
                      <div key={s.name}>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: c.ink, letterSpacing: "-.2px", lineHeight: 1.2 }}>{s.name}</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: c.inkSoft, fontWeight: 600, marginTop: 5 }}>
                          <Clock size={13} strokeWidth={2.2} color={c.greenBright} aria-hidden /> {s.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={160} style={{ textAlign: "center", marginTop: 30 }}>
            <p style={{ fontSize: 14.5, color: c.inkSoft, margin: 0 }}>All times West Africa Time (WAT) · Everyone is welcome.</p>
          </Reveal>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" style={{ background: c.paper, padding: "clamp(56px,7vw,100px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 48, alignItems: "center" }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: c.green }}>Come and worship</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.6vw,46px)", letterSpacing: "-1px", color: c.ink, margin: "12px 0 18px", lineHeight: 1 }}>Visit us in Ilorin.</h2>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24 }}>
              <MapPin size={20} strokeWidth={2.2} color={c.green} style={{ flexShrink: 0, marginTop: 3 }} aria-hidden />
              <p style={{ fontSize: 16.5, color: c.ink, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{ADDRESS}</p>
            </div>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: c.green, color: "#fff", fontWeight: 700, fontSize: 15.5, padding: "14px 26px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(14,122,67,.28)" }}>
              <Navigation size={17} strokeWidth={2.3} aria-hidden /> Get Directions
            </a>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ height: "clamp(280px,34vw,380px)", borderRadius: 24, overflow: "hidden", border: `1px solid ${c.line}`, boxShadow: "0 18px 40px rgba(8,40,24,.12)" }}>
              <iframe title="Map to C.A.C Salvation Centre, Ilorin" src={MAPS_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Connect */}
      <section id="connect" style={{ background: "linear-gradient(165deg, #0E7A43 0%, #0A5230 100%)", color: "#fff", padding: "clamp(56px,7vw,100px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: c.gold }}>Watch · Listen · Connect</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1.2px", color: "#fff", margin: "12px 0 0", lineHeight: 1 }}>Stay with the family.</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {connect.map((x, i) => (
              <Reveal key={x.label} delay={i * 70}>
                <a
                  href={x.href}
                  {...(x.href.startsWith("mailto") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="card-lift"
                  style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 20, padding: "24px 22px", textDecoration: "none" }}
                >
                  <span style={{ display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 13, background: "rgba(43,182,115,.22)", color: c.greenBright, flexShrink: 0 }}>{x.icon}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "#fff", marginBottom: 4 }}>{x.label}</div>
                    <div style={{ fontSize: 13.5, color: c.onDeep, lineHeight: 1.5, wordBreak: "break-word" }}>{x.desc}</div>
                  </div>
                  <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: c.gold }}>Open <ArrowUpRight size={14} strokeWidth={2.4} aria-hidden /></span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: c.deep, color: "#fff", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px) 36px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 36, paddingBottom: 32, borderBottom: `1px solid ${c.onDeepLine}` }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "2.5px", textTransform: "uppercase", color: c.gold, fontWeight: 800 }}>Christ Apostolic Church</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, marginTop: 4 }}>Salvation Centre · Ilorin</div>
              <p style={{ fontSize: 14, color: c.onDeep, lineHeight: 1.65, margin: "14px 0 0", maxWidth: 300 }}>The District Headquarters of the global C.A.C Salvation Centre family. One Fold, One Shepherd.</p>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14, color: c.gold }}>Visit</div>
              <p style={{ fontSize: 14, color: c.onDeep, lineHeight: 1.7, margin: 0 }}>{ADDRESS}</p>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 13.5, fontWeight: 700, color: c.greenBright, textDecoration: "none" }}>Directions <ArrowUpRight size={14} aria-hidden /></a>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14, color: c.gold }}>Connect</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
                <a href={YT} target="_blank" rel="noopener noreferrer" style={{ color: c.onDeep, textDecoration: "none" }}>YouTube</a>
                <a href={SPOTIFY} target="_blank" rel="noopener noreferrer" style={{ color: c.onDeep, textDecoration: "none" }}>Spotify Podcast</a>
                <a href={APPLE_PODCASTS} target="_blank" rel="noopener noreferrer" style={{ color: c.onDeep, textDecoration: "none" }}>Apple Podcasts</a>
                <a href={AUDIOMACK} target="_blank" rel="noopener noreferrer" style={{ color: c.onDeep, textDecoration: "none" }}>Audiomack</a>
                <a href={FB} target="_blank" rel="noopener noreferrer" style={{ color: c.onDeep, textDecoration: "none" }}>Facebook</a>
                <a href={TIKTOK} target="_blank" rel="noopener noreferrer" style={{ color: c.onDeep, textDecoration: "none" }}>TikTok</a>
                <a href={`mailto:${EMAIL}`} style={{ color: c.onDeep, textDecoration: "none", wordBreak: "break-word" }}>{EMAIL}</a>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14, color: c.gold }}>The wider family</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
                <a href="https://www.cacsalvationcenter.org" style={{ color: c.onDeep, textDecoration: "none" }}>CAC Salvation Center · Baltimore</a>
                <a href="https://cackingdomembassy.org" target="_blank" rel="noopener noreferrer" style={{ color: c.onDeep, textDecoration: "none" }}>CAC Kingdom Embassy</a>
                <a href="https://cacpalaceofpeace.org" target="_blank" rel="noopener noreferrer" style={{ color: c.onDeep, textDecoration: "none" }}>CAC Palace of Peace</a>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: c.onDeep, marginTop: 22 }}>© 2026 Christ Apostolic Church Salvation Centre, Ilorin · Kwara State, Nigeria</div>
        </div>
      </footer>
    </main>
  );
}
