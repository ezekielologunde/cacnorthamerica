const CHANNEL_ID = "UCoogH4HuVXSn4okSpRlsDQA";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export interface Sermon {
  id: string;
  title: string;
  published: string;
}

const FALLBACK: Sermon[] = [
  { id: "RTfTTF8zoz0", title: "Sunday Worship Service", published: "" },
  { id: "-Sr681xHLW0", title: "Sunday Worship Service", published: "" },
  { id: "xIZBd9UYIDw", title: "Sunday Worship", published: "" },
];

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
    const data = await res.json() as { items?: { id: { videoId: string }; snippet: { title: string; publishedAt: string } }[] };
    const items = data.items ?? [];
    if (!items.length) return null;
    return items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      published: item.snippet.publishedAt ?? "",
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
      if (id && title) sermons.push({ id, title: decodeXml(title), published: published ?? "" });
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
  if (!iso) return "CAC Salvation Center";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "CAC Salvation Center";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
