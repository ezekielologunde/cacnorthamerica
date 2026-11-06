import { FORM_HEADER } from "@/lib/spam";
import { SERVE_FORM_NAME, SERVE_INBOX } from "@/lib/serveSignup";
import { serveTeamNames } from "@/lib/serveTeams";

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

/**
 * Submit a "Serve at the Convention" sign-up to /api/serve (same contract as
 * submitLead: {method:"mailto"} means Resend isn't set up, so the visitor's
 * email client opens with the sign-up addressed to SERVE_INBOX).
 *
 * Throws an Error carrying the server's message, and `field` when the server
 * names the field at fault.
 */
export async function submitServeSignup(
  data: { name: string; email: string; phone: string; note: string; teams: string[]; under18: boolean; guardianConsent: boolean; consent: boolean } & Record<string, unknown>,
  turnstileToken = "",
): Promise<"sent" | "mailto"> {
  const res = await fetch("/api/serve", {
    method: "POST",
    headers: { "Content-Type": "application/json", [FORM_HEADER]: "1" },
    body: JSON.stringify({ ...data, turnstileToken }),
  });
  const json: { success?: boolean; method?: string; error?: string; field?: string } = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(json.error ?? ""), { field: json.field });

  if (json.method === "mailto") {
    const lines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone.trim() ? `Phone: ${data.phone}` : "",
      `Teams: ${serveTeamNames(data.teams).join(", ")}`,
      data.note.trim() ? `Experience / Availability: ${data.note}` : "",
      `Under 18: ${data.under18 ? "Yes" : "No"}`,
      data.under18 ? `Guardian Consent: ${data.guardianConsent ? "Yes" : "No"}` : "",
    ].filter(Boolean);
    const subject = encodeURIComponent(`${SERVE_FORM_NAME} — CACNA`);
    window.location.href = `mailto:${SERVE_INBOX}?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
    return "mailto";
  }

  return "sent";
}
