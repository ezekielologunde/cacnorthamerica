import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { getStripeClient } from "@/lib/stripe";
import { conventionYears, type ConventionYear } from "@/lib/conventions";

function findYear(slug: string): ConventionYear | undefined {
  const match = /^cacna-(\d{4})$/.exec(slug);
  if (!match) return undefined;
  return conventionYears.find((cy) => cy.year === Number(match[1]));
}

export default async function RegisterConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string; status?: string }>;
}) {
  const { slug } = await params;
  const cy = findYear(slug);
  if (!cy) notFound();

  const { session_id: sessionId, status } = await searchParams;

  let contactEmail: string | null = null;
  let totalCents: number | null = null;
  let registrants: string[] = [];
  let notFoundSession = false;

  if (sessionId) {
    try {
      const stripe = getStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });
      contactEmail = session.customer_details?.email ?? session.customer_email ?? null;
      totalCents = session.amount_total ?? 0;
      const paidNames = (session.line_items?.data ?? []).map((li) => li.description ?? "").filter(Boolean);
      let freeNames: string[] = [];
      try {
        const free = JSON.parse((session.metadata?.free_registrants as string) || "[]") as { n: string; c: string }[];
        freeNames = free.map((r) => `${r.n} (${r.c})`);
      } catch {
        // Malformed/missing metadata -- show just the paid line items.
      }
      registrants = [...paidNames, ...freeNames];
    } catch {
      notFoundSession = true;
    }
  }

  if (notFoundSession) {
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

  const showDetails = Boolean(sessionId) || status === "free";

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

        {showDetails && (
          <div style={{ maxWidth: 460, margin: "0 auto", textAlign: "left", background: "rgba(245,246,250,.06)", border: "1px solid rgba(245,246,250,.14)", borderRadius: 18, padding: "24px 26px" }}>
            {contactEmail && <p style={{ fontSize: 13.5, color: "rgba(245,246,250,.6)", margin: "0 0 12px" }}>{contactEmail}</p>}
            {registrants.length > 0 && (
              <ul style={{ margin: "0 0 16px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {registrants.map((name, i) => (
                  <li key={i} style={{ fontSize: 14.5, color: "var(--cream)" }}>{name}</li>
                ))}
              </ul>
            )}
            {totalCents !== null && (
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(245,246,250,.14)", paddingTop: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)" }}>Paid</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#fff" }}>${(totalCents / 100).toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

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
