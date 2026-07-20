import "server-only";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Without the real service-role key, createServiceClient() falls back to the
  // anon key — which can never pass admin_profiles' RLS (it requires auth.uid(),
  // and that fallback client carries no session). Every admin login would look
  // like "wrong account" instead of "server misconfigured". Fail loudly instead.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    redirect("/admin/login?error=missing_service_key");
  }

  const service = createServiceClient();
  const { data: profile } = await service
    .from("admin_profiles").select("id").eq("id", user.id).single();
  if (!profile) redirect("/admin/login?error=unauthorized");
  return { supabase: service, user };
}
