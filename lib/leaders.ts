import { createClient } from "@supabase/supabase-js";

export type LeaderCategory =
  | "cacna_regional"
  | "global_hq"
  | "zonal_superintendent"
  | "past_president"
  | "past_superintendent"
  | "past_evangelist"
  | "bible_institute";

export interface Leader {
  id: string;
  full_name: string;
  title: string;
  category: LeaderCategory;
  bio: string | null;
  photo_url: string | null;
  zone_name: string | null;
  phone: string | null;
  email: string | null;
  tenure_start: string | null;
  tenure_end: string | null;
  sort_order: number;
}

function client() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** Published leaders, optionally filtered to one or more categories, ordered
 *  the way they're meant to be displayed. */
export async function getLeaders(categories?: LeaderCategory[]): Promise<Leader[]> {
  let query = client()
    .from("leaders")
    .select("id, full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order")
    .eq("is_published", true)
    .order("category")
    .order("sort_order");

  if (categories?.length) query = query.in("category", categories);

  const { data } = await query;
  return (data ?? []) as Leader[];
}
