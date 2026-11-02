import { Globe2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { getLatestCacWorldNews, type CacWorldNewsItem } from "@/lib/cacWorldNews";
// hm-head / hm-link: 44px tap target and heading size on phones.
import "./home-mobile.css";

const CAC_WORLD_NEWS_URL = "https://www.cacworldnews.com/";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function StoryCard({ item, delay }: { item: CacWorldNewsItem; delay: number }) {
  const date = formatDate(item.publishedAt);
  return (
    <Reveal delay={delay} style={{ height: "100%" }}>
      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="card-lift"
        style={{
          textDecoration: "none", color: "inherit", background: "var(--paper)",
          border: "1px solid var(--line)", borderRadius: 22, overflow: "hidden",
          display: "flex", flexDirection: "column", height: "100%",
        }}
      >
        <div style={{ position: "relative", height: 160, flexShrink: 0, background: "var(--blue)", display: "grid", placeItems: "center" }}>
          {item.imageUrl ? (
            // Plain img, not next/image: images.unoptimized is on site-wide,
            // so next/image would add nothing but a remotePatterns entry.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Globe2 size={34} strokeWidth={1.6} color="rgba(255,255,255,.55)" aria-hidden />
          )}
        </div>
        <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-.3px", lineHeight: 1.22, margin: 0, textWrap: "balance" }}>
            {item.title}
          </h3>
          {item.excerpt && (
            <p style={{
              fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.62, margin: 0, flex: 1,
              display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {item.excerpt}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--line)", fontSize: 12.5, color: "var(--ink-soft)" }}>
            <span style={{ fontWeight: 700, color: "var(--red)" }}>
              CAC World News <span aria-hidden>↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
            {date && <time dateTime={item.publishedAt ?? undefined}>{date}</time>}
          </div>
        </div>
      </a>
    </Reveal>
  );
}

/**
 * The newest stories from CAC World News (cacworldnews.com), each linking out
 * to the original. Server component: the data comes from
 * getLatestCacWorldNews (live feed, cached ~30 min) during render, so pages
 * can drop it in without a client fetch. Renders nothing when no stories are
 * available, so a feed outage never leaves an empty box on the page.
 */
export async function CacWorldNewsStrip({
  limit = 3,
  title = "From CAC World News",
  background = "var(--cream-2)",
}: {
  limit?: number;
  title?: string;
  background?: string;
}) {
  const stories = await getLatestCacWorldNews(limit);
  if (stories.length === 0) return null;

  return (
    <section
      aria-labelledby="cac-world-news-strip-title"
      style={{ background, padding: "clamp(56px,7vw,96px) clamp(20px,5vw,64px)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal className="hm-head" style={{ marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div style={{ maxWidth: 620 }}>
            <h2 id="cac-world-news-strip-title" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-1.2px", margin: "0 0 10px", lineHeight: 1.02 }}>
              {title}
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>
              Stories from Christ Apostolic Church congregations worldwide, as reported by CAC World News.
            </p>
          </div>
          <a
            href={CAC_WORLD_NEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="press hm-link"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: "var(--red)", textDecoration: "none" }}
          >
            More on cacworldnews.com <span aria-hidden style={{ fontSize: 17 }}>↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 22 }}>
          {stories.map((item, i) => <StoryCard key={item.id} item={item} delay={i * 80} />)}
        </div>
      </div>
    </section>
  );
}
