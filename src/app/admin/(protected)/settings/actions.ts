"use server";

import { revalidatePath } from "next/cache";
import { updateSiteContent, updateSiteSettings } from "@/lib/data/queries";

function afterMutate() {
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
}

export async function saveSiteSettings(formData: FormData) {
  await updateSiteSettings({
    churchName: String(formData.get("churchName") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    contactPhone: String(formData.get("contactPhone") ?? ""),
    address: String(formData.get("address") ?? ""),
    facebookUrl: String(formData.get("facebookUrl") ?? "") || undefined,
    instagramUrl: String(formData.get("instagramUrl") ?? "") || undefined,
    youtubeUrl: String(formData.get("youtubeUrl") ?? "") || undefined,
    prayerLineNumber: String(formData.get("prayerLineNumber") ?? "") || undefined,
    prayerLineAccessCode:
      String(formData.get("prayerLineAccessCode") ?? "") || undefined,
    prayerLineTime: String(formData.get("prayerLineTime") ?? "") || undefined,
  });
  afterMutate();
}

export async function saveSiteContent(formData: FormData) {
  const pageKey = String(formData.get("pageKey"));
  const sectionKey = String(formData.get("sectionKey"));
  const content = String(formData.get("content") ?? "");
  await updateSiteContent(pageKey, sectionKey, content);
  afterMutate();
}
