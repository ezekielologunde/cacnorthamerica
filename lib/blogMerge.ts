// Pure helpers shared by the home page and /blog, kept free of runtime
// imports so `npm test` can load them directly (type imports are erased).
import type { BlogPost } from "./blog";

/**
 * Every published post: the hand-written static POSTS first (in their own
 * order, so POSTS[0] stays /blog's lead story), then the posts published from
 * /admin/blog, newest first. A database post whose slug matches a static post
 * is dropped -- /blog/[slug] always renders the static one for that slug, so
 * listing both would show one post twice with only one of them reachable.
 */
export function mergeBlogPosts(staticPosts: readonly BlogPost[], dbPosts: readonly BlogPost[]): BlogPost[] {
  const seen = new Set(staticPosts.map((p) => p.slug));
  const extra: BlogPost[] = [];
  for (const p of [...dbPosts].sort((a, b) => b.dateIso.localeCompare(a.dateIso))) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    extra.push(p);
  }
  return [...staticPosts, ...extra];
}

/** Newest post by date, skipping any slug in `exclude`. */
export function latestBlogPost(posts: readonly BlogPost[], exclude: readonly string[] = []): BlogPost | undefined {
  const skip = new Set(exclude);
  return [...posts]
    .filter((p) => !skip.has(p.slug))
    .sort((a, b) => b.dateIso.localeCompare(a.dateIso))[0];
}
