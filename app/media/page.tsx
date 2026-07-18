import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import { getSermons, formatSermonDate } from "@/lib/sermons";
import { archiveEntries } from "@/lib/archive";
import { ArchiveBrowser } from "@/components/media/ArchiveBrowser";

export const metadata = {
  title: "Media Archive — Christ Apostolic Church North America (CACNA)",
  description:
    "Browse past CACNA livestreams — Annual Conventions, the Good Women Marathon Fasting & Prayers, CACMA sessions, and more, dating back to 2022.",
  alternates: { canonical: "/media" },
};

export default async function MediaArchivePage() {
  const recentSermons = await getSermons(9);

  return (
    <main style={{ background: "#0C0E13", minHeight: "100vh" }}>
      <Nav dark />

      {/* Hero */}
      <section style={{ padding: "140px clamp(20px,5vw,64px) 70px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(232,163,61,.2),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Media Archive</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(44px,6.5vw,92px)", letterSpacing: "-2px", color: "#fff", margin: "20px 0", lineHeight: .92 }}>
              Every message,<br />since the beginning.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,255,255,.55)", lineHeight: 1.65, maxWidth: 620, margin: "0 auto" }}>
              Past livestreams from CACNA&apos;s YouTube channel — Annual Conventions, the Good Women Marathon Fasting &amp; Prayers, CACMA sessions, and more since 2022. Each entry links to its exact video on our channel.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Recently streamed — live, self-updating */}
      {recentSermons.length > 0 && (
        <section style={{ padding: "0 clamp(20px,5vw,64px) 70px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Reveal style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,38px)", letterSpacing: "-.8px", color: "#fff", margin: 0 }}>
                Recently Streamed
              </h2>
            </Reveal>
            <div className="r3" style={{ gap: 20 }}>
              {recentSermons.map((v, i) => (
                <Reveal key={v.id} delay={i * 70}>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-lift-border"
                    style={{ display: "block", textDecoration: "none", borderRadius: 18, overflow: "hidden", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)" }}
                  >
                    <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%" }}>
                      <Image src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} fill style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "16px 18px 18px" }}>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>{v.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 6 }}>{formatSermonDate(v.published)}</div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full archive, year-grouped, filterable */}
      <section style={{ padding: "20px clamp(20px,5vw,64px) 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,38px)", letterSpacing: "-.8px", color: "#fff", margin: "0 0 8px" }}>
              The Full Archive
            </h2>
            <p style={{ fontSize: 14.5, color: "rgba(255,255,255,.45)", margin: 0 }}>
              Filter by type, or scroll through year by year.
            </p>
          </Reveal>
          <ArchiveBrowser entries={archiveEntries} />
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
