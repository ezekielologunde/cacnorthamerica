"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      description: (formData.get("description") as string) || null,
      price_display: formData.get("price_display") as string,
      price_cents: parseInt(formData.get("price_cents") as string, 10) || 0,
      badge: (formData.get("badge") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
      image_alt: (formData.get("image_alt") as string) || null,
      order_method: formData.get("order_method") as string,
      stripe_price_id: (formData.get("stripe_price_id") as string) || null,
      external_link: (formData.get("external_link") as string) || null,
      external_label: (formData.get("external_label") as string) || null,
      published: formData.get("published") === "true",
      sort_order: parseInt(formData.get("sort_order") as string, 10) || 0,
      is_digital: formData.get("is_digital") === "true",
      digital_file_url: (formData.get("digital_file_url") as string) || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[store] createProduct failed:", error.message);
    throw new Error("Could not create product. Please try again.");
  }
  revalidatePath("/admin/store");
  revalidatePath("/store");
  redirect(`/admin/store/${data.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("products")
    .update({
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      description: (formData.get("description") as string) || null,
      price_display: formData.get("price_display") as string,
      price_cents: parseInt(formData.get("price_cents") as string, 10) || 0,
      badge: (formData.get("badge") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
      image_alt: (formData.get("image_alt") as string) || null,
      order_method: formData.get("order_method") as string,
      stripe_price_id: (formData.get("stripe_price_id") as string) || null,
      external_link: (formData.get("external_link") as string) || null,
      external_label: (formData.get("external_label") as string) || null,
      published: formData.get("published") === "true",
      sort_order: parseInt(formData.get("sort_order") as string, 10) || 0,
      is_digital: formData.get("is_digital") === "true",
      digital_file_url: (formData.get("digital_file_url") as string) || null,
    })
    .eq("id", id);

  if (error) {
    console.error("[store] updateProduct failed:", error.message);
    throw new Error("Could not save. Please try again.");
  }
  revalidatePath("/admin/store");
  revalidatePath(`/admin/store/${id}`);
  revalidatePath("/store");
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("[store] deleteProduct failed:", error.message);
    throw new Error("Could not delete product. Please try again.");
  }
  revalidatePath("/admin/store");
  revalidatePath("/store");
  redirect("/admin/store");
}

export async function togglePublished(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("products")
    .update({ published })
    .eq("id", id);
  if (error) {
    console.error("[store] togglePublished failed:", error.message);
    throw new Error("Could not update publish status.");
  }
  revalidatePath("/admin/store");
  revalidatePath("/store");
}
