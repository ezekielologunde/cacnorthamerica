"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { checkinPageHref, isCheckinId } from "@/lib/checkinSearch";

// Both actions are bound to the person's id and posted from a form that
// carries the current search (hidden q / year), so the volunteer lands back
// on the same results, with or without JavaScript.

export async function checkInPerson(id: string, formData?: FormData) {
  const { supabase, user } = await requireAdmin();
  if (!isCheckinId(id)) throw new Error("Could not check this person in. Please try again.");
  // Only where not yet checked in: a double tap, or two volunteers on the same
  // person, never overwrites who checked them in or when.
  const { error } = await supabase
    .from("checkin_people")
    .update({ checked_in_at: new Date().toISOString(), checked_in_by: user.email ?? null })
    .eq("id", id)
    .is("checked_in_at", null);
  if (error) {
    console.error(`[check-in] checkInPerson failed for id ${id}`);
    throw new Error("Could not check this person in. Please try again.");
  }
  revalidatePath("/admin/check-in");
  redirect(checkinPageHref(formData?.get("q"), formData?.get("year")), RedirectType.replace);
}

export async function undoCheckIn(id: string, formData?: FormData) {
  const { supabase } = await requireAdmin();
  if (!isCheckinId(id)) throw new Error("Could not undo this check-in. Please try again.");
  const { error } = await supabase
    .from("checkin_people")
    .update({ checked_in_at: null, checked_in_by: null })
    .eq("id", id);
  if (error) {
    console.error(`[check-in] undoCheckIn failed for id ${id}`);
    throw new Error("Could not undo this check-in. Please try again.");
  }
  revalidatePath("/admin/check-in");
  redirect(checkinPageHref(formData?.get("q"), formData?.get("year")), RedirectType.replace);
}
