import type { MetadataRoute } from "next";
import { SITE_URL, ROUTES } from "@/lib/site";
import { POSTS } from "@/lib/blog";
import { createServiceClient } from "@/lib/supabase/server";

/** Pages whose content turns over often enough to hint "weekly"; the rest are "monthly". */
const WEEKLY = new Set([
  "/",
  "/online",
  "/events",
  "/events/good-women-anniversary",
  "/events/cacna-2026",
  "/calendar",
  "/devotional",
  "/bible-plan",
  "/blog",
  "/testimonies",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticRoutes: MetadataRoute.Sitemap = ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: WEEKLY.has(path) ? "weekly" : "monthly",
    priority,
  }));

  // Static blog posts (source of truth for the current blog)
  const staticBlogSlugs = new Set(POSTS.map((p) => p.slug));
  const staticBlogRoutes: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.dateIso),
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

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
      .map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: new Date(p.updated_at ?? Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
  } catch {
    // Non-fatal: Supabase unavailable at build time is acceptable
  }

  return [...staticRoutes, ...staticBlogRoutes, ...dynamicBlogRoutes];
}
