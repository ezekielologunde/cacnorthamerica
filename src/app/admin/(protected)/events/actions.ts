"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteEvent, upsertEvent } from "@/lib/data/queries";
import type { EventType } from "@/lib/data/types";

function afterMutate() {
  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath("/events");
}

export async function saveEvent(formData: FormData) {
  const id = formData.get("id")?.toString() || undefined;
  await upsertEvent({
    id,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    eventType: (formData.get("eventType") as EventType) ?? "service",
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    location: String(formData.get("location") ?? ""),
    themeText: String(formData.get("themeText") ?? "") || undefined,
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  });
  afterMutate();
  redirect("/admin/events");
}

export async function removeEvent(formData: FormData) {
  const id = String(formData.get("id"));
  await deleteEvent(id);
  afterMutate();
}
