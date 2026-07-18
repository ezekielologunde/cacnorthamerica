"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteChurch, upsertChurch } from "@/lib/data/queries";

function afterMutate() {
  revalidatePath("/admin/churches");
  revalidatePath("/churches");
  revalidatePath("/");
}

export async function saveChurch(formData: FormData) {
  const id = formData.get("id")?.toString() || undefined;
  await upsertChurch({
    id,
    name: String(formData.get("name") ?? ""),
    address: String(formData.get("address") ?? ""),
    city: String(formData.get("city") ?? ""),
    region: String(formData.get("region") ?? ""),
    country: String(formData.get("country") ?? "USA"),
    contactPhone: String(formData.get("contactPhone") ?? "") || undefined,
    websiteUrl: String(formData.get("websiteUrl") ?? "") || undefined,
    category: (formData.get("category") as "member" | "partner") ?? "member",
    isPublished: formData.get("isPublished") === "on",
  });
  afterMutate();
  redirect("/admin/churches");
}

export async function removeChurch(formData: FormData) {
  await deleteChurch(String(formData.get("id")));
  afterMutate();
}
