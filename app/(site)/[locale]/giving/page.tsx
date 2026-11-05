import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { Phone, Mail } from "lucide-react";
import { CopyAccount } from "@/components/giving/CopyAccount";
import { GIVING_CAMPAIGNS, type GivingCampaign } from "@/lib/giving";
import { GivingForm } from "@/components/giving/GivingForm";
import { recurringEnabled } from "@/lib/givingRecurring";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Giving — Christ Apostolic Church North America (CACNA)",
    description: "Give your tithe or offering online by card, bank or Zelle, or support a project: the CAC Village Pay Off, the Hope For All Initiative, and the CAC Centenary Building Project.",
    alternates: { canonical: `${SITE_URL}/giving` },
  };
}

/** The account details for one campaign, for donors who would rather send the gift themselves. */
function AccountGroup({ campaign }: { campaign: GivingCampaign }) {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-0.3px", color: "#fff", margin: "0 0 12px" }}>
        {campaign.name}
      </h3>
      <div style={{ display: "grid", gap: 10 }}>
        {campaign.accounts.map((a) => (
          <CopyAccount key={a.label} label={a.label} value={a.value} />
        ))}
      </div>
    </div>
  );
}

export default async function GivingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const withAccounts = GIVING_CAMPAIGNS.filter((c) => c.accounts.length > 0);

  return (
    <main id="main-content">
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "calc(var(--bar-h, 0px) + 104px) clamp(20px,5vw,64px) 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,var(--blue),var(--red) 70%)", opacity: 0.1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,6.5vw,84px)", letterSpacing: "-0.03em", color: "var(--ink)", margin: "0 0 14px", lineHeight: 0.96 }}>
              Your giving makes<br />
              <span style={{ color: "var(--red)" }}>a difference.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "var(--ink-soft)", lineHeight: 1.55, maxWidth: 580, margin: "0 auto" }}>
              Gifts support CACNA&apos;s ministries and the Annual Convention.
            </p>
            <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 580, margin: "14px auto 0" }}>
              CACNA is a 501(c)(3) church (EIN 27-2632984). Gifts made to CACNA may be tax deductible in the U.S. as the law allows; please check with your tax adviser. A gift sent straight to a bank account in Nigeria is not made through CACNA, so ask us before assuming a U.S. receipt.
            </p>
          </Reveal>

        </div>
      </section>

      {/* Scripture */}
      <section style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(24px,3vw,36px)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Reveal delay={220}>
            <figure style={{ maxWidth: 620, margin: "0 auto", padding: "22px 22px", borderRadius: 22, background: "var(--paper)", border: "1px solid var(--line)", boxShadow: "0 14px 36px rgba(18,20,30,.08)", textAlign: "left" }}>
              <p style={{ fontSize: "clamp(16px,1.7vw,19px)", color: "var(--ink)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                &ldquo;As it is written: <strong style={{ fontStyle: "normal" }}>&lsquo;They have freely scattered their gifts to the poor; their righteousness endures forever.&rsquo;</strong>&rdquo;
              </p>
              <figcaption style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "var(--red)" }}>2 Corinthians 9:9</figcaption>
            </figure>
          </Reveal>        </div>
      </section>

      {/* Give online */}
      <section style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(48px,6vw,72px)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Reveal>
            <GivingForm campaigns={GIVING_CAMPAIGNS} recurringOn={recurringEnabled()} />
          </Reveal>
          {recurringEnabled() && (
            <p style={{ textAlign: "center", fontSize: 14, color: "var(--ink-soft)", margin: "18px 0 0" }}>
              Already give on a schedule? <Link href="/giving/cancel" style={{ color: "var(--red)", fontWeight: 700 }}>Cancel a recurring gift</Link>.
            </p>
          )}
        </div>
      </section>

      {/* Photo */}
      <section style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(48px,6vw,72px)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Reveal>
            <div style={{ position: "relative", width: "100%", height: "clamp(180px,28vw,360px)", borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 50px rgba(18,20,30,.15)" }}>
              <ImageLightbox src="/images/giving-offering.jpg" alt="Ushers receiving the offering during a CACNA gathering" objectPosition="center 40%" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Account details for sending a gift directly */}
      <section style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(70px,9vw,110px)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Reveal>
            <div style={{ borderRadius: 28, padding: "clamp(22px,5.5vw,48px)", background: "linear-gradient(135deg,var(--ink),#1C1E2E)", boxShadow: "0 28px 60px rgba(18,20,30,.22)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3.2vw,38px)", letterSpacing: "-1px", color: "#fff", margin: "0 0 10px", lineHeight: 1.1 }}>
                Prefer to send it yourself?
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.78)", lineHeight: 1.6, margin: "0 0 26px", maxWidth: 560 }}>
                Use these Zelle and bank details, and put your name and what the gift is for in the memo.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 28 }}>
                {withAccounts.map((c) => (
                  <AccountGroup key={c.slug} campaign={c} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact us to give */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(40px,5vw,72px) clamp(20px,5vw,64px) clamp(64px,8vw,100px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,40px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0 }}>Other ways to give</h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, margin: "14px auto 0", maxWidth: 560 }}>
              For Zelle, wire, or check, use the account details above. For questions about giving, call or email.
            </p>
          </Reveal>
          <div className="r2" style={{ gap: 18 }}>
            {[
              { icon: Phone, title: "By phone", desc: "Call the CACNA office.", href: "tel:+13054690346", cta: "Call (305) 469-0346" },
              { icon: Mail, title: "By email", desc: "Email info@cacna.org.", href: "mailto:info@cacna.org", cta: "Email us" },
            ].map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <div style={{ background: "var(--paper)", borderRadius: 20, padding: "22px 20px", border: "1px solid var(--line)", boxShadow: "0 8px 22px rgba(18,20,30,.05)", height: "100%" }}>
                  <IconBadge icon={w.icon} style={{ marginBottom: 16 }} />
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink)", margin: "0 0 10px" }}>{w.title}</h3>
                  <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65, margin: "0 0 14px" }}>{w.desc}</p>
                  <a href={w.href} style={{ display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 20px", borderRadius: 999, background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>{w.cta}</a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
