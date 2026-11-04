// What happens when a recurring gift goes wrong: a charge fails, the
// subscription ends, or the donor's bank disputes a debit. Free of imports so
// scripts/check-giving-problem.mjs can load it under plain Node; the Stripe
// webhook passes in the real cancel and email senders.
//
// Stripe retries a failed charge on the schedule set in the Dashboard (Smart
// Retries), so most failures need only a clear email to the donor. Three
// cases need more:
//  - the FIRST charge fails: the subscription stays active while its invoice is
//    voided, so it would try again next cycle. A gift the donor never saw
//    succeed is stopped, and they are told to give again.
//  - a dispute: the donor told their bank the debit was not authorised, and
//    the authorisation is gone, so every later debit would fail. Stop the gift.
//  - the gift ends for any reason: the donor and the committee are told.
// Donor emails never include card or bank details, only the gift.

export type ProblemKind = "failed" | "stopped-first-failure" | "ended" | "disputed" | "inquiry";

export type ProblemEmail = {
  /** Resend idempotency key (24h window) so Stripe's retries never send twice. */
  idempotencyKey: string;
  kind: ProblemKind;
  contactName: string;
  contactEmail: string;
  campaignTitle: string;
  /** "Monthly" or "Every 2 weeks", or "". */
  frequencyLabel: string;
  /** The gift, e.g. "$100.00". */
  amountLabel: string;
  /** failed only: the date Stripe will try again, e.g. "November 18, 2026", or "". */
  nextAttemptLabel: string;
  /** ended only: why, in the donor's words, or "". */
  reasonLabel: string;
  /** Who the email is for. */
  audience: "donor" | "committee";
};

export type ProblemDeps = {
  /** Resolves when the subscription is cancelled, or was already. The reason is
   *  recorded on the cancellation, so the ended handler can tell the code's own
   *  cancels from a donor's (and not tell the donor they asked for it). */
  cancelSubscription: (subscriptionId: string, reason: AutoCancelReason) => Promise<void>;
  sendEmail: (input: ProblemEmail) => Promise<boolean>;
};

export type ProblemOutcome = "handled" | "skipped" | "failed";

export type AutoCancelReason = "first-charge-failed" | "dispute";
/** Prefix of the cancellation comment the code writes when it cancels. */
export const AUTO_CANCEL_PREFIX = "auto:";

type Metadata = Record<string, string | null | undefined>;

export type FailedInvoice = {
  invoiceId: string;
  subscriptionId: string;
  billingReason: string | null;
  attemptCount: number;
  /** The invoice's status now. A late redelivery may find it already paid. */
  status: string | null;
  /** Unix seconds of the next automatic retry, or null when there is none. */
  nextAttemptAt: number | null;
  amountDueCents: number;
  contactEmail: string;
  metadata: Metadata;
};

export type EndedSubscription = {
  subscriptionId: string;
  /** Stripe's cancellation_details.reason: cancellation_requested,
   *  payment_failed, payment_disputed, or null. */
  reason: string | null;
  /** cancellation_details.comment: "auto:..." when this code cancelled it. */
  comment: string | null;
  contactEmail: string;
  metadata: Metadata;
};

export type DisputedGift = {
  disputeId: string;
  /** Stripe's dispute status. "warning_*" is a bank's inquiry, not a chargeback. */
  status: string | null;
  subscriptionId: string;
  amountCents: number;
  contactEmail: string;
  metadata: Metadata;
};

const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

function frequencyOf(frequency: string | null | undefined): string {
  return frequency === "monthly" ? "Monthly" : frequency === "biweekly" ? "Every 2 weeks" : "";
}

function isGiving(metadata: Metadata, subscriptionId: string): boolean {
  return metadata.kind === "giving" && subscriptionId !== "";
}

/** "November 18, 2026" in US Eastern time (the church's), or "". */
export function dateLabel(unixSeconds: number | null): string {
  if (!unixSeconds || !Number.isFinite(unixSeconds)) return "";
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });
}

/** Why a gift ended, in words a donor understands. Unknown reasons say nothing. */
export function reasonLabel(reason: string | null | undefined, audience: "donor" | "committee" = "donor"): string {
  if (reason === "cancellation_requested") return audience === "donor" ? "You asked us to stop it." : "Stopped at the donor's request.";
  if (reason === "payment_failed") return "The payments kept failing, so Stripe stopped it.";
  if (reason === "payment_disputed") return "A payment was disputed with the bank.";
  return "";
}

function base(meta: Metadata, contactEmail: string, amountCents: number) {
  return {
    contactName: meta.contact_name ?? "",
    contactEmail,
    campaignTitle: meta.campaign_title ?? "",
    frequencyLabel: frequencyOf(meta.frequency),
    amountLabel: dollars(amountCents),
  };
}

