import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Gallery } from "@/components/sections/Gallery";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

export const metadata = {
  title: "Gallery — CAC Salvation Center",
  description:
    "Moments of worship, fellowship, and celebration at CAC Salvation Center, Randallstown MD.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <main>
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "140px clamp(20px,5vw,64px) 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#F15F22,#D62828 70%)", opacity: 0.1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Gallery</span>
          </Reveal>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(46px,6.5vw,90px)", letterSpacing: "-0.03em", color: "var(--ink)", margin: "16px 0", lineHeight: 0.92, textWrap: "balance" }}>
            <RevealText immediate>Life at the</RevealText>{" "}
            <RevealText immediate delay={0.12} style={{ background: "linear-gradient(100deg,#F15F22,#D62828)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Center.
            </RevealText>
          </h1>
          <Reveal delay={200}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 520, margin: "0 auto", textWrap: "pretty" }}>
              A glimpse of our worship, our family, and the joy of God&apos;s presence among us. Tap any photo to explore.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(40px,5vw,72px) clamp(20px,5vw,64px) clamp(64px,8vw,100px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <Gallery />
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
