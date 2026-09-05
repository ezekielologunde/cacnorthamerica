import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { getDetailedSchedule, CONVENTION_VENUE } from "@/lib/conventions";

export const metadata = {
  title: "2026 Schedule — CACNA Annual Convention",
  description: "The full day-by-day schedule from the CACNA 2026 Annual Convention at CAC Village, Blue Ridge Summit, PA — kept as an archive record.",
  alternates: { canonical: "/events/cacna-2026/schedule" },
};

const DAY_NAMES: Record<string, string> = {
  "2026-07-13": "Mon · Jul 13", "2026-07-14": "Tue · Jul 14", "2026-07-15": "Wed · Jul 15",
  "2026-07-16": "Thu · Jul 16", "2026-07-17": "Fri · Jul 17", "2026-07-18": "Sat · Jul 18",
};

export default function Cacna2026SchedulePage() {
  const sessions = getDetailedSchedule(2026)!;
  const byDay = new Map<string, typeof sessions>();
  for (const s of sessions) {
    byDay.set(s.dayIso, [...(byDay.get(s.dayIso) ?? []), s]);
  }

  return (
    <main id="main-content">
      <Nav heroDark />

      <div role="status" style={{ background: "#2c2825", padding: "13px clamp(20px,5vw,64px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px 20px", fontSize: 14, fontWeight: 600, color: "rgba(245,246,250,.7)" }}>
        <span>The 2026 convention has come and gone — this schedule is kept as an archive.</span>
        <Link href="/events/cacna-2026" style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>Back to CACNA 2026 →</Link>
      </div>

      <section style={{ background: "var(--ink)", padding: "80px clamp(20px,5vw,64px) 70px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/events/cacna-2026" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 24 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> CACNA 2026
            </Link>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px,5vw,58px)", letterSpacing: "-0.03em", color: "#fff", margin: 0, lineHeight: 1 }}>
            <RevealText immediate>Full Schedule</RevealText>
          </h1>
          <Reveal delay={140}>
            <p style={{ marginTop: 14, fontSize: 15, color: "rgba(245,246,250,.65)" }}>{CONVENTION_VENUE}</p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--cream)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
          {Array.from(byDay.entries()).map(([dayIso, daySessions], di) => (
            <Reveal key={dayIso} delay={di * 40}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--red)", margin: "0 0 14px" }}>
                {DAY_NAMES[dayIso] ?? dayIso}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {daySessions.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "16px 20px" }}>
                    <div style={{ flexShrink: 0, minWidth: 92, fontSize: 13, fontWeight: 700, color: "var(--flame)" }}>{s.startsAt}–{s.endsAt}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{s.title}</div>
                      {s.ministerName && (
                        <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 2 }}>{s.ministerName}{s.ministerTitle ? ` — ${s.ministerTitle}` : ""}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
