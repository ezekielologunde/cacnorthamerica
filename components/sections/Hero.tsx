"use client";
import Link from "next/link";
import { useRef, useState, useEffect, type CSSProperties } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Magnetic } from "@/components/ui/Magnetic";
import { haptic } from "@/lib/haptics";
import { conventionToFeature, currentOrNextConvention, dateRangeLabel, CONVENTION_VENUE_SHORT } from "@/lib/conventions";
import { specialEvents, isEventPast } from "@/lib/events";
import { POSTS } from "@/lib/blog";

const HERO_T = {
  en: { badge: "CACNA", line1: "One Fold.", line2: "One Shepherd." },
  yo: { badge: "CACNA", line1: "Agbo Kan.", line2: "Oluṣọ-Agutan Kan." },
} as const;

const BG_WORDS = [
  { w: "GRACE",     l: 4,  delay: 0,   dur: 22, sz: 48, o: 0.055 },
  { w: "FAITH",     l: 77, delay: 1,   dur: 28, sz: 30, o: 0.045 },
  { w: "HOPE",      l: 21, delay: 2,   dur: 18, sz: 62, o: 0.06  },
  { w: "LOVE",      l: 63, delay: 0.5, dur: 24, sz: 38, o: 0.05  },
  { w: "GLORY",     l: 41, delay: 2.5, dur: 20, sz: 26, o: 0.04  },
  { w: "WORSHIP",   l: 87, delay: 1.5, dur: 30, sz: 22, o: 0.05  },
  { w: "AMEN",      l: 11, delay: 3,   dur: 16, sz: 44, o: 0.055 },
  { w: "FAMILY",    l: 53, delay: 1.2, dur: 32, sz: 18, o: 0.04  },
] as const;

