import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { StoreCatalog } from "@/components/store/StoreCatalog";
import { EducationMaterials } from "@/components/store/EducationMaterials";
import { ApparelComingSoon } from "@/components/store/ApparelComingSoon";
import { StoreNews } from "@/components/store/StoreNews";
import { ConventionAdWidget } from "@/components/blog/ConventionAdWidget";
import { storeProducts } from "@/lib/conventions";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Store — CACNA Apparel & Christian Education Materials",
    description: "CACNA apparel, and where to order Sunday School lessons and Bible study manuals from the Christian Education Department.",
    alternates: { canonical: `${SITE_URL}/store` },
  };
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Store");

  const categories = [
    { key: "convention", label: t("conventionApparel"), products: storeProducts.filter((p) => p.category === "convention") },
    { key: "good_women", label: t("goodWomenApparel"), products: storeProducts.filter((p) => p.category === "good_women") },
    { key: "youth", label: t("youthApparel"), products: storeProducts.filter((p) => p.category === "youth") },
    { key: "merchandise", label: t("merchandise"), products: storeProducts.filter((p) => p.category === "merchandise") },
  ];
  const educationProducts = storeProducts.filter((p) => p.category === "christian_education");
  const hasAnyProducts = categories.some((c) => c.products.length > 0);
  const hasApparel = categories.some((c) => c.key !== "merchandise" && c.products.length > 0);

  return (
    <main id="main-content">
      <Nav heroDark />

      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 64px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(38px,6vw,64px)", letterSpacing: "-0.03em", color: "#fff", margin: 0, lineHeight: 1 }}>
            <RevealText immediate>{t("apparelHeading")}</RevealText>
          </h1>
          <Reveal delay={140}>
            <p style={{ marginTop: 16, fontSize: 15.5, color: "rgba(245,246,250,.72)" }}>
              Apparel from CACNA, and where to order Christian Education materials.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--cream)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <ConventionAdWidget />
          {!hasApparel && <ApparelComingSoon />}
          {hasAnyProducts && (
            <div style={{ marginTop: hasApparel ? 0 : 48 }}>
              <StoreCatalog categories={categories} />
            </div>
          )}
        </div>
      </section>

      <EducationMaterials products={educationProducts} />

      <StoreNews />

      <FooterExperience />
    </main>
  );
}
