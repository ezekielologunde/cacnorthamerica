"use server";

import { revalidatePath } from "next/cache";
import { addMedia, deleteMedia, getMedia } from "@/lib/data/queries";

function afterMutate() {
  revalidatePath("/admin/media");
}

export async function createMedia(formData: FormData) {
  const existing = await getMedia();
  await addMedia({
    url: String(formData.get("url") ?? ""),
    altText: String(formData.get("altText") ?? ""),
    caption: String(formData.get("caption") ?? "") || undefined,
    album: String(formData.get("album") ?? "general"),
    sortOrder: existing.length,
  });
  afterMutate();
}

export async function removeMedia(formData: FormData) {
  await deleteMedia(String(formData.get("id")));
  afterMutate();
}
