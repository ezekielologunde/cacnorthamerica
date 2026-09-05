import Image from "next/image";

/** A small real-photo strip for sub-ministry pages -- ported from the
 *  Convention site's own components/ui/PhotoStrip.tsx during the Phase H
 *  data-completeness audit (2026-09). Source photos are uncaptioned on
 *  their site of origin, so `caption` is always a general one ("From the
 *  2025 convention") rather than a specific claim about who/what is
 *  pictured. Since no per-photo caption exists, the images are treated as
 *  one decorative unit (`alt=""`) with a single accessible name on the
 *  group, matching Convention's own accessibility reasoning. */
export function PhotoStrip({ photos, caption }: { photos: string[]; caption: string }) {
  if (photos.length === 0) return null;

  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px,5vw,64px)", marginTop: 40 }}>
      <div role="group" aria-label={caption} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {photos.map((src, i) => (
          <div key={src} style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", borderRadius: 16 }}>
            <Image src={src} alt="" fill sizes="(max-width: 640px) 30vw, 260px" style={{ objectFit: "cover" }} priority={i === 0} />
          </div>
        ))}
      </div>
      <p style={{ marginTop: 12, textAlign: "center", fontSize: 12, color: "var(--ink-soft)" }}>{caption}</p>
    </section>
  );
}
