import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { getStripeClient } from "@/lib/stripe";
import { isPaidCheckout } from "@/lib/registrationConfirmation";
import { splitCheckoutAmount } from "@/lib/processingFee";
import { cadencePhrase, splitRecurringCheckout } from "@/lib/givingRecurring";
import { isRecurring } from "@/lib/givingRequest";
import { setRequestLocale } from "next-intl/server";

// A per-person receipt reached from Stripe: never indexed, and no inherited
// canonical pointing at the home page.
export const metadata: Metadata = {
  title: "Giving Receipt — CACNA",
  robots: { index: false, follow: false },
  // The URL carries a session id or sealed token: never send it as a Referer
  // (same-origin included) or into analytics page_referrer.
  referrer: "no-referrer",
  alternates: { canonical: null },
};

export default async function GivingConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { session_id: sessionId } = await searchParams;

  let contactEmail: string | null = null;
  let totalCents: number | null = null;
  let feeCents = 0;
  let chargedCents = 0;
  let campaignTitle: string | null = null;
  let frequency: "monthly" | "biweekly" | null = null;
  // Only a paid session of this page's own kind is a completed checkout; an
  // abandoned or unpaid session, another kind's session, or no session at
  // all gets the not-found state rather than a receipt.
  let notFound = !sessionId;
  // A bank gift is complete at checkout but not paid until the debit clears,
  // about 4 business days later; the webhook records it and sends the receipt
  // only then.
  let pending = false;

  if (sessionId) {
    try {
      const stripe = getStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent", "subscription"] });
      const paid = isPaidCheckout(session, "giving");
      // Pending only while the debit is genuinely in flight: after a failed
      // debit the session stays complete and unpaid, and must not promise an
      // email that will never come.
      const intent = typeof session.payment_intent === "object" ? session.payment_intent : null;
      // A recurring gift is a subscription session: it has no payment intent of
      // its own. A failed first debit cancels the subscription (lib/givingProblem.ts),
      // so it counts as processing only while the subscription is still live.
      const subscription = session.mode === "subscription";
      const sub = typeof session.subscription === "object" ? session.subscription : null;
      const subLive = !!sub && ["active", "incomplete", "trialing"].includes(sub.status);
      pending = !paid
        && session.metadata?.kind === "giving"
        && session.status === "complete"
        && (session.payment_method_types ?? []).includes("us_bank_account")
        && (subscription ? subLive : intent?.status === "processing");
      if (!paid && !pending) throw new Error("not a paid giving session");
      contactEmail = session.customer_details?.email ?? session.customer_email ?? null;
      // "Given" is the gift the donor chose; the fee is shown on its own.
      const split = subscription
        ? splitRecurringCheckout(session.amount_total ?? 0, session.metadata)
        : splitCheckoutAmount(session.amount_total ?? 0, session.metadata);
      const freq = session.metadata?.frequency;
      frequency = subscription && isRecurring(freq) ? freq : null;
      totalCents = split.subtotalCents;
      feeCents = split.processingFeeCents;
      chargedCents = split.totalCents;
      campaignTitle = session.metadata?.campaign_title ?? null;
    } catch {
      notFound = true;
    }
  }

  if (notFound) {
    return (
      <main id="main-content">
        <Nav heroDark />
        <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 100px", textAlign: "center" }}>
          <XCircle size={48} strokeWidth={1.8} color="var(--red)" aria-hidden style={{ marginBottom: 20 }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", color: "#fff", margin: "0 0 14px" }}>
            We couldn&apos;t find that gift
          </h1>
          <p style={{ fontSize: 15.5, color: "rgba(245,246,250,.65)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            This link may be out of date. If you just gave, check your email for a confirmation.
          </p>
        </section>
        <FooterExperience />
      </main>
    );
  }

  return (
    <main id="main-content">
      <Nav heroDark />
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 100px", textAlign: "center" }}>
        <CheckCircle2 size={48} strokeWidth={1.8} color="var(--gold)" aria-hidden style={{ marginBottom: 20 }} />
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", color: "#fff", margin: "0 0 14px" }}>
          Thank you for your gift!
        </h1>
        <p style={{ fontSize: 15.5, color: "rgba(245,246,250,.65)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
          {pending
            ? "Your bank payment is processing. It usually clears in about 4 business days, and we\u2019ll email you a confirmation when it does."
            : "A confirmation email is on its way."}
        </p>

        {sessionId && (totalCents !== null || campaignTitle) && (
          <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "left", background: "rgba(245,246,250,.06)", border: "1px solid rgba(245,246,250,.14)", borderRadius: 18, padding: "24px 26px" }}>
            {contactEmail && <p style={{ fontSize: 13.5, color: "rgba(245,246,250,.6)", margin: "0 0 12px" }}>{contactEmail}</p>}
            {campaignTitle && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--cream)", marginBottom: 14 }}>
                <span>Campaign</span>
                <span style={{ color: "rgba(245,246,250,.6)" }}>{campaignTitle}</span>
              </div>
            )}
            {frequency && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--cream)", marginBottom: 14 }}>
                <span>Repeats</span>
                <span style={{ color: "rgba(245,246,250,.6)" }}>{frequency === "monthly" ? "Every month" : "Every 2 weeks"}</span>
              </div>
            )}
            {totalCents !== null && (
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(245,246,250,.14)", paddingTop: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)" }}>{pending ? "Pending" : "Given"}</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#fff" }}>${(totalCents / 100).toFixed(2)}</span>
              </div>
            )}
            {totalCents !== null && feeCents > 0 && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "rgba(245,246,250,.6)", marginTop: 10 }}>
                <span>Processing fee</span>
                <span>{`$${(feeCents / 100).toFixed(2)}`}</span>
              </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "rgba(245,246,250,.6)", marginTop: 4 }}>
                <span>Total charged</span>
                <span>{`$${(chargedCents / 100).toFixed(2)}`}</span>
              </div>
              </>
            )}
          </div>
        )}

        {frequency && (
          <p style={{ fontSize: 14, color: "rgba(245,246,250,.65)", maxWidth: 460, margin: "24px auto 0", lineHeight: 1.7 }}>
            This gift is charged {cadencePhrase(frequency)} until you stop it, and you will get a receipt for every payment.{" "}
            <Link href="/giving/cancel" style={{ color: "var(--gold)" }}>Cancel any time</Link>.
          </p>
        )}

        <div style={{ marginTop: 36 }}>
          <Link href="/giving" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 14.5, padding: "14px 26px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
            Back to Giving
          </Link>
        </div>
      </section>
      <FooterExperience />
    </main>
  );
}
