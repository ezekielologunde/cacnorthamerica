"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { revalidatePath } from "next/cache";

export async function archiveContact(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("contact_submissions").update({ archived: true }).eq("id", id);
  if (error) {
    console.error("[contact] archiveContact failed:", error.message);
    throw new Error("Could not archive submission. Please try again.");
  }
  revalidatePath("/admin/contact");
}

export async function unarchiveContact(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("contact_submissions").update({ archived: false }).eq("id", id);
  if (error) {
    console.error("[contact] unarchiveContact failed:", error.message);
    throw new Error("Could not unarchive submission. Please try again.");
  }
  revalidatePath("/admin/contact");
}
