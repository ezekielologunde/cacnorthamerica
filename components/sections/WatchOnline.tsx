import Link from "next/link";
import { Radio, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { VideoFacade } from "@/components/ui/VideoFacade";
import { getLiveStream, getSermons, formatSermonDate } from "@/lib/sermons";

export async function WatchOnline() {
  const [live, recent] = await Promise.all([getLiveStream(), getSermons(4)]);
  const featured = live ?? recent[0];

  // No real video available from either source — hide the section rather
  // than show an empty/broken Watch band.
  if (!featured) return null;

  const thumbnails = live ? recent.slice(0, 3) : recent.slice(1, 4);

  return (
    <section style={{ background: "var(--gradient-band)", padding: "clamp(64px,8vw,110px) clamp(20px,5vw,64px)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: -120, right: -100, width: 500, height: 400, background: "radial-gradient(circle,rgba(200,30,58,.2),transparent 65%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 36 }}>
            <div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)" }}>
                <Radio size={14} strokeWidth={2.5} aria-hidden /> Watch
              </span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", color: "#fff", margin: "10px 0 0" }}>
                {live ? "We're live right now." : "Worship with us online."}
              </h2>
            </div>
            <Link href="/online" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14.5, fontWeight: 700, color: "var(--gold)", textDecoration: "none", flexShrink: 0 }}>
              Watch Online <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: thumbnails.length ? "1.6fr 1fr" : "1fr", gap: 28, alignItems: "start" }}>
          {/* Functional content, not decorative -- no scroll-triggered
              Reveal here. This section's height (tall grid + the featured
              video's own 16:9 block) could push whileInView's intersection
              check past the point it ever fires, leaving the video/thumbs
              stuck at opacity 0 with nothing else on the page hinting why. */}
          <VideoFacade videoId={featured.id} title={featured.title} live={!!live} />

          {thumbnails.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {thumbnails.map((s) => (
                <a
                  key={s.id}
                  href={`https://www.youtube.com/watch?v=${s.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", gap: 12, alignItems: "center", textDecoration: "none", padding: 8, borderRadius: 14, transition: "background .2s" }}
                  className="watch-thumb-link"
                >
                  <img src={`https://i.ytimg.com/vi/${s.id}/mqdefault.jpg`} alt="" width={112} height={63} loading="lazy" style={{ width: 112, height: 63, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(245,246,250,.5)", marginTop: 4 }}>{formatSermonDate(s.published)}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
