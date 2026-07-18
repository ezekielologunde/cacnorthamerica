import { NextResponse } from "next/server";

// Instagram feed via Behold.so (free, no Meta Developer app required).
//
// Setup:
//   1. Create a free account at https://behold.so
//   2. Connect your Instagram account and create a Feed
//   3. Copy the Feed ID (e.g. "AbCdEfGh1234")
//   4. Add it as BEHOLD_FEED_ID in Vercel → Settings → Environment Variables
//   5. Redeploy — live posts will appear on the homepage automatically

const FEED_ID = process.env.BEHOLD_FEED_ID ?? "";

export const revalidate = 3600; // re-fetch at most once per hour

export async function GET() {
  if (!FEED_ID) {
    return NextResponse.json({ error: "BEHOLD_FEED_ID not set" }, { status: 503 });
  }

  try {
    const res = await fetch(`https://feeds.behold.so/${FEED_ID}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Behold API error:", res.status, body);
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }

    const json = await res.json();

    const posts = (json.posts ?? []).map((p: Record<string, string>) => ({
      id:        p.id,
      type:      p.mediaType,
      image:     p.thumbnailUrl ?? p.mediaUrl,
      permalink: p.permalink,
      caption:   p.caption ?? "",
      timestamp: p.timestamp,
    }));

    return NextResponse.json({ posts });
  } catch (err) {
    console.error("Behold fetch failed:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
