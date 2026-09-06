import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

// db.schema: "cacna" -- this project's Postgres instance is shared with the
// sibling cac-salvation-center site (CACNA's own Supabase project no longer
// exists), isolated in its own schema so these clients never touch that
// site's public.* tables. The generated Database type below still calls its
// one schema key "public" (that's just a label from when CACNA had its own
// project) -- it accurately describes the cacna schema's actual tables, and
// supabase-js doesn't cross-check the label against the runtime db.schema
// option, so this works without regenerating types.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "cacna" },
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
// Falls back to the anon key only if SUPABASE_SERVICE_ROLE_KEY is ever unset
// again (supabase-js throws synchronously at construction on an empty key) --
// RLS then still applies, so public reads keep working and admin/bypass
// reads just come back filtered instead of erroring. require-admin.ts
// fails loudly in that case rather than silently misbehaving.
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "cacna" }, auth: { autoRefreshToken: false, persistSession: false } }
  );
}
