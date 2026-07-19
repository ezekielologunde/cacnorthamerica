import { googleReviews, REVIEW_AVERAGE, REVIEW_COUNT } from "@/lib/reviews";
import { conventionYears } from "@/lib/conventions";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cacnorthamerica.com";

export const SITE = {
  name: "Christ Apostolic Church North America",
  shortName: "CACNA",
  url: SITE_URL,
  description:
    "CACNA unites Christ Apostolic Church member churches across the United States and Canada under 16 DCCs/Zones, preaching the whole Gospel in a clear and undiluted manner.",
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

/** Public routes for the sitemap (path, priority). */
export const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/leadership", priority: 0.7 },
  { path: "/leadership/past", priority: 0.5 },
  { path: "/zones", priority: 0.7 },
  { path: "/dccs", priority: 0.6 },
  { path: "/ministries", priority: 0.7 },
  { path: "/bible-institute", priority: 0.6 },
  { path: "/online", priority: 0.9 },
  { path: "/media", priority: 0.7 },
  { path: "/giving", priority: 0.8 },
  { path: "/prayer", priority: 0.8 },
  { path: "/devotional", priority: 0.7 },
  { path: "/bible-plan", priority: 0.7 },
  { path: "/salvation", priority: 0.8 },
  { path: "/events", priority: 0.7 },
  ...conventionYears.map((cy) => ({ path: cy.href, priority: cy.year === 2026 ? 0.75 : 0.5 })),
  { path: "/events/pilgrimage-2026", priority: 0.7 },
  { path: "/events/ministers-retreat-2027", priority: 0.6 },
  { path: "/calendar", priority: 0.8 },
  { path: "/testimonies", priority: 0.7 },
  { path: "/blog", priority: 0.6 },
  { path: "/store", priority: 0.5 },
  { path: "/gallery", priority: 0.6 },
  { path: "/visit", priority: 0.9 },
  { path: "/contact", priority: 0.7 },
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
        image: `${SITE_URL}/images/congregation.jpg`,
        description: SITE.description,
        telephone: SITE.telephone,
        email: SITE.email,
        priceRange: "Free",
        isAccessibleForFree: true,
        knowsLanguage: ["en", "yo"],
        areaServed: ["United States", "Canada"],
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
