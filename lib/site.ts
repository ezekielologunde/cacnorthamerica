import { googleReviews, REVIEW_AVERAGE, REVIEW_COUNT } from "@/lib/reviews";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cacsalvationcenter.org";

export const SITE = {
  name: "Christ Apostolic Church Salvation Center",
  shortName: "CAC Salvation Center",
  url: SITE_URL,
  description:
    "Real worship, real community — preaching the whole Gospel in a clear and undiluted manner. Join us Sundays at 10:30 AM ET in Randallstown, MD, and online.",
  telephone: "+1-443-272-6794",
  email: "info@cacsalvationcenter.org",
  address: {
    street: "10710 Marriottsville Rd",
    city: "Randallstown",
    region: "MD",
    postalCode: "21133",
    country: "US",
  },
  sameAs: [
    "https://www.facebook.com/CacSalvationCenterBaltimore",
    "https://www.instagram.com/salvationcenterbaltimore/",
    "https://www.youtube.com/channel/UCoogH4HuVXSn4okSpRlsDQA",
    "https://www.tiktok.com/@salvationcenterus",
  ],
} as const;

/** Public routes for the sitemap (path, priority). */
export const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/leadership", priority: 0.7 },
  { path: "/ministries", priority: 0.7 },
  { path: "/online", priority: 0.9 },
  { path: "/giving", priority: 0.8 },
  { path: "/building", priority: 0.8 },
  { path: "/prayer", priority: 0.8 },
  { path: "/devotional", priority: 0.7 },
  { path: "/bible-plan", priority: 0.7 },
  { path: "/salvation", priority: 0.8 },
  { path: "/salvationcity", priority: 0.8 },
  { path: "/events", priority: 0.7 },
  { path: "/events/good-women-anniversary", priority: 0.65 },
  { path: "/events/24th-anniversary", priority: 0.75 },
  { path: "/events/cacna-2026", priority: 0.75 },
  { path: "/events/pilgrimage-2026", priority: 0.7 },
  { path: "/events/macedonia-outreach", priority: 0.7 },
  { path: "/calendar", priority: 0.8 },
  { path: "/testimonies", priority: 0.7 },
  { path: "/ilorin", priority: 0.6 },
  { path: "/blog", priority: 0.6 },
  { path: "/store", priority: 0.5 },
  { path: "/gallery", priority: 0.6 },
  { path: "/visit", priority: 0.9 },
  { path: "/venue", priority: 0.75 },
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
        areaServed: ["Randallstown", "Baltimore", "Maryland", "United States"],
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
        geo: { "@type": "GeoCoordinates", latitude: 39.37797, longitude: -76.8505 },
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.city,
          addressRegion: SITE.address.region,
          postalCode: SITE.address.postalCode,
          addressCountry: SITE.address.country,
        },
        sameAs: SITE.sameAs,
        founder: { "@type": "Person", name: "Pastor Dr. H.O. Ilufoye" },
        employee: [
          { "@type": "Person", name: "Pastor Dr. Hezekiah O. Ilufoye PhD", jobTitle: "Baltimore DCC Superintendent" },
          { "@type": "Person", name: "Pastor Felix Osunkiyesi", jobTitle: "Curate" },
          { "@type": "Person", name: "Pastor Alfred Aremo", jobTitle: "Associate Pastor" },
          { "@type": "Person", name: "Pastor Oludapo Eludoyin", jobTitle: "Associate Pastor" },
          { "@type": "Person", name: "Pastor Enoch Ilufoye", jobTitle: "Assembly Pastor, CAC Kingdom Embassy" },
        ],
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "09:25", closes: "12:30" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "19:00", closes: "20:30" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "19:00", closes: "20:30" },
        ],
        aggregateRating: { "@type": "AggregateRating", ratingValue: String(REVIEW_AVERAGE), reviewCount: String(REVIEW_COUNT), bestRating: "5", worstRating: "1" },
        review: googleReviews.map((r) => ({
          "@type": "Review",
          author: { "@type": "Person", name: r.name },
          reviewRating: { "@type": "Rating", ratingValue: String(r.rating), bestRating: "5", worstRating: "1" },
          reviewBody: r.quote,
        })),
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
