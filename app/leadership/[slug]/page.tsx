import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { getLeaderBySlug } from "@/lib/leaders";

export const revalidate = 3600;

function initials(name: string) {
  const parts = name.replace(/^(Pastor|Prophet|Evangelist|Apostle)\s+(Dr\.?\s+)?(\(Mrs\.?\)\s+)?/i, "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")).toUpperCase();
}

const CATEGORY_LABEL: Record<string, string> = {
  cacna_regional: "CACNA Regional Leadership",
  global_hq: "Christ Apostolic Church Worldwide",
  zonal_superintendent: "Zonal Superintendent",
  dcc_superintendent: "DCC Superintendent",
  past_president: "Past President",
  past_superintendent: "Past General Superintendent",
  past_evangelist: "Past General Evangelist",
  past_secretary: "Past General Secretary",
  past_treasurer: "Past General Treasurer",
  bible_institute: "CACNA Bible Institute",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getLeaderBySlug(slug);
  if (!result) return { title: "Leader — Christ Apostolic Church North America (CACNA)" };
  return {
    title: `${result.leader.full_name} — Christ Apostolic Church North America (CACNA)`,
    description: result.leader.bio ?? `${result.leader.title} — Christ Apostolic Church North America.`,
    alternates: { canonical: `/leadership/${slug}` },
  };
}

export default async function LeaderProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getLeaderBySlug(slug);
  if (!result) notFound();

  const { leader, roles } = result;

  return (
    <main id="main-content">
      <Nav heroDark />

      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -100, width: 640, height: 500, background: "radial-gradient(circle,rgba(253,200,65,.2),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Link href="/leadership" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(245,246,250,.6)", textDecoration: "none", marginBottom: 28 }}>
              <ArrowLeft size={14} strokeWidth={2.5} aria-hidden /> Leadership
            </Link>
          </Reveal>
          <Reveal delay={60}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>
              {CATEGORY_LABEL[leader.category] ?? "Leadership"}
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5.5vw,64px)", letterSpacing: "-2px", color: "#fff", margin: "16px 0 8px", lineHeight: .98 }}>
              {leader.full_name}
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p style={{ fontSize: "clamp(15px,1.7vw,18px)", color: "rgba(245,246,250,.72)", lineHeight: 1.5, maxWidth: 640 }}>
              {roles.length > 1 ? roles.map((r) => r.title).join(" · ") : leader.title}
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gridTemplateColumns: leader.photo_url ? "auto 1fr" : "1fr", gap: 40, alignItems: "start" }}>
          {leader.photo_url ? (
            <Reveal>
              <div style={{ position: "relative", width: 180, height: 180, borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 44px rgba(18,20,30,.18)", flexShrink: 0 }}>
                <ImageLightbox src={leader.photo_url} alt={leader.full_name} />
              </div>
            </Reveal>
          ) : null}

          <div>
            {!leader.photo_url && (
              <Reveal>
                <div aria-hidden style={{
                  width: 100, height: 100, borderRadius: 24, marginBottom: 24,
                  background: "linear-gradient(135deg,var(--red),var(--red-deep))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32,
                }}>
                  {initials(leader.full_name)}
                </div>
              </Reveal>
            )}

            <Reveal delay={60}>
              {leader.bio ? (
                <div style={{ margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                  {leader.bio.split(/\n\n+/).map((para, i) => (
                    <p key={i} style={{ fontSize: 16.5, color: "var(--ink)", lineHeight: 1.8, margin: 0 }}>{para}</p>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 15, color: "var(--ink-soft)", fontStyle: "italic", lineHeight: 1.7, margin: "0 0 24px" }}>
                  A fuller story for {leader.full_name.split(" ").slice(-1)[0]} is coming soon.
                </p>
              )}
            </Reveal>

            {(leader.tenure_start || leader.zone_name || leader.phone || leader.email) && (
              <Reveal delay={120}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "20px 22px" }}>
                  {leader.tenure_start ? (
                    <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                      <strong style={{ color: "var(--ink)" }}>Tenure:</strong> {leader.tenure_start}–{leader.tenure_end ?? "present"}
                    </div>
                  ) : null}
                  {leader.zone_name ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--ink-soft)" }}>
                      <MapPin size={14} strokeWidth={2} aria-hidden /> {leader.zone_name}
                    </div>
                  ) : null}
                  {leader.phone ? (
                    <a href={`tel:${leader.phone}`} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>
                      <Phone size={14} strokeWidth={2} aria-hidden /> {leader.phone}
                    </a>
                  ) : null}
                  {leader.email ? (
                    <a href={`mailto:${leader.email}`} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>
                      <Mail size={14} strokeWidth={2} aria-hidden /> {leader.email}
                    </a>
                  ) : null}
                </div>
              </Reveal>
            )}

            {roles.length > 1 ? (
              <Reveal delay={160}>
                <div style={{ marginTop: 24 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>
                    Roles
                  </h2>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                    {roles.map((r) => (
                      <li key={r.id} style={{ fontSize: 14.5, color: "var(--ink-soft)" }}>• {r.title}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
