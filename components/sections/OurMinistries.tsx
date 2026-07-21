import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { BookOpen, HandHeart, Music, Landmark, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type MinistryTeaser = { name: string; desc: string; icon: LucideIcon; gradient: string };

// Same verbatim source descriptions as the full /ministries page (2026-07-21).
const featured: MinistryTeaser[] = [
  { name: "Presidency", desc: "Administers and carries out policies formulated by the General Executive Council of the church.", icon: Landmark, gradient: "linear-gradient(140deg,var(--red-deep),var(--ink))" },
  { name: "Christian Education", desc: "An established concept in Christ Apostolic Church from inception, founded by the progenitors of the church.", icon: BookOpen, gradient: "linear-gradient(140deg,var(--flame),var(--gold))" },
  { name: "Evangelism, Prayer & Counselling", desc: "Leads all evangelical efforts and prophecy of the church.", icon: HandHeart, gradient: "linear-gradient(140deg,var(--ember),var(--red-deep))" },
  { name: "Music", desc: "The formation of choir groups, dating back to the very foundations of the church.", icon: Music, gradient: "linear-gradient(140deg,var(--gold),var(--flame))" },
];

/** Replaces the old "How We Gather" annual-events rundown — that framing
 *  read like a single congregation's service schedule, which CACNA isn't;
 *  this instead answers the more important question of what CACNA actually
 *  does as a regional body, via its real ministry departments. */
export function OurMinistries() {
  return (
    <section style={{ background: "var(--cream)", padding: "100px clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>
            What We Do
          </span>
        </Reveal>
        <Reveal delay={80} style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5vw,68px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: 0, lineHeight: .95 }}>
            Our Ministries
          </h2>
          <p style={{ fontSize: 16, color: "var(--ink-soft)", maxWidth: 560, margin: "16px auto 0" }}>
            CACNA is the corporate family of Christ Apostolic Church across North America — part of the wider CAC movement headquartered in Nigeria. These departments carry that work into every zone.
          </p>
        </Reveal>

        <div className="r4" style={{ gap: 20 }}>
          {featured.map((m, i) => {
            const Icon = m.icon;
            return (
              <Reveal key={m.name} delay={i * 100}>
                <div style={{
                  borderRadius: 24, padding: "32px 26px", height: "100%",
                  background: "var(--paper)", border: "1px solid var(--line)",
                  boxShadow: "0 10px 26px rgba(18,20,30,.06)",
                  display: "flex", flexDirection: "column",
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, background: m.gradient,
                    display: "grid", placeItems: "center", marginBottom: 20,
                  }}>
                    <Icon size={24} strokeWidth={2} color="#fff" aria-hidden />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "var(--ink)", letterSpacing: "-.3px", margin: "0 0 10px", lineHeight: 1.2 }}>
                    {m.name}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0, flex: 1 }}>
                    {m.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={400} style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/ministries" className="press" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontWeight: 700, fontSize: 15, color: "var(--red)", textDecoration: "none",
          }}>
            See all our ministries <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
