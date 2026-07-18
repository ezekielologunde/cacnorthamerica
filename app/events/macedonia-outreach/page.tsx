import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Heart, BookOpen, Package, ExternalLink, MapPin, Users } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cacsalvationcenter.org";
const IG = "https://www.instagram.com/macedonia.outreach/";
const G  = "#1B4332";
const GL = "#2D6A4F";

export const metadata: Metadata = {
  title: "Macedonia Outreach — CAC Salvation Center",
  description:
    "An annual mission to forgotten rural ministers in hard-to-reach and unreachable places — carrying the full gospel where most cannot go. Follow @macedonia.outreach.",
  alternates: { canonical: "/events/macedonia-outreach" },
  keywords: [
    "Macedonia Outreach", "CAC mission Nigeria", "rural ministry outreach",
    "forgotten pastors Nigeria", "evangelism unreachable places", "Christian mission Nigeria",
  ],
  openGraph: {
    type: "website",
    title: "Macedonia Outreach — Where Most Cannot Go",
    description:
      "Carrying the full gospel to forgotten rural ministers in hard-to-reach places. Annual mission of CAC Salvation Center.",
    url: `${SITE_URL}/events/macedonia-outreach`,
    images: [{ url: "/images/macedonia-logo.png", width: 1200, height: 630, alt: "Macedonia Outreach logo" }],
  },
};

const PILLARS = [
  {
    icon: Heart,
    label: "Encouragement",
    desc: "Pastors labouring in isolation need to know they are not forgotten. We come as witnesses — your work is seen, and it matters.",
  },
  {
    icon: BookOpen,
    label: "Equipping",
    desc: "Bibles, study materials, and teaching resources placed directly in the hands of ministers who have none.",
  },
  {
    icon: Package,
    label: "Practical Support",
    desc: "Food items, medicines, and supplies that meet the real and immediate needs of ministers and their communities.",
  },
];

const WAYS = [
  {
    num: "01",
    label: "Pray",
    desc: "Intercede for the team, the roads, and the pastors we visit. Every door opened in the field is first opened in prayer.",
    cta: "Join the prayer line",
    href: "/prayer",
  },
  {
    num: "02",
    label: "Give",
    desc: "Your giving covers transport, food packs, Bibles, and medicines. A small gift can reach a forgotten corner of the harvest field.",
    cta: "Give to this mission",
    href: "/giving",
  },
  {
    num: "03",
    label: "Go",
    desc: "Volunteers travel with the team each year. If you feel called to go into the field, tell us — we want to hear your heart.",
    cta: "Express interest",
    href: "/contact",
  },
];

