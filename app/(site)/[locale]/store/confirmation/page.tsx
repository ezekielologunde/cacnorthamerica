import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { getStripeClient } from "@/lib/stripe";
import { setRequestLocale } from "next-intl/server";

export default async function StoreConfirmationPage({
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
  let items: { description: string; amountCents: number }[] = [];
  let notFound = false;

  if (sessionId) {
    try {
      const stripe = getStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });
      contactEmail = session.customer_details?.email ?? session.customer_email ?? null;
      totalCents = session.amount_total ?? 0;
      items = (session.line_items?.data ?? []).map((li) => ({ description: li.description ?? "", amountCents: li.amount_total ?? 0 }));
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
            We couldn&apos;t find that order
          </h1>
          <p style={{ fontSize: 15.5, color: "rgba(245,246,250,.65)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            This link may be out of date. If you just completed checkout, check your email for a confirmation.
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
          Thank you for your order!
        </h1>
        <p style={{ fontSize: 15.5, color: "rgba(245,246,250,.65)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
          We&apos;ve received your order. A confirmation email is on its way.
        </p>

        {sessionId && (
          <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "left", background: "rgba(245,246,250,.06)", border: "1px solid rgba(245,246,250,.14)", borderRadius: 18, padding: "24px 26px" }}>
            {contactEmail && <p style={{ fontSize: 13.5, color: "rgba(245,246,250,.6)", margin: "0 0 12px" }}>{contactEmail}</p>}
            <ul style={{ margin: "0 0 16px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((item, i) => (
                <li key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--cream)" }}>
                  <span>{item.description}</span>
                  <span style={{ color: "rgba(245,246,250,.6)" }}>${(item.amountCents / 100).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            {totalCents !== null && (
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(245,246,250,.14)", paddingTop: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)" }}>Paid</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#fff" }}>${(totalCents / 100).toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 36 }}>
          <Link href="/store" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,246,250,.09)", color: "var(--cream)", fontWeight: 700, fontSize: 14.5, padding: "14px 26px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>
            Back to Store
          </Link>
        </div>
      </section>
      <FooterExperience />
    </main>
  );
}
