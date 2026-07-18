"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function sanitizeUrl(raw: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!/^https?:\/\//i.test(trimmed)) throw new Error("Event URL must start with https:// or http://");
  return trimmed;
}

export async function createEvent(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("events")
    .insert({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      event_date: formData.get("event_date") as string,
      end_date: (formData.get("end_date") as string) || null,
      location: (formData.get("location") as string) || null,
      event_url: sanitizeUrl(formData.get("event_url") as string),
      published: formData.get("published") === "true",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[events] createEvent failed:", error.message);
    throw new Error("Could not create event. Please try again.");
  }
  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect(`/admin/events/${data.id}`);
}

export async function updateEvent(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("events")
    .update({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      event_date: formData.get("event_date") as string,
      end_date: (formData.get("end_date") as string) || null,
      location: (formData.get("location") as string) || null,
      event_url: sanitizeUrl(formData.get("event_url") as string),
      published: formData.get("published") === "true",
    })
    .eq("id", id);

  if (error) {
    console.error("[events] updateEvent failed:", error.message);
    throw new Error("Could not save. Please try again.");
  }
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/events");
}

export async function deleteEvent(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    console.error("[events] deleteEvent failed:", error.message);
    throw new Error("Could not delete event. Please try again.");
  }
  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}
