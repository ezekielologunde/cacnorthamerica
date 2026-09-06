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

type SlideBg =
  | { type: "photo"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string }
  | { type: "gradient"; value: string };
type SlideKind = "Welcome" | "Event" | "Ad" | "News";

interface Slide {
  key: string;
  kind: SlideKind;
  eyebrow: string;
  title: string;
  desc: string;
  cta: { label: string; href: string; external?: boolean };
  bg: SlideBg;
  /** A portrait (e.g. a person's headshot) doesn't work stretched as a
   *  full-bleed background — shown inline in the content instead, dynamically,
   *  while the slide falls back to a gradient backdrop. */
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
      bg: { type: "video", src: "/videos/welcome-hero.mp4", poster: "/images/cac-congregation-worship.jpg", alt: "CACNA congregation in worship" },
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
      bg: { type: "video", src: "/videos/convention-hero.mp4", poster: "/images/cac-youth-convention.jpg", alt: "CACNA youth at a past Annual Convention" },
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

    const givingCampaign = GIVING_CAMPAIGNS[0] ? localizeCampaign(GIVING_CAMPAIGNS[0], locale) : undefined;
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
      const isPortrait = latestPost.image?.orientation === "portrait";
      slides.push({
        key: "news",
        kind: "News",
        eyebrow: "Latest News",
        title: latestPost.title,
        desc: latestPost.excerpt,
        cta: { label: "Read the Post", href: latestPost.href ?? `/blog/${latestPost.slug}` },
        bg: latestPost.image && !isPortrait
          ? { type: "photo", src: latestPost.image.url, alt: latestPost.image.alt }
          : { type: "gradient", value: latestPost.accent },
        inlineImage: latestPost.image && isPortrait
          ? { src: latestPost.image.url, alt: latestPost.image.alt }
          : undefined,
      });
    }

    return slides;
  }, [locale]);
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
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
                : slide.bg.type === "video"
                ? { backgroundImage: `url(${slide.bg.poster})`, backgroundSize: "cover", backgroundPosition: "center" }
                : slide.bg.type === "gradient"
                ? { background: slide.bg.value }
                : {}),
            }}
          >
            {slide.bg.type === "video" && !reduce && (
              <video
                key={slide.bg.src}
                autoPlay
                muted
                loop
                playsInline
                poster={slide.bg.poster}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              >
                <source src={slide.bg.src} type="video/mp4" />
              </video>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark shadow overlay + grain vignette */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(135deg,rgba(0,0,0,.8) 0%,rgba(0,0,0,.56) 55%,rgba(0,0,0,.4) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(120% 80% at 50% 0%,transparent 50%,rgba(0,0,0,.45) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, zIndex: 1, background: "linear-gradient(to bottom,transparent,rgba(0,0,0,.7))" }} />

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

            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(38px,6vw,76px)", lineHeight: 1.0, letterSpacing: "-0.03em",
              margin: "24px 0 0", color: "#fff", textWrap: "balance",
            }}>
              {slide.title}
            </h1>

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
    </header>
  );
}
