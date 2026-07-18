import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import Link from "next/link";
import Image from "next/image";
import { Music, HeartHandshake, Sparkles, HandHeart, Video, Wrench, Globe, ShieldCheck, BookOpen, Users2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata = {
  title: "Ministries — Christ Apostolic Church North America (CACNA)",
  description:
    "The departments serving every CACNA zone — Administration, Christian Education, Evangelism, Missions, Music, Welfare & Outreach, ICT, and more.",
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
  { name: "Administration", desc: "Coordinating the presidency and regional leadership that guides CACNA's 16 DCCs and Zones.", icon: Wrench, gradient: "linear-gradient(140deg,var(--red),var(--flame))", href: "/leadership", cta: "Meet our leadership" },
  { name: "Christian Education", desc: "Grounding believers across every zone in sound biblical teaching and discipleship.", icon: BookOpen, gradient: "linear-gradient(140deg,var(--flame),var(--gold))", href: "/contact", cta: "Learn more" },
  { name: "Evangelism, Prayer & Counselling", desc: "Carrying the whole Gospel to the lost and standing in the gap in prayer for our churches and cities.", icon: HandHeart, gradient: "linear-gradient(140deg,var(--red),var(--red-deep))", href: "/prayer", cta: "Join in prayer" },
  { name: "Youth & Young Adult", desc: "Raising the next generation as bold, grounded ambassadors of Christ across every CACNA zone.", icon: Sparkles, gradient: "linear-gradient(140deg,var(--red-deep),var(--red))", href: "/contact", cta: "Get involved" },
  { name: "Missions", desc: "Reaching forgotten and hard-to-reach communities — including the annual Macedonia Outreach to rural ministers.", icon: Globe, gradient: "linear-gradient(140deg,#1B4332,#2D6A4F)", href: "/events/macedonia-outreach", cta: "Learn about the mission" },
  { name: "Music", desc: "Spirit-filled praise and worship carried across CACNA's member churches and the Annual Convention.", icon: Music, gradient: "linear-gradient(140deg,var(--gold),var(--flame))", href: "/contact", cta: "Serve in music" },
  { name: "Welfare & Outreach", desc: "Meeting practical needs and extending Christ's love to members and communities in every zone.", icon: HeartHandshake, gradient: "linear-gradient(140deg,var(--flame),var(--red))", href: "/contact", cta: "Learn more" },
  { name: "ICT & Technical", desc: "Powering CACNA's livestreams, media, and digital presence so the Gospel reaches every home.", icon: Video, gradient: "linear-gradient(140deg,var(--ink),var(--red-deep))", href: "/online", cta: "Watch online" },
  { name: "CAC Good Women Association", desc: "Women across CACNA growing together in faith, prayer, and service.", icon: Users2, gradient: "linear-gradient(140deg,var(--gold),var(--red))", href: "/contact", cta: "Connect" },
  { name: "CAC Men Association (CACMA)", desc: "Men across every CACNA zone standing together in discipleship and service.", icon: ShieldCheck, gradient: "linear-gradient(140deg,var(--red-deep),var(--ink))", href: "/contact", cta: "Connect" },
];

export default function MinistriesPage() {
  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 760, height: 460, background: "radial-gradient(circle,rgba(30,58,107,.3),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 16s ease-in-out infinite" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Ministries</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px,6.5vw,92px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 0.95, textWrap: "balance" }}>
            <RevealText immediate>There&apos;s a place</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ background: "linear-gradient(100deg,#3D5FA1,#1E3A6B,#E8A33D)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              for you here.
            </RevealText>
          </h1>
          <Reveal delay={360}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,247,239,.72)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto", textWrap: "pretty" }}>
              CACNA&apos;s departments serve every member church across the United States and Canada — a place to grow, to serve, and to belong.
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

      {/* CTA */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,58px)", letterSpacing: "-1.2px", color: "var(--cream)", margin: "0 0 16px", lineHeight: 0.96 }}>Not sure where you fit?</h2>
          <p style={{ fontSize: 17, color: "rgba(255,247,239,.6)", margin: "0 0 36px" }}>Reach out and we&apos;ll connect you with the right department or zone.</p>
          <Link href="/contact" className="btn-sheen press-lg" style={{ display: "inline-block", background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 34px", borderRadius: 999, textDecoration: "none", boxShadow: "0 16px 34px rgba(30,58,107,.4)" }}>
            Fill the serve form →
          </Link>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
