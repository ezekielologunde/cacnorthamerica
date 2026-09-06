import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import Link from "next/link";
import { getSermons, getLiveStream, formatSermonDate } from "@/lib/sermons";
import { PRAYER_LINE } from "@/lib/prayerLine";
import { Video } from "lucide-react";
import { archiveEntries } from "@/lib/archive";
import { ArchiveBrowser } from "@/components/media/ArchiveBrowser";
import { currentOrNextConvention, getConventionState } from "@/lib/conventions";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";

const YOUTUBE_URL = "https://youtube.com/@cacnorthamericalatunderegi1330";
const YOUTUBE_LIVE_URL = "https://www.youtube.com/@cacnorthamericalatunderegi1330/live";
// The channel's running "ANNUAL PROGRAM" playlist -- ported from the
// Convention site's /live page during the Phase C content merge (2026-09).
// Unlike the single-video featured player above (whichever one video the
// YouTube Data API currently reports live), this aggregates every session
// uploaded during convention week into one continuously-updating embed --
// shown only while the convention is actually underway.
const CONVENTION_SESSIONS_PLAYLIST_ID = "PLhXt6OVepbyjadJt8WufxY-5Mt5OAjsSf";

const platforms = [
  { name: "YouTube", desc: "The Annual Convention & message replays", href: YOUTUBE_URL },
  { name: "Instagram", desc: "Updates from across CACNA", href: "https://instagram.com/cacnorthamericalatunderegion" },
];

