import Link from "next/link";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Registration Confirmed — CACNA Annual Convention",
  alternates: { canonical: "/convention/register/confirmation" },
};

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function RegisterConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ registration?: string }>;
}) {
  const { registration: registrationId } = await searchParams;

  let registration: { contact_name: string; contact_email: string; total_amount_cents: number; status: string; church_name: string | null } | null = null;
  let registrants: { full_name: string; category: string }[] = [];

  if (registrationId) {
    const supabase = createServiceClient();
    const { data: reg } = await supabase
      .from("convention_registrations")
      .select("contact_name, contact_email, total_amount_cents, status, church_name")
      .eq("id", registrationId)
      .maybeSingle();
    registration = reg;

    if (reg) {
      const { data: regs } = await supabase
        .from("convention_registrants")
        .select("full_name, category")
        .eq("registration_id", registrationId);
      registrants = regs ?? [];
    }
  }

  return (
    <main>
      <Nav />
      <section style={{ background: "var(--cream)", padding: "150px clamp(20px,5vw,64px) clamp(70px,9vw,110px)" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <Reveal from="scale">
            <span aria-hidden style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#7A1128,#FDC841)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: "20px 0 10px" }}>
              You&apos;re registered!
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.65, margin: "0 0 32px" }}>
              Thank you for registering for the CACNA Annual Convention. A confirmation has been sent to your email.
            </p>
          </Reveal>

          {registration && (
            <Reveal delay={200}>
              <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "26px 28px", textAlign: "left", boxShadow: "0 12px 30px rgba(18,20,30,.06)" }}>
                {registration.church_name && (
                  <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 4 }}>{registration.church_name}</div>
                )}
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", marginBottom: 12 }}>
                  {registration.contact_name}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {registrants.map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--ink-soft)" }}>
                      <span>{r.full_name}</span>
                      <span style={{ textTransform: "capitalize" }}>{r.category.replace("_", " ")}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "var(--red)" }}>
                    {registration.status === "paid" ? "Paid" : registration.status === "pending" ? "Pending payment" : registration.status}
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink)" }}>
                    {formatCents(registration.total_amount_cents)}
                  </span>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal delay={260}>
            <Link href="/" className="press" style={{ display: "inline-flex", marginTop: 32, fontSize: 14, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
              ← Back to home
            </Link>
          </Reveal>
        </div>
      </section>
      <FooterExperience />
    </main>
  );
}
