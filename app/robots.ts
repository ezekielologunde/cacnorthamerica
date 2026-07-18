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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Everyone is welcome to crawl the public site; admin and checkout are private.
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin", "/admin/", "/store/success",
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
