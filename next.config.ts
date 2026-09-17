import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    // Vercel's Image Optimization quota is exhausted on this account's plan
    // (confirmed via a 402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED once the
    // stale image cache was purged — every /_next/image request was silently
    // failing behind a cached response until then). Serve raw files instead
    // of failing to render, same fix already applied on the sibling
    // Convention project for the identical reason.
    unoptimized: true,
    // Next.js 15+ defaults this to "attachment", which makes browsers treat
    // every /_next/image response as a file download instead of an inline
    // image. Harmless with unoptimized:true (this path isn't hit), but keeps
    // behavior correct if unoptimized is ever turned back off.
    contentDispositionType: "inline",
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.cdninstagram.com" },
      { protocol: "https", hostname: "cacnorthamerica.com" },
    ],
  },

  compiler: {
    removeConsole: { exclude: ["error"] },
  },

  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://unpkg.com",
      "img-src 'self' data: blob: https://img.youtube.com https://res.cloudinary.com https://*.cdninstagram.com https://cacnorthamerica.com https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://unpkg.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com",
      "font-src 'self' https://unpkg.com",
      "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://www.google.com https://vitals.vercel-insights.com https://*.tile.openstreetmap.org",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://maps.google.com https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: csp },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // cacnorthamerica.vercel.app was the declared canonical host until
      // cacna.cacsalvationcenter.org was attached (September 2026), so Google
      // has it indexed. Send every page there to the subdomain so there is one
      // canonical host. API routes are left alone: Stripe webhooks and other
      // server-to-server callers may still be configured against the old host
      // and do not follow redirects. Preview deployments use other hostnames
      // (and are noindex on Vercel anyway), so they are unaffected.
      {
        source: "/",
        has: [{ type: "host" as const, value: "cacnorthamerica.vercel.app" }],
        destination: "https://cacna.cacsalvationcenter.org/",
        permanent: true,
      },
      {
        source: "/:path((?!api/|_next/).*)",
        has: [{ type: "host" as const, value: "cacnorthamerica.vercel.app" }],
        destination: "https://cacna.cacsalvationcenter.org/:path",
        permanent: true,
      },
      { source: "/leadership-meet-our-pastors", destination: "/leadership", permanent: true },
      { source: "/leadership-meet-our-pastors/", destination: "/leadership", permanent: true },
      { source: "/online-connect-to-our-services", destination: "/online", permanent: true },
      { source: "/online-connect-to-our-services/", destination: "/online", permanent: true },
      { source: "/dccs", destination: "/zones", permanent: true },
      { source: "/dccs/", destination: "/zones", permanent: true },
      { source: "/events", destination: "/calendar", permanent: true },
      { source: "/events/", destination: "/calendar", permanent: true },
      { source: "/media", destination: "/online", permanent: true },
      { source: "/media/", destination: "/online", permanent: true },
      { source: "/global", destination: "/leadership#global-family", permanent: true },
      { source: "/global/", destination: "/leadership#global-family", permanent: true },

      // The Yoruba locale was retired (2026-09) -- most /yo pages were
      // untranslated near-duplicates of their English counterparts, which
      // Search Console was flagging as duplicate content with a canonical
      // mismatch. Google still has a batch of /yo/... URLs indexed, so send
      // them to their English equivalent instead of letting them 404.
      { source: "/yo", destination: "/", permanent: true },
      { source: "/yo/:path*", destination: "/:path*", permanent: true },

      // These individual leader-bio pages predate "Past Leaders" becoming a
      // photo gallery (see app/(site)/[locale]/leadership/past/page.tsx) --
      // nothing on the live site links to them anymore, but Search Console
      // still has them indexed as 404s from the old site structure.
      { source: "/leadership/samuel-kayode-abiara", destination: "/leadership/past", permanent: true },
      { source: "/leadership/jacob-o-alokan", destination: "/leadership/past", permanent: true },
      { source: "/leadership/m-o-agbaje", destination: "/leadership/past", permanent: true },
      { source: "/leadership/timothy-adelani", destination: "/leadership/past", permanent: true },
      { source: "/leadership/s-batholomew-odusona", destination: "/leadership/past", permanent: true },
      { source: "/leadership/j-a-sanya", destination: "/leadership/past", permanent: true },
      { source: "/leadership/j-a-medaiyese", destination: "/leadership/past", permanent: true },
      { source: "/leadership/gabriel-o-olaoye", destination: "/leadership/past", permanent: true },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        // proxy.ts explicitly passes this host+path combination through
        // untouched so this rewrite -- not next-intl's routing -- is what
        // resolves the blog subdomain's root path. See its own comment.
        {
          source: "/",
          has: [{ type: "host" as const, value: "blog.cacnorthamerica.com" }],
          destination: "/blog",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withNextIntl(nextConfig);
