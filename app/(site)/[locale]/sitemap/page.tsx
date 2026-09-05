import Link from "next/link";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { currentOrNextConvention } from "@/lib/conventions";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Sitemap — Christ Apostolic Church North America (CACNA)",
  description: "Every public page on the CACNA website, grouped for easy browsing.",
  alternates: { canonical: "/sitemap" },
};

export default async function SitemapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Sitemap");

  const cy = currentOrNextConvention();

  // A human-readable index of CACNA's real routes, grouped by topic --
  // distinct from app/sitemap.ts (the machine-readable XML sitemap).
  const groups: { title: string; pages: { label: string; href: string }[] }[] = [
    {
      title: "Who We Are",
      pages: [
        { label: "About CACNA", href: "/about" },
        { label: "Leadership", href: "/leadership" },
        { label: "Past Leaders", href: "/leadership/past" },
        { label: "Zones & DCCs", href: "/zones" },
        { label: "Ministries", href: "/ministries" },
        { label: "Bible Institute", href: "/bible-institute" },
        { label: "Statement of Faith", href: "/statement-of-faith" },
      ],
    },
    {
      title: "Annual Convention",
      pages: [
        { label: `Convention ${cy.year}`, href: cy.href },
        { label: "Plan Your Visit", href: "/plan-your-visit" },
        { label: "Past Conventions Archive", href: "/archive" },
        { label: "Calendar & Events", href: "/calendar" },
        { label: "Store", href: "/store" },
      ],
    },
    {
      title: "Ministries & Programs",
      pages: [
        { label: "CACMA (Men's Association)", href: "/cacma" },
        { label: "Youth & Young Adult", href: "/youth" },
        { label: "Children's Ministry", href: "/children" },
        { label: "Good Women Association", href: "/good-women" },
        { label: "Ministers' Wives Conference", href: "/ministers-wives" },
        { label: "Business Group Fellowship", href: "/business-group" },
        { label: "Christian Education Department", href: "/christian-education" },
      ],
    },
    {
      title: "Media & News",
      pages: [
        { label: "Watch Online", href: "/online" },
        { label: "Watchwords", href: "/watchwords" },
        { label: "Blog & News", href: "/blog" },
        { label: "Gallery", href: "/gallery" },
      ],
    },
    {
      title: "Connect",
      pages: [
        { label: "Contact & Visit", href: "/contact" },
        { label: "Giving", href: "/giving" },
      ],
    },
  ];

  return (
    <main id="main-content">
      <Nav heroDark />
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 70px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>{t("title")}</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(38px,6vw,64px)", letterSpacing: "-0.03em", color: "#fff", margin: "14px 0 0", lineHeight: 1 }}>
            {t("subtitle")}
          </h1>
        </div>
      </section>

      <section style={{ background: "var(--paper)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px) clamp(72px,8vw,110px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "clamp(32px,4vw,48px)" }}>
          {groups.map((group, i) => (
            <Reveal key={group.title} delay={i * 60}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "var(--red)", margin: "0 0 16px" }}>{group.title}</h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {group.pages.map((page) => (
                  <li key={page.href}>
                    <Link href={`/${locale}${page.href}`} style={{ fontSize: 14.5, color: "var(--ink-soft)", textDecoration: "none" }}>
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
