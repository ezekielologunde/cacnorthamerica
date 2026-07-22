"use client";

import { useEffect, useState, useCallback, type CSSProperties } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cloudinaryLoader } from "@/lib/cloudinary-loader";

// Real photos from the 2025 CACNA Latunde Region General Convention, pulled
// from the dedicated Convention site's (cacna-convention.vercel.app) own
// gallery and self-hosted here. Shown as a fallback until the admin console
// (Cloudinary-backed /api/gallery) has real uploads of its own.
const STATIC_PHOTOS: Photo[] = [
  { id: "convention-2025-01", src: "/images/convention-2025-01.jpg", alt: "Ministers seated together at the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-02", src: "/images/convention-2025-02.jpg", alt: "Bible Institute graduates in cap and gown at the 2025 CACNA Convention" },
  { id: "convention-2025-03", src: "/images/convention-2025-03.jpg", alt: "Two ministers in academic regalia at the 2025 CACNA Convention" },
  { id: "convention-2025-04", src: "/images/convention-2025-04.jpg", alt: "Pastors gathered at the pulpit during the 2025 CACNA Convention" },
  { id: "convention-2025-05", src: "/images/convention-2025-05.jpg", alt: "Women of CACNA worshiping together at the 2025 Convention" },
  { id: "convention-2025-06", src: "/images/convention-2025-06.jpg", alt: "A graduate speaking at the podium during the 2025 CACNA Convention" },
  { id: "convention-children-01", src: "/images/convention-children-01.jpg", alt: "The Children's Department in an outdoor group session at the 2025 CACNA Convention" },
  { id: "convention-children-02", src: "/images/convention-children-02.jpg", alt: "Children's Department participants seated together outdoors at the 2025 CACNA Convention" },
  { id: "convention-children-03", src: "/images/convention-children-03.jpg", alt: "The Children's Department in an indoor session at the 2025 CACNA Convention" },
  { id: "convention-children-04", src: "/images/convention-children-04.jpg", alt: "Children's Department participants with CACNA Convention bags at the 2025 CACNA Convention" },
  // Full 2025 convention photo set (61 photos), copied from the Annual
  // Convention site's own gallery (cacna-convention.vercel.app) so this page
  // can host the complete recap rather than a hand-picked sample. No
  // per-photo captions exist upstream, so alt text is generic by design.
  { id: "convention-2025-full-01", src: "/photos/gallery/IMG-20250717-WA0040.jpg", alt: "Photo 1 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-02", src: "/photos/gallery/IMG-20250719-WA0014.jpg", alt: "Photo 2 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-03", src: "/photos/gallery/IMG-20250719-WA0018.jpg", alt: "Photo 3 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-04", src: "/photos/gallery/IMG-20250719-WA0020.jpg", alt: "Photo 4 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-05", src: "/photos/gallery/IMG-20250719-WA0021.jpg", alt: "Photo 5 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-06", src: "/photos/gallery/IMG-20250719-WA0022.jpg", alt: "Photo 6 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-07", src: "/photos/gallery/IMG-20250719-WA0023.jpg", alt: "Photo 7 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-08", src: "/photos/gallery/IMG-20250719-WA0024.jpg", alt: "Photo 8 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-09", src: "/photos/gallery/IMG-20250719-WA0025.jpg", alt: "Photo 9 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-10", src: "/photos/gallery/IMG-20250719-WA0026.jpg", alt: "Photo 10 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-11", src: "/photos/gallery/IMG-20250719-WA0027.jpg", alt: "Photo 11 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-12", src: "/photos/gallery/IMG-20250719-WA0028.jpg", alt: "Photo 12 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-13", src: "/photos/gallery/IMG-20250719-WA0029.jpg", alt: "Photo 13 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-14", src: "/photos/gallery/IMG-20250719-WA0030.jpg", alt: "Photo 14 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-15", src: "/photos/gallery/IMG-20250719-WA0031.jpg", alt: "Photo 15 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-16", src: "/photos/gallery/IMG-20250719-WA0032.jpg", alt: "Photo 16 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-17", src: "/photos/gallery/IMG-20250719-WA0033.jpg", alt: "Photo 17 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-18", src: "/photos/gallery/IMG-20250719-WA0034.jpg", alt: "Photo 18 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-19", src: "/photos/gallery/IMG-20250719-WA0035.jpg", alt: "Photo 19 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-20", src: "/photos/gallery/IMG-20250719-WA0036.jpg", alt: "Photo 20 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-21", src: "/photos/gallery/IMG-20250719-WA0037.jpg", alt: "Photo 21 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-22", src: "/photos/gallery/IMG-20250719-WA0038.jpg", alt: "Photo 22 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-23", src: "/photos/gallery/IMG-20250719-WA0039.jpg", alt: "Photo 23 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-24", src: "/photos/gallery/IMG-20250719-WA0040.jpg", alt: "Photo 24 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-25", src: "/photos/gallery/IMG-20250719-WA0041.jpg", alt: "Photo 25 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-26", src: "/photos/gallery/IMG-20250719-WA0042.jpg", alt: "Photo 26 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-27", src: "/photos/gallery/IMG-20250719-WA0043.jpg", alt: "Photo 27 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-28", src: "/photos/gallery/IMG-20250719-WA0044.jpg", alt: "Photo 28 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-29", src: "/photos/gallery/IMG-20250719-WA0045.jpg", alt: "Photo 29 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-30", src: "/photos/gallery/IMG-20250719-WA0046.jpg", alt: "Photo 30 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-31", src: "/photos/gallery/IMG-20250719-WA0047.jpg", alt: "Photo 31 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-32", src: "/photos/gallery/IMG-20250719-WA0048.jpg", alt: "Photo 32 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-33", src: "/photos/gallery/IMG-20250719-WA0049.jpg", alt: "Photo 33 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-34", src: "/photos/gallery/IMG-20250719-WA0050.jpg", alt: "Photo 34 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-35", src: "/photos/gallery/IMG-20250719-WA0051.jpg", alt: "Photo 35 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-36", src: "/photos/gallery/IMG-20250719-WA0052.jpg", alt: "Photo 36 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-37", src: "/photos/gallery/IMG-20250719-WA0053.jpg", alt: "Photo 37 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-38", src: "/photos/gallery/IMG-20250719-WA0054.jpg", alt: "Photo 38 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-39", src: "/photos/gallery/IMG-20250719-WA0055.jpg", alt: "Photo 39 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-40", src: "/photos/gallery/IMG-20250719-WA0056.jpg", alt: "Photo 40 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-full-41", src: "/photos/gallery/IMG-20250719-WA0057.jpg", alt: "Photo 41 of 41 from the 2025 CACNA Latunde Region General Convention" },
  { id: "convention-2025-children-01", src: "/photos/gallery-children/cacna_children1.jpeg", alt: "Photo 1 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-02", src: "/photos/gallery-children/cacna_children2.jpeg", alt: "Photo 2 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-03", src: "/photos/gallery-children/cacna_children3.jpeg", alt: "Photo 3 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-04", src: "/photos/gallery-children/cacna_children4.jpeg", alt: "Photo 4 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-05", src: "/photos/gallery-children/cacna_children5.jpeg", alt: "Photo 5 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-06", src: "/photos/gallery-children/cacna_children6.jpeg", alt: "Photo 6 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-07", src: "/photos/gallery-children/cacna_children7.jpeg", alt: "Photo 7 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-08", src: "/photos/gallery-children/cacna_children8.jpeg", alt: "Photo 8 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-09", src: "/photos/gallery-children/cacna_children9.jpeg", alt: "Photo 9 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-10", src: "/photos/gallery-children/cacna_children10.jpeg", alt: "Photo 10 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-11", src: "/photos/gallery-children/cacna_children11.jpeg", alt: "Photo 11 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-12", src: "/photos/gallery-children/cacna_children12.jpeg", alt: "Photo 12 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-13", src: "/photos/gallery-children/cacna_children13.jpeg", alt: "Photo 13 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-14", src: "/photos/gallery-children/cacna_children14.jpeg", alt: "Photo 14 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-15", src: "/photos/gallery-children/cacna_children15.jpeg", alt: "Photo 15 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-16", src: "/photos/gallery-children/cacna_children16.jpeg", alt: "Photo 16 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-17", src: "/photos/gallery-children/cacna_children17.jpeg", alt: "Photo 17 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-18", src: "/photos/gallery-children/cacna_children18.jpeg", alt: "Photo 18 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-19", src: "/photos/gallery-children/cacna_children19.jpeg", alt: "Photo 19 of 20 from the 2025 CACNA Convention Children's Department" },
  { id: "convention-2025-children-20", src: "/photos/gallery-children/cacna_children20.jpeg", alt: "Photo 20 of 20 from the 2025 CACNA Convention Children's Department" },
];

