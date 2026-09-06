import { createClient } from "@supabase/supabase-js";

export interface CacWorldNewsItem {
  id: string;
  sourceUrl: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
}

// db.schema: "cacna" -- see lib/leaders.ts's comment (same bug, same fix):
// without this, every query here silently hits cac-salvation-center's own
// project instead of the isolated cacna schema.
function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "cacna" } },
  );
}

export async function getApprovedCacWorldNews(limit = 6): Promise<CacWorldNewsItem[]> {
  const supabase = anonClient();
  const { data } = await supabase
    .from("cac_world_news")
    .select("id, source_url, title, excerpt, image_url, published_at")
    .eq("status", "approved")
    .order("published_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((r) => ({
    id: r.id,
    sourceUrl: r.source_url,
    title: r.title,
    excerpt: r.excerpt,
    imageUrl: r.image_url,
    publishedAt: r.published_at,
  }));
}

export interface CacWorldNewsCandidate {
  sourceUrl: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
}

const FEED_URL = "https://www.cacworldnews.com/feeds/posts/default?alt=json&max-results=25";

const HTML_ENTITIES: Record<string, string> = {
  "&nbsp;": " ", "&amp;": "&", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&lt;": "<", "&gt;": ">",
};

function stripHtml(html: string): string {
  const noTags = html.replace(/<[^>]+>/g, " ");
  const decoded = noTags.replace(/&(nbsp|amp|quot|#39|apos|lt|gt);/g, (m) => HTML_ENTITIES[m] ?? m);
  return decoded.replace(/\s+/g, " ").trim();
}

function firstImageFromContent(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

/**
 * Fetches the latest posts from CAC World News' public Blogger feed.
 * Read-only — never writes to the DB. Callers decide what to store.
 */
export async function fetchCacWorldCandidates(): Promise<CacWorldNewsCandidate[]> {
  const res = await fetch(FEED_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`CAC World feed request failed: ${res.status}`);
  const json = await res.json();
  const entries: unknown[] = json?.feed?.entry ?? [];

  return entries.map((raw): CacWorldNewsCandidate => {
    const entry = raw as {
      title?: { $t?: string };
      published?: { $t?: string };
      content?: { $t?: string };
      summary?: { $t?: string };
      media$thumbnail?: { url?: string };
      link?: { rel?: string; href?: string }[];
    };

    const link = entry.link?.find((l) => l.rel === "alternate")?.href ?? "";
    const contentHtml = entry.content?.$t ?? entry.summary?.$t ?? "";
    const excerptText = stripHtml(contentHtml).slice(0, 220);

    return {
      sourceUrl: link,
      title: entry.title?.$t ?? "Untitled",
      excerpt: excerptText || null,
      imageUrl: entry.media$thumbnail?.url?.replace(/\/s72-c\//, "/s640/") ?? firstImageFromContent(contentHtml),
      publishedAt: entry.published?.$t ?? null,
    };
  }).filter((c) => c.sourceUrl);
}
