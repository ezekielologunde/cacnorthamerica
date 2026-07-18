"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { revalidatePath } from "next/cache";

export async function approveTestimony(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("testimonies").update({ approved: true }).eq("id", id);
  if (error) {
    console.error("[testimonies] approveTestimony failed:", error.message);
    throw new Error("Could not approve testimony. Please try again.");
  }
  revalidatePath("/admin/testimonies");
  revalidatePath("/testimonies");
}

export async function deleteTestimony(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("testimonies").delete().eq("id", id);
  if (error) {
    console.error("[testimonies] deleteTestimony failed:", error.message);
    throw new Error("Could not delete testimony. Please try again.");
  }
  revalidatePath("/admin/testimonies");
}
