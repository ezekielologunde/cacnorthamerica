"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = ["pending", "paid", "failed", "refunded"] as const;

export async function setRegistrationStatus(id: string, status: string) {
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Invalid status");
  }
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("convention_registrations").update({ status }).eq("id", id);
  if (error) {
    console.error("[convention-registrations] setRegistrationStatus failed:", error.message);
    throw new Error("Could not update registration status. Please try again.");
  }
  revalidatePath("/admin/convention-registrations");
}
