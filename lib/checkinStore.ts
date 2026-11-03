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
// thrown is logged (ref only, never names or emails) and swallowed, so this
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
  payment_status: "free" | "paid";
  stripe_session: string | null;
};

/** Trimmed and length-capped; "" stays "" (for not-null columns). */
function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Trimmed and length-capped, or null when empty. */
function optionalText(value: unknown, max: number): string | null {
  return text(value, max) || null;
}

function checkinRows(
  summary: RegistrationSummary,
  opts: { paymentStatus: "free" | "paid"; stripeSession?: string; contactEmail?: string }
): CheckinPersonRow[] {
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
    };
  });
}

export async function recordCheckinPeople(
  summary: RegistrationSummary,
  opts: { paymentStatus: "free" | "paid"; stripeSession?: string; contactEmail?: string }
): Promise<void> {
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
      .upsert(rows, { onConflict: "ref,idx", ignoreDuplicates: true });
    if (error) console.error(`[checkin] insert failed for ref ${ref}: ${error.code ?? ""} ${error.message ?? ""}`.trim());
  } catch (err) {
    console.error(`[checkin] failed for ref ${ref}: ${err instanceof Error ? err.name : "error"}`);
  }
}
