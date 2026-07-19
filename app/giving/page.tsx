import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { Phone, Mail, Landmark, Send } from "lucide-react";
import { GIVING_CAMPAIGNS, type GivingCampaign } from "@/lib/giving";

const accountIcon = (label: string) => (label.toLowerCase().includes("zelle") ? Send : Landmark);
const [centenary, villagePayoff, hopeForAll] = GIVING_CAMPAIGNS;

const SCHEMES = {
  centenary: { gradient: "linear-gradient(135deg,#7A1128,#FDC841)", glow: "rgba(253,200,65,.35)", badge: "rgba(255,255,255,.16)" },
  village: { gradient: "linear-gradient(135deg,#1B2A6B,#2D42C9)", glow: "rgba(45,66,201,.4)", badge: "rgba(255,255,255,.14)" },
  hope: { gradient: "linear-gradient(140deg,#1C3A2A,#2E6040)", glow: "rgba(46,96,64,.45)", badge: "rgba(255,255,255,.14)" },
} as const;

function CampaignCard({ campaign, scheme }: { campaign: GivingCampaign; scheme: (typeof SCHEMES)[keyof typeof SCHEMES] }) {
  return (
    <div style={{
      position: "relative", overflow: "hidden",
      borderRadius: 32, padding: "clamp(36px,5.5vw,64px)",
      background: scheme.gradient, boxShadow: "0 28px 60px rgba(18,20,30,.22)",
    }}>
      <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle,${scheme.glow},transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
        <span style={{
          display: "inline-block", fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase",
          color: "#fff", background: scheme.badge, padding: "7px 16px", borderRadius: 999, marginBottom: 20,
        }}>
          {campaign.eyebrow}
        </span>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.2vw,52px)", letterSpacing: "-1.2px", color: "#fff", margin: "0 0 16px", lineHeight: 1.05, textWrap: "balance" }}>
          {campaign.title}
        </h2>
        <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,.82)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 620 }}>
          {campaign.description}
        </p>
      </div>
      <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
        {campaign.accounts.map((a, i) => (
          <Reveal key={a.label} delay={i * 70}>
            <div style={{
              background: "rgba(255,255,255,.12)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,.18)", borderRadius: 22,
              padding: "26px 24px", height: "100%",
            }}>
              <IconBadge icon={accountIcon(a.label)} bg="rgba(255,255,255,.16)" color="#fff" style={{ marginBottom: 16 }} />
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,.72)", marginBottom: 8 }}>
                {a.label}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(19px,2vw,23px)", color: "#fff", letterSpacing: "0.3px", lineHeight: 1.3, wordBreak: "break-word" }}>
                {a.value}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function GivingPage() {
  return (
    <main>
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "140px clamp(20px,5vw,64px) 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,#2D42C9,#C81E3A 70%)", opacity: 0.1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Give</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(46px,6.5vw,90px)", letterSpacing: "-0.03em", color: "var(--ink)", margin: "16px 0", lineHeight: 0.92 }}>
              Your giving makes<br />
              <span style={{ color: "var(--red)" }}>a difference.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 580, margin: "0 auto" }}>
              Every gift fuels CACNA&apos;s ministries and the Annual Convention. You are partnering with the kingdom every time you give.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <figure style={{ maxWidth: 620, margin: "44px auto 0", padding: "26px 28px", borderRadius: 22, background: "var(--paper)", border: "1px solid var(--line)", boxShadow: "0 14px 36px rgba(18,20,30,.08)", textAlign: "left" }}>
              <p style={{ fontSize: "clamp(16px,1.7vw,19px)", color: "var(--ink)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                &ldquo;As it is written: <strong style={{ fontStyle: "normal" }}>&lsquo;They have freely scattered their gifts to the poor; their righteousness endures forever.&rsquo;</strong>&rdquo;
              </p>
              <figcaption style={{ marginTop: 12, fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)" }}>2 Corinthians 9:9</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Campaigns — bigger, distinctly-colored cards */}
      <section style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(70px,9vw,110px)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
          <Reveal>
            <CampaignCard campaign={centenary} scheme={SCHEMES.centenary} />
          </Reveal>
          <Reveal delay={80}>
            <CampaignCard campaign={villagePayoff} scheme={SCHEMES.village} />
          </Reveal>
          <Reveal delay={160}>
            <CampaignCard campaign={hopeForAll} scheme={SCHEMES.hope} />
          </Reveal>
        </div>
      </section>

      {/* Contact us to give */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(40px,5vw,72px) clamp(20px,5vw,64px) clamp(64px,8vw,100px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,40px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0 }}>Ways to give</h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, margin: "14px auto 0", maxWidth: 560 }}>
              Online giving isn&apos;t set up yet for CACNA directly — reach out and we&apos;ll point you to the right option, or connect you with a member church near you.
            </p>
          </Reveal>
          <div className="r2" style={{ gap: 18 }}>
            {[
              { icon: Phone, title: "By phone", desc: "Call CACNA at (305) 469-0346 to ask about giving." },
              { icon: Mail, title: "By email", desc: "Email info@cacnorthamerica.com and we'll follow up with details." },
            ].map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <div style={{ background: "var(--paper)", borderRadius: 20, padding: "28px 24px", border: "1px solid var(--line)", boxShadow: "0 8px 22px rgba(18,20,30,.05)", height: "100%" }}>
                  <IconBadge icon={w.icon} style={{ marginBottom: 16 }} />
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink)", margin: "0 0 10px" }}>{w.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{w.desc}</p>
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
