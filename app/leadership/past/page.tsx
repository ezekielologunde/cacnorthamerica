import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLeaders, type Leader } from "@/lib/leaders";

export const revalidate = 3600;

export const metadata = {
  title: "Past Leaders — Christ Apostolic Church North America (CACNA)",
  description: "The past Presidents, General Superintendents, and General Evangelists of Christ Apostolic Church Worldwide.",
  alternates: { canonical: "/leadership/past" },
};

const SECTIONS: { category: Leader["category"]; label: string }[] = [
  { category: "past_president", label: "Past Presidents" },
  { category: "past_superintendent", label: "Past General Superintendents" },
  { category: "past_evangelist", label: "Past General Evangelists" },
];

export default async function PastLeadersPage() {
  const leaders = await getLeaders(["past_president", "past_superintendent", "past_evangelist"]);

  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -100, width: 640, height: 500, background: "radial-gradient(circle,rgba(253,200,65,.2),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/leadership" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 28 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> Leadership
            </Link>
          </Reveal>
          <Reveal delay={60}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Our history</span>
          </Reveal>
          <Reveal delay={120}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,76px)", letterSpacing: "-2px", color: "#fff", margin: "16px 0", lineHeight: .95 }}>
              Those who came before.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(245,246,250,.72)", lineHeight: 1.65, maxWidth: 620 }}>
              Christ Apostolic Church Worldwide stands on the ministry of the leaders who carried this mandate before us.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Sections */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 56 }}>
          {SECTIONS.map(({ category, label }) => {
            const people = leaders.filter((l) => l.category === category);
            if (people.length === 0) return null;
            return (
              <div key={category}>
                <Reveal style={{ marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,36px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0 }}>{label}</h2>
                </Reveal>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {people.map((p, i) => (
                    <Reveal key={p.id} delay={i * 60}>
                      <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "22px 24px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 12px", marginBottom: p.bio ? 10 : 0 }}>
                          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: 0 }}>{p.full_name}</h3>
                          <span style={{ fontSize: 13.5, color: "var(--red)", fontWeight: 700 }}>{p.title}</span>
                        </div>
                        {p.bio && <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: 0 }}>{p.bio}</p>}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
