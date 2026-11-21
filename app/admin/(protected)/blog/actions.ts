"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { revalidatePath } from "next/cache";
import { revalidateBlogContent } from "@/lib/contentRevalidation";
import { redirect } from "next/navigation";
import { parseAuthors } from "@/lib/blog-authors";
import type { Json } from "@/types/database.types";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
}

function readAuthors(formData: FormData): Json {
  try {
    return parseAuthors(JSON.parse(String(formData.get("authors") ?? "[]"))) as unknown as Json;
  } catch {
    return [];
  }
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
  const image_url = (formData.get("image_url") as string) || null;
  const image_alt = (formData.get("image_alt") as string) || null;
  const authors = readAuthors(formData);

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ title, slug, excerpt, body, published, image_url, image_alt, authors, published_at: published ? new Date().toISOString() : null })
    .select("id")
    .single();

  if (error) {
    console.error("[blog] createPost failed:", error.message);
    throw new Error("Could not create post. Please try again.");
  }
  revalidatePath("/admin/blog");
  revalidateBlogContent();
  redirect(`/admin/blog/${data.id}`);
}

export async function updatePost(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = formData.get("title") as string;
  const slug = validateSlug(formData.get("slug") as string);
  const excerpt = (formData.get("excerpt") as string) || null;
  const body = formData.get("body") as string;
  const published = formData.get("published") === "true";
  const image_url = (formData.get("image_url") as string) || null;
  const image_alt = (formData.get("image_alt") as string) || null;
  const authors = readAuthors(formData);

  const { data: existing } = await supabase.from("blog_posts").select("published, published_at").eq("id", id).single();
  const published_at = published
    ? (existing?.published ? existing.published_at : new Date().toISOString())
    : null;

  const { error } = await supabase
    .from("blog_posts")
    .update({ title, slug, excerpt, body, published, image_url, image_alt, authors, published_at })
    .eq("id", id);

  if (error) {
    console.error("[blog] updatePost failed:", error.message);
    throw new Error("Could not save. Please try again.");
  }
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidateBlogContent();
}

export async function deletePost(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) {
    console.error("[blog] deletePost failed:", error.message);
    throw new Error("Could not delete post. Please try again.");
  }
  revalidatePath("/admin/blog");
  revalidateBlogContent();
  redirect("/admin/blog");
}
