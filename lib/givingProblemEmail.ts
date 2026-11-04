import { Resend } from "resend";
import { escapeHtml } from "@/lib/html";
import { emailCard, emailShell, sender } from "@/lib/email";
import { SITE, SITE_URL } from "@/lib/site";
import type { ProblemEmail } from "@/lib/givingProblem";

// Emails for a recurring gift that went wrong (lib/givingProblem.ts decides
// when). Donor emails say what happened to the gift and what to do next, and
// never include card or bank details. Committee emails go to the church inbox.

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ");

function copy(input: ProblemEmail): { subject: string; heading: string; subheading: string; cards: string[] } {
  const gift = `${input.frequencyLabel ? `${input.frequencyLabel} ` : ""}${input.amountLabel} gift to ${input.campaignTitle}`.trim();
  const donor = `${escapeHtml(input.contactName)}`;
  const cards: string[] = [emailCard("Gift", escapeHtml(gift))];

  if (input.audience === "committee") {
    cards.push(emailCard("Donor", `${donor} · ${escapeHtml(input.contactEmail)}`));
    const status: Record<ProblemEmail["kind"], string> = {
      "failed": input.nextAttemptLabel ? `A charge failed. Stripe will try again on ${escapeHtml(input.nextAttemptLabel)}.` : "A charge failed and Stripe has no retry left.",
      "stopped-first-failure": "The very first charge failed, so the gift was stopped. The donor was told to give again.",
      "ended": `The gift has ended. ${escapeHtml(input.reasonLabel)}`.trim(),
      "disputed": "The donor disputed a payment with their bank. The gift was stopped. Please reach out to the donor, and respond to the dispute in Stripe within its deadline.",
    };
    cards.push(emailCard("What happened", status[input.kind]));
    return {
      subject: oneLine(`Recurring gift problem: ${input.amountLabel} for ${input.campaignTitle} (${input.kind})`),
      heading: "A recurring gift needs attention",
      subheading: "From the giving page on cacna.org.",
      cards,
    };
  }

  if (input.kind === "failed") {
    cards.push(emailCard("What happened", "Your payment did not go through. This is usually an expired card or not enough funds."));
    cards.push(emailCard("What happens next", input.nextAttemptLabel ? `We will try again on <strong>${escapeHtml(input.nextAttemptLabel)}</strong>. Nothing more is needed if the payment method is fine by then.` : "We will not try again, so this gift has stopped. You can start it again on the giving page."));
  } else if (input.kind === "stopped-first-failure") {
    cards.push(emailCard("What happened", "The first payment for this gift did not go through, so we stopped it and you have not been charged."));
    cards.push(emailCard("To give", "You are welcome to try again with another card or bank account on the giving page."));
  } else {
    cards.push(emailCard("Your recurring gift has ended", escapeHtml(input.reasonLabel || "No more payments will be taken.")));
  }
  cards.push(emailCard("Questions?", "Reply to this email and we will help."));
  return {
    subject: input.kind === "ended" ? "Your recurring gift to CACNA has ended" : "Your recurring gift to CACNA did not go through",
    heading: input.kind === "ended" ? "Your recurring gift has ended" : "Your payment did not go through",
    subheading: `Hi ${donor}, thank you for giving to CACNA.`,
    cards,
  };
}

/** Never throws. Resolves true when sent or when there is nothing to send to
 *  (no key, no address), false on a send failure, so the webhook can answer
 *  500 and Stripe retries; the idempotency key stops a duplicate. */
export async function sendGivingProblemEmail(input: ProblemEmail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = input.audience === "committee" ? SITE.email : input.contactEmail;
  if (!key || !to) return true;
  const { subject, heading, subheading, cards } = copy(input);
  try {
    const { error } = await new Resend(key).emails.send(
      {
        ...sender("giving"),
        to,
        ...(input.audience === "committee" && input.contactEmail ? { replyTo: input.contactEmail } : {}),
        subject,
        html: emailShell({
          heading,
          subheading,
          bodyHtml: cards.join(""),
          ...(input.audience === "donor" ? { ctaHref: `${SITE_URL}/giving`, ctaLabel: "Go to the giving page" } : {}),
        }),
      },
      { idempotencyKey: input.idempotencyKey },
    );
    if (error) console.error("[giving problem] email failed:", error);
    return !error;
  } catch (err) {
    console.error("[giving problem] email send failed:", err);
    return false;
  }
}