/** A giving subscription's charge failed (invoice.payment_failed). */
export async function handleGivingPaymentFailed(inv: FailedInvoice, deps: ProblemDeps): Promise<ProblemOutcome> {
  if (!isGiving(inv.metadata, inv.subscriptionId)) return "skipped";
  // Stripe retries a delivery for days: by then Smart Retries may have paid the
  // invoice. A healthy gift is neither cancelled nor reported as failed.
  if (inv.status === "paid") return "skipped";
  const gift = Number(inv.metadata.subtotal_cents);
  const amountCents = Number.isInteger(gift) && gift > 0 ? gift : inv.amountDueCents;
  const first = inv.billingReason === "subscription_create";
  try {
    if (first) await deps.cancelSubscription(inv.subscriptionId, "first-charge-failed");
    const kind: ProblemKind = first ? "stopped-first-failure" : "failed";
    const key = `invoice-failed/${inv.invoiceId}/${inv.attemptCount}`;
    const mail = {
      ...base(inv.metadata, inv.contactEmail, amountCents),
      kind,
      nextAttemptLabel: first ? "" : dateLabel(inv.nextAttemptAt),
      reasonLabel: "",
    };
    // The donor first, then the committee: either email failing is retried by
    // Stripe, and the keys stop the one that did send from sending twice.
    let ok = true;
    if (inv.contactEmail) ok = (await deps.sendEmail({ ...mail, audience: "donor", idempotencyKey: `${key}/donor` })) && ok;
    // The committee hears about the first failure and about the last (no retry left).
    if (first || inv.nextAttemptAt === null || inv.attemptCount <= 1) {
      ok = (await deps.sendEmail({ ...mail, audience: "committee", idempotencyKey: `${key}/committee` })) && ok;
    }
    return ok ? "handled" : "failed";
  } catch (err) {
    console.error("[giving problem] payment failure not handled", { invoiceId: inv.invoiceId, error: err instanceof Error ? err.name : "error" });
    return "failed";
  }
}

/** A giving subscription ended (customer.subscription.deleted). */
export async function handleGivingSubscriptionEnded(sub: EndedSubscription, deps: ProblemDeps): Promise<ProblemOutcome> {
  if (!isGiving(sub.metadata, sub.subscriptionId)) return "skipped";
  // Our own cancels (a failed first charge, a dispute) already told the right
  // people the right thing; an "ended" email would say the donor asked for it.
  if (sub.comment?.startsWith(AUTO_CANCEL_PREFIX)) return "skipped";
  const gift = Number(sub.metadata.subtotal_cents);
  const mail = {
    ...base(sub.metadata, sub.contactEmail, Number.isInteger(gift) && gift > 0 ? gift : 0),
    kind: "ended" as const,
    nextAttemptLabel: "",
  };
  const key = `subscription-ended/${sub.subscriptionId}`;
  try {
    let ok = true;
    if (sub.contactEmail) ok = (await deps.sendEmail({ ...mail, reasonLabel: reasonLabel(sub.reason, "donor"), audience: "donor", idempotencyKey: `${key}/donor` })) && ok;
    ok = (await deps.sendEmail({ ...mail, reasonLabel: reasonLabel(sub.reason, "committee"), audience: "committee", idempotencyKey: `${key}/committee` })) && ok;
    return ok ? "handled" : "failed";
  } catch (err) {
    console.error("[giving problem] ended gift not handled", { subscriptionId: sub.subscriptionId, error: err instanceof Error ? err.name : "error" });
    return "failed";
  }
}

/** A bank or card dispute on a giving subscription's charge. The gift is
 *  stopped and the committee told; the donor is not emailed automatically,
 *  because a dispute is a conversation for a person to have. A bank's inquiry
 *  (status "warning_*") is only a question: the committee is told, and the gift
 *  carries on. The amount shown is the gift, not the fee-inclusive charge. */
export async function handleGivingDispute(d: DisputedGift, deps: ProblemDeps): Promise<ProblemOutcome> {
  if (!isGiving(d.metadata, d.subscriptionId)) return "skipped";
  const inquiry = d.status?.startsWith("warning_") ?? false;
  const gift = Number(d.metadata.subtotal_cents);
  try {
    if (!inquiry) await deps.cancelSubscription(d.subscriptionId, "dispute");
    const ok = await deps.sendEmail({
      ...base(d.metadata, d.contactEmail, Number.isInteger(gift) && gift > 0 ? gift : d.amountCents),
      kind: inquiry ? "inquiry" : "disputed",
      nextAttemptLabel: "",
      reasonLabel: "",
      audience: "committee",
      idempotencyKey: `dispute/${d.disputeId}/committee`,
    });
    return ok ? "handled" : "failed";
  } catch (err) {
    console.error("[giving problem] dispute not handled", { disputeId: d.disputeId, error: err instanceof Error ? err.name : "error" });
    return "failed";
  }
}
