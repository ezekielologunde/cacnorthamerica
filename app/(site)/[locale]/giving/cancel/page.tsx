import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { CancelRequestForm } from "@/components/giving/CancelRequestForm";
import { CancelGiftButton } from "@/components/giving/CancelGiftButton";
import { viewGifts } from "@/lib/givingCancel";
import { cancelDeps } from "@/lib/givingCancelStripe";

// The emailed link carries a sealed token in the URL: keep it out of search
// results and out of the Referer header of anything this page links to.
export const metadata: Metadata = {
  title: "Cancel a recurring gift — CACNA",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const heading = { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", color: "#fff", margin: "0 0 14px" } as const;
const lede = { fontSize: 15.5, color: "rgba(245,246,250,.65)", maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.7 } as const;

export default async function CancelRecurringGiftPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { t: token } = await searchParams;

  // Opening this page only reads; cancelling is a separate button that POSTs.
  const view = token ? await viewGifts(token, cancelDeps()) : null;

  return (
    <main id="main-content">
      <Nav heroDark />
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 100px", textAlign: "center" }}>
        {view?.state === "ok" ? (
          <>
            <h1 style={heading}>{view.gifts.length > 0 ? "Choose a gift to cancel" : "No recurring gifts to cancel"}</h1>
            <p style={lede}>
              {view.gifts.length > 0
                ? "Cancelling stops all future payments for that gift. Payments already made are not refunded."
                : "There are no active recurring gifts on this link. If you meant to cancel one, it may already be stopped."}
            </p>
            <div style={{ maxWidth: 460, margin: "0 auto", display: "grid", gap: 14, textAlign: "left" }}>
              {view.gifts.map((g) => {
                const what = [g.frequencyLabel, g.amountLabel].filter(Boolean).join(" ") || "Recurring gift";
                return (
                  <div key={g.subscriptionId} style={{ background: "rgba(245,246,250,.06)", border: "1px solid rgba(245,246,250,.14)", borderRadius: 18, padding: "22px 24px" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#fff" }}>{what}</div>
                    <div style={{ fontSize: 14, color: "rgba(245,246,250,.6)", margin: "4px 0 16px" }}>{g.campaignTitle ? `Gift to ${g.campaignTitle}` : "Gift to CACNA"}</div>
                    <CancelGiftButton token={token!} subscriptionId={g.subscriptionId} label={what.toLowerCase()} />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <h1 style={heading}>{view ? (view.state === "expired" ? "That link has expired" : "We couldn’t load your gifts") : "Cancel a recurring gift"}</h1>
            <p style={lede}>
              {view
                ? view.state === "expired"
                  ? "For your security the link only works for an hour. Enter your email and we’ll send a new one."
                  : "Please try again in a moment, or write to info@cacna.org and we’ll stop it for you."
                : "Enter the email you gave with. If a recurring gift is set up for it, we’ll email you a link to stop it."}
            </p>
            {(!view || view.state === "expired") && <CancelRequestForm />}
          </>
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
