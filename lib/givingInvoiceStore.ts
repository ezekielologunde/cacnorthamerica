import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import type { BeginResult, InvoiceStep, InvoiceStore } from "@/lib/givingInvoice";

// The durable half of recording a recurring gift: one row per Stripe invoice in
// cacna.giving_invoices (supabase/migrations/0018_giving_invoices.sql). The row
// is the claim on the invoice (its primary key allows one delivery to insert
// it) and remembers which steps, sheet row and receipt email, already
// succeeded, so a redelivery on any serverless instance repeats nothing.
//
// Unlike lib/checkinStore.ts this is NOT best effort: the webhook needs to
// know. Any database error throws, the caller answers 500, and Stripe retries
// for up to three days. Errors are logged by code or name only, never row data.

const TIMEOUT_MS = 3000;
/** A claim older than this with steps undone belonged to a delivery that died
 *  without releasing it, so the next delivery may take it over. The webhook's
 *  maxDuration (app/api/stripe/webhook/route.ts) is shorter, so a live delivery
 *  is never mistaken for a dead one. */
const STALE_CLAIM_MS = 2 * 60 * 1000;
const UNIQUE_VIOLATION = "23505";

function db() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
  return createServiceClient();
}

function stepsDone(row: { sheet_done: boolean; email_done: boolean } | null): Set<InvoiceStep> {
  const done = new Set<InvoiceStep>();
  if (row?.sheet_done) done.add("sheet");
  if (row?.email_done) done.add("email");
  return done;
}

export const givingInvoiceStore: InvoiceStore = {
  async begin(inv, split): Promise<BeginResult> {
    const client = db();
    const inserted = await client
      .from("giving_invoices")
      .insert({
        invoice_id: inv.invoiceId,
        subscription_id: inv.subscriptionId,
        billing_reason: inv.billingReason,
        amount_paid_cents: split.totalCents,
        subtotal_cents: split.subtotalCents,
        processing_fee_cents: split.processingFeeCents,
        setup_fee_cents: split.setupFeeCents,
        frequency: inv.metadata.frequency ?? null,
      })
      .abortSignal(AbortSignal.timeout(TIMEOUT_MS));
    if (!inserted.error) return { state: "new", done: new Set() };
    if (inserted.error.code !== UNIQUE_VIOLATION) throw new Error(`insert ${inserted.error.code ?? "unknown"}`);

    // Already known: a redelivery, a retry after a failure, or a delivery that
    // is running right now.
    const existing = await client
      .from("giving_invoices")
      .select("sheet_done, email_done")
      .eq("invoice_id", inv.invoiceId)
      .abortSignal(AbortSignal.timeout(TIMEOUT_MS))
      .single();
    if (existing.error) throw new Error(`select ${existing.error.code ?? "unknown"}`);
    const done = stepsDone(existing.data);
    if (done.has("sheet") && done.has("email")) return { state: "resume", done };

    // Take the claim only if it is stale (released or abandoned). One update
    // wins; a concurrent delivery gets no row back and reports busy.
    const cutoff = new Date(Date.now() - STALE_CLAIM_MS).toISOString();
    const taken = await client
      .from("giving_invoices")
      .update({ claimed_at: new Date().toISOString() })
      .eq("invoice_id", inv.invoiceId)
      .lt("claimed_at", cutoff)
      .select("sheet_done, email_done")
      .abortSignal(AbortSignal.timeout(TIMEOUT_MS));
    if (taken.error) throw new Error(`take ${taken.error.code ?? "unknown"}`);
    // The flags come from the row we just took: the earlier read may predate
    // steps the previous owner finished before releasing.
    return taken.data && taken.data.length > 0 ? { state: "resume", done: stepsDone(taken.data[0]) } : { state: "busy", done };
  },

  async markDone(invoiceId, step) {
    const patch = step === "sheet" ? { sheet_done: true } : { email_done: true };
    const { error } = await db()
      .from("giving_invoices")
      .update(patch)
      .eq("invoice_id", invoiceId)
      .abortSignal(AbortSignal.timeout(TIMEOUT_MS));
    if (error) throw new Error(`mark ${error.code ?? "unknown"}`);
  },

  async release(invoiceId) {
    const { error } = await db()
      .from("giving_invoices")
      .update({ claimed_at: new Date(0).toISOString() })
      .eq("invoice_id", invoiceId)
      .abortSignal(AbortSignal.timeout(TIMEOUT_MS));
    if (error) throw new Error(`release ${error.code ?? "unknown"}`);
  },
};
