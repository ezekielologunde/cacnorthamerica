"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteTenet, upsertTenet } from "@/lib/data/queries";

function afterMutate() {
  revalidatePath("/admin/tenets");
  revalidatePath("/tenets");
}

export async function saveTenet(formData: FormData) {
  const id = formData.get("id")?.toString() || undefined;
  await upsertTenet({
    id,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    isPublished: formData.get("isPublished") === "on",
  });
  afterMutate();
  redirect("/admin/tenets");
}

export async function removeTenet(formData: FormData) {
  await deleteTenet(String(formData.get("id")));
  afterMutate();
}
