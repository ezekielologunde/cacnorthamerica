const CHANNEL_ID = "UC9wwlYWGoII3B5vLtnIvJEw"; // CAC North America (Latunde Region)
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export interface Sermon {
  id: string;
  title: string;
  published: string;
  description?: string;
}

const FALLBACK: Sermon[] = [];

function decodeXml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

export async function getLiveStream(): Promise<Sermon | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  try {
    const url =
      `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet&channelId=${CHANNEL_ID}&type=video` +
      `&eventType=live&maxResults=1&key=${encodeURIComponent(key)}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json() as { items?: { id: { videoId: string }; snippet: { title: string; publishedAt: string } }[] };
    const items = data.items ?? [];
    if (!items.length) return null;
    return { id: items[0].id.videoId, title: items[0].snippet.title, published: items[0].snippet.publishedAt ?? "" };
  } catch {
    return null;
  }
}

async function fromApi(limit: number): Promise<Sermon[] | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  try {
    const url =
      `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet&channelId=${CHANNEL_ID}&type=video` +
      `&eventType=completed&order=date&maxResults=${limit}&key=${encodeURIComponent(key)}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json() as { items?: { id: { videoId: string }; snippet: { title: string; publishedAt: string; description?: string } }[] };
    const items = data.items ?? [];
    if (!items.length) return null;
    return items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      published: item.snippet.publishedAt ?? "",
      description: item.snippet.description || undefined,
    }));
  } catch {
    return null;
  }
}

async function fromRss(limit: number): Promise<Sermon[] | null> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);
    const sermons: Sermon[] = [];
    for (const entry of entries) {
      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
      const title = entry.match(/<title>([^<]*)<\/title>/)?.[1];
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
      const description = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1]?.trim();
      if (id && title) sermons.push({ id, title: decodeXml(title), published: published ?? "", description: description ? decodeXml(description) : undefined });
    }
    return sermons.length ? sermons.slice(0, limit) : null;
  } catch {
    return null;
  }
}

export async function getSermons(limit = 9): Promise<Sermon[]> {
  const api = await fromApi(limit);
  if (api?.length) return api;

  const rss = await fromRss(limit);
  if (rss?.length) return rss;

  return FALLBACK;
}

export function formatSermonDate(iso: string): string {
  if (!iso) return "CACNA";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "CACNA";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * schema.org VideoObject list for the sermons shown on a page, so search engines
 * can index each replay as a video result. thumbnailUrl/embedUrl point at YouTube;
 * the description falls back to the title-based line when YouTube has none.
 */
export function videoListJsonLd(videos: Sermon[], pageUrl: string) {
  const items = videos
    .filter((v) => v.id && v.title && !Number.isNaN(new Date(v.published).getTime()))
    .map((v) => ({
      "@type": "VideoObject",
      name: v.title,
      description: (v.description?.split(String.fromCharCode(10))[0] || `${v.title} — Christ Apostolic Church North America.`).slice(0, 300),
      thumbnailUrl: [`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`],
      uploadDate: new Date(v.published).toISOString(),
      embedUrl: `https://www.youtube.com/embed/${v.id}`,
      contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
      publisher: { "@type": "Organization", name: "Christ Apostolic Church North America" },
    }));
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: pageUrl,
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })),
  };
}
