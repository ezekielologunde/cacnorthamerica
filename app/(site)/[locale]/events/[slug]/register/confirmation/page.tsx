import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { QrCode } from "@/components/register/QrCode";
import { getStripeClient } from "@/lib/stripe";
import { SITE_URL } from "@/lib/site";
import { renderQrCodeSvg } from "@/lib/qr";
import { resolveRegistrationConfirmation } from "@/lib/registrationConfirmation";
import { PaymentOptions } from "@/components/register/PaymentOptions";
import { conventionYears, type ConventionYear, type RegistrantCategory } from "@/lib/conventions";
import { setRequestLocale } from "next-intl/server";
import { describeYouthRegistrant } from "@/lib/youthRegistration";

const CATEGORY_LABEL: Record<RegistrantCategory, string> = {
  adult: "Adult",
  young_adult: "Young Adult",
  child: "Child",
};

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

  const { summary, isPaid, isFree } = confirmation;
  // Only a free Youth & Child token the server sealed with `emailed` says a
  // confirmation email was attempted; the page never claims delivery.
  const emailAttempted = isFree && summary.emailed === true;

  // The QR re-opens this confirmation on whatever device scans it, and the
  // page re-verifies it there (Stripe session or sealed token) -- the
  // check-in proof staff use at the door.
  const qrSvg = isPaid ? await renderQrCodeSvg(`${SITE_URL}${confirmation.confirmationPath}`) : null;

  return (
    <main id="main-content">
      <Nav heroDark />
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 100px", textAlign: "center" }}>
        <CheckCircle2 size={48} strokeWidth={1.8} color="var(--gold)" aria-hidden style={{ marginBottom: 20 }} />
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", color: "#fff", margin: "0 0 14px" }}>
          {`You're registered for CACNA ${cy.year}!`}
        </h1>
        <p style={{ fontSize: 15.5, color: "rgba(245,246,250,.65)", maxWidth: 480, margin: `0 auto ${emailAttempted ? 12 : 32}px`, lineHeight: 1.7 }}>
          {isFree
            ? "Save this page or screenshot the QR code below to show at check-in."
            : "A confirmation email is on its way."}
        </p>
        {emailAttempted && (
          <p style={{ fontSize: 14, color: "rgba(245,246,250,.6)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
            We are emailing a confirmation to {summary.contactEmail}; check your spam folder if it does not arrive.
          </p>
        )}

        <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "left", background: "rgba(245,246,250,.06)", border: "1px solid rgba(245,246,250,.14)", borderRadius: 18, padding: "24px 26px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div style={{ minWidth: 0 }}>
              {summary.churchName && (
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#fff", margin: "0 0 4px" }}>{summary.churchName}</p>
              )}
              <p style={{ fontSize: 13.5, color: "rgba(245,246,250,.6)", margin: 0 }}>{summary.contactEmail}</p>
            </div>
            {qrSvg && <QrCode svg={qrSvg} label="Check-in QR code" />}
          </div>
          <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {summary.registrants.map((r, i) => {
              // Youth & Child registrants show their age group and meals.
              const youth = describeYouthRegistrant(r, cy.startIso);
              return (
                <li key={i} style={{ fontSize: 14.5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span style={{ color: "var(--cream)" }}>{r.n}</span>
                    <span style={{ color: "rgba(245,246,250,.6)" }}>{youth ? youth.ageGroup : (CATEGORY_LABEL[r.c] ?? "Adult")}</span>
                  </div>
                  {youth && (
                    <p style={{ fontSize: 12.5, color: "rgba(245,246,250,.55)", margin: "3px 0 0", lineHeight: 1.5 }}>
                      Meals: {youth.meals.length > 0 ? youth.meals.join(", ") : "None"}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(245,246,250,.14)", marginTop: 16, paddingTop: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)" }}>
              {summary.isComplimentary ? "Complimentary" : isPaid ? "Paid" : "Pending"}
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#fff" }}>
              ${(summary.totalAmountCents / 100).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Nothing to pay on a $0 registration, so no payment options. */}
        {summary.totalAmountCents > 0 && (
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
