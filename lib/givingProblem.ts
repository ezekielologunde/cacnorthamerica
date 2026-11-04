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

export type ProblemKind = "failed" | "stopped-first-failure" | "ended" | "disputed";

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
  /** Resolves when the subscription is cancelled, or was already. */
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  sendEmail: (input: ProblemEmail) => Promise<boolean>;
};

export type ProblemOutcome = "handled" | "skipped" | "failed";

type Metadata = Record<string, string | null | undefined>;

export type FailedInvoice = {
  invoiceId: string;
  subscriptionId: string;
  billingReason: string | null;
  attemptCount: number;
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
  contactEmail: string;
  metadata: Metadata;
};

export type DisputedGift = {
  disputeId: string;
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
export function reasonLabel(reason: string | null | undefined): string {
  if (reason === "cancellation_requested") return "You asked us to stop it.";
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
  const gift = Number(inv.metadata.subtotal_cents);
  const amountCents = Number.isInteger(gift) && gift > 0 ? gift : inv.amountDueCents;
  const first = inv.billingReason === "subscription_create";
  try {
    if (first) await deps.cancelSubscription(inv.subscriptionId);
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
  const gift = Number(sub.metadata.subtotal_cents);
  const mail = {
    ...base(sub.metadata, sub.contactEmail, Number.isInteger(gift) && gift > 0 ? gift : 0),
    kind: "ended" as const,
    nextAttemptLabel: "",
    reasonLabel: reasonLabel(sub.reason),
  };
  const key = `subscription-ended/${sub.subscriptionId}`;
  try {
    let ok = true;
    if (sub.contactEmail) ok = (await deps.sendEmail({ ...mail, audience: "donor", idempotencyKey: `${key}/donor` })) && ok;
    ok = (await deps.sendEmail({ ...mail, audience: "committee", idempotencyKey: `${key}/committee` })) && ok;
    return ok ? "handled" : "failed";
  } catch (err) {
    console.error("[giving problem] ended gift not handled", { subscriptionId: sub.subscriptionId, error: err instanceof Error ? err.name : "error" });
    return "failed";
  }
}

/** A bank or card dispute on a giving subscription's charge. The gift is
 *  stopped and the committee told; the donor is not emailed automatically,
 *  because a dispute is a conversation for a person to have. */
export async function handleGivingDispute(d: DisputedGift, deps: ProblemDeps): Promise<ProblemOutcome> {
  if (!isGiving(d.metadata, d.subscriptionId)) return "skipped";
  try {
    await deps.cancelSubscription(d.subscriptionId);
    const ok = await deps.sendEmail({
      ...base(d.metadata, d.contactEmail, d.amountCents),
      kind: "disputed",
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
