import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { getStripeClient } from "@/lib/stripe";
import { resolveRegistrationConfirmation } from "@/lib/registrationConfirmation";
import { GIFT_LINE_LABEL, giftOf } from "@/lib/registrationGift";
import { PaymentOptions } from "@/components/register/PaymentOptions";
import { RegistrantCheckinList } from "@/components/register/RegistrantCheckinList";
import { ZellePaymentPanel } from "@/components/register/ZellePaymentPanel";
import { conventionYears, type ConventionYear } from "@/lib/conventions";
import { setRequestLocale } from "next-intl/server";

function findYear(slug: string): ConventionYear | undefined {
  const match = /^cacna-(\d{4})$/.exec(slug);
  if (!match) return undefined;
  return conventionYears.find((cy) => cy.year === Number(match[1]));
}

export default async function RegisterConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ session_id?: string; t?: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cy = findYear(slug);
  if (!cy) notFound();

  const { session_id: sessionId, t: token } = await searchParams;

  // Nothing in the URL is trusted as proof: paid registrations render from
  // the Stripe session itself and free ones from a server-sealed token (see
  // lib/registrationConfirmation.ts). Older links that still carry `d` or
  // `status=free` are ignored rather than believed.
  const confirmation = await resolveRegistrationConfirmation({
    year: cy.year,
    sessionId,
    token,
    retrieveSession: (id) => getStripeClient().checkout.sessions.retrieve(id),
  });

  if (!confirmation) {
    return (
      <main id="main-content">
        <Nav heroDark />
        <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 100px", textAlign: "center" }}>
          <XCircle size={48} strokeWidth={1.8} color="var(--red)" aria-hidden style={{ marginBottom: 20 }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", color: "#fff", margin: "0 0 14px" }}>
            We couldn&apos;t find that registration
          </h1>
          <p style={{ fontSize: 15.5, color: "rgba(245,246,250,.65)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            This link may be out of date. If you just completed checkout, check your email for a confirmation — otherwise, contact us and we&apos;ll help sort it out.
          </p>
        </section>
        <FooterExperience />
      </main>
    );
  }

  const { summary, isPaid, isFree, processingFeeCents, payment, zelleRef } = confirmation;
  const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  // Registered by Zelle, payment not confirmed by staff yet: show what to
  // send and the memo reference instead of the generic payment options.
  const awaitingZelle = payment === "awaiting_zelle" && !!zelleRef;
  const gift = giftOf(summary);
  const hasBreakdown = processingFeeCents > 0 || gift > 0;
  // Only a free or Zelle token the server sealed with `emailed` says a
  // confirmation email was attempted; the page never claims delivery.
  const emailAttempted = (isFree || awaitingZelle) && summary.emailed === true;

  return (
    <main id="main-content">
      <Nav heroDark />
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 100px", textAlign: "center" }}>
        {awaitingZelle ? (
          <Clock size={48} strokeWidth={1.8} color="var(--gold)" aria-hidden style={{ marginBottom: 20 }} />
        ) : (
          <CheckCircle2 size={48} strokeWidth={1.8} color="var(--gold)" aria-hidden style={{ marginBottom: 20 }} />
        )}
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", color: "#fff", margin: "0 0 14px" }}>
          {awaitingZelle ? "Registration received. Now send your payment" : `You're registered for CACNA ${cy.year}!`}
        </h1>
        <p style={{ fontSize: 15.5, color: "rgba(245,246,250,.65)", maxWidth: 480, margin: `0 auto ${emailAttempted ? 12 : 32}px`, lineHeight: 1.7 }}>
          {awaitingZelle
            ? "Your spot is held and your check-in codes below work now. Staff confirm your payment when the Zelle arrives; we match payments to the reference."
            : isFree
              ? "Save this page and show your check-in code at check-in."
              : "A confirmation email is on its way."}
        </p>
        {emailAttempted && (
          <p style={{ fontSize: 14, color: "rgba(245,246,250,.6)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
            We are emailing a confirmation to {summary.contactEmail}; check your spam folder if it does not arrive.
          </p>
        )}

        {awaitingZelle && (
          <div style={{ maxWidth: 460, margin: "0 auto 24px", textAlign: "left" }}>
            <ZellePaymentPanel amountDueCents={summary.totalAmountCents} zelleRef={zelleRef} />
          </div>
        )}

        <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "left", background: "rgba(245,246,250,.06)", border: "1px solid rgba(245,246,250,.14)", borderRadius: 18, padding: "24px clamp(16px, 5vw, 26px)" }}>
          <div style={{ minWidth: 0, overflowWrap: "anywhere" }}>
            {summary.churchName && (
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#fff", margin: "0 0 4px" }}>{summary.churchName}</p>
            )}
            {summary.dcc && (
              <p style={{ fontSize: 13.5, color: "rgba(245,246,250,.75)", margin: "0 0 4px" }}>DCC / Zone: {summary.dcc}</p>
            )}
            <p style={{ fontSize: 13.5, color: "rgba(245,246,250,.6)", margin: 0 }}>{summary.contactEmail}</p>
          </div>
          <RegistrantCheckinList summary={summary} startIso={cy.startIso} />
          {hasBreakdown && (
            <div style={{ borderTop: "1px solid rgba(245,246,250,.14)", marginTop: 16, paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "rgba(245,246,250,.6)", marginTop: 0 }}>
                <span>Subtotal</span>
                <span>{dollars(summary.totalAmountCents)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "rgba(245,246,250,.6)", marginTop: 4 }}>
                <span>Processing fee</span>
                <span>{dollars(processingFeeCents)}</span>
              </div>
              {gift > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "rgba(245,246,250,.6)", marginTop: 4 }}>
                  <span>{GIFT_LINE_LABEL}</span>
                  <span>{dollars(gift)}</span>
                </div>
              )}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, borderTop: hasBreakdown ? "none" : "1px solid rgba(245,246,250,.14)", marginTop: hasBreakdown ? 8 : 16, paddingTop: hasBreakdown ? 0 : 14 }}>
            {awaitingZelle ? (
              <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "#7a4b00", background: "#fff4dc", borderRadius: 999, padding: "5px 10px" }}>
                Awaiting Zelle payment
              </span>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)" }}>
                {summary.isComplimentary ? "Complimentary" : isPaid ? "Paid" : "Pending"}
              </span>
            )}
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#fff" }}>
              {dollars(summary.totalAmountCents + processingFeeCents + gift)}
            </span>
          </div>
        </div>

        {/* Nothing to pay on a $0 registration, so no payment options; a Zelle
            registration has its own panel above. */}
        {summary.totalAmountCents > 0 && !awaitingZelle && (
          <div style={{ maxWidth: 460, margin: "24px auto 0", textAlign: "left" }}>
            <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 14px" }}>
              Payment Options
            </h2>
            <PaymentOptions variant="dark" />
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <Link href={cy.href} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 14.5, padding: "14px 26px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
            Back to Convention {cy.year}
          </Link>
        </div>
      </section>
      <FooterExperience />
    </main>
  );
}
