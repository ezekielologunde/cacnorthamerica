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
 *  locale-prefixed URL(s) directly avoids that redirect hop.
 *
 *  hasYo controls whether a /yo entry is listed at all. Most routes render
 *  hardcoded English JSX with no translation call, so their /yo page is
 *  byte-for-byte identical to /en -- listing both (as this used to do
 *  unconditionally) tells search engines two distinct localized pages
 *  exist when they don't, a duplicate-content problem rather than better
 *  i18n coverage. Only routes with a substantially-translated
 *  messages/yo.json namespace (verified 2026-09-06 against messages/en.json,
 *  see lib/site.ts's ROUTES comment) get hasYo: true and a hreflang
 *  alternate between the two; everything else lists /en only, with no
 *  alternate implying a Yoruba version exists. */
function localizedEntry(
  path: string,
  hasYo: boolean,
  rest: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">
): MetadataRoute.Sitemap[number][] {
  const suffix = path === "/" ? "" : path;
  if (!hasYo) {
    return [{ url: `${SITE_URL}/en${suffix}`, ...rest }];
  }
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
  const staticRoutes: MetadataRoute.Sitemap = ROUTES.flatMap(({ path, priority, yo }) =>
    localizedEntry(path, yo ?? false, { lastModified, changeFrequency: WEEKLY.has(path) ? "weekly" : "monthly", priority })
  );

  // Static blog posts (source of truth for the current blog) -- the blog
  // itself has no Yoruba translation (see ROUTES), so neither do posts.
  const staticBlogSlugs = new Set(POSTS.map((p) => p.slug));
  const staticBlogRoutes: MetadataRoute.Sitemap = POSTS.flatMap((post) =>
    localizedEntry(`/blog/${post.slug}`, false, { lastModified: new Date(post.dateIso), changeFrequency: "monthly", priority: 0.55 })
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
        localizedEntry(`/blog/${p.slug}`, false, { lastModified: new Date(p.updated_at ?? Date.now()), changeFrequency: "monthly", priority: 0.6 })
      );
  } catch {
    // Non-fatal: Supabase unavailable at build time is acceptable
  }

  return [...staticRoutes, ...staticBlogRoutes, ...dynamicBlogRoutes];
}
