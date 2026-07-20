"use client";
import Link from "next/link";
import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, PlayCircle, X } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Magnetic } from "@/components/ui/Magnetic";
import { haptic } from "@/lib/haptics";
import { conventionToFeature, currentOrNextConvention, dateRangeLabel, CONVENTION_VENUE_SHORT } from "@/lib/conventions";
import { specialEvents, isEventPast } from "@/lib/events";
import { POSTS } from "@/lib/blog";
import { GIVING_CAMPAIGNS } from "@/lib/giving";

export type HeroVideo = { id: string; title: string };

type SlideBg = { type: "photo"; src: string; alt: string } | { type: "gradient"; value: string };
type SlideKind = "Welcome" | "Event" | "Ad" | "News";

interface Slide {
  key: string;
  kind: SlideKind;
  eyebrow: string;
  title: string;
  desc: string;
  cta: { label: string; href: string; external?: boolean };
  bg: SlideBg;
}

const KIND_COLOR: Record<SlideKind, string> = {
  Welcome: "var(--gold)",
  Event: "var(--gold)",
  Ad: "var(--gold)",
  News: "var(--gold)",
};

/** Builds the rotating slide deck — a real news-and-events carousel (the
 *  "college homepage" pattern) instead of one fixed hero message. Every
 *  slide is real CACNA content: the adaptive convention state, real
 *  upcoming events, a real giving campaign, and the latest real post.
 *  Slides for events that have already passed simply don't get built. */
function useSlides(video?: HeroVideo | null): Slide[] {
  return useMemo(() => {
    const slides: Slide[] = [
      {
        key: "welcome",
        kind: "Welcome",
        eyebrow: "Welcome Home",
        title: "One Fold. One Shepherd.",
        desc: "Real worship and real community across every CACNA member church — preaching the whole Gospel in a clear and undiluted manner, wherever you are.",
        cta: { label: "Join Us Online", href: "/online" },
        bg: { type: "photo", src: "/images/cac-congregation-worship.jpg", alt: "CACNA congregation in worship" },
      },
    ];

    const { cy: featuredCy, state } = conventionToFeature();
    const nextCy = currentOrNextConvention();
    const showRecap = state === "live" || state === "concluded-recent";
    const recapPost = POSTS.find((p) => p.slug === "cacna-2026-closing-appreciation");
    slides.push({
      key: "convention",
      kind: "Event",
      eyebrow: showRecap ? (state === "live" ? "Live Now" : "Just Concluded") : "Save the Date",
      title: showRecap ? `CACNA ${featuredCy.year} Convention` : `CACNA ${nextCy.year} National Convention`,
      desc: showRecap
        ? "Read the Convention Chairman's closing message of thanks to every speaker, volunteer, and family."
        : `${dateRangeLabel(nextCy)} · ${CONVENTION_VENUE_SHORT}`,
      cta: showRecap
        ? { label: "Read the Closing Message", href: recapPost ? (recapPost.href ?? `/blog/${recapPost.slug}`) : featuredCy.href }
        : { label: "Event Details", href: nextCy.href },
      bg: { type: "photo", src: "/images/cac-youth-convention.jpg", alt: "CACNA youth at a past Annual Convention" },
    });

    const anniversary = specialEvents.find((e) => e.id === "cacna-50th-anniversary-2026");
    if (anniversary && !isEventPast(anniversary)) {
      slides.push({
        key: "anniversary",
        kind: "Event",
        eyebrow: "50 Years Strong",
        title: "50th Anniversary Celebration",
        desc: `${anniversary.dateLabel} · ${anniversary.timeLabel} — five decades of ministry across North America.`,
        cta: { label: "Celebrate With Us", href: anniversary.href ?? "/calendar" },
        bg: { type: "photo", src: "/images/cac-gathering-crowd.jpg", alt: "A gathering of the CACNA family" },
      });
    }

    const pilgrimage = specialEvents.find((e) => e.id === "holy-land-pilgrimage-2026");
    if (pilgrimage && !isEventPast(pilgrimage)) {
      slides.push({
        key: "pilgrimage",
        kind: "Ad",
        eyebrow: "Holy Land Pilgrimage",
        title: `Israel & Egypt, ${pilgrimage.dateLabel}`,
        desc: "Flights, hotels & a private guide included · $4,549 · $500 deposit to register.",
        cta: { label: "Reserve Your Spot", href: pilgrimage.href ?? "/calendar" },
        bg: { type: "gradient", value: "linear-gradient(135deg,#7A5A1E,#3D2C0F)" },
      });
    }

    const givingCampaign = GIVING_CAMPAIGNS[0];
    if (givingCampaign) {
      slides.push({
        key: "giving",
        kind: "Ad",
        eyebrow: givingCampaign.eyebrow,
        title: givingCampaign.title,
        desc: givingCampaign.adBlurb,
        cta: { label: "Give Now", href: "/giving" },
        bg: { type: "photo", src: "/images/giving-offering.jpg", alt: "CACNA members bringing an offering during a service" },
      });
    }

    const latestPost = [...POSTS]
      .filter((p) => p.slug !== "cacna-2026-closing-appreciation")
      .sort((a, b) => b.dateIso.localeCompare(a.dateIso))[0];
    if (latestPost) {
      slides.push({
        key: "news",
        kind: "News",
        eyebrow: "Latest News",
        title: latestPost.title,
        desc: latestPost.excerpt,
        cta: { label: "Read the Post", href: latestPost.href ?? `/blog/${latestPost.slug}` },
        bg: latestPost.image
          ? { type: "photo", src: latestPost.image.url, alt: latestPost.image.alt }
          : { type: "gradient", value: latestPost.accent },
      });
    }

    void video; // video is surfaced as a small link on the welcome slide, not its own slide
    return slides;
  }, [video]);
}

