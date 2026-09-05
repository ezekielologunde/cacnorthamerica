import type { NextConfig } from "next";

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
    // Destinations point at the default (English) locale explicitly --
    // these are old, indexed URLs with no locale segment of their own, so
    // there's no request-derived locale to preserve the way next-intl's
    // middleware does for in-app navigation.
    return [
      { source: "/leadership-meet-our-pastors", destination: "/en/leadership", permanent: true },
      { source: "/leadership-meet-our-pastors/", destination: "/en/leadership", permanent: true },
      { source: "/online-connect-to-our-services", destination: "/en/online", permanent: true },
      { source: "/online-connect-to-our-services/", destination: "/en/online", permanent: true },
      { source: "/dccs", destination: "/en/zones", permanent: true },
      { source: "/dccs/", destination: "/en/zones", permanent: true },
      { source: "/events", destination: "/en/calendar", permanent: true },
      { source: "/events/", destination: "/en/calendar", permanent: true },
      { source: "/media", destination: "/en/online", permanent: true },
      { source: "/media/", destination: "/en/online", permanent: true },
      { source: "/global", destination: "/en/leadership#global-family", permanent: true },
      { source: "/global/", destination: "/en/leadership#global-family", permanent: true },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        // middleware.ts explicitly passes this host+path combination through
        // untouched (before next-intl would otherwise redirect "/" -> "/en"
        // first and break this match) -- see its own comment for why.
        {
          source: "/",
          has: [{ type: "host" as const, value: "blog.cacnorthamerica.com" }],
          destination: "/en/blog",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
