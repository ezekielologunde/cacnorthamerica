import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

// db.schema: "cacna" -- see lib/supabase/server.ts's comment; this project
// is shared with cac-salvation-center, isolated in its own Postgres schema.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "cacna" } }
  );
}