const schedule = [
  {
    day: "Daily",
    name: PRAYER_LINE.name,
    time: PRAYER_LINE.times.map((t) => `${t.label} ${t.zone}`).join(" / "),
    type: `${PRAYER_LINE.dialIn} · Code: ${PRAYER_LINE.code}`,
  },
  { day: "July", name: "CACNA Annual Convention", time: "CAC Village, PA", type: "Streamed on YouTube & Zoom" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}/online`]));
  return {
    title: "Watch Online — Christ Apostolic Church North America (CACNA)",
    description: "Watch CACNA's Annual Convention and message replays online, and browse the full media archive back to 2022 — on YouTube, with Zoom available during the convention.",
    alternates: { canonical: `${SITE_URL}/${locale}/online`, languages },
  };
}

export default async function OnlinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Live");

  const [live, pastSermons] = await Promise.all([getLiveStream(), getSermons(9)]);
  const featured = live ?? pastSermons[0];
  const cy = currentOrNextConvention();
  const conventionIsLive = getConventionState(cy) === "live";
  return (
    <main id="main-content" style={{ background: "#0C0E13", minHeight: "100vh" }}>
      <Nav dark />

      {/* Hero */}
      <section style={{ padding: "140px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,30,58,.25),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", background: "rgba(253,200,65,.12)", border: "1px solid rgba(253,200,65,.25)", padding: "6px 16px", borderRadius: 999 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--red)", animation: "pulse-red 1.8s infinite", display: "inline-block" }} />
              Annual Convention · Streamed Live
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(48px,7vw,100px)", letterSpacing: "-2px", color: "#fff", margin: "20px 0", lineHeight: .92 }}>
              Worship from<br />
              <span style={{ color: "var(--red)" }}>Anywhere.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,255,255,.55)", lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
              The Annual Convention streams live, and messages are available on demand. The full experience — wherever you are.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Watch on YouTube — the primary action */}
      <section style={{ padding: "0 clamp(20px,5vw,64px) 56px" }}>
        <Reveal>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="btn-sheen card-lift" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(20px,3vw,40px)", maxWidth: 900, margin: "0 auto", background: "linear-gradient(120deg,var(--red),var(--red-deep))", borderRadius: 28, padding: "clamp(28px,4vw,44px)", textDecoration: "none", boxShadow: "0 30px 70px rgba(200,30,58,.35)" }}>
            <span style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 20, background: "rgba(255,255,255,.18)", display: "grid", placeItems: "center", border: "1px solid rgba(255,255,255,.3)" }}>
              <Video size={36} color="#fff" strokeWidth={1.8} aria-hidden />
            </span>
            <div style={{ flex: "1 1 260px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,.9)", marginBottom: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", animation: "pulse-red 1.8s infinite", display: "inline-block" }} /> Watch on YouTube
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.4vw,40px)", letterSpacing: "-1px", color: "#fff", margin: "0 0 6px" }}>CAC North America (Latunde Region)</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.88)", margin: 0 }}>The Annual Convention and message replays — Zoom is also available during convention week.</p>
            </div>
            <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "var(--red-deep)", fontWeight: 800, fontSize: 16, padding: "15px 28px", borderRadius: 999 }}>
              Open YouTube →
            </span>
          </a>
        </Reveal>
      </section>

      {/* Convention week: every session, as they're uploaded */}
      {conventionIsLive && (
        <section style={{ padding: "0 clamp(20px,5vw,64px) 56px" }}>
          <Reveal>
            <div style={{ maxWidth: 900, margin: "0 auto", borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.5)", border: "1px solid rgba(253,200,65,.3)" }}>
              <div style={{ background: "#161B22", padding: "18px 26px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "var(--gold)", letterSpacing: "1px" }}>● CONVENTION {cy.year} · LIVE THIS WEEK</span>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "#fff", margin: "6px 0 0" }}>Every session, as it happens.</h2>
                </div>
                <a href={YOUTUBE_LIVE_URL} target="_blank" rel="noopener noreferrer" className="press" style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 14, padding: "12px 22px", borderRadius: 999, textDecoration: "none" }}>
                  {t("watchLiveCta")} →
                </a>
              </div>
              <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/videoseries?list=${CONVENTION_SESSIONS_PLAYLIST_ID}`}
                  title="CACNA Annual Convention — full session playlist"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Featured player — latest streamed message */}
      {featured && (
      <section style={{ padding: "0 clamp(20px,5vw,64px) 80px" }}>
        <Reveal>
          <div style={{ maxWidth: 900, margin: "0 auto", borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.5)" }}>
            <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${featured.id}`}
                title={featured.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
            <div style={{ background: "#161B22", padding: "20px 28px", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              {live
                ? <span style={{ fontSize: 12, fontWeight: 700, color: "var(--red)", marginRight: 8, animation: "pulse-red 1.8s infinite" }}>● LIVE NOW</span>
                : <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", marginRight: 8 }}>● Latest message</span>
              }
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontWeight: 600, marginRight: 4 }}>Watch on:</span>
              {platforms.map(p => (
                <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.7)", textDecoration: "none", padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,.12)" }}>
                  {p.name}
                </a>
              ))}
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: "var(--gold)", textDecoration: "none" }}>
                View channel →
              </a>
            </div>
          </div>
        </Reveal>
      </section>
      )}

      {/* Past messages grid */}
      {pastSermons.length > 0 && (
      <section style={{ padding: "20px clamp(20px,5vw,64px) 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,36px)", letterSpacing: "-.8px", color: "#fff", margin: 0 }}>
              Past Messages
            </h2>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)", textDecoration: "none", whiteSpace: "nowrap" }}>
              All videos →
            </a>
          </Reveal>
          <div className="r3" style={{ gap: 20 }}>
            {pastSermons.map((v, i) => (
              <Reveal key={v.id} delay={i * 80}>
                <a
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-lift-border"
                  style={{ display: "block", textDecoration: "none", borderRadius: 18, overflow: "hidden", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)" }}
                >
                  <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%" }}>
                    <Image
                      src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,.4)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--red)" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 18px 18px" }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>{v.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 6 }}>{formatSermonDate(v.published)}</div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Full archive, year-grouped, filterable */}
      <section style={{ padding: "20px clamp(20px,5vw,64px) 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,38px)", letterSpacing: "-.8px", color: "#fff", margin: "0 0 8px" }}>
              The Full Archive
            </h2>
            <p style={{ fontSize: 14.5, color: "rgba(255,255,255,.45)", margin: 0 }}>
              Every message since 2022 — filter by type, or scroll through year by year.
            </p>
          </Reveal>
          <ArchiveBrowser entries={archiveEntries} />
        </div>
      </section>

      {/* Platforms */}
      <section style={{ padding: "20px clamp(20px,5vw,64px) 60px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", color: "#fff", margin: 0 }}>All the platforms.</h2>
          </Reveal>
          <div className="r2" style={{ gap: 14 }}>
            {platforms.map((p, i) => (
              <Reveal key={p.name} delay={i * 60}>
                <a href={p.href} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "rgba(255,255,255,.05)", borderRadius: 18, padding: "22px 20px", border: "1px solid rgba(255,255,255,.08)", textDecoration: "none" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 5 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>{p.desc}</div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section style={{ padding: "20px clamp(20px,5vw,64px) 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", color: "#fff", margin: 0 }}>Service schedule.</h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {schedule.map((s, i) => (
              <Reveal key={s.name} delay={i * 60}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: "rgba(255,255,255,.05)", borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 4 }}>{s.day}</div>
                    <div style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>{s.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "#fff" }}>{s.time}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 2 }}>{s.type}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
