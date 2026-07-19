import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { Phone, Mail, Landmark, Send } from "lucide-react";

const CENTENARY_ACCOUNTS = [
  { currency: "Naira", account: "2046703336" },
  { currency: "USD", account: "2046963520" },
  { currency: "GBP", account: "2046963509" },
  { currency: "EUR", account: "2046963516" },
];

const VILLAGE_PAYOFF_ACCOUNTS = [
  { icon: Landmark, label: "Chase Bank", value: "Ac# 823986275" },
  { icon: Send, label: "Zelle", value: "cacna@hotmail.com" },
];

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

      {/* CAC Centenary Building Project */}
      <section style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(56px,7vw,90px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Featured Campaign</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,40px)", letterSpacing: "-1px", color: "var(--ink)", margin: "10px 0 0" }}>
              CAC Centenary Building Project
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, margin: "14px auto 0", maxWidth: 600 }}>
              Conceived in 2018 to commemorate the Church&apos;s 100th anniversary, this project helps solve accommodation challenges on the prayer camp at Ikeji-Arakeji, Nigeria. CACNA members are warmly encouraged to give toward it.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
            {CENTENARY_ACCOUNTS.map((a, i) => (
              <Reveal key={a.currency} delay={i * 70}>
                <div style={{ background: "var(--paper)", borderRadius: 20, padding: "22px 20px", border: "1px solid var(--line)", boxShadow: "0 8px 22px rgba(18,20,30,.05)", height: "100%", textAlign: "center" }}>
                  <IconBadge icon={Landmark} style={{ marginBottom: 14, marginLeft: "auto", marginRight: "auto" }} />
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 6 }}>
                    First Bank — {a.currency}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "var(--ink)", letterSpacing: "0.5px" }}>
                    {a.account}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CAC Village Pay Off */}
      <section style={{ background: "var(--cream-2)", padding: "0 clamp(20px,5vw,64px) clamp(56px,7vw,90px)" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>CAC Village</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,40px)", letterSpacing: "-1px", color: "var(--ink)", margin: "10px 0 0" }}>
              CAC Village Pay Off
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, margin: "14px auto 0", maxWidth: 540 }}>
              Help pay down the mortgage on CAC Village, Blue Ridge Summit, PA — the home of our Annual Convention. Kindly send your donations to the CAC Village account below.
            </p>
          </Reveal>
          <div className="r2" style={{ gap: 16 }}>
            {VILLAGE_PAYOFF_ACCOUNTS.map((a, i) => (
              <Reveal key={a.label} delay={i * 70}>
                <div style={{ background: "var(--paper)", borderRadius: 20, padding: "22px 20px", border: "1px solid var(--line)", boxShadow: "0 8px 22px rgba(18,20,30,.05)", height: "100%", textAlign: "center" }}>
                  <IconBadge icon={a.icon} style={{ marginBottom: 14, marginLeft: "auto", marginRight: "auto" }} />
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--red)", marginBottom: 6 }}>
                    {a.label}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "var(--ink)" }}>
                    {a.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
