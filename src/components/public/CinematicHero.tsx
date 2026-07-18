"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Menu,
  MapPin,
  Play,
  Users,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/about", label: "Who We Are" },
  { href: "/departments", label: "Ministries" },
  { href: "/events", label: "Events" },
  { href: "/leadership", label: "Leadership" },
  { href: "/zones", label: "Zones" },
  { href: "/contact", label: "Contact" },
];

export default function CinematicHero({
  photos,
  welcome,
  featuredEvent,
  zoneCount,
}: {
  photos: string[];
  welcome: string;
  featuredEvent?: {
    title: string;
    themeText?: string;
    location: string;
    startDate: string;
    endDate: string;
    slug: string;
  };
  zoneCount: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const id = setInterval(
      () => setPhotoIndex((i) => (i + 1) % photos.length),
      8000,
    );
    return () => clearInterval(id);
  }, [photos.length]);

  const goPrev = () =>
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  const goNext = () => setPhotoIndex((i) => (i + 1) % photos.length);

  const start = featuredEvent
    ? new Date(`${featuredEvent.startDate}T00:00:00`)
    : null;
  const end = featuredEvent
    ? new Date(`${featuredEvent.endDate}T00:00:00`)
    : null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-navy-950 text-cream-100">
      {/* Background photo crossfade */}
      {photos.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === photoIndex ? 1 : 0 }}
        />
      ))}

      {/* Bottom blur overlay — blur only, no darkening gradient */}
      <div
        aria-hidden
        className="hero-blur-overlay pointer-events-none absolute inset-0 z-[1] backdrop-blur-xl"
      />

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-4 py-4 sm:px-6 md:px-12 md:py-6">
        <Link
          href="/"
          className="animate-blur-fade-up font-serif-display text-lg font-semibold tracking-tight md:text-xl"
          style={{ animationDelay: "0ms" }}
        >
          CAC North America
        </Link>

        <div className="hidden items-center gap-6 text-sm lg:flex">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="animate-blur-fade-up transition-colors hover:text-gray-300"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/live"
            className="liquid-glass animate-blur-fade-up hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold sm:flex md:px-6"
            style={{ animationDelay: "350ms" }}
          >
            <Play size={16} className="fill-cream-100" />
            Watch Live
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="liquid-glass animate-blur-fade-up relative flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            style={{ animationDelay: "350ms" }}
          >
            <Menu
              size={20}
              className={`absolute transition-all duration-500 ease-out ${menuOpen ? "rotate-180 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
            />
            <X
              size={20}
              className={`absolute transition-all duration-500 ease-out ${menuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-50 opacity-0"}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`absolute left-0 right-0 top-[64px] z-40 border-t border-b border-cream-100/10 bg-navy-950/95 shadow-2xl backdrop-blur-lg transition-all duration-500 ease-out lg:hidden ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="section-shell flex flex-col py-4">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-lg px-3 py-3 text-base transition-all duration-500 hover:bg-cream-100/10 ${
                menuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: menuOpen ? `${i * 50}ms` : "0ms" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/live"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex items-center gap-2 rounded-lg border-t border-cream-100/10 px-3 py-3 pt-4 text-base font-semibold"
          >
            <Play size={16} className="fill-cream-100" />
            Watch Live
          </Link>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-8 sm:px-6 md:px-12 md:pb-16">
        <div className="flex flex-col items-end gap-8 md:flex-row">
          <div className="flex-1">
            {featuredEvent && start && end && (
              <div
                className="animate-blur-fade-up mb-6 flex flex-wrap items-center gap-3 text-xs sm:gap-6 sm:text-sm"
                style={{ animationDelay: "300ms" }}
              >
                <span className="flex items-center gap-2 font-medium">
                  <Calendar size={16} />
                  {start.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  –
                  {end.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {featuredEvent.location}
                </span>
                <span className="flex items-center gap-2">
                  <Users size={16} />
                  {zoneCount} Zones Across North America
                </span>
              </div>
            )}

            <h1
              className="animate-blur-fade-up mb-4 font-serif-display text-3xl leading-tight sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl"
              style={{ animationDelay: "400ms", letterSpacing: "-0.02em" }}
            >
              One Fold. One Shepherd.
            </h1>

            <p
              className="animate-blur-fade-up mb-6 max-w-2xl text-base text-cream-100/80 sm:text-lg md:mb-12 md:text-xl"
              style={{ animationDelay: "500ms" }}
            >
              {welcome}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/live"
                className="animate-blur-fade-up flex items-center gap-2 rounded-full bg-cream-100 px-6 py-2.5 font-medium text-navy-950 transition-colors hover:bg-cream-200 sm:px-8 sm:py-3"
                style={{ animationDelay: "600ms" }}
              >
                <Play size={18} className="fill-navy-950" />
                Join Us Online
              </Link>
              <Link
                href="/about"
                className="liquid-glass animate-blur-fade-up rounded-full px-6 py-2.5 font-medium sm:px-8 sm:py-3"
                style={{ animationDelay: "700ms" }}
              >
                Learn More
              </Link>
            </div>
          </div>

          {photos.length > 1 && (
            <div className="flex gap-3 md:w-auto">
              <button
                onClick={goPrev}
                aria-label="Previous photo"
                className="liquid-glass animate-blur-fade-up rounded-full px-4 py-2.5 sm:px-6 sm:py-3"
                style={{ animationDelay: "800ms" }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={goNext}
                aria-label="Next photo"
                className="liquid-glass animate-blur-fade-up rounded-full px-4 py-2.5 sm:px-6 sm:py-3"
                style={{ animationDelay: "900ms" }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
