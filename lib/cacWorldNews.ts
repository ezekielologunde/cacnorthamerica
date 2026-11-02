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
  return parseFeed(await res.json());
}

function parseFeed(json: { feed?: { entry?: unknown[] } } | null): CacWorldNewsCandidate[] {
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

// ---------------------------------------------------------------------------
// Live public feed: getLatestCacWorldNews
//
// The public site no longer waits on an admin to approve each story: the
// Blogger feed is read server-side through Next's data cache (refreshed about
// every 30 minutes) and merged with any admin-approved rows. Anything an admin
// rejected or unpublished stays hidden even while it is still in the feed.
// Feed text and URLs are third-party input, so every item is re-checked here
// before it can reach a page.
// ---------------------------------------------------------------------------

const FEED_REVALIDATE_SECONDS = 1800;
const EXCERPT_MAX = 160;

function hostMatches(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function parseHttpsUrl(value: unknown): URL | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

/** Story links must point at CAC World News itself (cacworldnews.com / www.);
 *  arbitrary *.blogspot.com blogs are not accepted. */
export function isAllowedStoryUrl(value: unknown): boolean {
  const url = parseHttpsUrl(value);
  if (!url) return false;
  const host = url.hostname.toLowerCase();
  return hostMatches(host, "cacworldnews.com");
}

/** Images must be https and served from Blogger's image hosts -- the only
 *  ones next.config.ts's CSP img-src allows for these stories. Anything else
 *  is dropped (the card shows its plain fallback instead of a broken image). */
function safeImageUrl(value: unknown): string | null {
  const url = parseHttpsUrl(value);
  if (!url) return null;
  const host = url.hostname.toLowerCase();
  if (host !== "blogger.googleusercontent.com" && !hostMatches(host, "bp.blogspot.com")) return null;
  // Blogger thumbnails come as /s72-c/ or /s72-w381-h254-c/; ask for a
  // card-sized rendition instead of a 72px square.
  return url.toString().replace(/\/s72(?:-w\d+-h\d+)?-c\//, "/s640/");
}

function decodeNumericEntities(text: string): string {
  return text.replace(/&#(x[0-9a-f]+|\d+);/gi, (m, code: string) => {
    const n = code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : parseInt(code, 10);
    return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : m;
  });
}

/** Plain-text excerpt of at most EXCERPT_MAX characters, cut on a word
 *  boundary, with an ellipsis only when something was cut. */
export function toExcerpt(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = decodeNumericEntities(stripHtml(value));
  if (!text) return null;
  if (text.length <= EXCERPT_MAX) return text;
  const cut = text.slice(0, EXCERPT_MAX - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > EXCERPT_MAX / 2 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s.,;:!?–—-]+$/, "")}…`;
}

function validDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return Number.isNaN(Date.parse(value)) ? null : value;
}

/** Same story on www./bare host, http/https or with ?m=1 is one story. */
function storyKey(sourceUrl: string): string {
  const url = new URL(sourceUrl);
  return `${url.hostname.toLowerCase().replace(/^www\./, "")}${url.pathname.replace(/\/+$/, "")}`;
}

function sanitize(item: CacWorldNewsItem): CacWorldNewsItem | null {
  if (!isAllowedStoryUrl(item.sourceUrl)) return null;
  const title = typeof item.title === "string" ? decodeNumericEntities(item.title).replace(/\s+/g, " ").trim() : "";
  if (!title) return null;
  return {
    id: item.id || item.sourceUrl,
    sourceUrl: item.sourceUrl,
    title,
    excerpt: toExcerpt(item.excerpt),
    imageUrl: safeImageUrl(item.imageUrl),
    publishedAt: validDate(item.publishedAt),
  };
}

async function fetchFeedItems(): Promise<CacWorldNewsItem[]> {
  const res = await fetch(FEED_URL, { next: { revalidate: FEED_REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`CAC World feed request failed: ${res.status}`);
  return parseFeed(await res.json()).map((c) => ({ id: c.sourceUrl, ...c }));
}

// NOTE: hiding rejected stories only works if SUPABASE_SERVICE_ROLE_KEY is set in production, and takes effect after the page's revalidate window (60s on the home page).
/** Source URLs an admin rejected or unpublished (the newest few hundred is
 *  plenty: the feed only carries its latest 25 posts). Rejected rows are
 *  hidden from the anon key by RLS, so this needs the service-role key;
 *  without it the lookup quietly returns nothing (same fallback as
 *  createServiceClient). Runs in parallel with the feed and approved-row
 *  reads so an unreachable database costs one retry cycle, not two. */
async function fetchRejectedUrls(): Promise<string[]> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !key) return [];
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    db: { schema: "cacna" },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase
    .from("cac_world_news")
    .select("source_url")
    .eq("status", "rejected")
    .order("published_at", { ascending: false })
    .limit(300);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.source_url as string);
}

function logFailure(what: string, err: unknown) {
  console.error(`[cac-world-news] ${what} failed:`, err instanceof Error ? err.message : err);
}

/**
 * Newest CAC World News stories for public pages: the live Blogger feed
 * merged with admin-approved rows, deduplicated by story URL (an approved
 * row wins over its feed copy), newest first. Never throws -- if the feed or
 * the database is unreachable it returns whatever the other source gave,
 * or [].
 */
export async function getLatestCacWorldNews(limit = 6): Promise<CacWorldNewsItem[]> {
  const [feedResult, approvedResult, rejectedResult] = await Promise.allSettled([
    fetchFeedItems(),
    getApprovedCacWorldNews(Math.max(limit, 25)),
    fetchRejectedUrls(),
  ]);
  if (feedResult.status === "rejected") logFailure("feed fetch", feedResult.reason);
  if (approvedResult.status === "rejected") logFailure("approved rows", approvedResult.reason);
  if (rejectedResult.status === "rejected") logFailure("rejected lookup", rejectedResult.reason);
  const feed = feedResult.status === "fulfilled" ? feedResult.value : [];
  const approved = approvedResult.status === "fulfilled" ? approvedResult.value : [];
  const rejected = new Set(
    (rejectedResult.status === "fulfilled" ? rejectedResult.value : []).filter(isAllowedStoryUrl).map(storyKey),
  );

  const byKey = new Map<string, CacWorldNewsItem>();
  for (const raw of [...approved, ...feed]) {
    const item = sanitize(raw);
    if (!item) continue;
    const key = storyKey(item.sourceUrl);
    if (byKey.has(key) || rejected.has(key)) continue;
    byKey.set(key, item);
  }

  const time = (i: CacWorldNewsItem) => (i.publishedAt ? Date.parse(i.publishedAt) : 0);
  return [...byKey.values()].sort((a, b) => time(b) - time(a)).slice(0, Math.max(0, limit));
}
