import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";

export const metadata = {
  title: "Contact — CACNA Convention",
  description: "Contact the CACNA Annual Convention committee.",
  alternates: { canonical: "/convention/contact" },
};

const CONTACTS = [
  { name: "Pastor David Adenodi", role: "Chairman", phone: "301-440-7033", email: "cacnaconvention@gmail.com", org: "C.A.C. Vineyard of Comfort, 6408 Princess Garden Parkway, Lanham, MD 20706" },
  { name: "Pastor Timothy Famojuro", role: "Secretary", phone: "917-709-1892", email: "ftimothy54@aol.com", org: "C.A.C. FITA, Brooklyn, NY" },
  { name: "Pastor Joseph Olawale", role: "General Inquiries", phone: "305-469-0346", email: "cacna@hotmail.com", org: "Christ Apostolic Church DFW Metroplex, Sanctuary of Power and Praise, 612 E. 2nd Street, Irving, TX 75060" },
];

export default function ConventionContactPage() {
  return (
    <main>
      <Nav heroDark />
      <ConventionPageHero eyebrow="Contact" title="Get in Touch" />
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {CONTACTS.map((c, i) => (
            <Reveal key={c.email} delay={i * 60}>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 24px" }}>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: "var(--ink)" }}>{c.name} — {c.role}</div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)", margin: "4px 0 12px" }}>{c.org}</div>
                <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                  <a href={`tel:${c.phone}`} style={{ fontSize: 13.5, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>{c.phone}</a>
                  <a href={`mailto:${c.email}`} style={{ fontSize: 13.5, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>{c.email}</a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <FooterExperience />
    </main>
  );
}
