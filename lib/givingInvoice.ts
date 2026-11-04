// Records one paid invoice of a recurring gift (a Stripe subscription made by
// the giving form): a sheet row and a receipt email for every charge, the
// first and every renewal. Free of imports so scripts/check-giving-invoice.mjs
// can load it under plain Node; the Stripe webhook passes in the real store,
// sheet and email senders.
//
// Why invoices: a subscription's checkout.session.completed fires once, at
// signup. Every later charge is only visible as an invoice, so invoice.paid is
// the single event that records every gift, the first included (the webhook
// skips subscription checkout sessions to avoid a second row).

export type InvoiceStep = "sheet" | "email";

export type InvoiceSummary = {
  invoiceId: string;
  subscriptionId: string;
  amountPaidCents: number;
  /** Stripe's billing_reason: subscription_create, subscription_cycle, ... */
  billingReason: string | null;
  /** The invoice's customer email. */
  contactEmail: string;
  /** The subscription's metadata (invoice.parent.subscription_details.metadata),
   *  set at checkout: kind, campaign_title, contact_name, subtotal_cents,
   *  processing_fee_cents, setup_fee_cents, frequency. */
  metadata: Record<string, string | null | undefined>;
};

/** Whether an invoice is a gift to record. Stripe also raises invoices for
 *  subscription changes (prorations), manual invoices and thresholds; only the
 *  charges the donor signed up for are gifts.
 *
 *  TODO(human): decide which billing_reason values count as a gift. The two
 *  below are the first charge and every scheduled renewal. A plan change made
 *  in the Customer Portal can raise a "subscription_update" invoice with a
 *  prorated, odd amount: recording it would add a sheet row and a receipt for
 *  an amount the donor never chose, but skipping it would leave real money
 *  unrecorded. */
export function shouldRecordInvoice(billingReason: string | null, amountPaidCents: number): boolean {
  if (!(amountPaidCents > 0)) return false;
  return billingReason === "subscription_create" || billingReason === "subscription_cycle";
}

/** True for a paid invoice of a giving subscription. Store and registration
 *  checkouts share the Stripe account; their invoices (if any) are ignored. */
export function isGivingInvoice(inv: InvoiceSummary): boolean {
  return inv.metadata.kind === "giving" && inv.subscriptionId !== "" && inv.amountPaidCents > 0;
}

/** The donor-facing name of a frequency, or "" when unknown. */
export function frequencyLabel(frequency: string | null | undefined): string {
  if (frequency === "monthly") return "Monthly";
  if (frequency === "biweekly") return "Every 2 weeks";
  return "";
}

export type InvoiceSplit = {
  /** The gift the donor chose. */
  subtotalCents: number;
  /** The per-cycle processing fee. */
  processingFeeCents: number;
  /** The one-time bank setup fee, only on the first invoice. */
  setupFeeCents: number;
  /** What was actually charged. */
  totalCents: number;
  /** True when the charge is not the gift plus the expected fees. */
  mismatch: boolean;
};

function wholeCents(value: unknown): number | null {
  const n = Number(value);
  return typeof value === "string" && Number.isInteger(n) && n >= 0 ? n : null;
}

/** Splits an invoice's amount_paid into gift, fee and setup fee using the
 *  amounts written to the subscription at checkout. The fee is whatever was
 *  charged beyond the gift, so the sheet always adds up to the charge; a
 *  charge that is not exactly the expected total is flagged `mismatch` and
 *  logged. Metadata that is missing or larger than the charge reads as all
 *  gift, no fee. */
export function splitInvoiceAmount(
  amountPaidCents: number,
  metadata: Record<string, string | null | undefined>,
  billingReason: string | null,
): InvoiceSplit {
  const subtotal = wholeCents(metadata.subtotal_cents);
  if (subtotal === null || subtotal > amountPaidCents) {
    return { subtotalCents: amountPaidCents, processingFeeCents: 0, setupFeeCents: 0, totalCents: amountPaidCents, mismatch: true };
  }
  const renewalFee = wholeCents(metadata.processing_fee_cents) ?? 0;
  const setupFee = billingReason === "subscription_create" ? (wholeCents(metadata.setup_fee_cents) ?? 0) : 0;
  const mismatch = amountPaidCents !== subtotal + renewalFee + setupFee;
  const feeTotal = amountPaidCents - subtotal;
  // Setup comes out of the fee first; the rest is the per-cycle fee.
  const setupFeeCents = Math.min(setupFee, feeTotal);
  return {
    subtotalCents: subtotal,
    processingFeeCents: feeTotal - setupFeeCents,
    setupFeeCents,
    totalCents: amountPaidCents,
    mismatch,
  };
}

