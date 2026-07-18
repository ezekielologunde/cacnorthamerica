import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.cdninstagram.com" },
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
      "img-src 'self' data: blob: https://img.youtube.com https://res.cloudinary.com https://*.cdninstagram.com https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://unpkg.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com",
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
      { source: "/leadership-meet-our-pastors", destination: "/leadership", permanent: true },
      { source: "/leadership-meet-our-pastors/", destination: "/leadership", permanent: true },
      { source: "/online-connect-to-our-services", destination: "/online", permanent: true },
      { source: "/online-connect-to-our-services/", destination: "/online", permanent: true },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host" as const, value: "blog.cacsalvationcenter.org" }],
          destination: "/blog",
        },
        {
          source: "/",
          has: [{ type: "host" as const, value: "city.cacsalvationcenter.org" }],
          destination: "/salvationcity",
        },
        {
          source: "/",
          has: [{ type: "host" as const, value: "ilorin.cacsalvationcenter.org" }],
          destination: "/ilorin",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
