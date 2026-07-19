import Image from "next/image";
import { ConventionNav } from "@/components/convention/ConventionNav";
import { ConventionFooter } from "@/components/convention/ConventionFooter";
import { Reveal } from "@/components/ui/Reveal";
import { ConventionPageHero } from "@/components/convention/ConventionPageHero";
import { mainGalleryPhotos, childrenGalleryPhotos } from "@/lib/convention/gallery";

export const metadata = {
  title: "Gallery — CACNA Convention",
  description: "Photos from past CACNA Annual Conventions and the Children's Convention.",
  alternates: { canonical: "/convention/gallery" },
};

function PhotoGrid({ photos }: { photos: string[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
      {photos.map((src) => (
        <div key={src} style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden", background: "var(--cream-2)" }}>
          <Image src={src} alt="CACNA Convention" fill sizes="(max-width: 640px) 50vw, 200px" style={{ objectFit: "cover" }} />
        </div>
      ))}
    </div>
  );
}

export default function ConventionGalleryPage() {
  return (
    <main>
      <ConventionNav />
      <ConventionPageHero
        eyebrow="Gallery"
        title="Convention Gallery"
        subhead="Moments from past CACNA Annual Conventions and the Children's Convention."
      />
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 44 }}>
          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 20px" }}>Convention</h2>
            <PhotoGrid photos={mainGalleryPhotos} />
          </Reveal>
          <Reveal>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.6vw,28px)", color: "var(--ink)", margin: "0 0 20px" }}>Children&apos;s Convention</h2>
            <PhotoGrid photos={childrenGalleryPhotos} />
          </Reveal>
        </div>
      </section>
      <ConventionFooter />
    </main>
  );
}
