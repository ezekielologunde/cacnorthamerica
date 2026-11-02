import { Reveal } from "@/components/ui/Reveal";
import { VideoFacade } from "@/components/ui/VideoFacade";
import { featuredStories, youtubeWatchUrl } from "@/lib/featuredStories";

/**
 * "Featured stories" band: the videos in lib/featuredStories.ts, each a
 * click-to-play facade (the YouTube embed loads only when the visitor
 * presses play) with a visible credit to the channel and a link out to the
 * video on YouTube. `tone` matches the page it sits on.
 */
export function FeaturedStories({
  tone = "light",
  background,
}: {
  tone?: "light" | "dark";
  /** Section background; defaults to the light band or transparent on dark pages. */
  background?: string;
}) {
  const stories = featuredStories();
  if (stories.length === 0) return null;

  const dark = tone === "dark";
  const heading = dark ? "#fff" : "var(--ink)";
  const body = dark ? "rgba(255,255,255,.6)" : "var(--ink-soft)";
  const link = dark ? "var(--gold)" : "var(--red)";
  // The channel credit is a link, so on dark it gets more contrast than body copy.
  const channelLink = dark ? "rgba(255,255,255,.85)" : "var(--ink-soft)";

  return (
    <section
      aria-labelledby="featured-stories-heading"
      style={{ background: background ?? (dark ? "transparent" : "var(--cream-2)"), padding: "clamp(56px,8vw,100px) clamp(20px,5vw,64px)" }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal style={{ marginBottom: 32 }}>
          <h2 id="featured-stories-heading" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", color: heading, margin: "0 0 10px", lineHeight: 1 }}>
            Featured stories
          </h2>
          <p style={{ fontSize: 16, color: body, lineHeight: 1.65, margin: 0, maxWidth: 600 }}>
            Videos from across the Christ Apostolic Church family, shared from YouTube.
          </p>
        </Reveal>

        {/* No scroll Reveal on the videos themselves: see the note in
            components/sections/WatchOnline.tsx about tall functional blocks. */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: "clamp(24px,3vw,36px)" }}>
          {stories.map((s) => (
            <li key={s.id} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <VideoFacade videoId={s.id} title={s.title} showTitle={false} />
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-.3px", color: heading, margin: 0, lineHeight: 1.3 }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 14, color: body, lineHeight: 1.6, margin: 0 }}>
                Credit:{" "}
                <a href={s.channelUrl} target="_blank" rel="noopener noreferrer" style={{ color: channelLink, fontWeight: 700 }}>
                  {s.channel} (YouTube)
                </a>
                <span aria-hidden> · </span>
                <a href={youtubeWatchUrl(s.id)} target="_blank" rel="noopener noreferrer" aria-label={`Watch "${s.title}" on YouTube (opens in a new tab)`} style={{ color: link, fontWeight: 700, textDecoration: "none" }}>
                  Watch on YouTube →
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
