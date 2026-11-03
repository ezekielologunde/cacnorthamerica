import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import { checkinCodesFor } from "@/lib/checkinCode";
import { conventionYears } from "@/lib/conventions";
import { describeMeals, MAX_ALLERGIES_LENGTH } from "@/lib/youthRegistration";
import type { RegistrationSummary } from "@/lib/checkoutSummary";

// Persists every registrant of a successful registration in
// cacna.checkin_people (supabase/migrations/0015_checkin_people.sql), so the
// admin check-in page can look people up by name or check-in code. The
// Google Sheet stays the record staff already use; this is a lookup copy.
//
// Best effort: a missing service-role key, a database error or anything
// thrown (including the 3s timeout) is logged (ref and error code only, never
// names or emails) and swallowed, so this
// never fails a registration or a Stripe webhook. Idempotent: rows are keyed
// by (ref, idx) and inserted with on-conflict-do-nothing, so webhook retries
// and duplicates never add rows or overwrite checked_in_at.

type CheckinPersonRow = {
  year: number;
  ref: string;
  idx: number;
  full_name: string;
  code: string;
  category: string;
  age: number | null;
  church_name: string | null;
  dcc: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  meals: string | null;
  allergies: string | null;
  payment_status: CheckinPaymentStatus;
  stripe_session: string | null;
  /** Only sent for Zelle registrations (migration 0016 adds the column). */
  zelle_ref?: string | null;
};

export type CheckinPaymentStatus = "free" | "paid" | "awaiting_zelle";
type CheckinOpts = { paymentStatus: CheckinPaymentStatus; stripeSession?: string; contactEmail?: string; zelleRef?: string };

/** Trimmed and length-capped; "" stays "" (for not-null columns). */
function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Trimmed and length-capped, or null when empty. */
function optionalText(value: unknown, max: number): string | null {
  return text(value, max) || null;
}

function checkinRows(summary: RegistrationSummary, opts: CheckinOpts): CheckinPersonRow[] {
  const codes = checkinCodesFor(summary);
  const startIso = conventionYears.find((cy) => cy.year === summary.year)?.startIso;
  return summary.registrants.map((r, i) => {
    // The same dated labels the sheet rows show; null when meals were never
    // asked (adult group mode).
    const meals = describeMeals(r.m, startIso);
    return {
      year: summary.year,
      ref: text(summary.ref, 100),
      idx: i,
      full_name: text(r.n, 120),
      code: codes[i],
      category: text(r.c, 40),
      age: Number.isInteger(r.a) ? (r.a as number) : null,
      church_name: optionalText(summary.churchName, 120),
      dcc: optionalText(summary.dcc ?? summary.youth?.dcc, 120),
      contact_name: text(summary.contactName, 120),
      contact_email: text(opts.contactEmail || summary.contactEmail, 254),
      contact_phone: optionalText(summary.contactPhone, 40),
      meals: meals ? text(meals.length > 0 ? meals.join("; ") : "None", 500) : null,
      allergies: optionalText(r.l, MAX_ALLERGIES_LENGTH),
      payment_status: opts.paymentStatus,
      stripe_session: optionalText(opts.stripeSession, 255),
      // Left out entirely otherwise, so free and card rows still insert
      // before migration 0016 has added the column.
      ...(opts.zelleRef ? { zelle_ref: text(opts.zelleRef, 20) } : {}),
    };
  });
}

export async function recordCheckinPeople(summary: RegistrationSummary, opts: CheckinOpts): Promise<void> {
  const ref = typeof summary?.ref === "string" ? summary.ref.slice(0, 100) : "?";
  try {
    // createServiceClient() would fall back to the anon key, which RLS
    // refuses anyway: skip outright instead.
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error(`[checkin] SUPABASE_SERVICE_ROLE_KEY not set; check-in rows not stored for ref ${ref}`);
      return;
    }
    const rows = checkinRows(summary, opts);
    if (rows.length === 0) return;
    const db = createServiceClient();
    const { error } = await db
      .from("checkin_people")
      .upsert(rows, { onConflict: "ref,idx", ignoreDuplicates: true })
      // A stalled database must not hold up the Stripe webhook / register
      // route: the abort throws, and the catch below logs it.
      .abortSignal(AbortSignal.timeout(3000));
    // The code only: error.message can echo row values (names, emails).
    if (error) console.error(`[checkin] insert failed for ref ${ref}: ${error.code ?? "unknown"}`);
  } catch (err) {
    console.error(`[checkin] failed for ref ${ref}: ${err instanceof Error ? err.name : "error"}`);
  }
}
