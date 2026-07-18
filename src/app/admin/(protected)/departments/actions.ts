"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteDepartment, upsertDepartment } from "@/lib/data/queries";

function afterMutate() {
  revalidatePath("/admin/departments");
  revalidatePath("/departments");
}

export async function saveDepartment(formData: FormData) {
  const id = formData.get("id")?.toString() || undefined;
  await upsertDepartment({
    id,
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    leaderName: String(formData.get("leaderName") ?? "") || undefined,
    contactEmail: String(formData.get("contactEmail") ?? "") || undefined,
    contactPhone: String(formData.get("contactPhone") ?? "") || undefined,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    isPublished: formData.get("isPublished") === "on",
  });
  afterMutate();
  redirect("/admin/departments");
}

export async function removeDepartment(formData: FormData) {
  await deleteDepartment(String(formData.get("id")));
  afterMutate();
}
