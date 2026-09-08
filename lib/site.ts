import { googleReviews, REVIEW_AVERAGE, REVIEW_COUNT } from "@/lib/reviews";
import { conventionYears } from "@/lib/conventions";

// Canonical host. cacna.cacsalvationcenter.org is a subdomain of the sibling
// church site, so the whole CAC family shares one domain for SEO. It was
// attached to the cacnorthamerica Vercel project in September 2026 (before
// that the default had to fall back to the project's *.vercel.app domain,
// see PR #31). Three places must agree on this value, or canonicals,
// hreflang and the sitemap point Google at the wrong host:
//   1. this default,
//   2. NEXT_PUBLIC_SITE_URL in the Vercel project (it overrides this default),
//   3. Supabase Auth -> URL Configuration -> Redirect URLs (password-reset
//      emails link to SITE_URL; a host missing from that allow-list makes
//      the link silently go nowhere).
// cacnorthamerica.com still serves an old, unrelated WordPress build.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cacna.cacsalvationcenter.org";

export const SITE = {
  name: "Christ Apostolic Church North America",
  shortName: "CACNA",
  url: SITE_URL,
  description:
    "CACNA unites Christ Apostolic Church member churches across the United States, Canada, and South America under 24 Zones & DCCs, preaching the whole Gospel in a clear and undiluted manner.",
  telephone: "+1-305-469-0346",
  email: "info@cacnorthamerica.com",
  address: {
    street: "14051 Stahley Road",
    city: "Blue Ridge Summit",
    region: "PA",
    postalCode: "17214",
    country: "US",
  },
  sameAs: [
    "https://youtube.com/@cacnorthamericalatunderegi1330",
    "https://instagram.com/cacnorthamericalatunderegion",
  ],
} as const;

/** Public routes for the sitemap (path, priority, whether a real Yoruba
 *  translation exists). `yo: true` only for routes whose page actually
 *  calls getTranslations()/useTranslations() with a namespace that's
 *  substantially translated in messages/yo.json (verified 2026-09-06 by
 *  diffing every key against messages/en.json) -- most routes render
 *  hardcoded English JSX with no translation call at all, so their /yo
 *  page is byte-for-byte identical to /en. Telling search engines those
 *  are two distinct localized pages (the previous behavior) is a
 *  duplicate-content problem, not a feature; omitted here means the
 *  sitemap lists only /en for that route, with no hreflang alternate
 *  implying a Yoruba version exists. /online and /giving each have
 *  exactly one translated string (an eyebrow label) out of an otherwise
 *  fully English page -- not enough to count as localized. */
export const ROUTES: { path: string; priority: number; yo?: boolean }[] = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8, yo: true },
  { path: "/leadership", priority: 0.7 },
  { path: "/leadership/past", priority: 0.5 },
  { path: "/zones", priority: 0.7 },
  { path: "/ministries", priority: 0.7 },
  { path: "/bible-institute", priority: 0.6 },
  { path: "/statement-of-faith", priority: 0.5 },
  { path: "/online", priority: 0.9 },
  { path: "/giving", priority: 0.8 },
  { path: "/store", priority: 0.5, yo: true },
  { path: "/watchwords", priority: 0.5 },
  ...conventionYears.map((cy) => ({ path: cy.href, priority: cy.year === 2026 ? 0.75 : 0.5 })),
  { path: "/events/pilgrimage-2026", priority: 0.7 },
  { path: "/events/cacna-50th-anniversary-2026", priority: 0.6 },
  { path: "/events/ministers-retreat-2027", priority: 0.6 },
  { path: "/calendar", priority: 0.8 },
  { path: "/blog", priority: 0.6 },
  { path: "/gallery", priority: 0.6 },
  { path: "/archive", priority: 0.5 },
  { path: "/plan-your-visit", priority: 0.6, yo: true },
  { path: "/sitemap", priority: 0.3, yo: true },
  // Sub-ministry pages -- were missing from this list entirely despite
  // being live routes (found during the Phase F branding-cleanup pass,
  // 2026-09).
  { path: "/cacma", priority: 0.5, yo: true },
  { path: "/youth", priority: 0.5, yo: true },
  { path: "/christian-education", priority: 0.5, yo: true },
  { path: "/good-women", priority: 0.5, yo: true },
  { path: "/ministers-wives", priority: 0.5, yo: true },
  { path: "/business-group", priority: 0.5, yo: true },
  { path: "/children", priority: 0.5, yo: true },
  { path: "/contact", priority: 0.9, yo: true },
];

/** schema.org structured data (@graph: Church + WebSite) for rich results,
 *  local SEO, and AI answer-engines. */
export function churchJsonLd() {
  const churchId = `${SITE_URL}/#church`;
  const fullAddress = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Church",
        "@id": churchId,
        name: SITE.name,
        alternateName: SITE.shortName,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo.png`,
        image: `${SITE_URL}/images/logo.png`,
        description: SITE.description,
        telephone: SITE.telephone,
        email: SITE.email,
        priceRange: "Free",
        isAccessibleForFree: true,
        knowsLanguage: ["en", "yo"],
        areaServed: ["United States", "Canada", "South America"],
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
        geo: { "@type": "GeoCoordinates", latitude: 39.7454, longitude: -77.4894 },
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.city,
          addressRegion: SITE.address.region,
          postalCode: SITE.address.postalCode,
          addressCountry: SITE.address.country,
        },
        sameAs: SITE.sameAs,
        employee: [
          { "@type": "Person", name: "Pastor Dr. T.O. Agbeja", jobTitle: "Regional Superintendent, CACNA" },
          { "@type": "Person", name: "Pastor David Adenodi, Ph.D.", jobTitle: "Chairman, CACNA Convention" },
          { "@type": "Person", name: "Pastor Joseph Olawale Latunde", jobTitle: "Regional Secretary, CACNA" },
          { "@type": "Person", name: "Pastor Timothy Adelani", jobTitle: "Regional Treasurer, CACNA" },
          { "@type": "Person", name: "Pastor John Oluwatimilehin, Ph.D.", jobTitle: "Chairman, CAC Village Management Council" },
        ],
        ...(REVIEW_COUNT > 0 ? {
          aggregateRating: { "@type": "AggregateRating", ratingValue: String(REVIEW_AVERAGE), reviewCount: String(REVIEW_COUNT), bestRating: "5", worstRating: "1" },
          review: googleReviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            reviewRating: { "@type": "Rating", ratingValue: String(r.rating), bestRating: "5", worstRating: "1" },
            reviewBody: r.quote,
          })),
        } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE.name,
        alternateName: SITE.shortName,
        description: SITE.description,
        publisher: { "@id": churchId },
        inLanguage: "en-US",
      },
    ],
  };
}

/** BreadcrumbList JSON-LD for a deep page — pass the trail from Home to current. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path === "/" ? "" : t.path}`,
    })),
  };
}
