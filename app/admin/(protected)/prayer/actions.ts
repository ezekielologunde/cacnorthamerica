"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { revalidatePath } from "next/cache";

export async function archivePrayer(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("prayer_requests").update({ archived: true }).eq("id", id);
  if (error) {
    console.error("[prayer] archivePrayer failed:", error.message);
    throw new Error("Could not archive request. Please try again.");
  }
  revalidatePath("/admin/prayer");
}

export async function unarchivePrayer(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("prayer_requests").update({ archived: false }).eq("id", id);
  if (error) {
    console.error("[prayer] unarchivePrayer failed:", error.message);
    throw new Error("Could not unarchive request. Please try again.");
  }
  revalidatePath("/admin/prayer");
}
