import Link from "next/link";
import { ConventionNav } from "@/components/convention/ConventionNav";
import { ConventionFooter } from "@/components/convention/ConventionFooter";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";

export const metadata = {
  title: "Give — CACNA Convention",
  description: "Support the CACNA Annual Convention through CACNA's giving page.",
  alternates: { canonical: "/convention/give" },
};

export default function ConventionGivePage() {
  return (
    <main>
      <ConventionNav />
      <ConventionPageHero eyebrow="Give" title="Support the Convention" />
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 28 }}>
              The Annual Convention is made possible by the generosity of CACNA&apos;s members and friends.
              Giving toward the Convention runs through CACNA&apos;s own Giving page, alongside its other campaigns.
            </p>
            <Link
              href="/giving"
              className="press"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--red)", color: "#fff", fontWeight: 800,
                fontSize: 14, padding: "12px 26px", borderRadius: 999, textDecoration: "none",
              }}
            >
              Give Now →
            </Link>
          </Reveal>
        </div>
      </section>
      <ConventionFooter />
    </main>
  );
}
