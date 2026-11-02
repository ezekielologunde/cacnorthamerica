import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// AI assistants and answer-engines we explicitly welcome — being listed by name
// improves "AI reach" (citations in ChatGPT, Claude, Perplexity, Google AI, etc.)
// and future-proofs us if the wildcard group is ever tightened.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "DuckAssistBot",
  "Meta-ExternalAgent",
];

// Convention and CAC Village pages must stay crawlable (they are the pages
// people search "CAC Village", "CAC City of Prayer" and "CACNA Annual
// Convention" to reach). Listing them as explicit allows keeps them open even
// if a broader disallow is added to the wildcard group later; the longest
// matching rule wins, so these always beat any shorter disallow.
const KEY_PUBLIC_PATHS = ["/events", "/archive", "/about", "/giving", "/calendar"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Everyone is welcome to crawl the public site; admin and checkout are private.
      {
        userAgent: "*",
        // /category/news is the one old category URL we redirect (see
        // next.config.ts); it must stay crawlable or Google never sees the
        // 301. The longer allow path wins over the "/category/" disallow.
        // /api/gallery feeds the /gallery page's photo grid client-side, so
        // it stays crawlable for Google's renderer; the rest of /api/ is
        // form posts, checkout and webhooks.
        allow: ["/", "/category/news", "/api/gallery", ...KEY_PUBLIC_PATHS],
        disallow: [
          "/admin",
          "/api/",
          "/newsletter",
          // Post-payment receipts: per-person pages reached from Stripe, never
          // search results. They also send noindex (see each page's metadata).
          "/events/*/register/confirmation",
          "/giving/confirmation",
          "/store/confirmation",
          // This domain ran WordPress before this Next.js rebuild. These paths
          // are leftovers Google still remembers crawling (theme assets,
          // uploads, category archives) that now 404 correctly — disallowing
          // them stops the repeat crawl attempts Search Console keeps
          // flagging under "Page indexing / Not found (404)".
          "/wp-content/", "/wp-admin/", "/wp-includes/", "/wp-json/", "/xmlrpc.php",
          "/category/",
        ],
      },
      { userAgent: AI_BOTS, allow: "/" },
      // Google Ads' landing-page crawler ignores the "*" group, so it must be
      // addressed by name or Ads can't verify the pages it sends traffic to.
      { userAgent: ["AdsBot-Google", "AdsBot-Google-Mobile"], allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
