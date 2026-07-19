import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export type RegistrantCategory = "adult" | "young_adult" | "child";

export interface ConventionPricingTier {
  id: string;
  year: number;
  category: RegistrantCategory;
  price_cents: number;
  starts_on: string;
  ends_on: string;
}

/**
 * Ported from the Convention project's lib/pricing.ts — same "today in
 * America/New_York" computation (the convention's own timezone), same
 * starts_on/ends_on window logic. CACNA has no `convention_editions` table
 * (year data lives in lib/conventions.ts), so this takes a plain `year`
 * instead of an `edition_id`.
 */
export async function getActivePricingForYear(
  supabase: SupabaseClient<Database>,
  year: number,
  onDate?: string
): Promise<ConventionPricingTier[]> {
  const today = onDate ?? new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());

  const { data } = await supabase
    .from("convention_pricing_tiers")
    .select("id, year, category, price_cents, starts_on, ends_on")
    .eq("year", year)
    .lte("starts_on", today)
    .gte("ends_on", today)
    .order("sort_order");

  return (data ?? []) as ConventionPricingTier[];
}

export function priceForCategory(
  tiers: ConventionPricingTier[],
  category: RegistrantCategory
): ConventionPricingTier | undefined {
  return tiers.find((t) => t.category === category);
}
