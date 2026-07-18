import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";

export function PastorWelcome() {
  return (
    <section style={{ background: "var(--cream-2)", padding: "clamp(70px,9vw,120px) clamp(20px,5vw,64px)" }}>
      <div className="r2c" style={{ maxWidth: 1200, margin: "0 auto", gap: "clamp(48px,5vw,80px)" }}>
        {/* Pastor portrait with parallax */}
        <Reveal from="left" style={{ position: "relative" }}>
          <div style={{ width: "100%", height: "clamp(360px,44vw,560px)", borderRadius: 26, overflow: "hidden", boxShadow: "0 28px 60px rgba(27,19,14,.18)", position: "relative" }}>
            <Parallax distance={36} style={{ position: "absolute", left: 0, right: 0, top: "-9%", height: "118%" }}>
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image src="/images/pastor-couple.jpg" alt="Pastor Dr. H.O. Ilufoye and Evang. Mrs Victoria Ilufoye" fill style={{ objectFit: "cover", objectPosition: "center 28%" }} sizes="(max-width:900px) 100vw, 45vw" />
              </div>
            </Parallax>
          </div>
          <div style={{ position: "absolute", bottom: -22, left: -18, background: "var(--ink)", color: "var(--cream)", padding: "16px 22px", borderRadius: 16, boxShadow: "0 18px 36px rgba(27,19,14,.28)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, lineHeight: 1.2 }}>Pastor Dr. H.O. Ilufoye<span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: "rgba(255,247,239,.82)" }}>&amp; Evang. Mrs Victoria Ilufoye</span></div>
            <div style={{ fontSize: 12.5, color: "var(--gold)", fontWeight: 700, letterSpacing: ".5px", marginTop: 4 }}>Baltimore DCC Superintendent · First Lady</div>
          </div>
        </Reveal>

        {/* Mission quote */}
        <div>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>A word from our Pastor</span>
          </Reveal>
          <Reveal delay={80}>
            <div aria-hidden style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 96, lineHeight: 0.55, color: "var(--gold)", margin: "20px 0 0" }}>&ldquo;</div>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ fontSize: "clamp(18px,1.9vw,24px)", lineHeight: 1.6, color: "var(--ink)", margin: "0 0 18px", textWrap: "pretty", fontWeight: 500 }}>
              We are given the mandate to preach the whole Gospel in a clear and undiluted manner. We stand as part of the vast body of Christ across the globe — fulfilling the Great Commission, building every believer to be God&apos;s Ambassadors here on earth, and preparing them for Christ&apos;s Kingdom to come.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,2.6vw,34px)", letterSpacing: "-.5px", lineHeight: 1.15, margin: "0 0 8px", color: "var(--ink)" }}>
              With this in our heart, we say{" "}
              <span style={{ background: "linear-gradient(100deg,#F15F22,#D62828)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Welcome Home!</span>
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", fontStyle: "italic", margin: "0 0 30px" }}>It&apos;s more than a greeting — it&apos;s our lifestyle.</p>
          </Reveal>
          <Reveal delay={240}>
            <Link href="/about" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: "var(--ink)", textDecoration: "none", padding: "14px 24px", borderRadius: 999, border: "1.5px solid var(--ink)" }}>
              Read Our Story <span aria-hidden style={{ fontSize: 17 }}>→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
