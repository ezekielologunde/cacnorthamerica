import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe-registration";

/** Separate webhook from the Store's (app/api/stripe/webhook/route.ts) —
 *  convention registration is a distinct flow with its own metadata shape
 *  and its own table (convention_registrations), ported from the
 *  Convention project's app/api/stripe/webhook/route.ts. */
export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { id: string; payment_intent: string; metadata?: { registration_id?: string } };
    const registrationId = session.metadata?.registration_id;
    if (registrationId) {
      await supabase
        .from("convention_registrations")
        .update({ status: "paid", stripe_payment_intent_id: session.payment_intent })
        .eq("id", registrationId);
    } else {
      console.error("[convention webhook] checkout.session.completed missing metadata.registration_id", {
        sessionId: session.id,
      });
    }
  }

  // registration_id here relies on Stripe automatically copying the Checkout
  // Session's top-level metadata (set in app/api/convention/register/route.ts)
  // onto the resulting PaymentIntent.
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as { id: string; metadata?: { registration_id?: string } };
    const registrationId = paymentIntent.metadata?.registration_id;
    if (registrationId) {
      await supabase.from("convention_registrations").update({ status: "failed" }).eq("id", registrationId);
    } else {
      console.error("[convention webhook] payment_intent.payment_failed missing metadata.registration_id", {
        paymentIntentId: paymentIntent.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}
