import { createClient } from "@supabase/supabase-js";

// Canonical category list — kept in sync by hand with the `leaders_category_check`
// constraint (see migration leaders_person_linking_and_tenure_year). Any future
// category must be added to BOTH the DB constraint and this union together.
export type LeaderCategory =
  | "cacna_regional"
  | "global_hq"
  | "zonal_superintendent"
  | "past_president"
  | "past_superintendent"
  | "past_evangelist"
  | "bible_institute"
  | "dcc_superintendent";

export interface Leader {
  id: string;
  full_name: string;
  title: string;
  category: LeaderCategory;
  bio: string | null;
  photo_url: string | null;
  /** Free-text zone label — must exactly match the ZONE_POSITIONS keys used
   *  by components/sections/GlobalChurches.tsx; a typo here silently falls
   *  back to that map's default pin position rather than erroring. */
  zone_name: string | null;
  phone: string | null;
  email: string | null;
  /** Bare years only (e.g. 1943) — source material never records a month/day. */
  tenure_start: number | null;
  tenure_end: number | null;
  sort_order: number;
  /** Stable slug linking multiple role-rows to the same real person (e.g.
   *  "david-adenodi" across his cacna_regional, bible_institute, and
   *  dcc_superintendent rows). Null for leaders who only hold one role. */
  person_key: string | null;
}

function client() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** Published leaders, optionally filtered to one or more categories, ordered
 *  the way they're meant to be displayed. */
const LEADER_COLUMNS = "id, full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key";

export async function getLeaders(categories?: LeaderCategory[]): Promise<Leader[]> {
  let query = client()
    .from("leaders")
    .select(LEADER_COLUMNS)
    .eq("is_published", true)
    .order("category")
    .order("sort_order");

  if (categories?.length) query = query.in("category", categories);

  const { data } = await query;
  return (data ?? []) as Leader[];
}

/** All published role-rows for one real person, across every category they
 *  hold (e.g. Regional Secretary + Bible Institute Registrar + DCC Superintendent). */
export async function getLeaderRoles(personKey: string): Promise<Leader[]> {
  const { data } = await client()
    .from("leaders")
    .select(LEADER_COLUMNS)
    .eq("is_published", true)
    .eq("person_key", personKey)
    .order("sort_order");
  return (data ?? []) as Leader[];
}
