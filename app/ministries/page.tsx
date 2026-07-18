import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";
import Image from "next/image";
import { Music, HeartHandshake, Sparkles, Baby, HandHeart, Video, Users, Heart, Wrench, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata = {
  title: "Ministries — CAC Salvation Center",
  description:
    "Find your place to belong and serve at CAC Salvation Center — worship & choir, women's fellowship, youth, children's ministry, prayer, and media.",
  alternates: { canonical: "/ministries" },
};

type Ministry = {
  name: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  cta: string;
  image?: string;
  alt?: string;
  gradient?: string;
};

const ministries: Ministry[] = [
  { name: "Worship & Choir", desc: "Spirit-filled praise that leads the whole house into God's presence every Sunday.", icon: Music, gradient: "linear-gradient(140deg,var(--red),var(--flame))", href: "/contact", cta: "Join the choir" },
  { name: "Women's Fellowship", desc: "Sister Fellowship (Blessed Sisters, Unity Sisters, Glorious Sisters) and more — all women of the Salvation Center growing together in faith, prayer, and service.", icon: HeartHandshake, gradient: "linear-gradient(140deg,var(--flame),var(--gold))", href: "/contact", cta: "Connect with the sisters" },
  { name: "Youth & Young Adults", desc: "Raising the next generation as bold, grounded ambassadors of Christ.", icon: Sparkles, gradient: "linear-gradient(140deg,var(--red-deep),var(--red))", href: "/contact", cta: "Get involved" },
  { name: "Children's Ministry", desc: "A safe, joyful place for kids to meet Jesus. Sunday School begins at 9:25 AM.", icon: Baby, gradient: "linear-gradient(140deg,var(--flame),var(--red))", href: "/visit", cta: "Plan a visit" },
  { name: "Prayer & Intercession", desc: "Standing in the gap for our church and our city — join the daily 5 AM prayer line.", icon: HandHeart, gradient: "linear-gradient(140deg,var(--red),var(--red-deep))", href: "/prayer", cta: "Join the prayer line" },
  { name: "Media & Online", desc: "Carrying the service beyond our walls — streaming Spirit-filled worship to the world.", icon: Video, gradient: "linear-gradient(140deg,var(--gold),var(--flame))", href: "/contact", cta: "Serve on media" },
  { name: "Macedonia Outreach", desc: "An annual mission to forgotten rural ministers in hard-to-reach and unreachable places — carrying the gospel where most cannot go.", icon: Globe, gradient: "linear-gradient(140deg,#1B4332,#2D6A4F)", image: "/images/macedonia-logo.png", alt: "Macedonia Outreach logo", href: "/events/macedonia-outreach", cta: "Learn about the mission" },
];

const groupCategories: { label: string; icon: LucideIcon; groups: string[] }[] = [
  { label: "Brothers' Fellowships", icon: Users, groups: ["Gideonite Brothers", "Blessed Brothers", "Victory Brothers", "Men's Group"] },
  { label: "Sisters' Fellowships", icon: Heart, groups: ["Mother in Israel", "Blessed Sisters", "Glorious Sisters", "Virtuous Women", "Sisters of Grace", "Mercy Group", "Unity Sisters"] },
  { label: "Generations", icon: Sparkles, groups: ["Children's Ministry", "Youth & Young Adults"] },
  { label: "Service & Departments", icon: Wrench, groups: ["Ushers", "Protocols", "Publication Team", "Hall Renting Committee"] },
];

export default function MinistriesPage() {
  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 760, height: 460, background: "radial-gradient(circle,rgba(214,40,40,.3),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 16s ease-in-out infinite" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Ministries</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px,6.5vw,92px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 0.95, textWrap: "balance" }}>
            <RevealText immediate>There&apos;s a place</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ background: "linear-gradient(100deg,#F15F22,#D62828,#E8A33D)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              for you here.
            </RevealText>
          </h1>
          <Reveal delay={360}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,247,239,.72)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto", textWrap: "pretty" }}>
              We were never meant to do faith alone. Find a family within the family — a place to grow, to serve, and to belong.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22 }}>
          {ministries.map((m, i) => (
            <Reveal key={m.name} delay={(i % 3) * 90}>
              <div className="card-lift" style={{ height: "100%", borderRadius: 24, overflow: "hidden", background: "var(--paper)", border: "1px solid var(--line)", boxShadow: "0 14px 34px rgba(27,19,14,.08)", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", height: 200, background: m.image ? "#0F1F0F" : m.gradient }}>
                  <span style={{ position: "absolute", top: 16, left: 16, width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,.18)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", border: "1px solid rgba(255,255,255,.25)", zIndex: 2 }}>
                    <m.icon size={22} strokeWidth={1.85} color="#fff" aria-hidden />
                  </span>
                  {m.image ? (
                    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: "20px 28px" }}>
                      <Image src={m.image} alt={m.alt ?? m.name} width={960} height={720} style={{ maxHeight: 130, width: "auto", height: "auto", maxWidth: "100%", objectFit: "contain" }} />
                    </div>
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                      <m.icon size={64} strokeWidth={1.4} color="rgba(255,255,255,.9)" aria-hidden />
                    </div>
                  )}
                </div>
                <div style={{ padding: "24px 26px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, letterSpacing: "-.4px", color: "var(--ink)", margin: "0 0 10px" }}>{m.name}</h3>
                  <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65, margin: "0 0 20px" }}>{m.desc}</p>
                  {m.href.startsWith("http") ? (
                    <a href={m.href} target="_blank" rel="noopener noreferrer" className="press" style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
                      {m.cta} <span aria-hidden style={{ fontSize: 16 }}>→</span>
                    </a>
                  ) : (
                    <Link href={m.href} className="press" style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
                      {m.cta} <span aria-hidden style={{ fontSize: 16 }}>→</span>
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Fellowships & groups */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>The wider family</span>
          </Reveal>
          <Reveal delay={80} style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.4vw,56px)", letterSpacing: "-1.2px", color: "var(--ink)", margin: 0, lineHeight: 0.98, textWrap: "balance" }}>
              Fellowships &amp; groups
            </h2>
            <p style={{ fontSize: "clamp(15px,1.7vw,18px)", color: "var(--ink-soft)", lineHeight: 1.7, margin: "16px auto 0", maxWidth: 600 }}>
              Beyond Sunday, the Salvation Center is a web of fellowships, bands, and teams — every one a place to belong and to serve.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {groupCategories.map((cat, i) => (
              <Reveal key={cat.label} delay={(i % 4) * 80}>
                <div style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 24, padding: "28px 26px", boxShadow: "0 12px 30px rgba(27,19,14,.06)", display: "flex", flexDirection: "column" }}>
                  <span style={{ display: "grid", placeItems: "center", width: 48, height: 48, borderRadius: 14, background: "linear-gradient(140deg,var(--flame),var(--red))", marginBottom: 18, boxShadow: "0 8px 20px rgba(214,40,40,.26)" }}>
                    <cat.icon size={22} strokeWidth={1.9} color="#fff" aria-hidden />
                  </span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-.3px", color: "var(--ink)", margin: "0 0 16px", lineHeight: 1.15 }}>{cat.label}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {cat.groups.map((g) => (
                      <span key={g} style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", background: "var(--cream-2)", border: "1px solid var(--line)", padding: "7px 13px", borderRadius: 999 }}>{g}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,58px)", letterSpacing: "-1.2px", color: "var(--cream)", margin: "0 0 16px", lineHeight: 0.96 }}>Not sure where you fit?</h2>
          <p style={{ fontSize: 17, color: "rgba(255,247,239,.6)", margin: "0 0 36px" }}>Fill the serve form and we&apos;ll connect you with the right team or fellowship.</p>
          <Link href="/contact" className="btn-sheen press-lg" style={{ display: "inline-block", background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 34px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 34px rgba(214,40,40,.4)" }}>
            Fill the serve form →
          </Link>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
