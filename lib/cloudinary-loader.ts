import type { ImageLoaderProps } from "next/image";

/**
 * next/image loader for images already hosted on Cloudinary.
 *
 * Cloudinary does the resize/format/quality work itself, so next/image no
 * longer routes these through Vercel's Image Optimization — which is metered
 * (5,000 transformations/month on the free tier). Cloudinary returns a
 * correctly sized image per breakpoint via `w_<width>`.
 *
 * Non-Cloudinary sources (e.g. local `/public` fallbacks) are returned
 * untouched so they load directly without a Vercel transformation.
 */
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const marker = "/image/upload/";
  const idx = src.indexOf(marker);
  if (idx === -1) return src; // not a Cloudinary upload URL — leave as-is

  const base = src.slice(0, idx + marker.length);
  let rest = src.slice(idx + marker.length);

  // Drop any transformation segment baked into the URL (e.g. "f_auto,q_auto,w_1400/")
  const slash = rest.indexOf("/");
  const firstSeg = slash === -1 ? rest : rest.slice(0, slash);
  if (/(?:^|,)(?:f_|q_|w_|h_|c_|e_|dpr_)/.test(firstSeg)) {
    rest = slash === -1 ? "" : rest.slice(slash + 1);
  }

  return `${base}f_auto,q_${quality ?? "auto"},w_${width}/${rest}`;
}
