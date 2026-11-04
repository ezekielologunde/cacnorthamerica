import { FORM_HEADER } from "@/lib/spam";

export type LeadData = Record<string, string>;

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Submit a lead/form to the church inbox.
 *
 * Posts to /api/contact which uses Resend when RESEND_API_KEY is set in the
 * environment. If the key is not configured the API returns {method:"mailto"}
 * and we fall back to opening the visitor's email client — so a submission is
 * never silently dropped.
 *
 * Returns "sent" (delivered by Resend) or "mailto" (handed to email client).
 */
export async function submitLead(data: LeadData, formName: string, turnstileToken = ""): Promise<"sent" | "mailto"> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", [FORM_HEADER]: "1" },
    body: JSON.stringify({ ...data, formName, turnstileToken }),
  });

  if (!res.ok) throw new Error(`Submission failed (${res.status})`);

  const json: { success?: boolean; method?: string } = await res.json();

  if (json.method === "mailto") {
    const subject = encodeURIComponent(`${formName} — CACNA`);
    const body = encodeURIComponent(
      Object.entries(data)
        .filter(([, v]) => v.trim())
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    );
    window.location.href = `mailto:info@cacna.org?subject=${subject}&body=${body}`;
    return "mailto";
  }

  return "sent";
}