const BG_WORDS = [
  { w: "GRACE",     l: 4,  delay: 0,   dur: 22, sz: 48, o: 0.05  },
  { w: "FAITH",     l: 77, delay: 1,   dur: 28, sz: 30, o: 0.04  },
  { w: "HOPE",      l: 21, delay: 2,   dur: 18, sz: 62, o: 0.055 },
  { w: "LOVE",      l: 63, delay: 0.5, dur: 24, sz: 38, o: 0.045 },
  { w: "FAMILY",    l: 53, delay: 1.2, dur: 32, sz: 18, o: 0.04  },
] as const;

/** Real YouTube embed (CACNA's own channel, fetched via lib/sermons.ts) in a
 *  lightbox — the honest "video feature": no fabricated background video
 *  file exists, so this plays CACNA's actual latest upload on demand instead. */
function VideoLightbox({ video, onClose }: { video: HeroVideo; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog" aria-modal="true" aria-label={video.title}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(12,14,19,.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(20px,5vw,64px)",
      }}
    >
      <button
        type="button" onClick={onClose} aria-label="Close" className="press"
        style={{
          position: "absolute", top: 20, right: 20,
          width: 44, height: 44, borderRadius: 999,
          background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)",
          display: "grid", placeItems: "center", cursor: "pointer",
        }}
      >
        <X size={20} strokeWidth={2} color="#fff" aria-hidden />
      </button>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 960, aspectRatio: "16/9", borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: 0, display: "block" }}
        />
      </div>
    </div>
  );
}

const HERO_T = {
  en: { line1: "One Fold.", line2: "One Shepherd." },
  yo: { line1: "Agbo Kan.", line2: "Oluṣọ-Agutan Kan." },
} as const;