interface Photo { src: string; alt: string; id: string; }

function Skeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ borderRadius: 18, aspectRatio: "4/3", background: "var(--line)", animation: "pulse 1.8s ease-in-out infinite" }} />
      ))}
    </div>
  );
}

export function Gallery() {
  const reduce = useReducedMotion();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading]   = useState(true);
  const [live, setLive]         = useState(false);
  const [open, setOpen]         = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.photos?.length) {
          setPhotos(data.photos);
          setLive(true);
        } else {
          setPhotos(STATIC_PHOTOS);
        }
      })
      .catch(() => setPhotos(STATIC_PHOTOS))
      .finally(() => setLoading(false));
  }, []);

  const close = useCallback(() => setOpen(null), []);
  const go    = useCallback((dir: number) => {
    haptic("selection");
    setOpen((cur) => cur === null ? cur : (cur + dir + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft")  go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, go]);

  if (loading) return <Skeleton />;

  if (photos.length === 0) {
    return (
      <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, textAlign: "center", padding: "40px 0" }}>
        No photos have been added yet — check back soon.
      </p>
    );
  }

  return (
    <>
      {/* Count badge */}
      {live && (
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 20, fontSize: 13, fontWeight: 700, color: "var(--red)" }}>
          <Images size={15} strokeWidth={2.5} aria-hidden /> {photos.length} photos from Cloudinary
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,260px), 1fr))", gap: 14 }}>
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { haptic("light"); setOpen(i); }}
            className="press gallery-tile"
            aria-label={`View photo: ${p.alt}`}
            style={{ position: "relative", border: "none", padding: 0, cursor: "pointer", borderRadius: 18, overflow: "hidden", aspectRatio: "4 / 3", background: "var(--cream-2)" }}
          >
            <Image
              src={p.src} alt={p.alt} fill loader={cloudinaryLoader}
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="gallery-img" style={{ objectFit: "cover" }}
            />
            <span className="gallery-scrim" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.5),transparent 55%)", opacity: 0, transition: "opacity .3s" }} />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            role="dialog" aria-modal="true" aria-label={photos[open].alt}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,8,6,.93)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", padding: "clamp(16px,5vw,64px)" }}
          >
            <button onClick={(e) => { e.stopPropagation(); close(); }} aria-label="Close gallery" className="press"
              style={{ position: "absolute", top: 20, right: 20, width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer", zIndex: 3 }}>
              <X size={22} aria-hidden />
            </button>
            <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo" className="press" style={navBtn("left")}>
              <ChevronLeft size={26} aria-hidden />
            </button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo" className="press" style={navBtn("right")}>
              <ChevronRight size={26} aria-hidden />
            </button>
            <motion.div
              key={open}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: "relative", width: "min(1100px,92vw)", height: "min(82vh,760px)", borderRadius: 16, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}
            >
              <Image src={photos[open].src} alt={photos[open].alt} fill loader={cloudinaryLoader} sizes="92vw" style={{ objectFit: "contain" }} />
            </motion.div>
            <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center", color: "rgba(255,255,255,.8)", fontSize: 14, padding: "0 24px" }}>
              {photos[open].alt} · {open + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function navBtn(side: "left" | "right"): CSSProperties {
  return {
    position: "absolute", [side]: "clamp(8px,2vw,28px)", top: "50%", transform: "translateY(-50%)",
    width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,.12)",
    border: "1px solid rgba(255,255,255,.2)", color: "#fff", display: "grid", placeItems: "center",
    cursor: "pointer", zIndex: 3,
  } as CSSProperties;
}
