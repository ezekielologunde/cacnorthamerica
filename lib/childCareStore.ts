import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import type { ChildCareRow } from "@/lib/childCare";

// Saves Children's Ministry care details in cacna.child_care_details
// (supabase/migrations/0026_child_care_details.sql), which only the service
// role can read or write.
//
// Unlike lib/checkinStore.ts this is NOT best effort: the register route
// refuses the registration when it returns false, so a parent is never told a
// child is registered while their allergy details were lost. Logs carry the
// registration ref and an error code only, never a name or a medical detail
// (a database error message can echo row values).

export async function saveChildCare(ref: string, rows: ChildCareRow[]): Promise<boolean> {
  if (rows.length === 0) return true;
  const safeRef = typeof ref === "string" ? ref.slice(0, 100) : "?";
  try {
    // createServiceClient() would fall back to the anon key, which has no
    // privileges on this table: refuse outright instead.
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error(`[child-care] SUPABASE_SERVICE_ROLE_KEY not set; care details not stored for ref ${safeRef}`);
      return false;
    }
    const { error } = await createServiceClient()
      .from("child_care_details")
      .insert(rows)
      .abortSignal(AbortSignal.timeout(5000));
    if (error) {
      console.error(`[child-care] insert failed for ref ${safeRef}: ${error.code ?? "unknown"}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[child-care] failed for ref ${safeRef}: ${err instanceof Error ? err.name : "error"}`);
    return false;
  }
}
