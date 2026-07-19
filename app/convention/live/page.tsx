import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";

export const metadata = {
  title: "Live — CACNA Convention",
  description: "Watch the CACNA Annual Convention livestream and this year's sessions.",
  alternates: { canonical: "/convention/live" },
};

const YOUTUBE_CHANNEL_URL = "https://youtube.com/@cacnorthamericalatunderegi1330";
const YOUTUBE_LIVE_URL = "https://www.youtube.com/@cacnorthamericalatunderegi1330/live";
const CURRENT_SESSIONS_PLAYLIST_ID = "PLhXt6OVepbyjadJt8WufxY-5Mt5OAjsSf";

export default function ConventionLivePage() {
  return (
    <main>
      <Nav heroDark />
      <ConventionPageHero
        eyebrow="Live"
        title="Watch the Convention Live"
        subhead="Stream this year's convention sessions, or catch up on past ones."
      />
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Reveal>
            <a
              href={YOUTUBE_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="press"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--red)", color: "#fff", fontWeight: 800,
                fontSize: 14, padding: "12px 24px", borderRadius: 999, textDecoration: "none", marginBottom: 32,
              }}
            >
              Watch Live →
            </a>
          </Reveal>

          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 16px" }}>
              This Year&apos;s Sessions
            </h2>
            <div style={{ aspectRatio: "16/9", width: "100%", borderRadius: 18, overflow: "hidden", border: "1px solid var(--line)" }}>
              <iframe
                style={{ width: "100%", height: "100%" }}
                src={`https://www.youtube.com/embed/videoseries?list=${CURRENT_SESSIONS_PLAYLIST_ID}`}
                title="This Year's Sessions"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </Reveal>

          <Reveal>
            <p style={{ marginTop: 28, fontSize: 14.5, color: "var(--ink-soft)" }}>
              Looking for past years?{" "}
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--red)", fontWeight: 700, textDecoration: "underline" }}>
                Visit our YouTube channel →
              </a>
            </p>
          </Reveal>
        </div>
      </section>
      <FooterExperience />
    </main>
  );
}
