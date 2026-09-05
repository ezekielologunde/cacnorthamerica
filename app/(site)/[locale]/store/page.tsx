import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { StoreCatalog } from "@/components/store/StoreCatalog";
import { storeProducts } from "@/lib/conventions";
import { setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Store — CACNA Convention Apparel & Christian Education Materials",
  description: "Convention, Good Women, and Youth & Young Adult apparel, plus real Sunday School lessons and Bible study manuals from CACNA's Christian Education Department — checkout securely with Stripe.",
  alternates: { canonical: "/store" },
};

export default async function StorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = [
    { key: "convention", label: "Convention Apparel", products: storeProducts.filter((p) => p.category === "convention") },
    { key: "good_women", label: "Good Women Association Apparel", products: storeProducts.filter((p) => p.category === "good_women") },
    { key: "youth", label: "Youth & Young Adult Apparel", products: storeProducts.filter((p) => p.category === "youth") },
    { key: "christian_education", label: "Christian Education Materials", products: storeProducts.filter((p) => p.category === "christian_education") },
  ];
  const hasAnyProducts = categories.some((c) => c.products.length > 0);

  return (
    <main id="main-content">
      <Nav heroDark />

      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 70px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Store</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(38px,6vw,64px)", letterSpacing: "-0.03em", color: "#fff", margin: "16px 0 0", lineHeight: 1 }}>
            <RevealText immediate>Apparel & Merchandise</RevealText>
          </h1>
          <Reveal delay={140}>
            <p style={{ marginTop: 16, fontSize: 15.5, color: "rgba(245,246,250,.68)" }}>
              Convention, Good Women, and Youth &amp; Young Adult apparel, plus Sunday School lessons and Bible study manuals from Christian Education — checkout securely with Stripe.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--cream)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {hasAnyProducts ? (
            <StoreCatalog categories={categories} />
          ) : (
            <div style={{ textAlign: "center", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "clamp(32px,5vw,48px)" }}>
              <p style={{ fontSize: 16, color: "var(--ink-soft)", margin: 0 }}>
                Nothing in the catalog yet — check back closer to the next convention.
              </p>
            </div>
          )}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
