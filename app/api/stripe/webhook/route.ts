import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { logToSheet } from "@/lib/sheetsWebhook";
import { unchunkFromMetadata, decodeSummary, type RegistrationSummary } from "@/lib/checkoutSummary";
import { sendRegistrationConfirmationEmail } from "@/lib/registrationEmail";
import { SITE_URL } from "@/lib/site";

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

  // Rows are only ever logged here, on confirmed payment -- there's no
  // "pending" row created at checkout-start and no update path (the Sheets
  // webhook only appends), so a failed or abandoned checkout simply never
  // produces a row. Stripe's own dashboard remains the record of
  // failed/abandoned payment attempts.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { id: string; metadata?: Record<string, string | undefined> };
    const kind = session.metadata?.kind;

    try {
      const full = await stripe.checkout.sessions.retrieve(session.id, { expand: ["line_items"] });
      const contactEmail = full.customer_details?.email ?? full.customer_email ?? "";
      const totalDollars = `$${((full.amount_total ?? 0) / 100).toFixed(2)}`;
      const lineDescriptions = (full.line_items?.data ?? []).map((li) => li.description ?? "");

      if (kind === "registration") {
        // The full registration -- including free/comp registrants Stripe
        // never saw as line items -- travels in the `d` metadata (see
        // lib/checkoutSummary.ts, ported from the Convention site). Fall
        // back to Stripe's own line-item descriptions only if that's
        // somehow missing, so a log row still gets written.
        const encoded = unchunkFromMetadata(session.metadata, "d");
        const summary: RegistrationSummary | null = encoded ? decodeSummary(encoded) : null;

        logToSheet(`Registration — CACNA ${summary?.year ?? session.metadata?.convention_year ?? ""}`, {
          "Registration Type": summary?.registrationType ?? "",
          "Church Name": summary?.churchName ?? "",
          "Contact Name": summary?.contactName ?? "",
          "Contact Email": contactEmail || summary?.contactEmail || "",
          "Contact Phone": summary?.contactPhone ?? "",
          "Registrants": summary
            ? summary.registrants.map((r) => `${r.n} (${r.c})`).join("; ")
            : lineDescriptions.join("; "),
          "Total": totalDollars,
          "Stripe Session": session.id,
        });

        // Stripe's own customer_details email is more authoritative than
        // whatever the registrant originally typed into the form (matches
        // the "Contact Email" fallback above) -- send the confirmation
        // there, falling back to the summary's email if Stripe somehow
        // didn't capture one.
        if (summary) {
          const emailTo = contactEmail || summary.contactEmail;
          if (emailTo) {
            const confirmationUrl = `${SITE_URL}/events/cacna-${summary.year}/register/confirmation?session_id=${session.id}&d=${encoded}`;
            await sendRegistrationConfirmationEmail({ ...summary, contactEmail: emailTo }, confirmationUrl, true);
          }
        }
      } else if (kind === "store_order") {
        const itemsSummary = (full.line_items?.data ?? [])
          .map((li) => `${li.description ?? ""} × ${li.quantity ?? 1}`)
          .join("; ");

        logToSheet("Store Order", {
          "Contact Name": session.metadata?.contact_name ?? "",
          "Contact Email": contactEmail,
          "Items": itemsSummary,
          "Total": totalDollars,
          "Stripe Session": session.id,
        });
      } else {
        console.error("Stripe checkout.session.completed event with unrecognized metadata.kind", {
          sessionId: session.id,
        });
      }
    } catch (recordError) {
      // The payment already succeeded on Stripe's side regardless of
      // whether this record-keeping step works -- log loudly rather than
      // surface a 500 that would make Stripe retry an already-completed
      // payment's webhook indefinitely.
      console.error("Failed to record a completed checkout to Google Sheets", {
        sessionId: session.id,
        recordError,
      });
    }
  }

  return NextResponse.json({ received: true });
}
