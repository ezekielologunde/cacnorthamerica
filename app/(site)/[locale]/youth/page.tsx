import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { InstagramIcon, TikTokIcon, XIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import {
  currentOrNextConvention,
  dateRangeLabel,
  CONVENTION_VENUE,
  CONVENTION_VENUE_SHORT,
  activePricing,
} from "@/lib/conventions";
import { MEAL_SLOTS, mealSlotLabel } from "@/lib/youthRegistration";
import {
  youthSocialLinks,
  singlesSocialLinks,
  YOUTH_INSTAGRAM_URL,
  YOUTH_WHATSAPP_URL,
  YOUTH_CONTACT_EMAIL,
  type SocialPlatform,
} from "@/lib/youthSocials";
import Image from "next/image";
import Link from "next/link";
import { Big_Shoulders } from "next/font/google";
import { ArrowRight, ArrowDown } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/site";
import "./youth.css";

// The Youth page is its own world inside the site (owner request, 2026-11:
// "its own Youthful Website ... bolder ... a complete different design
// vibrant"): its sections carry their own palette and poster type, while the
// global Nav and footer stay. Styles live in ./youth.css under .yy-page.
const poster = Big_Shoulders({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-yy",
  display: "swap",
});

// Price tiers and "current or next convention" are date-driven, so re-render
// hourly like the other convention-facing pages.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Youth & Young Adult — Christ Apostolic Church North America (CACNA)",
    description:
      "CACNA's Youth & Young Adult Ministry (YYAM): convention registration for children, youth and young adults, meals, programs, and where to follow us.",
    alternates: { canonical: `${SITE_URL}/youth` },
  };
}

// 2026 Annual Convention theme + coordinator, sourced from the Convention
// site's own lib/content/youth-program.ts.
const CONVENTION_THEME = "Did God Really Say...? Knowing God's Word for Yourself";
const REGIONAL_COORDINATOR = "Pastor Adekunmi Browne";

// Real program names from cacnorthamerica.com/youth-young-adult/ -- no
// descriptions were given there beyond the titles, so none are invented here.
// Photos are each program's own real thumbnail from that page.
const programs = [
  { name: "Academic Conference", photo: "/images/cac-youth-program-academic.jpg", alt: "Young women listening during a CACNA youth Academic Conference session" },
  { name: "Leadership Retreat", photo: "/images/cac-youth-program-retreat.jpg", alt: "Leaders seated in conversation at a CACNA youth Leadership Retreat" },
  { name: "Night of Divine Encounter", photo: "/images/cac-youth-program-divine-encounter.jpg", alt: "A young man with head bowed in prayer at a Night of Divine Encounter" },
  { name: "Youth Conference", photo: "/images/cac-youth-program-conference.jpg", alt: "A large group of CACNA youth outdoors under the trees at a Youth Conference" },
];

// Transcribed from the 2026 convention program book's "CAC North America
// Youth and Young Ministry 2026 Convention Schedule" (ported from the
// Convention site's lib/content/youth-program.ts, 2026-09).
const schedule2026 = [
  {
    day: "Wednesday, July 15",
    agenda: [
      "10:00–11:00am — Praise & Worship and Opening Prayer",
      "11:30am–1:30pm — Session One: \"Did God Really Say...? How to Read the Bible for Yourself\"",
      "3:00–4:00pm — Session Two: Real Men, Real Talk / Real Women, Real Talk (Becoming Him/Her: Identity)",
      "4:00–5:00pm — Session Three: Panel Discussion — Unmasking and Healing Sexual Brokenness",
      "7:00–9:00pm — Youth Explosion Impartation Service",
    ],
  },
  {
    day: "Thursday, July 16",
    agenda: [
      "10:45–11:15am — Opening Address: \"Did God Really Say...? Knowing God's Word for Yourself\" — Pastor Adekunmi Browne",
      "11:30am–1:00pm — Session Four: Workshops (Calling All Creatives · iWorship for Psalmists & Levites · Marketplace Ministry)",
      "1:00–2:30pm — Lunch | Annual CACNA Picnic",
      "5:00–8:00pm — CACNA Praise Night!",
    ],
  },
  {
    day: "Friday, July 17",
    agenda: [
      "11:00am–1:00pm — Session Five: Breakout — Teen Talk · Singles Ministry · Marriage Ministry",
      "2:30–3:30pm — Session Six: Owning Your Health",
      "3:30–4:30pm — Session Seven: Bible Jeopardy & Prize Giveaway!",
      "4:30–5:00pm — Testimonies · Reflection · Prayer",
    ],
  },
];

