import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { PhotoStrip } from "@/components/ministries/PhotoStrip";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export type ExecutiveMember = { name: string; title: string };

export type AgendaItem = { time?: string; event: string; speaker?: string };
export type ScheduleBlock = { dayLabel: string; timeRange?: string; agenda: AgendaItem[] };

export type SubConferencePageProps = {
  kicker: string;
  headingLines: [string, string];
  intro: string;
  theme?: string;
  leaderLabel?: string;
  leaderNames?: string[];
  highlight?: { label: string; text: string };
  executive?: ExecutiveMember[];
  /** Overrides the section heading above `executive` — defaults to "Executive
   *  Committee". Use for lists that aren't actually a standing committee
   *  (e.g. a year's convention speakers, some of whom may not even be CAC
   *  clergy), so the label doesn't misrepresent who these people are. */
  executiveLabel?: string;
  historyParagraphs?: string[];
  /** Day-by-day convention schedule for this ministry — ported from
   *  Convention's own per-ministry program pages during the Phase D content
   *  merge (2026-09). Rendered as its own section, right before the honest
   *  note / CTA. */
  schedule?: ScheduleBlock[];
  scheduleYear?: number;
  /** A real 3-photo strip from the 2025 convention gallery, right under the
   *  hero — ported from Convention's own per-ministry pages during the
   *  Phase H data-completeness audit (2026-09). */
  photoStrip?: { photos: string[]; caption: string };
  note?: string;
  relatedLink?: { href: string; label: string };
};

export async function SubConferencePage({
  kicker,
  headingLines,
  intro,
  theme,
  leaderLabel,
  leaderNames,
  highlight,
  executive,
  executiveLabel,
  historyParagraphs,
  schedule,
  scheduleYear,
  photoStrip,
  note,
  relatedLink,
}: SubConferencePageProps) {
  const t = await getTranslations("SubMinistry");
  const resolvedExecutiveLabel = executiveLabel ?? t("executiveHeading");
  return (
    <main id="main-content">
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 760, height: 460, background: "radial-gradient(circle,rgba(200,30,58,.3),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal from="scale">
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>{kicker}</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,76px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0", lineHeight: 1.02, textWrap: "balance" }}>
            <RevealText immediate>{headingLines[0]}</RevealText>
            <br />
            <RevealText immediate delay={0.15} style={{ color: "var(--red)" }}>
              {headingLines[1]}
            </RevealText>
          </h1>
          <Reveal delay={360}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(245,246,250,.72)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto", textWrap: "pretty" }}>
              {intro}
            </p>
          </Reveal>
        </div>
      </section>

      {photoStrip && (
        <section style={{ background: "var(--cream)", paddingBottom: 10 }}>
          <PhotoStrip photos={photoStrip.photos} caption={photoStrip.caption} />
        </section>
      )}

      {/* Identity: theme + leadership */}
      {(theme || (leaderNames && leaderNames.length > 0)) && (
        <section style={{ background: "var(--cream)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px) 0" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: theme && leaderNames?.length ? "repeat(auto-fit,minmax(240px,1fr))" : "1fr", gap: 14 }}>
            {theme && (
              <Reveal>
                <div style={{ borderRadius: 18, padding: "22px 24px", background: "var(--paper)", border: "1px solid var(--line)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>Theme</div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink)", margin: 0, lineHeight: 1.4 }}>&ldquo;{theme}&rdquo;</p>
                </div>
              </Reveal>
            )}
            {leaderNames && leaderNames.length > 0 && (
              <Reveal delay={80}>
                <div style={{ borderRadius: 18, padding: "22px 24px", background: "var(--paper)", border: "1px solid var(--line)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>{leaderLabel ?? "Leader"}</div>
                  {leaderNames.map((n) => (
                    <p key={n} style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink)", margin: 0, lineHeight: 1.4 }}>{n}</p>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Highlight quote */}
      {highlight && (
        <section style={{ background: "var(--cream)", padding: "clamp(40px,5vw,56px) clamp(20px,5vw,64px)" }}>
          <Reveal>
            <div style={{ maxWidth: 780, margin: "0 auto", borderRadius: 22, padding: "clamp(26px,3vw,36px)", background: "linear-gradient(140deg,var(--red-deep),var(--ink))", boxShadow: "0 18px 36px rgba(200,30,58,.2)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>{highlight.label}</div>
              <p style={{ fontSize: 16.5, color: "#fff", lineHeight: 1.75, margin: 0 }}>{highlight.text}</p>
            </div>
          </Reveal>
        </section>
      )}

      {/* History */}
      {historyParagraphs && historyParagraphs.length > 0 && (
        <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <Reveal>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>History</span>
            </Reveal>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              {historyParagraphs.map((p, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.8, margin: 0 }}>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Executive committee */}
      {executive && executive.length > 0 && (
        <section style={{ background: "var(--cream-2)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <Reveal style={{ textAlign: "center", marginBottom: 36 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>{resolvedExecutiveLabel}</span>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
              {executive.map((m, i) => (
                <Reveal key={m.name} delay={(i % 4) * 60}>
                  <div style={{ height: "100%", borderRadius: 16, padding: "18px 20px", background: "var(--paper)", border: "1px solid var(--line)" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15.5, color: "var(--ink)", lineHeight: 1.3, marginBottom: 4 }}>{m.name}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{m.title}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Convention schedule */}
      {schedule && schedule.length > 0 && (
        <section style={{ background: "var(--paper)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>
                {scheduleYear ? `${scheduleYear} Convention Schedule` : "Convention Schedule"}
              </span>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {schedule.map((block, i) => (
                <Reveal key={`${block.dayLabel}-${i}`} delay={i * 60}>
                  <div>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: 0 }}>{block.dayLabel}</h3>
                      {block.timeRange && <span style={{ fontSize: 13, fontWeight: 600, color: "var(--red)" }}>{block.timeRange}</span>}
                    </div>
                    <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0, borderLeft: "2px solid var(--line)" }}>
                      {block.agenda.map((item, j) => (
                        <li key={j} style={{ position: "relative", padding: "0 0 16px 22px" }}>
                          <span aria-hidden style={{ position: "absolute", left: -5, top: 4, width: 8, height: 8, borderRadius: "50%", background: "var(--red)" }} />
                          {item.time && (
                            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 2 }}>{item.time}</div>
                          )}
                          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", lineHeight: 1.4 }}>{item.event}</div>
                          {item.speaker && (
                            <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>{item.speaker}</div>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Honest note (e.g. content gap disclosure) */}
      {note && (
        <section style={{ background: "var(--paper)", padding: "0 clamp(20px,5vw,64px) clamp(56px,7vw,90px)" }}>
          <Reveal>
            <p style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7, fontStyle: "italic" }}>{note}</p>
          </Reveal>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: "var(--ink)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,54px)", letterSpacing: "-1.2px", color: "var(--cream)", margin: "0 0 16px", lineHeight: 0.98 }}>
            Connect with us.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(245,246,250,.6)", margin: "0 0 32px" }}>
            Reach out to learn more or get involved.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
            <Link
              href="/contact"
              className="press-lg"
              style={{ display: "inline-block", background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 34px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(200,30,58,.4)" }}
            >
              Contact Us →
            </Link>
            {relatedLink && (
              <Link
                href={relatedLink.href}
                className="press-lg"
                style={{ display: "inline-block", background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 16, padding: "17px 34px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}
              >
                {relatedLink.label}
              </Link>
            )}
          </div>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
