import { Resend } from "resend";
import { emailShell, sender } from "@/lib/email";
import { escapeHtml } from "@/lib/html";
import { SITE_URL } from "@/lib/site";
import { serveTeamNames } from "@/lib/serveTeams";
import type { ServeSignup } from "@/lib/serveSignup";

// Emails for the "Serve at the Convention" sign-up (app/api/serve/route.ts).

/** The committee's notice: every submitted value, escaped. */
export function serveNoticeHtml(rows: [string, string][]): string {
  const trs = rows
    .map(([k, v]) => `<tr><td style="padding:8px 14px;font-weight:600;color:#5f5e5a;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 14px;color:#12141E">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  return emailShell({
    heading: "New convention volunteer",
    subheading: "Someone signed up on cacna.org/serve. Reply to this email to reach them.",
    bodyHtml: `<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #ECE9E4;border-radius:12px">${trs}</table>`,
  });
}

/** The volunteer's confirmation. It goes to an address nobody has verified,
 *  so it repeats none of their free text: only the team names, which come
 *  from the fixed list in lib/serveTeams.ts. */
export function serveConfirmationHtml(signup: Pick<ServeSignup, "teams" | "under18">, conventionHref: string): string {
  const teams = serveTeamNames(signup.teams).map(escapeHtml).join(", ");
  const minor = signup.under18
    ? `<p style="margin:12px 0 0;font-size:14px;color:#5f5e5a;line-height:1.7">As you are under 18, the Convention Committee may also speak with your parent or guardian.</p>`
    : "";
  const bodyHtml = `<div style="background:#fff;border:1px solid #ECE9E4;border-radius:16px;padding:24px 26px">
    <p style="margin:0;font-size:14px;color:#12141E;line-height:1.7"><strong>You offered to serve with:</strong> ${teams}</p>
    <p style="margin:12px 0 0;font-size:14px;color:#5f5e5a;line-height:1.7">The Convention Committee will be in touch with what comes next.</p>
    ${minor}
    <p style="margin:12px 0 0;font-size:13px;color:#8a8983;line-height:1.7">If you didn't sign up on cacna.org, you can safely ignore this email.</p>
  </div>`;
  return emailShell({
    heading: "Thank you for offering to serve!",
    subheading: "We've received your sign-up to serve at the CACNA Annual Convention.",
    bodyHtml,
    ctaHref: `${SITE_URL}${conventionHref}`,
    ctaLabel: "Convention details",
  });
}

/** Never throws: a courtesy on top of the committee notice, so a failure
 *  here never changes the route's response. */
export async function sendServeConfirmation(
  email: string,
  signup: Pick<ServeSignup, "teams" | "under18">,
  conventionHref: string,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    const { error } = await new Resend(key).emails.send({
      ...sender("convention"),
      to: email,
      subject: "Thank you for signing up to serve — CACNA Convention",
      html: serveConfirmationHtml(signup, conventionHref),
    });
    if (error) console.error("[serve confirmation] Resend error:", error);
  } catch (err) {
    console.error("[serve confirmation] send failed:", err);
  }
}
