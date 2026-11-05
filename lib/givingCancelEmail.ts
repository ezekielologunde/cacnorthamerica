import { Resend } from "resend";
import { escapeHtml } from "@/lib/html";
import { emailCard, emailShell, sender } from "@/lib/email";
import { SITE_URL } from "@/lib/site";
import type { Gift } from "@/lib/givingCancel";

/** The link-bearing email for "cancel my recurring gift". Sent only to an
 *  address that has a live recurring gift. Never throws; resolves false on a
 *  send failure. With no Resend key (local development) there is nothing to
 *  send, which is not a failure. */
export async function sendGivingCancelLinkEmail(input: { email: string; token: string; gifts: Gift[] }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return true;
  const link = `${SITE_URL}/giving/cancel?t=${encodeURIComponent(input.token)}`;
  const cards = input.gifts.map((g) =>
    emailCard(
      escapeHtml([g.frequencyLabel, g.amountLabel].filter(Boolean).join(" ") || "Recurring gift"),
      escapeHtml(g.campaignTitle ? `Gift to ${g.campaignTitle}` : "Gift to CACNA"),
    ),
  );
  cards.push(emailCard("This link works for one hour", "Opening it does not cancel anything. You choose which gift to stop on the page. If you did not ask for this, ignore this email and your gifts carry on."));
  try {
    const { error } = await new Resend(key).emails.send({
      ...sender("giving"),
      to: input.email,
      subject: "Cancel your recurring gift to CACNA",
      html: emailShell({
        heading: "Stop a recurring gift",
        subheading: "You asked to cancel a recurring gift to CACNA.",
        bodyHtml: cards.join(""),
        ctaHref: link,
        ctaLabel: "Choose a gift to cancel",
      }),
    });
    if (error) console.error("[giving cancel] email failed:", error);
    return !error;
  } catch (err) {
    console.error("[giving cancel] email send failed:", err);
    return false;
  }
}
