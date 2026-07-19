import { ConventionNav } from "@/components/convention/ConventionNav";
import { ConventionFooter } from "@/components/convention/ConventionFooter";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import { conventionNewsEvents } from "@/lib/convention/news-events";

export const metadata = {
  title: "News — CACNA Convention",
  description: "News and upcoming events from CACNA and the Annual Convention.",
  alternates: { canonical: "/convention/news" },
};

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[m - 1]} ${d}, ${y}`;
}

export default function ConventionNewsPage() {
  return (
    <main>
      <ConventionNav />
      <ConventionPageHero eyebrow="News" title="News & Events" />
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
          {conventionNewsEvents.map((e, i) => (
            <Reveal key={e.title} delay={i * 80}>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "22px 26px" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--red)" }}>
                  {fmtDate(e.date)}{e.endDate ? `–${fmtDate(e.endDate)}` : ""}{e.location ? ` · ${e.location}` : ""}
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(19px,2.4vw,24px)", color: "var(--ink)", margin: "8px 0 10px" }}>
                  {e.title}
                </h2>
                <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: e.highlights ? 14 : 0 }}>{e.description}</p>
                {e.highlights ? (
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                    {e.highlights.map((h) => (
                      <li key={h} style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>• {h}</li>
                    ))}
                  </ul>
                ) : null}
                {e.moreInfoUrl ? (
                  <a href={e.moreInfoUrl} style={{ fontSize: 13.5, fontWeight: 700, color: "var(--red)", textDecoration: "underline" }}>
                    More details →
                  </a>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <ConventionFooter />
    </main>
  );
}
