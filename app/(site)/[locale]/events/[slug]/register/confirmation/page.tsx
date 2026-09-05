import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { QrCode } from "@/components/register/QrCode";
import { getStripeClient } from "@/lib/stripe";
import { SITE_URL } from "@/lib/site";
import { renderQrCodeSvg } from "@/lib/qr";
import { decodeSummary } from "@/lib/checkoutSummary";
import { conventionYears, type ConventionYear, type RegistrantCategory } from "@/lib/conventions";
import { setRequestLocale } from "next-intl/server";

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
  searchParams: Promise<{ session_id?: string; status?: string; d?: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cy = findYear(slug);
  if (!cy) notFound();

  const { session_id: sessionId, status, d: encoded } = await searchParams;

  // Without a database, the registration's own details travel in the `d`
  // query param (see lib/checkoutSummary.ts) rather than being looked up by
  // an id -- a missing or undecodable value means a stale/bad link.
  const summary = encoded ? decodeSummary(encoded) : null;

  let isPaid = status === "free";
  if (summary && sessionId && !isPaid) {
    try {
      const session = await getStripeClient().checkout.sessions.retrieve(sessionId);
      isPaid = session.payment_status === "paid";
    } catch {
      isPaid = false;
    }
  }

  if (!summary) {
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

  // Re-encode the same query string this page was reached with, so the QR
  // code opens this exact confirmation again on whatever device scans it --
  // the self-contained "no login, no lookup needed" check-in proof staff use
  // at the door.
  const confirmationUrl = status === "free"
    ? `${SITE_URL}/events/cacna-${cy.year}/register/confirmation?status=free&d=${encoded}`
    : `${SITE_URL}/events/cacna-${cy.year}/register/confirmation?session_id=${sessionId}&d=${encoded}`;
  const qrSvg = isPaid ? await renderQrCodeSvg(confirmationUrl) : null;

  return (
    <main id="main-content">
      <Nav heroDark />
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 100px", textAlign: "center" }}>
        <CheckCircle2 size={48} strokeWidth={1.8} color="var(--gold)" aria-hidden style={{ marginBottom: 20 }} />
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", color: "#fff", margin: "0 0 14px" }}>
          {`You're registered for CACNA ${cy.year}!`}
        </h1>
        <p style={{ fontSize: 15.5, color: "rgba(245,246,250,.65)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
          We&apos;ve received your registration. A confirmation email is on its way.
        </p>

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
            {summary.registrants.map((r, i) => (
              <li key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5 }}>
                <span style={{ color: "var(--cream)" }}>{r.n}</span>
                <span style={{ color: "rgba(245,246,250,.6)" }}>{CATEGORY_LABEL[r.c] ?? "Adult"}</span>
              </li>
            ))}
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

        <div style={{ marginTop: 36 }}>
          <Link href={cy.href} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 14.5, padding: "14px 26px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
            Back to Convention {cy.year}
          </Link>
        </div>
      </section>
      <FooterExperience />
    </main>
  );
}
