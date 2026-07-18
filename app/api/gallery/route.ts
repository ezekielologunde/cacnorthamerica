import { NextResponse } from "next/server";
import GALLERY_IDS from "@/lib/gallery-ids.json";
import { createServiceClient } from "@/lib/supabase/server";

// Gallery images are pre-fetched from Cloudinary and stored in lib/gallery-ids.json.
// Run `node scripts/fetch-gallery.mjs` locally to refresh after new uploads.
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dkmn2rtbc";

export const revalidate = 3600; // 1h — allows DB images to appear within an hour

const SAMPLE_IDS = new Set([
  "main-sample", "cld-sample", "cld-sample-2",
  "cld-sample-3", "cld-sample-4", "cld-sample-5", "sample",
]);

function cloudinaryPhoto(id: string) {
  const slug = id.split("/").pop() ?? id;
  const alt = slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    src:   `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_1400/${id}`,
    thumb: `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_500/${id}`,
    alt,
    id,
  };
}

export async function GET() {
  // Fetch DB-managed images first. SUPABASE_SERVICE_ROLE_KEY isn't set up
  // yet in this environment — skip the DB lookup rather than crash the
  // build/request; the static JSON fallback below still serves photos.
  let dbImages: { cloudinary_public_id: string }[] = [];
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const service = createServiceClient();
    const { data } = await service
      .from("gallery_images")
      .select("id, cloudinary_public_id, caption, alt_text, category")
      .eq("published", true)
      .order("sort_order");
    dbImages = data ?? [];
  }

  const dbPhotos = dbImages.map((img) => cloudinaryPhoto(img.cloudinary_public_id));

  // Static JSON fallback (deduplicate IDs already in DB)
  const dbIds = new Set((dbImages ?? []).map((img) => img.cloudinary_public_id));
  const staticIds = (GALLERY_IDS as string[]).filter(
    (id) => !SAMPLE_IDS.has(id) && !dbIds.has(id)
  );
  const staticPhotos = staticIds.map(cloudinaryPhoto);

  const photos = [...dbPhotos, ...staticPhotos];

  return NextResponse.json({ photos, total: photos.length });
}