// Real event photos from cacnorthamerica.com/youth-young-adult/ and the
// recovered WordPress gallery archive; alt text describes what each shows.
const moments = [
  { src: "/images/cac-youth-unity-1.jpg", alt: "A huge group of CACNA youth and pastors in matching Unity t-shirts" },
  { src: "/images/cac-youth-conference-group.jpg", alt: "Volunteers holding up a #ONECAC t-shirt at a youth registration table" },
  { src: "/photos/gallery-archive/youth3-3266.jpg", alt: "Ministers presenting a framed award at a CACNA youth gathering" },
  { src: "/photos/gallery-archive/youth-2-2567.jpg", alt: "Ministers clapping in worship at a CACNA youth service" },
];

// A 14-point starburst for the hero sticker, computed once at module scope.
const BURST = Array.from({ length: 28 }, (_, i) => {
  const r = i % 2 === 0 ? 50 : 38;
  const a = (Math.PI * i) / 14 - Math.PI / 2;
  return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
}).join(" ");

function Star() {
  return (
    <svg className="yy-star" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 1.5l2.6 7.9 7.9 2.6-7.9 2.6-2.6 7.9-2.6-7.9-7.9-2.6 7.9-2.6z" fill="currentColor" />
    </svg>
  );
}

const PLATFORM: Record<SocialPlatform, { name: string; icon: (size: number) => ReactNode }> = {
  instagram: { name: "Instagram", icon: (s) => <InstagramIcon size={s} /> },
  tiktok: { name: "TikTok", icon: (s) => <TikTokIcon size={s} /> },
  x: { name: "X", icon: (s) => <XIcon size={s} /> },
  whatsapp: { name: "WhatsApp", icon: (s) => <WhatsAppIcon size={s} /> },
};

function dollars(cents: number): string {
  return `$${cents % 100 === 0 ? cents / 100 : (cents / 100).toFixed(2)}`;
}

function shortDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
}

