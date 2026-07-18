"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { revalidatePath } from "next/cache";

export async function addImage(formData: FormData) {
  const { supabase } = await requireAdmin();

  const cloudinary_public_id = (formData.get("cloudinary_public_id") as string | null)?.trim();
  if (!cloudinary_public_id) throw new Error("Cloudinary public ID is required.");

  const caption = (formData.get("caption") as string | null)?.trim() || null;
  const alt_text = (formData.get("alt_text") as string | null)?.trim() || null;
  const category = (formData.get("category") as string | null)?.trim() || "general";
  const sort_order = parseInt((formData.get("sort_order") as string | null) ?? "0", 10) || 0;

  const { error } = await supabase.from("gallery_images").insert({
    cloudinary_public_id,
    caption,
    alt_text,
    category,
    sort_order,
  });

  if (error) {
    console.error("[gallery] addImage failed:", error.message);
    throw new Error("Could not add image. Please try again.");
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function removeImage(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);

  if (error) {
    console.error("[gallery] removeImage failed:", error.message);
    throw new Error("Could not remove image. Please try again.");
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function updateImage(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const caption = (formData.get("caption") as string | null)?.trim() || null;
  const alt_text = (formData.get("alt_text") as string | null)?.trim() || null;
  const category = (formData.get("category") as string | null)?.trim() || "general";
  const sort_order = parseInt((formData.get("sort_order") as string | null) ?? "0", 10) || 0;
  const published = formData.get("published") === "true";

  const { error } = await supabase
    .from("gallery_images")
    .update({ caption, alt_text, category, sort_order, published })
    .eq("id", id);

  if (error) {
    console.error("[gallery] updateImage failed:", error.message);
    throw new Error("Could not update image. Please try again.");
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function toggleImagePublished(id: string, published: boolean) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("gallery_images")
    .update({ published })
    .eq("id", id);

  if (error) {
    console.error("[gallery] toggleImagePublished failed:", error.message);
    throw new Error("Could not update image. Please try again.");
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
