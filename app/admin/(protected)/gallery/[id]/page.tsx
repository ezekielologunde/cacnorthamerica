import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import GalleryImageForm from "@/components/admin/GalleryImageForm";

type ImageRow = {
  id: string;
  cloudinary_public_id: string;
  caption: string | null;
  alt_text: string | null;
  category: string;
  sort_order: number;
  published: boolean;
};

export default async function EditGalleryImagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("id, cloudinary_public_id, caption, alt_text, category, sort_order, published")
    .eq("id", id)
    .single();

  const image = data as ImageRow | null;
  if (!image) notFound();

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin/gallery" style={{ color: "var(--ink-soft)", fontSize: 13, textDecoration: "none" }}>
          ← Gallery
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "8px 0 0" }}>
          Edit Photo
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 28, alignItems: "start" }}>
        {/* Preview */}
        <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <img
            src={`https://res.cloudinary.com/dkmn2rtbc/image/upload/f_auto,q_auto,w_600/${image.cloudinary_public_id}`}
            alt={image.alt_text ?? image.caption ?? "Gallery image"}
            style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
          />
          <div style={{ padding: "12px 16px" }}>
            <p style={{ fontSize: 11, color: "var(--ink-soft)", margin: "0 0 4px", fontFamily: "monospace" }}>
              {image.cloudinary_public_id}
            </p>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "white", borderRadius: 12, padding: "32px 36px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <GalleryImageForm image={image} />
        </div>
      </div>
    </div>
  );
}
