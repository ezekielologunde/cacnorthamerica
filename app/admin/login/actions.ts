"use server";

import { createClient } from "@/lib/supabase/server";

export async function loginAction(_: unknown, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) return { error: "Invalid email or password." };

  return { success: true };
}
