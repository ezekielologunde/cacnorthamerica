"use client";
import Link from "next/link";
import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { haptic } from "@/lib/haptics";
import { conventionToFeature, currentOrNextConvention, dateRangeLabel, CONVENTION_VENUE_SHORT } from "@/lib/conventions";
import { specialEvents, isEventPast } from "@/lib/events";
import { POSTS } from "@/lib/blog";
import { GIVING_CAMPAIGNS, localizeCampaign } from "@/lib/giving";

type SlideKind = "Welcome" | "Event" | "Ad" | "News";

// The hero's one persistent background -- every slide's text crossfades on
// top of the same clip instead of each slide bringing its own photo/video/
// gradient.
//
// This was previously the channel's "current livestream" video id, which
// silently broke: outside of an active broadcast that id just shows a
// static "Live stream offline" placeholder, with no error or console
// signal. This id is a fixed upload from the real CACNA North America
// channel instead (Revival Night, 2026 Convention Day 5), so it never goes
// "offline" regardless of whether anything is currently streaming. Starts
// at 3:32, where the congregation is standing in worship rather than the
// stream's dead air before the program begins.
const HERO_BG_VIDEO = { videoId: "SFXZsCZPD0I", start: 212, poster: "/images/cac-congregation-worship.jpg", alt: "CACNA congregation in worship" };

interface Slide {
  key: string;
  kind: SlideKind;
  eyebrow: string;
  title: string;
  desc: string;
  cta: { label: string; href: string; external?: boolean };
  /** A portrait (e.g. a person's headshot) shown inline in the content next
   *  to the text, since the hero background is now the one persistent video
   *  rather than a per-slide image a portrait could substitute for. */
  inlineImage?: { src: string; alt: string };
  /** Extra navigation for the Welcome slide only — points visitors to the
   *  site's other important sections instead of a single CTA. */
  quickLinks?: { label: string; href: string }[];
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
function useSlides(): Slide[] {
  const locale = useLocale();
  return useMemo(() => {
    const slides: Slide[] = [];

    slides.push({
      key: "welcome",
      kind: "Welcome",
      eyebrow: "Welcome Home",
      title: "Welcome to CACNA",
      desc: "The corporate home of Christ Apostolic Church across North America — part of a global family headquartered in Nigeria. Explore who we are, watch a service online, or find your zone.",
      cta: { label: "About CACNA", href: "/about" },
      quickLinks: [
        { label: "Our Ministries", href: "/ministries" },
        { label: "Watch Online", href: "/online" },
        { label: "Find a Zone", href: "/zones" },
      ],
    });

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
      });
    }

    const givingCampaign = GIVING_CAMPAIGNS[0] ? localizeCampaign(GIVING_CAMPAIGNS[0], locale) : undefined;
    if (givingCampaign) {
      slides.push({
        key: "giving",
        kind: "Ad",
        eyebrow: givingCampaign.eyebrow,
        title: givingCampaign.title,
        desc: givingCampaign.adBlurb,
        cta: { label: "Give Now", href: "/giving" },
      });
    }

    const latestPost = [...POSTS]
      .filter((p) => p.slug !== "cacna-2026-closing-appreciation")
      .sort((a, b) => b.dateIso.localeCompare(a.dateIso))[0];
    if (latestPost) {
      // A portrait photo (e.g. a person's headshot) still works as the small
      // inline circle below; a landscape photo has nowhere to go now that
      // the hero background is the one persistent video rather than a
      // per-slide image — it stays visible on the post's own page.
      const isPortrait = latestPost.image?.orientation === "portrait";
      slides.push({
        key: "news",
        kind: "News",
        eyebrow: "Latest News",
        title: latestPost.title,
        desc: latestPost.excerpt,
        cta: { label: "Read the Post", href: latestPost.href ?? `/blog/${latestPost.slug}` },
        inlineImage: latestPost.image && isPortrait
          ? { src: latestPost.image.url, alt: latestPost.image.alt }
          : undefined,
      });
    }

    return slides;
  }, [locale]);
}

/** Mobile browsers apply much stricter iframe-autoplay policies than
 *  desktop -- confirmed live: this same embed that plays fine at desktop
 *  widths renders as a plain black frame on a mobile viewport/user-agent,
 *  with no thumbnail, no error, nothing to recover from. Skipping the
 *  video below 640px and showing the poster photo instead (same idea as
 *  the reduced-motion fallback) is more reliable than gambling on
 *  autoplay support. */
