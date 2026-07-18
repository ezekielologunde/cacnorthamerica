"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_active || profile.role !== "super_admin") {
    throw new Error("Only an active super admin can manage users");
  }

  return supabase;
}

export async function setUserActive(formData: FormData) {
  const supabase = await requireSuperAdmin();
  const id = String(formData.get("id"));
  const isActive = formData.get("isActive") === "true";
  await supabase.from("profiles").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin/users");
}

export async function setUserRole(formData: FormData) {
  const supabase = await requireSuperAdmin();
  const id = String(formData.get("id"));
  const role = String(formData.get("role"));
  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/users");
}
