import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ShoppingBag, Shield, Heart, Package } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { StoreProducts } from "@/components/store/StoreProducts";

export const metadata = {
  title: "Store — CAC Salvation Center",
  description:
    "Salvation Center apparel, Bibles, original worship music, and custom prints. Every purchase supports the church's building project and ministries.",
  alternates: { canonical: "/store" },
};

const trust = [
  { icon: Heart,   label: "Proceeds support ministries", desc: "Every sale funds the building project and outreach." },
  { icon: Package, label: "Ships within 5 business days", desc: "Maryland local pickup available on request." },
  { icon: Shield,  label: "Secure checkout",             desc: "Multiple payment options accepted. Receipt sent instantly." },
];


export default async function StorePage() {
  const service = createServiceClient();
  const { data: products } = await service
    .from("products")
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{
        background: "var(--ink)",
        padding: "150px clamp(20px,5vw,64px) clamp(70px,9vw,110px)",
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden style={{ position: "absolute", top: -140, right: -100, width: 640, height: 520, background: "radial-gradient(circle,rgba(232,163,61,.2),transparent 65%)", pointerEvents: "none", animation: "gradient-drift 18s ease-in-out infinite" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -60, left: -80, width: 400, height: 340, background: "radial-gradient(circle,rgba(214,40,40,.14),transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 20 }}>
              <ShoppingBag size={14} strokeWidth={2.5} aria-hidden /> Salvation Center Store
            </div>
          </Reveal>

          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(48px,7.5vw,104px)", letterSpacing: "-0.035em",
            color: "#fff", margin: "0 0 28px", lineHeight: 0.9, textWrap: "balance",
          }}>
            <RevealText immediate>Carry the</RevealText>{" "}
            <RevealText immediate delay={0.12}
              style={{ background: "linear-gradient(100deg,#F15F22,#D62828,#E8A33D)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              message.
            </RevealText>
          </h1>

          <Reveal delay={200}>
            <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,247,239,.72)", lineHeight: 1.7, maxWidth: 560, margin: "0 0 40px" }}>
              Apparel, Bibles, worship music, and custom prints — resources for the family, inside the church and beyond it. Every purchase supports the ministries of CAC Salvation Center.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Products */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0 }}>Shop.</h2>
              {products && products.length > 0 && (
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  {products.length} item{products.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </Reveal>

          <StoreProducts products={products ?? []} />
        </div>
      </section>

      {/* How ordering works */}
      <section style={{ background: "var(--cream-2)", borderTop: "1px solid var(--line)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 10 }}>How ordering works</div>
            <p style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.78, margin: "0 0 10px" }}>
              <strong>Apparel &amp; Music</strong> — click "Add to Cart" to check out securely via Stripe, or "Request order" for custom sizing and we'll reply within 24 hours. Cards, Apple Pay, and Google Pay accepted.
            </p>
            <p style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.78, margin: 0 }}>
              <strong>Bibles</strong> link directly to Amazon. <strong>Custom prints</strong> are ordered via email — we confirm details and quote the final price. All proceeds support CAC Salvation Center ministries.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ background: "var(--ink)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3.5vw,38px)", letterSpacing: "-.8px", color: "var(--cream)", margin: 0 }}>Simple, personal, purposeful.</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 18 }}>
            {trust.map((t, i) => (
              <Reveal key={t.label} delay={i * 80}>
                <div style={{ background: "rgba(255,247,239,.05)", border: "1px solid rgba(255,247,239,.1)", borderRadius: 18, padding: "24px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <t.icon size={18} strokeWidth={2} color="var(--gold)" aria-hidden />
                    <span style={{ fontWeight: 700, fontSize: 15, color: "var(--cream)" }}>{t.label}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(255,247,239,.58)", lineHeight: 1.65, margin: 0 }}>{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
