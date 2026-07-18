import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { CheckCircle2, ShoppingBag, Mail, MessageCircle, Home } from "lucide-react";
import Link from "next/link";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Order Confirmed — CAC Salvation Center Store",
  description: "Thank you for your order from the Salvation Center Store.",
  robots: { index: false, follow: false },
};

async function getSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key || !sessionId) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stripe = new Stripe(key, { apiVersion: "2024-06-20" as any });
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });
  } catch {
    return null;
  }
}

async function saveOrderFallback(session: Stripe.Checkout.Session): Promise<void> {
  try {
    const supabase = createServiceClient();
    const sd = session.collected_information?.shipping_details ?? null;
    const paymentIntent =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : (session.payment_intent as any)?.id ?? null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from as any)("orders").upsert(
      {
        stripe_session_id: session.id,
        stripe_payment_intent: paymentIntent,
        customer_name: session.customer_details?.name ?? null,
        customer_email: session.customer_details?.email ?? "",
        customer_phone: session.customer_details?.phone ?? null,
        shipping_name: sd?.name ?? session.customer_details?.name ?? null,
        shipping_line1: sd?.address?.line1 ?? null,
        shipping_line2: sd?.address?.line2 ?? null,
        shipping_city: sd?.address?.city ?? null,
        shipping_state: sd?.address?.state ?? null,
        shipping_postal_code: sd?.address?.postal_code ?? null,
        shipping_country: sd?.address?.country ?? null,
        line_items: (session.line_items?.data ?? []).map((li) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const prod = li.price?.product as any;
          return {
            description: li.description ?? "Item",
            quantity: li.quantity ?? 1,
            amount_total: li.amount_total ?? 0,
            product_id: prod?.metadata?.product_id ?? null,
            is_digital: prod?.metadata?.is_digital === "true",
          };
        }),
        amount_total: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        status: "paid",
      },
      { onConflict: "stripe_session_id" },
    );
    console.log("[success] Order upserted to DB:", session.id);
  } catch (err) {
    console.error("[success] Failed to save order fallback:", err);
  }
}

export default async function StoreSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = session_id ? await getSession(session_id) : null;

  // Save immediately — webhook is primary, this is the fallback
  if (session && session.payment_status === "paid") {
    await saveOrderFallback(session);
  }

  const email = session?.customer_details?.email;
  const name = session?.customer_details?.name;
  const amountTotal = session?.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : null;
  const items = session?.line_items?.data ?? [];
  const hasDigital = session?.metadata?.has_digital === "true";

  // Short human-readable ref shown to customer and visible in admin (Stripe session ID suffix)
  const orderRef = session?.id ? session.id.slice(-8).toUpperCase() : null;

  return (
    <main>
      <Nav heroDark />

      <section style={{
        background: "var(--ink)", padding: "140px clamp(20px,5vw,64px) 100px",
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden style={{ position: "absolute", top: -80, right: -80, width: 500, height: 400, background: "radial-gradient(circle,rgba(232,163,61,.22),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 72, height: 72, borderRadius: "50%",
            background: "rgba(34,197,94,.12)", border: "1.5px solid rgba(34,197,94,.3)",
            marginBottom: 24,
          }}>
            <CheckCircle2 size={36} color="#22c55e" strokeWidth={2} aria-hidden />
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(38px,5.5vw,66px)", letterSpacing: "-1.5px",
            color: "#fff", margin: "0 0 18px", lineHeight: 0.98,
          }}>
            {name ? `Thank you, ${name.split(" ")[0]}.` : "Order confirmed."}
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,247,239,.75)", lineHeight: 1.7 }}>
            {email ? (
              <>Your receipt has been sent to <strong style={{ color: "rgba(255,247,239,.95)" }}>{email}</strong> by Stripe.</>
            ) : (
              "Your receipt has been sent to your email by Stripe."
            )}
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
            {amountTotal && (
              <div style={{
                background: "rgba(255,247,239,.07)", border: "1px solid rgba(255,247,239,.14)",
                borderRadius: 16, padding: "14px 28px",
              }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 6 }}>
                  Order total
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "#fff" }}>
                  {amountTotal}
                </div>
              </div>
            )}
            {orderRef && (
              <div style={{
                background: "rgba(255,247,239,.07)", border: "1px solid rgba(255,247,239,.14)",
                borderRadius: 16, padding: "14px 28px",
              }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 6 }}>
                  Order ref
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "#fff", letterSpacing: "2px" }}>
                  #{orderRef}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Order details */}
      {items.length > 0 && (
        <section style={{ background: "var(--cream-2)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, letterSpacing: "-.5px", color: "var(--ink)", margin: "0 0 24px" }}>
              What you ordered
            </h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((li, i) => (
                <li key={i} style={{
                  background: "var(--paper)", border: "1px solid var(--line)",
                  borderRadius: 14, padding: "14px 18px",
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{li.description}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>Qty: {li.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)", whiteSpace: "nowrap" }}>
                    ${((li.amount_total ?? 0) / 100).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Next steps */}
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, letterSpacing: "-.5px", color: "var(--ink)", margin: "0 0 28px" }}>
            What happens next
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 22px", display: "flex", gap: 16 }}>
              <Mail size={20} strokeWidth={2} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>Check your email</div>
                <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  Stripe has sent your receipt. Physical items ship within 5 business days.
                  {hasDigital && " Digital downloads will arrive in a separate email within 24 hours."}
                </div>
              </div>
            </div>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 22px", display: "flex", gap: 16 }}>
              <MessageCircle size={20} strokeWidth={2} color="#25D366" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>Questions? WhatsApp us</div>
                <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  Reach us at{" "}
                  <a href="https://wa.me/14432726794" target="_blank" rel="noopener noreferrer" style={{ color: "#25D366", fontWeight: 700 }}>
                    +1 (443) 272-6794
                  </a>{" "}
                  {orderRef && <>with your order ref <strong>#{orderRef}</strong>.</>}
                </div>
              </div>
            </div>
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 22px", display: "flex", gap: 16 }}>
              <ShoppingBag size={20} strokeWidth={2} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>Your purchase supports the ministry</div>
                <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  Every sale funds the building project, outreach, and the work of CAC Salvation Center in Randallstown and beyond.
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Link href="/store" className="press" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 15,
              padding: "13px 26px", borderRadius: 999, textDecoration: "none",
              boxShadow: "0 8px 22px rgba(214,40,40,.28)",
            }}>
              <ShoppingBag size={15} strokeWidth={2} aria-hidden /> Continue shopping
            </Link>
            <Link href="/" className="press" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--paper)", color: "var(--ink)", fontWeight: 700, fontSize: 15,
              padding: "13px 26px", borderRadius: 999, textDecoration: "none",
              border: "1px solid var(--line)",
            }}>
              <Home size={15} strokeWidth={2} aria-hidden /> Go home
            </Link>
          </div>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
