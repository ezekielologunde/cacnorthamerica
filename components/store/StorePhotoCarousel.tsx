"use client";

import type { StoreProduct } from "@/lib/conventions";

/** Infinite-scrolling strip of real product photos above the catalog — same
 *  marquee approach as PhotoMarquee (shares its `marquee-run` keyframe from
 *  globals.css) but sized larger and scoped to store product images instead
 *  of general life-of-CACNA photography. */
function Track({ products, ariaHidden }: { products: StoreProduct[]; ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} style={{ display: "flex", gap: 20, flexShrink: 0 }}>
      {products.map((p, i) => (
        <div key={p.id + i} style={{ position: "relative", width: 240, height: 200, borderRadius: 20, overflow: "hidden", flexShrink: 0, boxShadow: "0 10px 26px rgba(18,20,30,.16)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.imageSrc} alt={ariaHidden ? "" : p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {!ariaHidden && (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "28px 16px 12px", background: "linear-gradient(to top,rgba(18,20,30,.82),transparent)" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{p.name}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function StorePhotoCarousel({ products }: { products: StoreProduct[] }) {
  const withPhotos = products.filter((p) => p.imageSrc);
  if (withPhotos.length === 0) return null;

  return (
    <section style={{ background: "var(--ink)", padding: "0 0 clamp(40px,6vw,64px)", overflow: "hidden" }}>
      <style>{`
        .store-marquee-outer { position: relative; }
        .store-marquee-track { display: flex; width: max-content; animation: marquee-run 36s linear infinite; }
        .store-marquee-outer:hover .store-marquee-track,
        .store-marquee-outer:focus-within .store-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .store-marquee-track { animation: none; overflow-x: auto; }
        }
      `}</style>
      <div className="store-marquee-outer">
        <div className="store-marquee-track">
          <Track products={withPhotos} />
          <Track products={withPhotos} ariaHidden />
        </div>
      </div>
    </section>
  );
}
