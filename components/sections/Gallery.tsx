"use client";

import { useEffect, useState, useCallback, type CSSProperties } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cloudinaryLoader } from "@/lib/cloudinary-loader";

const STATIC_PHOTOS = [
  { src: "/images/congregation.jpg", alt: "Congregation in colorful African attire worshipping together", id: "s1" },
  { src: "/images/worship.jpg",      alt: "Women singing at Easter Sunday service",                       id: "s2" },
  { src: "/images/choir.jpg",        alt: "The Salvation Center choir in red and white robes",            id: "s3" },
  { src: "/images/stage.jpg",        alt: "Church stage with leadership beneath the CAC banner",          id: "s4" },
  { src: "/images/pastor.jpg",       alt: "Pastor Dr. H.O. Ilufoye preaching",                           id: "s5" },
  { src: "/images/pastor-choir.jpg", alt: "Pastor Dr. H.O. Ilufoye with the choir in worship",           id: "s6" },
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