function useIsNarrowViewport(breakpoint: number): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setNarrow(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);
  return narrow;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const narrow = useIsNarrowViewport(640);
  const slides = useSlides();

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

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
      {/* Persistent video background — the same clip sits behind every
          slide; only the text content (below) crossfades between slides.
          The poster paints immediately (and is all reduced-motion visitors
          ever see); the iframe, oversized + centered, is the standard
          object-fit:cover trick since an <iframe> has no native equivalent. */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, overflow: "hidden",
        backgroundImage: `url(${HERO_BG_VIDEO.poster})`, backgroundSize: "cover", backgroundPosition: "center",
      }}>
        {!reduce && !narrow && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${HERO_BG_VIDEO.videoId}?autoplay=1&mute=1&loop=1&playlist=${HERO_BG_VIDEO.videoId}&start=${HERO_BG_VIDEO.start}&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
            title={HERO_BG_VIDEO.alt}
            allow="autoplay; encrypted-media"
            style={{
              position: "absolute", top: "50%", left: "50%",
              width: "177.78vh", height: "56.25vw",
              minWidth: "100%", minHeight: "100%",
              transform: "translate(-50%,-50%)",
              border: "none", pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* Dark shadow overlay + grain vignette */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(135deg,rgba(0,0,0,.8) 0%,rgba(0,0,0,.56) 55%,rgba(0,0,0,.4) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(120% 80% at 50% 0%,transparent 50%,rgba(0,0,0,.45) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, zIndex: 1, background: "linear-gradient(to bottom,transparent,rgba(0,0,0,.7))" }} />

      {/* Slide content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", width: "100%", textAlign: "center" }}>
        {/* mode="wait" previously blocked each new slide's enter animation
            on the outgoing slide's exit animation fully resolving -- with a
            7s auto-advance interval running indefinitely, that coordination
            occasionally got stuck, leaving the slide permanently at its
            initial opacity: 0 (confirmed live: the h1's parent motion.div
            stuck invisible while the background kept playing). "popLayout"
            animates the incoming slide in immediately instead of waiting on
            a promise that isn't guaranteed to resolve (unlike "wait"), and
            -- unlike the default "sync" -- pulls the outgoing slide out of
            document flow for its exit animation instead of leaving both
            slides stacked in flow at once, which on mobile (where the
            larger headline wraps to more lines) inflated this header to
            ~2900px tall for the ~0.5s crossfade and broke the video
            background's vh/vw-based cover sizing (it assumes the header is
            ~100vh, not 3.5x that). */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={slide.key}
            initial={{ opacity: 0, y: reduce ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -18 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {slide.inlineImage && (
              <div style={{ width: 92, height: 92, borderRadius: "50%", overflow: "hidden", margin: "0 auto 18px", position: "relative", border: "3px solid rgba(255,255,255,.25)", boxShadow: "0 10px 26px rgba(0,0,0,.35)" }}>
                <ImageLightbox src={slide.inlineImage.src} alt={slide.inlineImage.alt} objectPosition="center 15%" />
              </div>
            )}
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

            {/* 800 is Bricolage Grotesque's max available weight (its
                variable axis tops out there too) -- font-weight can't push
                any bolder, so the extra heft comes from a text-stroke
                thickening the glyph edges plus a tighter double shadow for
                sharper contrast against the video. */}
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(52px,9vw,116px)", lineHeight: 0.96, letterSpacing: "-0.035em",
              margin: "24px 0 0", color: "#fff", textWrap: "balance",
              WebkitTextStroke: "1px rgba(255,255,255,.6)",
              textShadow: "0 2px 10px rgba(0,0,0,.65), 0 14px 40px rgba(0,0,0,.5)",
            }}>
              {slide.title}
            </h1>

            <p style={{
              fontSize: "clamp(16px,1.6vw,20px)", lineHeight: 1.65,
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
            </div>

            {slide.quickLinks && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, justifyContent: "center" }}>
                {slide.quickLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="press" style={{
                    fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,.82)",
                    textDecoration: "none", padding: "8px 16px", borderRadius: 999,
                    border: "1px solid rgba(255,255,255,.22)", background: "rgba(255,255,255,.06)",
                  }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel arrows */}
      {slides.length > 1 && (
        <>
          {/* Hidden below 640px (.hide-sm) -- the larger headline runs edge-
              to-edge on narrow screens and was colliding with these fixed-
              position arrows. The dots below plus the 7s auto-advance still
              cover navigation on mobile. */}
          <button
            type="button" onClick={() => goTo(index - 1)} aria-label="Previous slide" className="press hide-sm"
            style={{
              position: "absolute", left: "clamp(10px,3vw,28px)", top: "50%", transform: "translateY(-50%)", zIndex: 3,
              width: 44, height: 44, borderRadius: 999, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
              display: "grid", placeItems: "center", cursor: "pointer", backdropFilter: "blur(8px)",
            }}
          >
            <ChevronLeft size={22} strokeWidth={2} color="#fff" aria-hidden />
          </button>
          <button
            type="button" onClick={() => goTo(index + 1)} aria-label="Next slide" className="press hide-sm"
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
    </header>
  );
}
