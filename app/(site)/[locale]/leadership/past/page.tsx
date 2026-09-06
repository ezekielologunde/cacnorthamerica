import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLeaders, slugifyLeaderName, type Leader } from "@/lib/leaders";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";

function initials(name: string) {
  return name.replace(/^(Pastor|Prophet|Evangelist|Mrs\.?|Mr\.?|Dr\.?)\s+/i, "")
    .split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}/leadership/past`]));
  return {
    title: "Past Leaders — Christ Apostolic Church North America (CACNA)",
    description: "The past Presidents, General Superintendents, and General Evangelists of Christ Apostolic Church Worldwide.",
    alternates: { canonical: `${SITE_URL}/${locale}/leadership/past`, languages },
  };
}

const SECTIONS: { category: Leader["category"]; label: string }[] = [
  { category: "past_president", label: "Past Presidents" },
  { category: "past_superintendent", label: "Past General Superintendents" },
  { category: "past_evangelist", label: "Past General Evangelists" },
  { category: "past_secretary", label: "Past General Secretaries" },
  { category: "past_treasurer", label: "Past General Treasurers" },
];

export default async function PastLeadersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const leaders = await getLeaders(["past_president", "past_superintendent", "past_evangelist", "past_secretary", "past_treasurer"]);

  return (
    <main id="main-content">
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -100, width: 640, height: 500, background: "radial-gradient(circle,rgba(253,200,65,.2),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/leadership" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 28 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> Leadership
            </Link>
          </Reveal>
          <Reveal delay={60}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Our history</span>
          </Reveal>
          <Reveal delay={120}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px,6vw,76px)", letterSpacing: "-2px", color: "#fff", margin: "16px 0", lineHeight: .95 }}>
              Those who came before.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(245,246,250,.72)", lineHeight: 1.65, maxWidth: 620 }}>
              Christ Apostolic Church Worldwide stands on the ministry of the leaders who carried this mandate before us. Tap a photo to view it full-size.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Sections */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", gap: 64 }}>
          {SECTIONS.map(({ category, label }) => {
            const people = leaders.filter((l) => l.category === category);
            if (people.length === 0) return null;
            return (
              <div key={category}>
                <Reveal style={{ marginBottom: 28 }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,36px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0 }}>{label}</h2>
                </Reveal>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 22 }}>
                  {people.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 6) * 50}>
                      <div className="card-lift" style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 22, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                        <div style={{ position: "relative", width: "100%", height: 240, flexShrink: 0, background: "var(--ink)" }}>
                          {p.photo_url ? (
                            <ImageLightbox src={p.photo_url} alt={p.full_name} />
                          ) : (
                            <div aria-hidden style={{
                              position: "absolute", inset: 0, display: "grid", placeItems: "center",
                              background: "linear-gradient(135deg,var(--red),var(--red-deep))",
                            }}>
                              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 56, color: "#fff" }}>{initials(p.full_name)}</span>
                            </div>
                          )}
                        </div>
                        <div style={{ padding: "20px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                          <div style={{ marginBottom: p.bio ? 10 : 0 }}>
                            <Link href={`/leadership/${slugifyLeaderName(p.full_name)}`} style={{ textDecoration: "none" }}>
                              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: "0 0 4px", lineHeight: 1.2 }}>{p.full_name}</h3>
                            </Link>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 10px" }}>
                              <span style={{ fontSize: 13, color: "var(--red)", fontWeight: 700 }}>{p.title}</span>
                              {p.tenure_start && (
                                <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
                                  {p.tenure_start}–{p.tenure_end ?? "present"}
                                </span>
                              )}
                            </div>
                          </div>
                          {p.bio && <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, margin: "0 0 14px", flex: 1 }}>{p.bio}</p>}
                          <Link href={`/leadership/${slugifyLeaderName(p.full_name)}`} className="press" style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--ink)", textDecoration: "none" }}>
                            View full profile <span aria-hidden>→</span>
                          </Link>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
