"use client";
import { Reveal } from "@/components/ui/Reveal";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

// Real, individually-verified CACNA photos not used elsewhere on the
// homepage (convention 2025, Bible Institute, CACMA fellowship). No stock
// imagery — every photo here has been visually confirmed as genuinely ours.
const PHOTOS: { src: string; alt: string }[] = [
  { src: "/images/convention-2025-01.jpg", alt: "Ministers seated together at the 2025 CACNA Latunde Region General Convention" },
  { src: "/images/cac-clergy-ceremony.jpg", alt: "CACNA clergy in an ordination-style ceremony" },
  { src: "/images/convention-2025-05.jpg", alt: "Women of CACNA worshiping together at the 2025 Convention" },
  { src: "/images/bible-institute-graduation.jpg", alt: "CACNA Bible Institute graduation ceremony" },
  { src: "/images/convention-children-01.jpg", alt: "The Children's Department in an outdoor group session at the 2025 CACNA Convention" },
  { src: "/images/cacma-fellowship.jpg", alt: "CACMA fellowship gathering" },
  { src: "/images/convention-2025-03.jpg", alt: "Two ministers in academic regalia at the 2025 CACNA Convention" },
  { src: "/images/cac-graduation-group.jpg", alt: "A CACNA graduation ceremony group photo" },
  { src: "/images/convention-children-03.jpg", alt: "The Children's Department in an indoor session at the 2025 CACNA Convention" },
  { src: "/images/convention-2025-04.jpg", alt: "Pastors gathered at the pulpit during the 2025 CACNA Convention" },
  // These two used to be per-slide hero backgrounds (anniversary, giving)
  // before the hero moved to one persistent video for every slide -- given
  // a home here instead of dropping them from the homepage entirely.
  { src: "/images/cac-gathering-crowd.jpg", alt: "A gathering of the CACNA family" },
  { src: "/images/giving-offering.jpg", alt: "CACNA members bringing an offering during a service" },
];

function Track({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} style={{ display: "flex", gap: 16, flexShrink: 0 }}>
      {PHOTOS.map((p, i) => (
        <div key={p.src + i} style={{ position: "relative", width: 220, height: 150, borderRadius: 16, overflow: "hidden", flexShrink: 0, boxShadow: "0 8px 22px rgba(18,20,30,.12)" }}>
          {ariaHidden ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <ImageLightbox src={p.src} alt={p.alt} />
          )}
        </div>
      ))}
    </div>
  );
}

export function PhotoMarquee() {
  return (
    <section style={{ background: "var(--paper)", padding: "clamp(48px,6vw,80px) 0", overflow: "hidden" }}>
      <Reveal>
        <div style={{ textAlign: "center", padding: "0 clamp(20px,5vw,64px)", marginBottom: 30 }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>
            Life Across CACNA
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,42px)", letterSpacing: "-1px", margin: "10px 0 0", color: "var(--ink)" }}>
            Moments from the family.
          </h2>
        </div>
      </Reveal>

      <style>{`
        .photo-marquee-outer { position: relative; }
        .photo-marquee-track { display: flex; width: max-content; animation: marquee-run 42s linear infinite; }
        .photo-marquee-outer:hover .photo-marquee-track,
        .photo-marquee-outer:focus-within .photo-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .photo-marquee-track { animation: none; overflow-x: auto; }
        }
      `}</style>
      <div className="photo-marquee-outer">
        <div className="photo-marquee-track">
          <Track />
          <Track ariaHidden />
        </div>
      </div>
    </section>
  );
}
