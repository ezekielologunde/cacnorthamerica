"use client";
import { useState } from "react";
import { Play } from "lucide-react";

/**
 * Click-to-play YouTube facade — a real thumbnail + play button that swaps
 * in the actual iframe only on interaction. Zero iframe JS/network cost
 * until the visitor actually wants to watch, which keeps this section out
 * of the page's LCP/TBT budget. Uses youtube-nocookie.com (no tracking
 * cookies set until playback is requested) and a plain <img> for the
 * thumbnail (avoids adding i.ytimg.com to next.config's remotePatterns).
 */
export function VideoFacade({
  videoId,
  title,
  live = false,
}: {
  videoId: string;
  title: string;
  live?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 20, overflow: "hidden", background: "#000" }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${title}`}
      className="press"
      style={{
        position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 20, overflow: "hidden",
        border: "none", padding: 0, cursor: "pointer", background: "#000", display: "block",
      }}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        width={480}
        height={360}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.82 }}
      />
      <span aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.55),rgba(0,0,0,.1) 45%)" }} />
      {live && (
        <span aria-hidden style={{
          position: "absolute", top: 16, left: 16, display: "inline-flex", alignItems: "center", gap: 6,
          background: "var(--red)", color: "#fff", fontSize: 12, fontWeight: 800, letterSpacing: ".5px",
          padding: "5px 12px", borderRadius: 999, textTransform: "uppercase",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", animation: "pulse-red 1.6s ease-in-out infinite" }} />
          Live
        </span>
      )}
      <span aria-hidden style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,.94)",
        display: "grid", placeItems: "center", boxShadow: "0 12px 32px rgba(0,0,0,.35)",
      }}>
        <Play size={28} strokeWidth={0} fill="var(--red)" style={{ marginLeft: 3 }} aria-hidden />
      </span>
      <span style={{
        position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 20px 16px",
        color: "#fff", fontSize: 15, fontWeight: 700, textAlign: "left", lineHeight: 1.3,
      }}>
        {title}
      </span>
    </button>
  );
}
