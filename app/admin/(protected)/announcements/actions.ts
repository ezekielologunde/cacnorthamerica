"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAnnouncement(formData: FormData) {
  const { supabase } = await requireAdmin();

  const expiresRaw = formData.get("expires_at") as string;

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title: formData.get("title") as string,
      body: (formData.get("body") as string) || null,
      cta_text: (formData.get("cta_text") as string) || null,
      cta_url: (formData.get("cta_url") as string) || null,
      bg_color: (formData.get("bg_color") as string) || "#D62828",
      text_color: (formData.get("text_color") as string) || "#ffffff",
      placement: (formData.get("placement") as string) || "homepage",
      active: formData.get("active") === "true",
      expires_at: expiresRaw ? expiresRaw : null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[announcements] createAnnouncement failed:", error.message);
    throw new Error("Could not create announcement. Please try again.");
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/");
  redirect(`/admin/announcements/${data.id}`);
}

export async function updateAnnouncement(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const expiresRaw = formData.get("expires_at") as string;

  const { error } = await supabase
    .from("announcements")
    .update({
      title: formData.get("title") as string,
      body: (formData.get("body") as string) || null,
      cta_text: (formData.get("cta_text") as string) || null,
      cta_url: (formData.get("cta_url") as string) || null,
      bg_color: (formData.get("bg_color") as string) || "#D62828",
      text_color: (formData.get("text_color") as string) || "#ffffff",
      placement: (formData.get("placement") as string) || "homepage",
      active: formData.get("active") === "true",
      expires_at: expiresRaw ? expiresRaw : null,
    })
    .eq("id", id);

  if (error) {
    console.error("[announcements] updateAnnouncement failed:", error.message);
    throw new Error("Could not save. Please try again.");
  }

  revalidatePath("/admin/announcements");
  revalidatePath(`/admin/announcements/${id}`);
  revalidatePath("/");
}

export async function deleteAnnouncement(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) {
    console.error("[announcements] deleteAnnouncement failed:", error.message);
    throw new Error("Could not delete announcement. Please try again.");
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/");
  redirect("/admin/announcements");
}

export async function toggleActive(id: string, active: boolean) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("announcements")
    .update({ active })
    .eq("id", id);

  if (error) {
    console.error("[announcements] toggleActive failed:", error.message);
    throw new Error("Could not update status. Please try again.");
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/");
}
