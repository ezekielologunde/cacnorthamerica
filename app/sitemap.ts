import type { MetadataRoute } from "next";
import { SITE_URL, ROUTES } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { POSTS } from "@/lib/blog";
import { createServiceClient } from "@/lib/supabase/server";

/** Pages whose content turns over often enough to hint "weekly"; the rest are "monthly". */
const WEEKLY = new Set([
  "/",
  "/online",
  "/events/cacna-2026",
  "/calendar",
  "/blog",
]);

/** Every public route lives under /<locale>/... (see i18n/routing.ts) — a
 *  bare, unprefixed URL just 307s to the default locale. Declaring the
 *  locale-prefixed URLs directly (with hreflang alternates between them)
 *  avoids that redirect hop and is the only way the /yo pages get listed
 *  for search engines at all; they had no sitemap presence previously. */
function localizedEntry(
  path: string,
  rest: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">
): MetadataRoute.Sitemap[number][] {
  const suffix = path === "/" ? "" : path;
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${suffix}`])
  );
  return routing.locales.map((locale) => ({
    url: languages[locale],
    ...rest,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticRoutes: MetadataRoute.Sitemap = ROUTES.flatMap(({ path, priority }) =>
    localizedEntry(path, { lastModified, changeFrequency: WEEKLY.has(path) ? "weekly" : "monthly", priority })
  );

  // Static blog posts (source of truth for the current blog)
  const staticBlogSlugs = new Set(POSTS.map((p) => p.slug));
  const staticBlogRoutes: MetadataRoute.Sitemap = POSTS.flatMap((post) =>
    localizedEntry(`/blog/${post.slug}`, { lastModified: new Date(post.dateIso), changeFrequency: "monthly", priority: 0.55 })
  );

  // Dynamic blog posts from Supabase (deduped against static set)
  let dynamicBlogRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createServiceClient();
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true);

    dynamicBlogRoutes = (posts ?? [])
      .filter((p) => !staticBlogSlugs.has(p.slug))
      .flatMap((p) =>
        localizedEntry(`/blog/${p.slug}`, { lastModified: new Date(p.updated_at ?? Date.now()), changeFrequency: "monthly", priority: 0.6 })
      );
  } catch {
    // Non-fatal: Supabase unavailable at build time is acceptable
  }

  return [...staticRoutes, ...staticBlogRoutes, ...dynamicBlogRoutes];
}
