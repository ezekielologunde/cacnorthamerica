-- 0018: cacna.giving_invoices -- one row per paid invoice of a recurring gift
-- (monthly / every 2 weeks), so the Stripe webhook records each charge exactly
-- once even when Stripe redelivers an event or a retry lands on another
-- serverless instance. Renewals arrive days apart, so the webhook's in-memory
-- dedupe cannot be relied on for them.
--
-- !!! Apply ONLY with the site owner's say-so, and BEFORE recurring gifts are
-- !!! switched on (GIVING_RECURRING_ENABLED). Until a subscription exists no
-- !!! invoice.paid event reaches the code that writes this table.
--
-- Writer (server-side only, service_role, which bypasses RLS):
--   lib/givingInvoiceStore.ts, called from app/api/stripe/webhook/route.ts on
--   invoice.paid. The primary key is the claim: the first delivery inserts the
--   row, a duplicate or concurrent delivery hits a unique violation and reads
--   the row instead. sheet_done / email_done record which steps already
--   succeeded, so a retry repeats only what failed. claimed_at lets a delivery
--   take over a claim that is two minutes old and unfinished (see the store).
--
-- Nothing personal is stored: Stripe ids, amounts in cents, the frequency.
-- Names and emails stay in Stripe and the Google Sheet. No anon access; an
-- admin may read (for the operations view). 0010's default privileges would
-- grant select to anon and authenticated on every new cacna table, hence the
-- explicit revoke.

create table cacna.giving_invoices (
  invoice_id text primary key,
  subscription_id text not null,
  billing_reason text,
  -- What was charged, and how it splits (gift / per-cycle fee / one-time setup fee).
  amount_paid_cents integer not null check (amount_paid_cents > 0),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  processing_fee_cents integer not null default 0 check (processing_fee_cents >= 0),
  setup_fee_cents integer not null default 0 check (setup_fee_cents >= 0),
  frequency text,
  sheet_done boolean not null default false,
  email_done boolean not null default false,
  claimed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index giving_invoices_subscription_idx on cacna.giving_invoices (subscription_id);

-- ---------- RLS ----------

alter table cacna.giving_invoices enable row level security;

create policy "giving_invoices_admin_select" on cacna.giving_invoices
  for select to authenticated using (cacna.is_admin());

-- ---------- Grants ----------

revoke all on cacna.giving_invoices from anon, authenticated;
grant select on cacna.giving_invoices to authenticated;
grant all on cacna.giving_invoices to service_role;
