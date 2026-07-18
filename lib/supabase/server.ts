import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:    () => cookieStore.getAll(),
        setAll: (pairs) => {
          try { pairs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch { /* called from Server Component — ignored */ }
        },
      },
    }
  );
}

// Uses service role key — bypasses RLS entirely. No cookie handling.
//
// SUPABASE_SERVICE_ROLE_KEY isn't provisioned yet in this environment. Rather
// than crash every route/page that reads through this client (supabase-js
// throws synchronously at construction if the key is empty), fall back to
// the anon key: RLS then still applies, so public reads of published rows
// keep working and admin/unpublished-bypass reads just come back filtered
// instead of erroring. Add the real key to .env.local to restore full
// admin access (see require-admin.ts, which needs it to check admin_profiles).
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