export function Hero({ video }: { video?: HeroVideo | null }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [videoOpen, setVideoOpen] = useState(false);
  const slides = useSlides(video);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

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

  useEffect(() => {
    if (reduce || paused || slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [reduce, paused, slides.length]);

  function goTo(i: number) {
    haptic("selection");
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }

  const slide = slides[index];
  const isWelcome = slide.kind === "Welcome";

  return (
    <header
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center",
        padding: "140px clamp(20px,5vw,64px) 110px",
        overflow: "hidden",
        background: "#0d0a08",
      }}
    >
      {/* Background — crossfades with the active slide */}
      <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <AnimatePresence>
          <motion.div
            key={slide.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: 0,
              ...(slide.bg.type === "photo"
                ? { backgroundImage: `url(${slide.bg.src})`, backgroundSize: "cover", backgroundPosition: "center" }
                : { background: slide.bg.value }),
            }}
          />
        </AnimatePresence>
      </div>

      {/* Dark shadow overlay + grain vignette */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(135deg,rgba(0,0,0,.8) 0%,rgba(0,0,0,.56) 55%,rgba(0,0,0,.4) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(120% 80% at 50% 0%,transparent 50%,rgba(0,0,0,.45) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, zIndex: 1, background: "linear-gradient(to bottom,transparent,rgba(0,0,0,.7))" }} />

      {/* Floating ambient words — decorative, not slide-dependent */}
      {!reduce && (
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}>
          {BG_WORDS.map(({ w, l, delay, dur, sz, o }) => (
            <motion.span
              key={w}
              initial={{ y: "110vh" }}
              animate={{ y: "-110vh" }}
              transition={{ duration: dur, delay, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", left: `${l}%`, top: 0, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: sz, color: `rgba(255,255,255,${o})`, letterSpacing: "-0.02em", userSelect: "none", whiteSpace: "nowrap" }}
            >
              {w}
            </motion.span>
          ))}
        </div>
      )}

      {/* Slide content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 820, margin: "0 auto", width: "100%", textAlign: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.key}
            initial={{ opacity: 0, y: reduce ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -18 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
              padding: "7px 16px", borderRadius: 999,
              fontSize: 12, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase",
              color: KIND_COLOR[slide.kind],
              backdropFilter: "blur(8px)",
            }}>
              {slide.eyebrow}
            </span>

            {isWelcome ? (
              <h1 style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "clamp(48px,7vw,96px)", lineHeight: .94, letterSpacing: "-0.03em",
                margin: "22px 0 0", color: "#fff", textWrap: "balance",
              }}>
                <span className="sr-only">Christ Apostolic Church North America — uniting CAC member churches across the United States, Canada, and South America. </span>
                <RevealText key={`l1-${lang}`} immediate>{t.line1}</RevealText>
                <br />
                <RevealText key={`l2-${lang}`} immediate delay={0.12} style={{ color: "var(--red)" }}>{t.line2}</RevealText>
              </h1>
            ) : (
              <h1 style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "clamp(32px,4.6vw,58px)", lineHeight: 1.05, letterSpacing: "-0.02em",
                margin: "22px 0 0", color: "#fff", textWrap: "balance",
              }}>
                {slide.title}
              </h1>
            )}

            {isWelcome && (
              <div role="group" aria-label="Greeting language" style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 999, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)", backdropFilter: "blur(8px)", marginTop: 18 }}>
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
            )}

            <p style={{
              fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.65,
              color: "rgba(255,255,255,.78)", maxWidth: 520, margin: "18px auto 0",
              textWrap: "pretty",
            }}>
              {slide.desc}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 30, justifyContent: "center" }}>
              <Magnetic strength={0.4}>
                <Link href={slide.cta.href} target={slide.cta.external ? "_blank" : undefined} rel={slide.cta.external ? "noopener noreferrer" : undefined} className="btn-sheen" style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "var(--gold)", color: "var(--ink)",
                  fontWeight: 800, fontSize: 16,
                  padding: "16px 28px", borderRadius: 999,
                  textDecoration: "none",
                  boxShadow: "0 14px 34px rgba(253,200,65,.5)",
                }}>
                  {slide.cta.label} →
                </Link>
              </Magnetic>
              {isWelcome && (
                <Magnetic strength={0.4}>
                  <a href="/contact" className="btn-sheen" style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    background: "rgba(255,255,255,.12)", color: "#fff",
                    fontWeight: 700, fontSize: 16,
                    padding: "16px 28px", borderRadius: 999,
                    textDecoration: "none",
                    border: "1.5px solid rgba(255,255,255,.35)",
                    backdropFilter: "blur(8px)",
                  }}>
                    Plan a Visit
                  </a>
                </Magnetic>
              )}
            </div>

            {isWelcome && video && (
              <button type="button" onClick={() => setVideoOpen(true)} className="press" style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22,
                background: "none", border: "none", color: "rgba(255,255,255,.75)",
                fontWeight: 700, fontSize: 14, cursor: "pointer", padding: 0,
              }}>
                <PlayCircle size={17} strokeWidth={2} aria-hidden />
                Watch our latest video
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button" onClick={() => goTo(index - 1)} aria-label="Previous slide" className="press"
            style={{
              position: "absolute", left: "clamp(10px,3vw,28px)", top: "50%", transform: "translateY(-50%)", zIndex: 3,
              width: 44, height: 44, borderRadius: 999, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
              display: "grid", placeItems: "center", cursor: "pointer", backdropFilter: "blur(8px)",
            }}
          >
            <ChevronLeft size={22} strokeWidth={2} color="#fff" aria-hidden />
          </button>
          <button
            type="button" onClick={() => goTo(index + 1)} aria-label="Next slide" className="press"
            style={{
              position: "absolute", right: "clamp(10px,3vw,28px)", top: "50%", transform: "translateY(-50%)", zIndex: 3,
              width: 44, height: 44, borderRadius: 999, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
              display: "grid", placeItems: "center", cursor: "pointer", backdropFilter: "blur(8px)",
            }}
          >
            <ChevronRight size={22} strokeWidth={2} color="#fff" aria-hidden />
          </button>

          {/* Dots */}
          <div style={{ position: "absolute", bottom: 34, left: "50%", transform: "translateX(-50%)", zIndex: 3, display: "flex", gap: 9, alignItems: "center" }}>
            {slides.map((s, i) => (
              <button
                key={s.key} type="button" onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}: ${s.title}`} aria-current={i === index}
                className="press"
                style={{
                  width: i === index ? 28 : 8, height: 8, borderRadius: 999,
                  background: i === index ? "var(--gold)" : "rgba(255,255,255,.4)",
                  border: "none", cursor: "pointer", padding: 0,
                  transition: "width .3s ease, background .3s ease",
                }}
              />
            ))}
          </div>
        </>
      )}

      {videoOpen && video && (
        <VideoLightbox video={video} onClose={() => setVideoOpen(false)} />
      )}
    </header>
  );
}
