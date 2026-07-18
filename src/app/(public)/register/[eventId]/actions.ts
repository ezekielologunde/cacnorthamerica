"use server";

import { redirect } from "next/navigation";
import { submitRegistration } from "@/lib/data/queries";

const MAX_REGISTRANTS = 6;

export async function createRegistration(formData: FormData) {
  const eventId = String(formData.get("eventId"));

  const registrants: Array<{ fullName: string; category: string }> = [];
  for (let i = 0; i < MAX_REGISTRANTS; i++) {
    const fullName = String(formData.get(`registrant_name_${i}`) ?? "").trim();
    const category = String(formData.get(`registrant_category_${i}`) ?? "adult");
    if (fullName) registrants.push({ fullName, category });
  }

  await submitRegistration({
    eventId,
    registrationType: registrants.length > 1 ? "group" : "individual",
    churchName: String(formData.get("churchName") ?? "") || undefined,
    contactName: String(formData.get("contactName") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    contactPhone: String(formData.get("contactPhone") ?? "") || undefined,
    registrants,
  });

  redirect(`/register/${eventId}/confirmation`);
}
