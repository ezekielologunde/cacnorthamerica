import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { conventionYears, sessionsFor, getDetailedSchedule, dateRangeLabel, CONVENTION_VENUE, type ConventionYear } from "@/lib/conventions";

export const revalidate = 3600;

// 2026 has its own hand-built schedule at app/events/cacna-2026/schedule
// (real per-session data), and 2019/2020/2024 have no detail page at all --
// this "what to expect" template only makes sense for years still ahead, so
// it only ever actually renders for 2027+.
const FUTURE_YEARS = conventionYears.filter((cy) => cy.year > 2026);

function findYear(slug: string): ConventionYear | undefined {
  const match = /^cacna-(\d{4})$/.exec(slug);
  if (!match) return undefined;
  return FUTURE_YEARS.find((cy) => cy.year === Number(match[1]));
}

export function generateStaticParams() {
  return FUTURE_YEARS.map((cy) => ({ slug: `cacna-${cy.year}` }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cy = findYear(slug);
  if (!cy) return {};
  return {
    title: `Schedule — CACNA ${cy.year} Annual Convention`,
    description: `The day-by-day schedule for the CACNA ${cy.year} Annual Convention at ${CONVENTION_VENUE}.`,
    alternates: { canonical: `/events/cacna-${cy.year}/schedule` },
  };
}

export default async function SchedulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cy = findYear(slug);
  if (!cy) notFound();

  const detailed = getDetailedSchedule(cy.year);

  return (
    <main id="main-content">
      <Nav heroDark />

      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 70px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href={cy.href} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 24 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> CACNA {cy.year}
            </Link>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px,5vw,58px)", letterSpacing: "-0.03em", color: "#fff", margin: 0, lineHeight: 1 }}>
            <RevealText immediate>Schedule</RevealText>
          </h1>
          <Reveal delay={140}>
            <p style={{ marginTop: 14, fontSize: 15, color: "rgba(245,246,250,.65)" }}>{dateRangeLabel(cy)} · {CONVENTION_VENUE}</p>
          </Reveal>
          {!detailed && (
            <Reveal delay={200}>
              <p style={{ marginTop: 18, fontSize: 14, color: "rgba(245,246,250,.55)", maxWidth: 560 }}>
                Session-by-session detail (speakers, exact times) hasn&apos;t been announced yet — shown below is the recurring six-day rhythm the convention has followed every year.
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <section style={{ background: "var(--cream)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          {detailed ? (
            (() => {
              const byDay = new Map<string, typeof detailed>();
              for (const s of detailed) byDay.set(s.dayIso, [...(byDay.get(s.dayIso) ?? []), s]);
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                  {Array.from(byDay.entries()).map(([dayIso, daySessions], di) => (
                    <Reveal key={dayIso} delay={di * 40}>
                      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--red)", margin: "0 0 14px" }}>{dayIso}</h2>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {daySessions.map((s, i) => (
                          <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "16px 20px" }}>
                            <div style={{ flexShrink: 0, minWidth: 92, fontSize: 13, fontWeight: 700, color: "var(--flame)" }}>{s.startsAt}–{s.endsAt}</div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{s.title}</div>
                              {s.ministerName && <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 2 }}>{s.ministerName}{s.ministerTitle ? ` — ${s.ministerTitle}` : ""}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Reveal>
                  ))}
                </div>
              );
            })()
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sessionsFor(cy).map((s, i) => (
                <Reveal key={s.day} delay={i * 60}>
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 24px" }}>
                    <div style={{ flexShrink: 0, minWidth: 92, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--flame)" }}>{s.day}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)", marginBottom: 4 }}>{s.label}</div>
                      <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
