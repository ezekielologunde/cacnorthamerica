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

// lastModified is only sent where the data has a real date (blog posts).
// Static pages have no recorded edit date, and stamping every one with the
// build time tells Google they all changed on every deploy, which teaches it
// to ignore the field.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Several past convention years share /archive as their href; list each URL once.
  const uniqueRoutes = [...new Map(ROUTES.map((r) => [r.path, r])).values()];
  const staticRoutes: MetadataRoute.Sitemap = uniqueRoutes.map(({ path, priority }) =>
    entry(path, { changeFrequency: WEEKLY.has(path) ? "weekly" : "monthly", priority })
  );

  // Static blog posts (source of truth for the current blog)
  const staticBlogSlugs = new Set(POSTS.map((p) => p.slug));
  const staticBlogRoutes: MetadataRoute.Sitemap = POSTS.map((post) =>
    entry(`/blog/${post.slug}`, { lastModified: new Date(post.dateIso), changeFrequency: "monthly", priority: 0.6 })
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
        entry(`/blog/${p.slug}`, {
          ...(p.updated_at ? { lastModified: new Date(p.updated_at) } : {}),
          changeFrequency: "monthly",
          priority: 0.6,
        })
      );
  } catch {
    // Non-fatal: Supabase unavailable at build time is acceptable
  }

  return [...staticRoutes, ...staticBlogRoutes, ...dynamicBlogRoutes];
}
