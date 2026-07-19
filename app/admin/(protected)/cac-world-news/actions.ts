"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { fetchCacWorldCandidates } from "@/lib/cacWorldNews";
import { revalidatePath } from "next/cache";

export async function fetchLatestCandidates(): Promise<{ ok: boolean; added: number; error?: string }> {
  const { supabase } = await requireAdmin();

  let candidates;
  try {
    candidates = await fetchCacWorldCandidates();
  } catch (err) {
    return { ok: false, added: 0, error: err instanceof Error ? err.message : "Failed to reach CAC World News" };
  }

  if (candidates.length === 0) return { ok: true, added: 0 };

  const { data: existing } = await supabase
    .from("cac_world_news")
    .select("source_url")
    .in("source_url", candidates.map((c) => c.sourceUrl));

  const known = new Set((existing ?? []).map((r) => r.source_url));
  const fresh = candidates.filter((c) => !known.has(c.sourceUrl));

  if (fresh.length === 0) {
    revalidatePath("/admin/cac-world-news");
    return { ok: true, added: 0 };
  }

  const { error } = await supabase.from("cac_world_news").insert(
    fresh.map((c) => ({
      source_url: c.sourceUrl,
      title: c.title,
      excerpt: c.excerpt,
      image_url: c.imageUrl,
      published_at: c.publishedAt,
      status: "pending",
    })),
  );

  if (error) {
    console.error("[cac-world-news] insert failed:", error.message);
    return { ok: false, added: 0, error: error.message };
  }

  revalidatePath("/admin/cac-world-news");
  return { ok: true, added: fresh.length };
}

export async function approveNews(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("cac_world_news")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    console.error("[cac-world-news] approveNews failed:", error.message);
    throw new Error("Could not approve article. Please try again.");
  }
  revalidatePath("/admin/cac-world-news");
  revalidatePath("/blog");
}

export async function rejectNews(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("cac_world_news")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    console.error("[cac-world-news] rejectNews failed:", error.message);
    throw new Error("Could not reject article. Please try again.");
  }
  revalidatePath("/admin/cac-world-news");
}

export async function unpublishNews(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("cac_world_news")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    console.error("[cac-world-news] unpublishNews failed:", error.message);
    throw new Error("Could not unpublish article. Please try again.");
  }
  revalidatePath("/admin/cac-world-news");
  revalidatePath("/blog");
}