export default function MacedoniaPage() {
  return (
    <main>
      <Nav heroDark />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        aria-label="Macedonia Outreach hero"
        style={{
          background: `linear-gradient(155deg,${G} 0%,${GL} 100%)`,
          padding: "150px clamp(20px,5vw,64px) 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div aria-hidden style={{ position: "absolute", top: 0, right: 0, width: 560, height: 560, background: "radial-gradient(circle,rgba(64,145,108,.22),transparent 65%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -80, left: -60, width: 380, height: 380, background: "radial-gradient(circle,rgba(255,247,239,.05),transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "clamp(48px,6vw,80px)", alignItems: "center" }}>
          <div>
            <Reveal>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,247,239,.6)" }}>
                Annual Mission · CAC Salvation Center
              </span>
            </Reveal>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px,6.5vw,88px)", letterSpacing: "-0.03em", color: "#fff", margin: "18px 0 24px", lineHeight: 0.93, textWrap: "balance" }}>
              <RevealText immediate>Where Most</RevealText>
              <br />
              <RevealText immediate delay={0.12} style={{ color: "var(--gold)" }}>Cannot Go.</RevealText>
            </h1>
            <Reveal delay={300}>
              <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(255,247,239,.78)", lineHeight: 1.7, maxWidth: 500, margin: "0 0 36px", textWrap: "pretty" }}>
                An annual mission to forgotten rural ministers in hard-to-reach and unreachable places — carrying the full gospel, one pastor at a time.
              </p>
            </Reveal>
            <Reveal delay={420}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link
                  href="/giving"
                  className="btn-sheen press"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gold)", color: "#1B1B1B", fontWeight: 800, fontSize: 15, padding: "14px 28px", borderRadius: 999, textDecoration: "none" }}
                >
                  Support the mission →
                </Link>
                <a
                  href={IG}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press"
                  aria-label="Follow Macedonia Outreach on Instagram (opens in new tab)"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.12)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 28px", borderRadius: 999, textDecoration: "none", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.2)" }}
                >
                  <ExternalLink size={17} aria-hidden /> Follow the journey
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180} style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{ width: "clamp(200px,26vw,320px)", height: "clamp(200px,26vw,320px)", borderRadius: "50%", background: "rgba(255,255,255,.08)", display: "grid", placeItems: "center", border: "2px solid rgba(255,255,255,.14)", padding: "10%" }}
              aria-hidden
            >
              <Image src="/images/macedonia-logo.png" alt="" width={960} height={720} style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Scripture ─────────────────────────────────────────────────────── */}
      <section style={{ background: G, padding: "clamp(40px,5vw,60px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <blockquote cite="https://www.biblegateway.com/passage/?search=Acts+16%3A9&version=NIV" style={{ margin: 0 }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,2.8vw,30px)", fontWeight: 700, fontStyle: "italic", color: "rgba(255,247,239,.9)", lineHeight: 1.5, letterSpacing: "-.3px", margin: "0 0 14px" }}>
                "Come over to Macedonia and help us."
              </p>
              <footer style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,247,239,.4)" }}>
                Acts 16:9 — The Macedonian Call
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────────── */}
      <section aria-labelledby="mission-heading" style={{ background: "var(--cream)", padding: "clamp(70px,9vw,120px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "clamp(40px,7vw,90px)", alignItems: "start" }}>
          <div>
            <Reveal>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: GL }}>The Mission</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 id="mission-heading" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1px", color: "var(--ink)", margin: "14px 0 24px", lineHeight: 0.97, textWrap: "balance" }}>
                Reaching the forgotten corners
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "var(--ink-soft)", lineHeight: 1.8, margin: "0 0 18px", textWrap: "pretty" }}>
                Across Nigeria — from the Kwara hinterlands to rural Osun and beyond — there are pastors quietly holding the light in communities the world has overlooked. No visitors. No resources. No recognition.
              </p>
              <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "var(--ink-soft)", lineHeight: 1.8, margin: 0, textWrap: "pretty" }}>
                Macedonia Outreach is the answer to that call. Each year, a team goes out into bush settlements, remote villages, and underserved towns — to find those ministers, sit with them, pray with them, and carry them forward.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
                {[
                  { icon: MapPin, label: "Rural Nigeria" },
                  { icon: Users, label: "Forgotten Ministers" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700, color: GL, background: "rgba(27,67,50,.08)", border: `1px solid rgba(27,67,50,.2)`, padding: "8px 16px", borderRadius: 999 }}>
                    <Icon size={14} aria-hidden /> {label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {PILLARS.map(({ icon: Icon, label, desc }, i) => (
              <Reveal key={label} delay={200 + i * 80}>
                <div style={{ display: "flex", gap: 18, background: "var(--paper)", borderRadius: 20, padding: "22px 24px", border: "1px solid var(--line)", boxShadow: "0 8px 22px rgba(27,19,14,.05)" }}>
                  <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 13, background: `linear-gradient(140deg,${G},${GL})`, display: "grid", placeItems: "center", boxShadow: "0 6px 16px rgba(27,67,50,.28)" }} aria-hidden>
                    <Icon size={20} color="#fff" />
                  </span>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--ink)", margin: "0 0 6px" }}>{label}</h3>
                    <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Get Involved ─────────────────────────────────────────────────── */}
      <section aria-labelledby="involved-heading" style={{ background: "var(--cream-2)", padding: "clamp(70px,9vw,120px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: GL }}>Get Involved</span>
            <h2 id="involved-heading" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4.5vw,54px)", letterSpacing: "-1.2px", color: "var(--ink)", margin: "14px 0 0", lineHeight: 0.96, textWrap: "balance" }}>
              Every role matters
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {WAYS.map(({ num, label, desc, cta, href }, i) => (
              <Reveal key={num} delay={i * 90}>
                <div style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 24, padding: "32px 28px", boxShadow: "0 12px 32px rgba(27,19,14,.06)", display: "flex", flexDirection: "column" }}>
                  <div aria-hidden style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 800, color: "var(--line)", lineHeight: 1, marginBottom: 18, userSelect: "none" }}>{num}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, letterSpacing: "-.5px", color: "var(--ink)", margin: "0 0 12px" }}>{label}</h3>
                  <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.72, flex: 1, margin: "0 0 24px" }}>{desc}</p>
                  <Link href={href} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: GL, textDecoration: "none" }}>
                    {cta} <span aria-hidden>→</span>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Follow CTA ───────────────────────────────────────────────────── */}
      <section
        aria-label="Follow Macedonia Outreach on Instagram"
        style={{ background: `linear-gradient(155deg,${G},${GL})`, padding: "clamp(70px,9vw,110px) clamp(20px,5vw,64px)", textAlign: "center", position: "relative", overflow: "hidden" }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 65% 40%,rgba(82,183,136,.18),transparent 55%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 660, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <div aria-hidden style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,.12)", display: "grid", placeItems: "center", margin: "0 auto 24px", border: "1px solid rgba(255,255,255,.18)" }}>
              <ExternalLink size={28} color="#fff" />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,4vw,50px)", letterSpacing: "-1px", color: "#fff", margin: "0 0 18px", lineHeight: 0.97, textWrap: "balance" }}>
              Follow the journey live
            </h2>
            <p style={{ fontSize: "clamp(15px,1.7vw,18px)", color: "rgba(255,247,239,.74)", lineHeight: 1.7, margin: "0 0 36px", textWrap: "pretty" }}>
              Field updates, testimonies, and moments from the outreach are shared live on Instagram. Follow{" "}
              <strong style={{ color: "#fff" }}>@macedonia.outreach</strong> to travel with the team — even from home.
            </p>
            <a
              href={IG}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sheen press-lg"
              aria-label="Follow @macedonia.outreach on Instagram (opens in new tab)"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", color: G, fontWeight: 800, fontSize: 16, padding: "16px 32px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 40px rgba(0,0,0,.22)" }}
            >
              <ExternalLink size={20} aria-hidden /> @macedonia.outreach
            </a>
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
