"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
}

function validateSlug(slug: string): string {
  const s = slug.trim().slice(0, 80);
  if (!SLUG_RE.test(s)) throw new Error("Slug must contain only lowercase letters, numbers, and hyphens.");
  return s;
}

export async function createPost(formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = formData.get("title") as string;
  const slug = validateSlug((formData.get("slug") as string) || slugify(title));
  const excerpt = (formData.get("excerpt") as string) || null;
  const body = formData.get("body") as string;
  const published = formData.get("published") === "true";

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ title, slug, excerpt, body, published, published_at: published ? new Date().toISOString() : null })
    .select("id")
    .single();

  if (error) {
    console.error("[blog] createPost failed:", error.message);
    throw new Error("Could not create post. Please try again.");
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect(`/admin/blog/${data.id}`);
}

export async function updatePost(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = formData.get("title") as string;
  const slug = validateSlug(formData.get("slug") as string);
  const excerpt = (formData.get("excerpt") as string) || null;
  const body = formData.get("body") as string;
  const published = formData.get("published") === "true";

  const { data: existing } = await supabase.from("blog_posts").select("published, published_at").eq("id", id).single();
  const published_at = published
    ? (existing?.published ? existing.published_at : new Date().toISOString())
    : null;

  const { error } = await supabase
    .from("blog_posts")
    .update({ title, slug, excerpt, body, published, published_at })
    .eq("id", id);

  if (error) {
    console.error("[blog] updatePost failed:", error.message);
    throw new Error("Could not save. Please try again.");
  }
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
}

export async function deletePost(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) {
    console.error("[blog] deletePost failed:", error.message);
    throw new Error("Could not delete post. Please try again.");
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}
