import { conventionToFeature, dateRangeLabel, conventionDayNumber } from "@/lib/conventions";
import { specialEvents, splitByDate } from "@/lib/events";
import { POSTS } from "@/lib/blog";

export type HeroMode = "live" | "concluded" | "upcoming" | "news";

export interface HeroContent {
  mode: HeroMode;
  badge: string;
  eyebrow?: string;
  title: string;
  /** Short, quoted convention theme (e.g. live/upcoming states). */
  theme?: string;
  /** Longer unquoted prose (a post excerpt) — concluded/news states. */
  subtitle?: string;
  ctaLabel: string;
  ctaHref: string;
  ctaExternal?: boolean;
  dateLabel?: string;
}

/** Single source of truth for what the Hero should feature right now: a
 *  convention currently underway, one that just concluded (recap window),
 *  the next dated event otherwise, or the latest news post as a last
 *  resort. Keeps Hero.tsx free of date-math branching. */
export function getHeroContent(): HeroContent {
  const { cy, state } = conventionToFeature();

  if (state === "live") {
    const day = conventionDayNumber(cy);
    return {
      mode: "live",
      badge: "Live Now",
      eyebrow: day ? `Day ${day} of 6` : undefined,
      title: `CACNA ${cy.year} National Convention`,
      theme: cy.theme,
      ctaLabel: "Watch Live",
      ctaHref: "/online",
      dateLabel: dateRangeLabel(cy),
    };
  }

  if (state === "concluded-recent") {
    const recap = POSTS.find((p) => p.slug === "cacna-2026-closing-appreciation");
    return {
      mode: "concluded",
      badge: "Just Concluded",
      title: cy.theme ? `CACNA ${cy.year} — “${cy.theme}”` : `CACNA ${cy.year} Annual Convention`,
      subtitle: recap?.excerpt,
      ctaLabel: "Read the Closing Message",
      ctaHref: recap ? (recap.href ?? `/blog/${recap.slug}`) : "/blog",
      dateLabel: dateRangeLabel(cy),
    };
  }

  // Nothing live/just-concluded — feature the next dated event.
  const { upcoming } = splitByDate(specialEvents);
  const nextEvent = upcoming[0];
  if (nextEvent) {
    const isConvention = nextEvent.id.startsWith("cacna-convention-");
    return {
      mode: "upcoming",
      badge: "Next Up",
      title: nextEvent.title,
      theme: isConvention ? cy.theme : undefined,
      ctaLabel: isConvention && cy.registrationUrl ? `Register — CACNA ${cy.year}` : nextEvent.href ? "Learn More" : `CACNA ${cy.year} — Save the Date`,
      ctaHref: isConvention ? (cy.registrationUrl ?? cy.href) : (nextEvent.href ?? "/events"),
      ctaExternal: isConvention && !!cy.registrationUrl,
      dateLabel: nextEvent.dateLabel,
    };
  }

  // Fallback: latest news post.
  const latest = [...POSTS].sort((a, b) => b.dateIso.localeCompare(a.dateIso))[0];
  return {
    mode: "news",
    badge: "Latest News",
    title: latest.title,
    subtitle: latest.excerpt,
    ctaLabel: "Read More",
    ctaHref: latest.href ?? `/blog/${latest.slug}`,
  };
}
