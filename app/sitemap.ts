import type { MetadataRoute } from "next";
import { SITE_URL, ROUTES } from "@/lib/site";
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

function entry(
  path: string,
  rest: Omit<MetadataRoute.Sitemap[number], "url">
): MetadataRoute.Sitemap[number] {
  return { url: `${SITE_URL}${path === "/" ? "" : path}`, ...rest };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticRoutes: MetadataRoute.Sitemap = ROUTES.map(({ path, priority }) =>
    entry(path, { lastModified, changeFrequency: WEEKLY.has(path) ? "weekly" : "monthly", priority })
  );

  // Static blog posts (source of truth for the current blog)
  const staticBlogSlugs = new Set(POSTS.map((p) => p.slug));
  const staticBlogRoutes: MetadataRoute.Sitemap = POSTS.map((post) =>
    entry(`/blog/${post.slug}`, { lastModified: new Date(post.dateIso), changeFrequency: "monthly", priority: 0.55 })
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
      .map((p) =>
        entry(`/blog/${p.slug}`, { lastModified: new Date(p.updated_at ?? Date.now()), changeFrequency: "monthly", priority: 0.6 })
      );
  } catch {
    // Non-fatal: Supabase unavailable at build time is acceptable
  }

  return [...staticRoutes, ...staticBlogRoutes, ...dynamicBlogRoutes];
}
