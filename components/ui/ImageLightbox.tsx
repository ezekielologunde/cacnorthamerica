"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

/** Makes any photo clickable to view full-size in an overlay — previously
 *  used only for blog cover photos, now shared across the site (leadership
 *  portraits, etc.) since the fixed-height cropped thumbnail never let
 *  visitors see the whole picture. */
export function ImageLightbox({
  src, alt, objectFit = "cover", objectPosition = "center",
}: { src: string; alt: string; objectFit?: "cover" | "contain"; objectPosition?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View full image: ${alt}`}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          padding: 0, border: "none", background: "none", cursor: "zoom-in",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit, objectPosition, display: "block" }} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(12,14,19,.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "clamp(20px,5vw,64px)",
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="press"
            style={{
              position: "absolute", top: 20, right: 20,
              width: 44, height: 44, borderRadius: 999,
              background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)",
              display: "grid", placeItems: "center", cursor: "pointer",
            }}
          >
            <X size={20} strokeWidth={2} color="#fff" aria-hidden />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 12, cursor: "default" }}
          />
        </div>
      )}
    </>
  );
}