export type BeginResult = {
  /** new: this delivery owns the invoice. resume: a previous delivery did part
   *  of it (see done). busy: another delivery is working on it right now. */
  state: "new" | "resume" | "busy";
  done: ReadonlySet<InvoiceStep>;
};

/** Durable, shared across serverless instances (a table), unlike the webhook's
 *  in-memory sets: renewals arrive days apart on cold instances. */
export type InvoiceStore = {
  begin(inv: InvoiceSummary, split: InvoiceSplit): Promise<BeginResult>;
  markDone(invoiceId: string, step: InvoiceStep): Promise<void>;
  /** Lets the next delivery take over at once after a failed attempt. */
  release(invoiceId: string): Promise<void>;
};

export type InvoiceEmail = {
  idempotencyKey: string;
  contactName: string;
  contactEmail: string;
  campaignTitle: string;
  totalLabel: string;
  feeLabel?: string;
  chargedLabel?: string;
  frequencyLabel?: string;
};

export type InvoiceDeps = {
  store: InvoiceStore;
  logSheet: (formName: string, fields: Record<string, string>) => Promise<boolean>;
  sendEmail: (input: InvoiceEmail) => Promise<boolean>;
};

/** recorded: row and receipt done. duplicate: a redelivery of one already
 *  fully recorded. skipped: not a giving gift. busy / failed: answer 500 so
 *  Stripe retries; nothing is lost, and steps already done are not repeated. */
export type InvoiceOutcome = "recorded" | "duplicate" | "skipped" | "busy" | "failed";

const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export async function recordGivingInvoice(inv: InvoiceSummary, deps: InvoiceDeps): Promise<InvoiceOutcome> {
  if (!isGivingInvoice(inv) || !shouldRecordInvoice(inv.billingReason, inv.amountPaidCents)) return "skipped";

  const split = splitInvoiceAmount(inv.amountPaidCents, inv.metadata, inv.billingReason);
  if (split.mismatch) {
    // Ids and cents only, never names or emails.
    console.error("[giving invoice] charge differs from the expected gift plus fees", {
      invoiceId: inv.invoiceId,
      paid: inv.amountPaidCents,
      subtotal: split.subtotalCents,
    });
  }

  let begun: BeginResult;
  try {
    begun = await deps.store.begin(inv, split);
  } catch (err) {
    console.error("[giving invoice] could not claim the invoice", { invoiceId: inv.invoiceId, error: err instanceof Error ? err.name : "error" });
    return "failed";
  }
  if (begun.state === "busy") return "busy";
  const done = new Set(begun.done);
  if (done.has("sheet") && done.has("email")) return "duplicate";

  const meta = inv.metadata;
  const frequency = frequencyLabel(meta.frequency);
  const feeTotal = split.processingFeeCents + split.setupFeeCents;
  let ok = true;
  try {
    if (!done.has("sheet")) {
      const wrote = await deps.logSheet("Giving", {
        "Campaign": meta.campaign_title ?? "",
        "Contact Name": meta.contact_name ?? "",
        "Contact Email": inv.contactEmail,
        "Total": dollars(split.subtotalCents),
        "Processing Fee": dollars(feeTotal),
        "Amount Charged": dollars(split.totalCents),
        "Frequency": frequency,
        "Payment": inv.billingReason === "subscription_create" ? "First" : "Renewal",
        "Stripe Invoice": inv.invoiceId,
        "Stripe Subscription": inv.subscriptionId,
      });
      if (wrote) await deps.store.markDone(inv.invoiceId, "sheet");
      else ok = false;
    }
    if (!done.has("email")) {
      const sent = await deps.sendEmail({
        idempotencyKey: `invoice/${inv.invoiceId}`,
        contactName: meta.contact_name ?? "",
        contactEmail: inv.contactEmail,
        campaignTitle: meta.campaign_title ?? "",
        totalLabel: dollars(split.subtotalCents),
        ...(feeTotal > 0 ? { feeLabel: dollars(feeTotal), chargedLabel: dollars(split.totalCents) } : {}),
        ...(frequency ? { frequencyLabel: frequency } : {}),
      });
      if (sent) await deps.store.markDone(inv.invoiceId, "email");
      else ok = false;
    }
  } catch (err) {
    console.error("[giving invoice] recording failed", { invoiceId: inv.invoiceId, error: err instanceof Error ? err.name : "error" });
    ok = false;
  }

  if (!ok) {
    try {
      await deps.store.release(inv.invoiceId);
    } catch {
      // The claim goes stale on its own and the next delivery takes over.
    }
    return "failed";
  }
  return "recorded";
}