export default async function YouthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Youth");

  const cy = currentOrNextConvention();
  const dates = dateRangeLabel(cy);
  const venueShort = cy.venue ?? CONVENTION_VENUE_SHORT;
  const internalReg = cy.registrationUrl && cy.registrationUrl.startsWith("/") ? cy.registrationUrl : undefined;
  const youthRegisterHref = internalReg ? `${internalReg}/youth` : undefined;

  const youngAdultTier = activePricing(cy).find((tier) => tier.category === "young_adult");
  const youngAdultFee = youngAdultTier
    ? t("feeYoungAdultUntil", { price: dollars(youngAdultTier.priceCents), date: shortDate(youngAdultTier.endsOn) })
    : t("feeYoungAdultPlain");

  const ages = [
    { range: "1–10", label: t("ageChildren"), fee: t("feeFree"), tone: "lime" },
    { range: "11–19", label: t("ageYouth"), fee: t("feeFree"), tone: "pink" },
    { range: "20–29", label: t("ageYoungAdults"), fee: youngAdultFee, tone: "sun" },
  ];

  // "Tuesday Lunch — 7/13" -> day "Tue", date "7/13", meal "Lunch".
  const meals = MEAL_SLOTS.map((slot) => {
    const label = mealSlotLabel(slot, cy.startIso);
    const [dayMeal, date] = label.split(" — ");
    const [day, meal] = dayMeal.split(" ");
    return { slot, label, day: day.slice(0, 3), date, meal };
  });

  const socials = youthSocialLinks();
  const singles = singlesSocialLinks();
  const hasWhatsApp = YOUTH_WHATSAPP_URL.trim().length > 0;

  const pillars = [
    { label: t("visionLabel"), body: t("visionBody") },
    { label: t("missionLabel"), body: t("heroBody") },
    { label: t("valuesLabel"), body: t("valuesBody") },
  ];

  const ticker = [t("marqueeRegister"), dates, venueShort, t("marqueeForm"), t("heroTitleTag").replace(/[()]/g, "")];

  return (
    <main id="main-content" className={`yy-page ${poster.variable}`}>
      <Nav heroDark />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="yy-hero" aria-labelledby="yy-title">
        <svg className="yy-squiggle" viewBox="0 0 220 40" aria-hidden>
          <path d="M4 20c14-16 28-16 42 0s28 16 42 0 28-16 42 0 28 16 42 0 28-16 42 0" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        </svg>
        <div className="yy-hero-inner">
          <div className="yy-hero-copy">
            <h1 id="yy-title" className="yy-h1">
              <span className="yy-h1-org">{t("heroTitleOrg")}</span>
              <span className="yy-h1-main">{t("heroTitleMain")}</span>
              <span className="yy-h1-tag">{t("heroTitleTag")}</span>
            </h1>
            <p className="yy-tagline">
              {t("heroHeading1")} {t("heroHeading2")}
            </p>

            <div className="yy-ticket">
              <span className="yy-ticket-event">{t("heroConvention", { year: cy.year })}</span>
              <span className="yy-ticket-dates">{dates}</span>
              <span className="yy-ticket-venue">{venueShort}</span>
            </div>

            <div className="yy-hero-ctas">
              {youthRegisterHref ? (
                <Link href={youthRegisterHref} className="yy-btn yy-btn-lime yy-btn-xl">
                  {t("heroRegisterCta")} <ArrowRight size={22} strokeWidth={2.6} aria-hidden />
                </Link>
              ) : (
                <p className="yy-soon">{t("registerSoon")}</p>
              )}
              <a href="#socials" className="yy-btn yy-btn-ghost">
                {t("heroSocialCta")} <ArrowDown size={18} strokeWidth={2.4} aria-hidden />
              </a>
            </div>
          </div>

          <div className="yy-hero-art">
            <div className="yy-hero-photo">
              <Image
                src="/images/cac-youth-worship.jpg"
                alt="A CACNA youth leader in a Unity t-shirt worshipping out loud"
                fill
                priority
                sizes="(max-width: 860px) 90vw, 46vw"
                style={{ objectFit: "cover", objectPosition: "40% 30%" }}
              />
            </div>
            <div className="yy-hero-snap">
              <Image
                src="/images/cac-youth-unity-2.jpg"
                alt="CACNA youth from across North America in Unity t-shirts"
                fill
                sizes="(max-width: 860px) 46vw, 20vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="yy-burst" aria-hidden>
              <svg viewBox="0 0 100 100"><polygon points={BURST} fill="currentColor" /></svg>
              <span>{cy.year}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker (decorative: every fact in it is stated elsewhere) ── */}
      <div className="yy-ticker" aria-hidden>
        <div className="yy-ticker-track">
          {[0, 1].map((copy) => (
            <div className="yy-ticker-run" key={copy}>
              {ticker.map((item, i) => (
                <span key={i} className="yy-ticker-item">
                  {item}
                  <Star />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Who registers where ─────────────────────────────── */}
      <section className="yy-who" id="register" aria-labelledby="yy-who-h">
        <div className="yy-wrap">
          <h2 id="yy-who-h" className="yy-h2">{t("whoHeading")}</h2>
          <p className="yy-lead">{t("whoBody")}</p>

          <div className="yy-ruler">
            <div className="yy-ruler-group">
              <ol className="yy-ruler-ages">
                {ages.map((a) => (
                  <li key={a.range} className={`yy-age yy-tone-${a.tone}`}>
                    <span className="yy-age-range">{a.range}</span>
                    <span className="yy-age-label">{a.label}</span>
                    <span className="yy-age-fee">{a.fee}</span>
                  </li>
                ))}
              </ol>
              <div className="yy-ruler-dest">
                {youthRegisterHref ? (
                  <Link href={youthRegisterHref} className="yy-btn yy-btn-ink">
                    {t("youthFormCta")} <ArrowRight size={20} strokeWidth={2.6} aria-hidden />
                  </Link>
                ) : (
                  <p className="yy-soon yy-soon-dark">{t("registerSoon")}</p>
                )}
              </div>
            </div>
            <div className="yy-ruler-group yy-ruler-adults">
              <ol className="yy-ruler-ages">
                <li className="yy-age yy-tone-outline">
                  <span className="yy-age-range">30+</span>
                  <span className="yy-age-label">{t("ageAdults")}</span>
                  <span className="yy-age-fee">{t("feeAdult")}</span>
                </li>
              </ol>
              <div className="yy-ruler-dest">
                {internalReg ? (
                  <Link href={internalReg} className="yy-btn yy-btn-outline">
                    {t("mainFormCta")} <ArrowRight size={20} strokeWidth={2.6} aria-hidden />
                  </Link>
                ) : (
                  <p className="yy-soon yy-soon-dark">{t("registerSoon")}</p>
                )}
              </div>
            </div>
          </div>
          <p className="yy-fine">{t("registerBody", { dates, venue: cy.venue ?? CONVENTION_VENUE })}</p>
        </div>
      </section>

      {/* ── Food ────────────────────────────────────────────── */}
      <section className="yy-food" aria-labelledby="yy-food-h">
        <div className="yy-wrap yy-food-grid">
          <div className="yy-food-copy">
            <h2 id="yy-food-h" className="yy-h2">{t("foodHeading")}</h2>
            <p className="yy-lead">{t("foodBody")}</p>
            <p className="yy-food-note">{t("foodAllergies")}</p>
            {youthRegisterHref ? (
              <Link href={youthRegisterHref} className="yy-btn yy-btn-ink">
                {t("foodCta")} <ArrowRight size={20} strokeWidth={2.6} aria-hidden />
              </Link>
            ) : (
              <p className="yy-soon yy-soon-dark">{t("registerSoon")}</p>
            )}
            <p className="yy-food-mail">
              {t("mealQuestionsLead")} <a href={`mailto:${YOUTH_CONTACT_EMAIL}`}>{YOUTH_CONTACT_EMAIL}</a>
            </p>
          </div>
          <ul className="yy-menu" aria-label={t("foodListLabel")}>
            {meals.map((m) => (
              <li key={m.slot} className={`yy-meal yy-meal-${m.meal.toLowerCase()}`}>
                <span className="yy-sr">{m.label}</span>
                <span className="yy-meal-day" aria-hidden>{m.day}</span>
                <span className="yy-meal-date" aria-hidden>{m.date}</span>
                <span className="yy-meal-name" aria-hidden>{m.meal}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Who we are + programs + moments ─────────────────── */}
      <section className="yy-about" aria-labelledby="yy-about-h">
        <div className="yy-wrap">
          <h2 id="yy-about-h" className="yy-h2">{t("aboutHeading")}</h2>
          <dl className="yy-pillars">
            {pillars.map((p) => (
              <div key={p.label} className="yy-pillar">
                <dt>{p.label}</dt>
                <dd>{p.body}</dd>
              </div>
            ))}
          </dl>

          <div className="yy-history">
            <div>
              <h3 className="yy-h3">{t("historyHeading")}</h3>
              <p>{t("historyBody")}</p>
            </div>
            <div className="yy-history-photo">
              <ImageLightbox src="/images/cac-youth-convention.jpg" alt="CACNA youth kneeling in custom team jerseys with their names on the back" />
            </div>
          </div>

          <h2 className="yy-h2 yy-programs-h">{t("programsHeading")}</h2>
          <ul className="yy-posters">
            {programs.map((p, i) => (
              <li key={p.name} className={`yy-poster yy-poster-${i}`}>
                <div className="yy-poster-img">
                  <ImageLightbox src={p.photo} alt={p.alt} />
                </div>
                <span className="yy-poster-name">{p.name}</span>
              </li>
            ))}
          </ul>

          <h2 className="yy-h2 yy-moments-h">{t("momentsHeading")}</h2>
          <div className="yy-moments">
            {moments.map((m, i) => (
              <div key={m.src} className={`yy-moment yy-moment-${i}`}>
                <ImageLightbox src={m.src} alt={m.alt} />
              </div>
            ))}
          </div>

          <details className="yy-lookback">
            <summary>{t("lookBackSummary")}</summary>
            <div className="yy-lookback-body">
              <p>
                <strong>{t("conventionThemeLabel")}:</strong> &ldquo;{CONVENTION_THEME}&rdquo;
                <br />
                <strong>{t("coordinatorLabel")}:</strong> {REGIONAL_COORDINATOR}
              </p>
              {schedule2026.map((block) => (
                <div key={block.day}>
                  <h3 className="yy-h4">{block.day}</h3>
                  <ul>
                    {block.agenda.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* ── Socials wall ────────────────────────────────────── */}
      <section className="yy-socials" id="socials" aria-labelledby="yy-socials-h">
        <div className="yy-wrap">
          <h2 id="yy-socials-h" className="yy-h2">{t("socialsHeading")}</h2>
          <p className="yy-lead">{t("ctaBody")}</p>
          <ul className="yy-wall">
            {socials.map((s) => (
              <li key={s.platform} className={`yy-tile yy-tile-${s.platform}`}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  <span className="yy-tile-icon">{PLATFORM[s.platform].icon(40)}</span>
                  <span className="yy-tile-name">{PLATFORM[s.platform].name}</span>
                  <span className="yy-tile-handle">{s.handle}</span>
                  <span className="yy-tile-owner">{s.owner === "cacna" ? t("ownerCacna") : t("ownerYouth")}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="yy-singles">
            {singles.length > 0 ? (
              <>
                <h3 className="yy-h3">{t("singlesHeading")}</h3>
                <ul className="yy-singles-links">
                  {singles.map((s) => (
                    <li key={s.platform}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="yy-btn yy-btn-ghost">
                        {PLATFORM[s.platform].icon(20)} {PLATFORM[s.platform].name}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="yy-singles-soon">{t("singlesSoon")}</p>
            )}
          </div>

          <p className="yy-contact">
            {t("mealQuestionsLead")} <a href={`mailto:${YOUTH_CONTACT_EMAIL}`}>{YOUTH_CONTACT_EMAIL}</a>
            {" · "}
            <Link href="/contact">{t("journeyWithUsCta")}</Link>
          </p>
        </div>
      </section>

      <FooterExperience />

      {/* ── Sticky mobile action bar (hidden from 768px up) ─────── */}
      <nav className="yy-bar" aria-label={t("quickActions")}>
        {youthRegisterHref && (
          <Link href={youthRegisterHref} className="yy-bar-btn yy-bar-register">
            {t("heroRegisterCta")}
          </Link>
        )}
        {hasWhatsApp && (
          <a href={YOUTH_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="yy-bar-btn yy-bar-wa" aria-label="WhatsApp">
            <WhatsAppIcon size={22} />
          </a>
        )}
        <a href={YOUTH_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="yy-bar-btn yy-bar-ig" aria-label="Instagram @cacnayyam">
          <InstagramIcon size={22} />
        </a>
      </nav>
    </main>
  );
}