function AnimLetters({ children, delay = 0 }: { children: string; delay?: number }) {
  const reduce = useReducedMotion();
  const chars = Array.from(children);
  return (
    <motion.span
      role="img"
      aria-label={children}
      style={{ display: "inline-block" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.045, delayChildren: delay } },
      }}
      initial="hidden"
      animate="show"
    >
      {chars.map((char, i) => (
        <span key={i} aria-hidden style={{ display: "inline-flex", overflow: "hidden", verticalAlign: "top" }}>
          <motion.span
            variants={
              reduce
                ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
                : { hidden: { y: "110%" }, show: { y: "0%", transition: { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.6 } } }
            }
            style={{ display: "inline-block" }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Compact "what's happening" cards, surfaced directly in the hero instead of
 *  requiring a scroll — the convention state is adaptive (live/just-concluded
 *  recap vs. next save-the-date), the others only show while still relevant. */
function HeroHighlights() {
  const { cy: featuredCy, state } = conventionToFeature();
  const nextCy = currentOrNextConvention();
  const showRecap = state === "live" || state === "concluded-recent";

  const anniversary = specialEvents.find((e) => e.id === "cacna-50th-anniversary-2026");
  const showAnniversary = anniversary && !isEventPast(anniversary);

  const recapPost = POSTS.find((p) => p.slug === "cacna-2026-closing-appreciation");
  const latestPost = [...POSTS]
    .filter((p) => p.slug !== recapPost?.slug)
    .sort((a, b) => b.dateIso.localeCompare(a.dateIso))[0];

  const cardBase: CSSProperties = {
    display: "block", borderRadius: 20, padding: "26px 28px",
    textDecoration: "none", textAlign: "left", height: "100%",
  };

  return (
    <div style={{
      background: "rgba(12,14,19,.4)", border: "1px solid rgba(255,255,255,.14)",
      backdropFilter: "blur(10px)", borderRadius: 28,
      padding: "clamp(20px,3vw,28px)", maxWidth: 980, margin: "0 auto",
    }}>
      <span style={{ display: "block", fontSize: 12.5, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 16, textAlign: "center" }}>
        Right now at CACNA
      </span>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
        gap: 16,
      }}>
        <Link
          href={showRecap ? (recapPost ? (recapPost.href ?? `/blog/${recapPost.slug}`) : featuredCy.href) : nextCy.href}
          className="card-lift"
          style={{ ...cardBase, background: "linear-gradient(140deg,var(--red),var(--red-deep))", boxShadow: "0 14px 34px rgba(200,30,58,.35)" }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,.8)" }}>
            {showRecap ? (state === "live" ? "Live now" : "Just concluded") : "Save the date"}
          </span>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "#fff", margin: "8px 0 6px", lineHeight: 1.15 }}>
            {showRecap ? `CACNA ${featuredCy.year} Convention` : `CACNA ${nextCy.year} Convention`}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,.85)" }}>
            {showRecap ? "Read the closing message →" : `${dateRangeLabel(nextCy)} · ${CONVENTION_VENUE_SHORT}`}
          </div>
        </Link>

        {showAnniversary && (
          <Link href={anniversary.href ?? "/calendar"} className="card-lift" style={{ ...cardBase, background: "#fff", boxShadow: "0 14px 34px rgba(0,0,0,.22)" }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)" }}>50 years strong</span>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)", margin: "8px 0 6px", lineHeight: 1.15 }}>
              50th Anniversary
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>{anniversary.dateLabel} →</div>
          </Link>
        )}

        {latestPost && (
          <Link href={latestPost.href ?? `/blog/${latestPost.slug}`} className="card-lift" style={{ ...cardBase, background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.28)", backdropFilter: "blur(8px)" }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)" }}>Latest news</span>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "#fff", margin: "8px 0 6px", lineHeight: 1.25,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {latestPost.title}
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.75)" }}>Read the post →</div>
          </Link>
        )}
      </div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // No CACNA-specific background video is available yet (the source site's
  // video belongs to a different, unrelated congregation) — a static photo
  // stands in below until CACNA supplies its own footage.

  // Bilingual hero greeting (English / Yorùbá). Scoped to the greeting;
  // persists per visit.
  const [lang, setLang] = useState<"en" | "yo">("en");
  useEffect(() => {
    const saved = localStorage.getItem("cac-hero-lang");
    if (saved === "yo" || saved === "en") setLang(saved);
  }, []);
  function switchLang(next: "en" | "yo") {
    if (next === lang) return;
    haptic("selection");
    setLang(next);
    try { localStorage.setItem("cac-hero-lang", next); } catch {}
  }
  const t = HERO_T[lang];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Cinematic scroll choreography: the video pushes back + scales while the
  // copy drifts up and fades — a single, deliberate hero moment.
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <header
      ref={ref}
      style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center",
        padding: "140px clamp(20px,5vw,64px) 80px",
        overflow: "hidden",
        background: "#0d0a08",
        backgroundImage: "url(/images/cac-congregation-worship.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Static background photo, scroll-linked parallax (no video yet — see note above) */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute", inset: "-10%", zIndex: 0, overflow: "hidden",
          backgroundImage: "url(/images/cac-congregation-worship.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          scale: reduce ? 1 : videoScale,
          y: reduce ? 0 : videoY,
          willChange: "transform",
        }}
      />

      {/* Dark shadow overlay + grain vignette */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(135deg,rgba(0,0,0,.8) 0%,rgba(0,0,0,.56) 55%,rgba(0,0,0,.4) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "radial-gradient(120% 80% at 50% 0%,transparent 50%,rgba(0,0,0,.45) 100%)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 160, zIndex: 1,
        background: "linear-gradient(to bottom,transparent,rgba(0,0,0,.65))",
      }} />

      {/* Floating ambient words */}
      {!reduce && (
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}>
          {BG_WORDS.map(({ w, l, delay, dur, sz, o }) => (
            <motion.span
              key={w}
              initial={{ y: "110vh" }}
              animate={{ y: "-110vh" }}
              transition={{ duration: dur, delay, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                left: `${l}%`,
                top: 0,
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: sz,
                color: `rgba(255,255,255,${o})`,
                letterSpacing: "-0.02em",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              {w}
            </motion.span>
          ))}
        </div>
      )}

      {/* Content */}
      <motion.div
        style={{
          position: "relative", zIndex: 2,
          maxWidth: 860, margin: "0 auto", width: "100%",
          textAlign: "center",
          y: reduce ? 0 : contentY,
          opacity: reduce ? 1 : contentOpacity,
        }}
      >
        <Reveal from="scale">
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
            padding: "8px 16px 8px 10px", borderRadius: 999,
            fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.85)",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{ background: "var(--red)", color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 999, letterSpacing: ".5px" }}>{t.badge}</span>
            24 Zones &amp; DCCs, U.S., Canada &amp; South America · A Region of Christ Apostolic Church Worldwide
          </span>
        </Reveal>

        <Reveal delay={60} style={{ marginTop: 20 }}>
          <p style={{
            fontSize: "clamp(16px,1.8vw,20px)", fontWeight: 800, letterSpacing: "1px",
            textTransform: "uppercase", color: "var(--gold)", margin: 0,
            textShadow: "0 2px 16px rgba(0,0,0,.4)",
          }}>
            Welcome to the Christ Apostolic Church North America website
          </p>
        </Reveal>

        <motion.h1
          animate={reduce ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
          style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(52px,7.4vw,104px)",
            lineHeight: .94, letterSpacing: "-0.03em",
            margin: "22px 0 0", color: "#fff",
            textWrap: "balance",
          }}
        >
          <span className="sr-only">Christ Apostolic Church North America — uniting CAC member churches across the United States, Canada, and South America. </span>
          <AnimLetters key={`l1-${lang}`}>{t.line1}</AnimLetters>
          <br />
          <RevealText
            key={`l2-${lang}`}
            immediate
            delay={0.18}
            style={{ color: "var(--red)" }}
          >
            {t.line2}
          </RevealText>
        </motion.h1>

        <Reveal delay={300} style={{ marginTop: 18 }}>
          <div role="group" aria-label="Greeting language" style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 999, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)", backdropFilter: "blur(8px)" }}>
            {(["en", "yo"] as const).map((l) => (
              <button
                key={l} type="button" onClick={() => switchLang(l)} aria-pressed={lang === l}
                className="press"
                style={{ padding: "7px 16px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-body)", background: lang === l ? "#fff" : "transparent", color: lang === l ? "var(--ink)" : "rgba(255,255,255,.8)", transition: "background .2s, color .2s" }}
              >
                {l === "en" ? "English" : "Yorùbá"}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={420}>
          <p style={{
            fontSize: "clamp(16px,1.5vw,19px)", lineHeight: 1.65,
            color: "rgba(255,255,255,.74)", maxWidth: 480, margin: "20px auto 0",
            textWrap: "pretty", minHeight: 84,
          }}>
            <AnimatePresence mode="wait">
              {lang === "en" ? (
                <motion.span key="sub-en" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  Welcome home. As part of the worldwide family of Christ Apostolic
                  Church, we bring real worship and real community to every CACNA
                  member church — preaching the whole Gospel in a clear and undiluted
                  manner, wherever you are.{" "}
                  <strong style={{ color: "#fff" }}>One fold, one Shepherd.</strong>
                </motion.span>
              ) : (
                <motion.span key="sub-yo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  Ìjọsìn tòótọ́, ẹbí tòótọ́ ní gbogbo ìjọ CACNA —{" "}
                  <strong style={{ color: "#fff" }}>agbo kan, oluṣọ-agutan kan.</strong>
                </motion.span>
              )}
            </AnimatePresence>
          </p>
        </Reveal>

        <Reveal delay={520}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 34, justifyContent: "center" }}>
            <Magnetic strength={0.4}>
              <Link href="/online" className="btn-sheen" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "var(--gold)", color: "var(--ink)",
                fontWeight: 800, fontSize: 16,
                padding: "17px 30px", borderRadius: 999,
                textDecoration: "none",
                boxShadow: "0 14px 34px rgba(253,200,65,.5)",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--ink)" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                Join Us Online
              </Link>
            </Magnetic>
            <Magnetic strength={0.4}>
              <a href="/contact" className="btn-sheen" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,.12)", color: "#fff",
                fontWeight: 700, fontSize: 16,
                padding: "17px 30px", borderRadius: 999,
                textDecoration: "none",
                border: "1.5px solid rgba(255,255,255,.35)",
                backdropFilter: "blur(8px)",
              }}>
                Plan a Visit
              </a>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={620} style={{ marginTop: 44 }}>
          <HeroHighlights />
        </Reveal>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        style={{ position: "absolute", bottom: 26, left: "50%", x: "-50%", zIndex: 2, opacity: reduce ? 1 : undefined }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, 9, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 26, height: 42, borderRadius: 999, border: "2px solid rgba(255,255,255,.35)", display: "flex", justifyContent: "center", paddingTop: 7 }}
        >
          <span style={{ width: 4, height: 8, borderRadius: 999, background: "rgba(255,255,255,.8)" }} />
        </motion.div>
      </motion.div>
    </header>
  );
}
