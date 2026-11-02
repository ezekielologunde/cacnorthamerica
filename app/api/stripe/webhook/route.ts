import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { logToSheet } from "@/lib/sheetsWebhook";
import { unchunkFromMetadata, decodeSummary, type RegistrationSummary } from "@/lib/checkoutSummary";
import { sendRegistrationConfirmationEmail } from "@/lib/registrationEmail";
import { sendStoreOrderConfirmationEmail } from "@/lib/storeOrderEmail";
import { sendGivingConfirmationEmail } from "@/lib/givingEmail";
import { SITE_URL } from "@/lib/site";

// checkout.session.completed also fires for delayed methods (ACH, etc.)
// before the money has moved; only these statuses mean the checkout is
// actually paid. A delayed payment is recorded later, when
// checkout.session.async_payment_succeeded arrives.
const SETTLED_PAYMENT_STATUSES = new Set(["paid", "no_payment_required"]);

// Best-effort dedupe of Stripe redeliveries, keyed by session id. There is
// no database for these records, so this only catches repeats that reach the
// same warm instance. Emails are also deduped across instances by Resend
// idempotency keys (24h window). A duplicate sheet row is still possible when
// a redelivery lands on a different instance; its "Stripe Session" column
// identifies it.
const handledSessions = new Set<string>();
const MAX_HANDLED_SESSIONS = 1000;

function markHandled(sessionId: string) {
  handledSessions.add(sessionId);
  if (handledSessions.size > MAX_HANDLED_SESSIONS) {
    const oldest = handledSessions.values().next().value;
    if (oldest) handledSessions.delete(oldest);
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const signature = request.headers.get("stripe-signature") ?? "";
  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, requireEnv("STRIPE_WEBHOOK_SECRET"));
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const failed = event.data.object as { id: string; metadata?: Record<string, string | undefined> };
    console.error("Stripe delayed payment failed; nothing was recorded for this checkout", {
      sessionId: failed.id,
      kind: failed.metadata?.kind,
    });
  }

  // Rows are only ever logged here, on settled payment -- there's no
  // "pending" row created at checkout-start and no update path (the Sheets
  // webhook only appends), so a failed or abandoned checkout simply never
  // produces a row. Stripe's own dashboard remains the record of
  // failed/abandoned payment attempts.
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const sessionId = (event.data.object as { id: string }).id;
    if (handledSessions.has(sessionId)) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    let full;
    try {
      full = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });
    } catch (retrieveError) {
      // 5xx so Stripe retries. A 200 here would lose a paid registration
      // (no row, no email) on a transient Stripe or network error.
      console.error("Failed to retrieve a completed checkout session", { sessionId, retrieveError });
      return NextResponse.json({ error: "Retrieve failed" }, { status: 500 });
    }

    if (!SETTLED_PAYMENT_STATUSES.has(full.payment_status)) {
      // Delayed payment still pending: record and email nothing yet.
      return NextResponse.json({ received: true });
    }

    const metadata = full.metadata ?? undefined;
    const kind = metadata?.kind;
    const idempotencyKey = `checkout-session/${sessionId}`;
    // Claimed before the awaits below so a concurrent redelivery to this
    // instance is skipped; released again if recording fails.
    markHandled(sessionId);

    try {
      const contactEmail = full.customer_details?.email ?? full.customer_email ?? "";
      const totalDollars = `$${((full.amount_total ?? 0) / 100).toFixed(2)}`;
      const lineDescriptions = (full.line_items?.data ?? []).map((li) => li.description ?? "");

      if (kind === "registration") {
        // The full registration -- including free registrants Stripe never
        // saw as line items -- travels in the `d` metadata (see
        // lib/checkoutSummary.ts, ported from the Convention site). Fall
        // back to Stripe's own line-item descriptions only if that's
        // somehow missing, so a log row still gets written.
        const encoded = unchunkFromMetadata(metadata, "d");
        const summary: RegistrationSummary | null = encoded ? decodeSummary(encoded) : null;

        logToSheet(`Registration — CACNA ${summary?.year ?? metadata?.convention_year ?? ""}`, {
          "Registration Type": summary?.registrationType ?? "",
          "Church Name": summary?.churchName ?? "",
          "Contact Name": summary?.contactName ?? "",
          "Contact Email": contactEmail || summary?.contactEmail || "",
          "Contact Phone": summary?.contactPhone ?? "",
          "Registrants": summary
            ? summary.registrants.map((r) => `${r.n} (${r.c})`).join("; ")
            : lineDescriptions.join("; "),
          "Total": totalDollars,
          "Stripe Session": sessionId,
        });

        // Stripe's own customer_details email is more authoritative than
        // whatever the registrant originally typed into the form (matches
        // the "Contact Email" fallback above) -- send the confirmation
        // there, falling back to the summary's email if Stripe somehow
        // didn't capture one. The link carries only the session id; the
        // confirmation page reads everything else back from Stripe.
        if (summary) {
          const emailTo = contactEmail || summary.contactEmail;
          if (emailTo) {
            const confirmationUrl = `${SITE_URL}/events/cacna-${summary.year}/register/confirmation?session_id=${sessionId}`;
            await sendRegistrationConfirmationEmail({ ...summary, contactEmail: emailTo }, confirmationUrl, true, idempotencyKey);
          }
        }
      } else if (kind === "store_order") {
        const itemsSummary = (full.line_items?.data ?? [])
          .map((li) => `${li.description ?? ""} × ${li.quantity ?? 1}`)
          .join("; ");

        const ship = full.collected_information?.shipping_details;
        const shippingAddress = ship?.address
          ? [ship.name, ship.address.line1, ship.address.line2, `${ship.address.city ?? ""}, ${ship.address.state ?? ""} ${ship.address.postal_code ?? ""}`.trim(), ship.address.country].filter(Boolean).join(", ")
          : "";

        logToSheet("Store Order", {
          "Contact Name": metadata?.contact_name ?? "",
          "Contact Email": contactEmail,
          "Ship To": shippingAddress,
          "Items": itemsSummary,
          "Total": totalDollars,
          "Stripe Session": sessionId,
        });

        await sendStoreOrderConfirmationEmail({
          contactName: metadata?.contact_name ?? "",
          contactEmail,
          items: (full.line_items?.data ?? []).map((li) => `${li.description ?? ""} × ${li.quantity ?? 1}`),
          totalLabel: totalDollars,
          shippingAddress,
          idempotencyKey,
        });
      } else if (kind === "giving") {
        const campaignTitle = metadata?.campaign_title ?? "";

        logToSheet("Giving", {
          "Campaign": campaignTitle,
          "Contact Name": metadata?.contact_name ?? "",
          "Contact Email": contactEmail,
          "Total": totalDollars,
          "Stripe Session": sessionId,
        });

        await sendGivingConfirmationEmail({
          contactName: metadata?.contact_name ?? "",
          contactEmail,
          campaignTitle,
          totalLabel: totalDollars,
          idempotencyKey,
        });
      } else {
        console.error("Stripe checkout event with unrecognized metadata.kind", { sessionId });
      }
    } catch (recordError) {
      // 5xx so Stripe retries (it backs off for up to ~3 days); a 200 here
      // would silently drop the record.
      handledSessions.delete(sessionId);
      console.error("Failed to record a completed checkout", { sessionId, recordError });
      return NextResponse.json({ error: "Recording failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
