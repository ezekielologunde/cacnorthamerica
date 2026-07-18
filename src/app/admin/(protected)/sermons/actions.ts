"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteLiveStream, upsertLiveStream } from "@/lib/data/queries";
import type { StreamPlatform } from "@/lib/data/types";

function afterMutate() {
  revalidatePath("/admin/sermons");
  revalidatePath("/live");
}

export async function saveLiveStream(formData: FormData) {
  const id = formData.get("id")?.toString() || undefined;
  await upsertLiveStream({
    id,
    title: String(formData.get("title") ?? ""),
    speaker: String(formData.get("speaker") ?? ""),
    streamUrl: String(formData.get("streamUrl") ?? ""),
    platform: (formData.get("platform") as StreamPlatform) ?? "youtube",
    isLive: formData.get("isLive") === "on",
    scheduledAt: String(formData.get("scheduledAt") ?? ""),
    recordingUrl: String(formData.get("recordingUrl") ?? "") || undefined,
    isPublished: formData.get("isPublished") === "on",
  });
  afterMutate();
  redirect("/admin/sermons");
}

export async function removeLiveStream(formData: FormData) {
  await deleteLiveStream(String(formData.get("id")));
  afterMutate();
}
