import Link from "next/link";
import Image from "next/image";
import { ConventionNav } from "@/components/convention/ConventionNav";
import { ConventionFooter } from "@/components/convention/ConventionFooter";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import { ExecutiveGrid } from "@/components/convention/ExecutiveGrid";
import { welcomeMessage, aboutConvention, history, leadership, committee } from "@/lib/convention/about";

export const metadata = {
  title: "About — CACNA Convention",
  description: "The story, mission, leadership, and committee behind the CACNA Annual Convention.",
  alternates: { canonical: "/convention/about" },
};

export default function ConventionAboutPage() {
  return (
    <main>
      <ConventionNav />
      <ConventionPageHero eyebrow="About" title="About the Convention" />

      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 48 }}>

          <Reveal>
            {welcomeMessage.paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: 14 }}>{p}</p>
            ))}
          </Reveal>

          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 14px" }}>Our Mission</h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 20 }}>{aboutConvention.missionStatement}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: "var(--red)", marginBottom: 10 }}>Biblically Based</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {aboutConvention.biblicallyBased.map((item) => (
                    <li key={item} style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: "var(--red)", marginBottom: 10 }}>Kingdom Focused</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {aboutConvention.kingdomFocused.map((item) => (
                    <li key={item} style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 14px" }}>Our Story</h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 12 }}>{history.summary}</p>
            <Link href="/about" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--red)", textDecoration: "underline" }}>
              Read CACNA&apos;s full story →
            </Link>
          </Reveal>

          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 20px" }}>Leadership</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
              {leadership.map((l) => (
                <div key={l.name} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1" }}>
                    <Image src={l.photo} alt={l.name} fill sizes="240px" style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)" }}>{l.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4, lineHeight: 1.5 }}>{l.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <ExecutiveGrid people={committee} title="Convention & Conference Committee" />
          </Reveal>

          <Reveal>
            <div style={{ background: "var(--cream-2)", borderRadius: 16, padding: "18px 22px" }}>
              <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                CACNA is shepherded by superintendents across 24 Zones and DCCs in the U.S. and Canada. See the full{" "}
                <Link href="/zones" style={{ color: "var(--red)", fontWeight: 700, textDecoration: "underline" }}>Zones</Link>
                {" "}and{" "}
                <Link href="/dccs" style={{ color: "var(--red)", fontWeight: 700, textDecoration: "underline" }}>DCCs</Link>
                {" "}directories.
              </p>
            </div>
          </Reveal>

        </div>
      </section>

      <ConventionFooter />
    </main>
  );
}
