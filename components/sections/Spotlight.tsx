import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { conventionToFeature, currentOrNextConvention, dateRangeLabel, CONVENTION_VENUE_SHORT } from "@/lib/conventions";
import { specialEvents, isEventPast } from "@/lib/events";
import { POSTS } from "@/lib/blog";

/** Everything the homepage might want to spotlight right now — a just-
 *  concluded or live convention, the next dated Convention, the 50th
 *  Anniversary, the Holy Land Pilgrimage promotion, and the latest post —
 *  each shown only while genuinely relevant (not past), so the section
 *  never shows a stale or already-happened item. */
export function Spotlight() {
  const { cy: featuredCy, state } = conventionToFeature();
  const nextCy = currentOrNextConvention();
  const showRecapCard = state === "live" || state === "concluded-recent";

  const anniversary = specialEvents.find((e) => e.id === "cacna-50th-anniversary-2026");
  const pilgrimage = specialEvents.find((e) => e.id === "holy-land-pilgrimage-2026");
  const showAnniversary = anniversary && !isEventPast(anniversary);
  const showPilgrimage = pilgrimage && !isEventPast(pilgrimage);

  const recapPost = POSTS.find((p) => p.slug === "cacna-2026-closing-appreciation");
  const latestPost = [...POSTS]
    .filter((p) => p.slug !== recapPost?.slug)
    .sort((a, b) => b.dateIso.localeCompare(a.dateIso))[0];

  return (
    <section id="whats-happening" style={{ background: "var(--cream)", padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px)", scrollMarginTop: 90 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal style={{ marginBottom: 36, textAlign: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Right now at CACNA</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4vw,50px)", letterSpacing: "-1.2px", color: "var(--ink)", margin: "12px 0 0", lineHeight: 1 }}>
            What&apos;s happening.
          </h2>
        </Reveal>

        <div className="spotlight-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 18 }}>
          {/* Featured: live / just-concluded convention */}
          {showRecapCard && (
            <Reveal style={{ gridColumn: "span 12" }}>
              <div className="spotlight-featured card-lift" style={{
                position: "relative", overflow: "hidden", borderRadius: 28,
                background: "linear-gradient(135deg,#12141E,#2A1420)",
                padding: "clamp(30px,4vw,52px)", minHeight: 220,
                display: "flex", flexDirection: "column", justifyContent: "center",
              }}>
                <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,30,58,.35),transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 2, maxWidth: 680 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EB6342", animation: state === "live" ? "pulse-red 1.8s infinite" : "none", display: "inline-block" }} />
                    <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)" }}>
                      {state === "live" ? "Live Now" : "Just Concluded"}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,38px)", letterSpacing: "-.8px", color: "#fff", margin: "0 0 12px", lineHeight: 1.08 }}>
                    CACNA {featuredCy.year}{featuredCy.theme ? ` — “${featuredCy.theme}”` : ""}
                  </h3>
                  <p style={{ fontSize: 15, color: "rgba(245,246,250,.7)", margin: "0 0 8px" }}>{dateRangeLabel(featuredCy)} · {CONVENTION_VENUE_SHORT}</p>
                  {recapPost?.excerpt && (
                    <p style={{ fontSize: 15.5, color: "rgba(245,246,250,.85)", lineHeight: 1.65, margin: "14px 0 22px", maxWidth: 560 }}>{recapPost.excerpt}</p>
                  )}
                  <Link href={recapPost ? (recapPost.href ?? `/blog/${recapPost.slug}`) : featuredCy.href} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gold)", color: "var(--ink)", fontWeight: 800, fontSize: 14.5, padding: "12px 22px", borderRadius: 999, textDecoration: "none" }}>
                    {state === "live" ? "Watch Live" : "Read the Closing Message"} <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          )}

          {/* Next Convention — save the date */}
          <Reveal delay={60} style={{ gridColumn: "span 12" }} className="spotlight-half">
            <Link href={nextCy.href} className="card-lift" style={{
              display: "block", height: "100%", borderRadius: 24, padding: "clamp(26px,3vw,34px)",
              background: "linear-gradient(140deg,var(--red),var(--red-deep))", textDecoration: "none",
              boxShadow: "0 18px 40px rgba(200,30,58,.28)",
            }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,.75)" }}>Save the date</span>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "-.6px", color: "#fff", margin: "10px 0 8px", lineHeight: 1.1 }}>
                CACNA {nextCy.year} National Convention
              </h3>
              <p style={{ fontSize: 14.5, color: "rgba(255,255,255,.82)", margin: "0 0 18px" }}>{dateRangeLabel(nextCy)} · {CONVENTION_VENUE_SHORT}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: "#fff" }}>
                Event details <span aria-hidden>→</span>
              </span>
            </Link>
          </Reveal>

          {/* 50th Anniversary */}
          {showAnniversary && (
            <Reveal delay={100} style={{ gridColumn: "span 12" }} className="spotlight-half">
              <Link href={anniversary.href ?? "/calendar"} className="card-lift" style={{
                display: "block", height: "100%", borderRadius: 24, padding: "clamp(26px,3vw,34px)",
                background: "var(--paper)", border: "1px solid var(--line)", textDecoration: "none",
                boxShadow: "0 14px 34px rgba(18,20,30,.08)",
              }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>50 years strong</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "-.6px", color: "var(--ink)", margin: "10px 0 8px", lineHeight: 1.1 }}>
                  50th Anniversary Celebration
                </h3>
                <p style={{ fontSize: 14.5, color: "var(--ink-soft)", margin: "0 0 18px" }}>{anniversary.dateLabel} · {anniversary.timeLabel}</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: "var(--red)" }}>
                  Celebrate with us <span aria-hidden>→</span>
                </span>
              </Link>
            </Reveal>
          )}

          {/* Holy Land Pilgrimage promo */}
          {showPilgrimage && (
            <Reveal delay={140} style={{ gridColumn: "span 12" }} className="spotlight-half">
              <Link href={pilgrimage.href ?? "/calendar"} className="card-lift" style={{
                display: "block", height: "100%", borderRadius: 24, padding: "clamp(26px,3vw,34px)",
                background: "linear-gradient(140deg,#7A5A1E,#3D2C0F)", textDecoration: "none",
                boxShadow: "0 18px 40px rgba(122,90,30,.3)",
              }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)" }}>Holy Land Pilgrimage</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "-.6px", color: "#fff", margin: "10px 0 8px", lineHeight: 1.1 }}>
                  Israel &amp; Egypt, {pilgrimage.dateLabel}
                </h3>
                <p style={{ fontSize: 14.5, color: "rgba(245,246,250,.8)", margin: "0 0 18px" }}>Flights, hotels &amp; guide included · $4,549</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: "var(--gold)" }}>
                  Reserve your spot <span aria-hidden>→</span>
                </span>
              </Link>
            </Reveal>
          )}

          {/* Latest news */}
          {latestPost && (
            <Reveal delay={180} style={{ gridColumn: "span 12" }} className="spotlight-half">
              <Link href={latestPost.href ?? `/blog/${latestPost.slug}`} className="card-lift" style={{
                display: "block", height: "100%", borderRadius: 24, padding: "clamp(26px,3vw,34px)",
                background: "var(--ink)", textDecoration: "none",
                boxShadow: "0 14px 34px rgba(18,20,30,.18)",
              }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)" }}>Latest from the blog</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.4vw,26px)", letterSpacing: "-.5px", color: "#fff", margin: "10px 0 8px", lineHeight: 1.2, textWrap: "pretty" }}>
                  {latestPost.title}
                </h3>
                <p style={{ fontSize: 14, color: "rgba(245,246,250,.65)", margin: "0 0 18px", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {latestPost.excerpt}
                </p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: "var(--gold)" }}>
                  Read the post <span aria-hidden>→</span>
                </span>
              </Link>
            </Reveal>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 860px) {
          .spotlight-half { grid-column: span 6 !important; }
        }
        @media (min-width: 1180px) {
          .spotlight-half { grid-column: span 3 !important; }
        }
      `}</style>
    </section>
  );
}
