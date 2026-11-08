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
      { protocol: "https", hostname: "cacna.org" },
    ],
  },

  compiler: {
    removeConsole: { exclude: ["error"] },
  },

  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.google-analytics.com https://unpkg.com https://js.stripe.com https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://unpkg.com",
      "img-src 'self' data: blob: https://img.youtube.com https://i.ytimg.com https://res.cloudinary.com https://*.cdninstagram.com https://cacnorthamerica.com https://blogger.googleusercontent.com https://*.bp.blogspot.com https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.g.doubleclick.net https://unpkg.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com",
      "font-src 'self' https://unpkg.com",
      "connect-src 'self' https://*.supabase.co https://api.cloudinary.com https://www.google-analytics.com https://analytics.google.com https://www.google.com https://vitals.vercel-insights.com https://*.tile.openstreetmap.org https://api.stripe.com https://checkout.stripe.com https://pagead2.googlesyndication.com https://*.g.doubleclick.net https://*.adtrafficquality.google",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://maps.google.com https://www.google.com https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com https://challenges.cloudflare.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.safeframe.googlesyndication.com https://*.adtrafficquality.google",
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
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: csp },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
      // Static photos change rarely; a week of caching (plus a day of
      // stale-while-revalidate) stops repeat visits re-downloading them.
      // Lighthouse flagged ~140 KiB of short-lived cache lifetimes.
      ...["/images/:path*", "/photos/:path*"].map((source) => ({
        source,
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      })),
    ];
  },

  async redirects() {
    return [
      // One canonical host: cacna.org. The *.vercel.app project
      // domain and the retired cacna.cacsalvationcenter.org subdomain are both
      // indexed by Google, so send every page to the canonical host. API routes
      // are left alone: Stripe webhooks and other server-to-server callers may
      // still be configured against the old hosts and do not follow redirects.
      // Preview deployments use other hostnames (and are noindex on Vercel
      // anyway), so they are unaffected. www is handled by Vercel's domain
      // redirect, not here.
      ...["cacnorthamerica.vercel.app", "cacna.cacsalvationcenter.org", "cacnorthamerica.com", "www.cacnorthamerica.com"].flatMap((host) => [
        {
          source: "/",
          has: [{ type: "host" as const, value: host }],
          destination: "https://cacna.org/",
          permanent: true,
        },
        {
          source: "/:path((?!api/|_next/).*)",
          has: [{ type: "host" as const, value: host }],
          destination: "https://cacna.org/:path",
          permanent: true,
        },
      ]),
      // Youth & Young Adult Ministry has its own site (yyam.cacna.org). Hash links
      // such as /youth#register carry over to the matching YYAM home sections.
      { source: "/youth", destination: "https://yyam.cacna.org/", permanent: true },
      { source: "/en/youth", destination: "https://yyam.cacna.org/", permanent: true },
      { source: "/yyam", destination: "https://yyam.cacna.org/", permanent: true },
      { source: "/yyam/:path*", destination: "https://yyam.cacna.org/:path*", permanent: true },
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

      // The old WordPress site (cacnorthamerica.com, retired 2026-11) is still
      // indexed by Google. Send its URLs to the closest page here so search
      // traffic and any inbound links land somewhere useful. Spam, scanner and
      // demo-theme URLs from that site (/feed, /newsite/*, /practice-areas, ...)
      // are deliberately NOT redirected: they should 404. Same-path matches
      // (/cacma, /gallery, /contact) need no entry. Trailing slashes are
      // normalised by Next before these are matched.
      ...(
        [
          ["/cac-north-america", "/"],
          ["/about-us", "/about"],
          ["/our-tenets", "/statement-of-faith"],
          ["/current-leaders", "/leadership"],
          ["/cac-current-leaders-2", "/leadership"],
          ["/presidency", "/leadership"],
          ["/:slug(pastor-[^/]+-profile)", "/leadership"],
          ["/prophet-h-o-oladeji-profile", "/leadership"],
          ["/pastor-so-oladele", "/leadership"],
          ["/pastor-agbeja-profile", "/leadership"],
          ["/past-leaders", "/leadership/past"],
          ["/cac-past-leaders", "/leadership/past"],
          ["/dcc-zonal-superintendents", "/zones"],
          ["/c-a-c-north-washington-zone", "/zones"],
          ["/portfolio-item/:slug(c-a-c-[^/]+-zone)", "/zones"],
          ["/portfolio-item/:slug([^/]+-dcc)", "/zones"],
          ["/departments", "/ministries"],
          ["/administration-department", "/ministries"],
          ["/music-department", "/ministries"],
          ["/2947-2", "/ministries"],
          ["/evangelical", "/ministries"],
          ["/portfolio-item/administration", "/ministries"],
          ["/portfolio-item/2203", "/ministries"],
          ["/portfolio-item/2483", "/ministries"],
          ["/youth-young-adult", "https://yyam.cacna.org/"],
          ["/portfolio-item/youth-conference", "https://yyam.cacna.org/programs"],
          ["/portfolio-item/2496", "/christian-education"],
          ["/upcoming-events", "/calendar"],
          ["/live-streaming", "/online"],
          ["/sermons", "/online"],
          ["/sermons/lord", "/online"],
          ["/portfolio-item/2026-cacna-annual-convention", "/events/cacna-2026"],
          ["/2026-cacna-national-convention", "/events/cacna-2026"],
          ["/portfolio-item/2026-cac-north-america-pilgrim-tour", "/events/pilgrimage-2026"],
          ["/2026-cac-north-america-pilgrim-tour", "/events/pilgrimage-2026"],
          ["/retreat", "/events/ministers-retreat-2027"],
          ["/portfolio-item/retreat", "/events/ministers-retreat-2027"],
          ["/portfolio-item/leadership-retreat", "/events/ministers-retreat-2027"],
          ["/portfolio-item/cac-na-men-of-nobility", "/cacma"],
          ["/cac-na-men-of-nobility", "/cacma"],
          ["/portfolio-item/2026-regional-general-council-meeting", "/calendar"],
          ["/2026-regional-general-council-meeting", "/calendar"],
          ["/portfolio-item/cac-north-america-2026-sunday-school-rally", "/calendar"],
          ["/cac-north-america-2026-sunday-school-rally", "/calendar"],
          ["/event/cacna-2024-annual-convention", "/archive"],
          ["/venue/:path*", "/archive"],
          ["/organizer/:path*", "/archive"],
          ["/prayer-request-2", "/contact"],
          ["/form", "/contact"],
          ["/donation", "/giving"],
          ["/online-giving", "/giving"],
          ["/about-2/gallery", "/gallery"],
          ["/category/news", "/blog"],
        ] as const
      ).map(([source, destination]) => ({ source, destination, permanent: true })),
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
