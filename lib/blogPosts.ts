import { createClient } from "@supabase/supabase-js";
import { POSTS, CATEGORY_COLOR, CATEGORY_ACCENT, type BlogPost } from "@/lib/blog";
import { parseAuthors } from "@/lib/blog-authors";
import { mergeBlogPosts } from "@/lib/blogMerge";

type DbBlogRow = {
  id: string; title: string; slug: string; excerpt: string | null;
  body: string; published_at: string | null; created_at: string;
  image_url: string | null; image_alt: string | null; authors: unknown;
};

function dbPostToBlogPost(p: DbBlogRow): BlogPost {
  const date = new Date(p.published_at ?? p.created_at);
  const words = p.body.split(/\s+/).length;
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? p.body.slice(0, 160) + "…",
    date: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    dateIso: p.published_at ?? p.created_at,
    category: "Ministry Update",
    categoryColor: CATEGORY_COLOR["Ministry Update"],
    accent: CATEGORY_ACCENT["Ministry Update"],
    readTime: `${Math.max(1, Math.round(words / 200))} min read`,
    featured: true,
    authors: parseAuthors(p.authors),
    image: p.image_url ? { url: p.image_url, alt: p.image_alt ?? p.title } : undefined,
    body: p.body.split(/\n\n+/),
  };
}

/**
 * Every published post for public listings (home page and /blog): the static
 * POSTS plus whatever has been published from /admin/blog. Never throws -- if
 * the database is unreachable it falls back to the static posts alone.
 */
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [...POSTS];
  try {
    // db.schema: "cacna" -- see lib/supabase/server.ts's comment; without it
    // this silently hits cac-salvation-center's own project instead.
    const { data, error } = await createClient(url, key, { db: { schema: "cacna" } })
      .from("blog_posts")
      .select("id, title, slug, excerpt, body, published_at, created_at, image_url, image_alt, authors")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return mergeBlogPosts(POSTS, (data ?? []).map(dbPostToBlogPost));
  } catch (err) {
    console.error("[blog] published posts lookup failed:", err instanceof Error ? err.message : err);
    return [...POSTS];
  }
}
