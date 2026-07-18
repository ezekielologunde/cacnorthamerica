"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteLeader, upsertLeader } from "@/lib/data/queries";
import type { LeaderCategory } from "@/lib/data/types";

function afterMutate() {
  revalidatePath("/admin/leaders");
  revalidatePath("/leadership");
  revalidatePath("/zones");
}

export async function saveLeader(formData: FormData) {
  const id = formData.get("id")?.toString() || undefined;
  await upsertLeader({
    id,
    fullName: String(formData.get("fullName") ?? ""),
    title: String(formData.get("title") ?? ""),
    category: formData.get("category") as LeaderCategory,
    bio: String(formData.get("bio") ?? "") || undefined,
    zoneName: String(formData.get("zoneName") ?? "") || undefined,
    phone: String(formData.get("phone") ?? "") || undefined,
    email: String(formData.get("email") ?? "") || undefined,
    tenureStart: String(formData.get("tenureStart") ?? "") || undefined,
    tenureEnd: String(formData.get("tenureEnd") ?? "") || undefined,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    isPublished: formData.get("isPublished") === "on",
  });
  afterMutate();
  redirect("/admin/leaders");
}

export async function removeLeader(formData: FormData) {
  await deleteLeader(String(formData.get("id")));
  afterMutate();
}
