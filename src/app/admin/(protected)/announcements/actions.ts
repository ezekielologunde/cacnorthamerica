"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteAnnouncement, upsertAnnouncement } from "@/lib/data/queries";

function afterMutate() {
  revalidatePath("/admin/announcements");
  revalidatePath("/");
}

export async function saveAnnouncement(formData: FormData) {
  const id = formData.get("id")?.toString() || undefined;
  await upsertAnnouncement({
    id,
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    startsAt: String(formData.get("startsAt") ?? ""),
    expiresAt: String(formData.get("expiresAt") ?? "") || undefined,
    isPinned: formData.get("isPinned") === "on",
    isPublished: formData.get("isPublished") === "on",
  });
  afterMutate();
  redirect("/admin/announcements");
}

export async function removeAnnouncement(formData: FormData) {
  await deleteAnnouncement(String(formData.get("id")));
  afterMutate();
}
