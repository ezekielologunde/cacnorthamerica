"use server";

import { revalidatePath } from "next/cache";
import { updateRegistrationStatus } from "@/lib/data/queries";
import type { RegistrationStatus } from "@/lib/data/types";

export async function setRegistrationStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = formData.get("status") as RegistrationStatus;
  await updateRegistrationStatus(id, status);
  revalidatePath("/admin/registrations");
}
