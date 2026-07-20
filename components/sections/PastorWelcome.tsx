import Link from "next/link";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { getLeaders } from "@/lib/leaders";

function initials(name: string) {
  const parts = name.replace(/^(Pastor|Prophet|Evangelist|Apostle)\s+(Dr\.?\s+)?(\(Mrs\.?\)\s+)?/i, "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")).toUpperCase();
}

export async function PastorWelcome() {
  const regional = await getLeaders(["cacna_regional"]);
  const superintendent = regional[0];
  const name = superintendent?.full_name ?? "Pastor Dr. T.O. Agbeja";
  const title = superintendent?.title?.split(";")[0]?.split("&")[0]?.trim() || "Regional Superintendent, CACNA";
  const photoUrl = superintendent?.photo_url;

  return (
    <section style={{ background: "var(--cream-2)", padding: "clamp(70px,9vw,120px) clamp(20px,5vw,64px)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: "-15%", left: "-8%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,30,58,.08),transparent 70%)", pointerEvents: "none" }} />
      <div className="r2c" style={{ maxWidth: 1200, margin: "0 auto", gap: "clamp(48px,5vw,80px)", position: "relative", zIndex: 1 }}>
        {/* Portrait with parallax */}
        <Reveal from="left" style={{ position: "relative" }}>
          <div style={{ width: "100%", height: "clamp(360px,44vw,560px)", borderRadius: 26, overflow: "hidden", boxShadow: "0 28px 60px rgba(18,20,30,.18)", position: "relative", background: "var(--ink)" }}>
            {photoUrl ? (
              <Parallax distance={36} style={{ position: "absolute", left: 0, right: 0, top: "-9%", height: "118%" }}>
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <ImageLightbox src={photoUrl} alt={name} objectPosition="center 28%" />
                </div>
              </Parallax>
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "linear-gradient(150deg,var(--flame),var(--red))" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 88, color: "rgba(255,255,255,.92)" }}>{initials(name)}</span>
              </div>
            )}
          </div>
          <div style={{ position: "absolute", bottom: -22, left: -18, background: "var(--ink)", color: "var(--cream)", padding: "16px 22px", borderRadius: 16, boxShadow: "0 18px 36px rgba(18,20,30,.28)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, lineHeight: 1.2 }}>{name}</div>
            <div style={{ fontSize: 12.5, color: "var(--gold)", fontWeight: 700, letterSpacing: ".5px", marginTop: 4 }}>{title}</div>
          </div>
        </Reveal>

        {/* Mission quote */}
        <div>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>A word from our Regional Superintendent</span>
          </Reveal>
          <Reveal delay={80}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, margin: "22px 0 0",
              background: "linear-gradient(135deg,var(--gold),#e0a92f)",
              display: "grid", placeItems: "center",
              boxShadow: "0 10px 24px rgba(253,200,65,.35)",
            }}>
              <Quote size={26} color="var(--ink)" strokeWidth={2.2} fill="var(--ink)" aria-hidden />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ fontSize: "clamp(18px,1.9vw,24px)", lineHeight: 1.6, color: "var(--ink)", margin: "22px 0 18px", textWrap: "pretty", fontWeight: 500 }}>
              Calvary greetings, in the name of our Lord and Savior Jesus Christ, by whose precious blood we are all redeemed. The Lord is calling us to walk in unity with our brethren — for we share the same Father — and to grow in every area of life and ministry in the work He has given us to do for the glory of His name. Let us do all things in the spirit of excellence, that when people see and hear of our works, His name will be praised.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,2.6vw,34px)", letterSpacing: "-.5px", lineHeight: 1.15, margin: "0 0 8px", color: "var(--ink)" }}>
              With this in our heart, we say{" "}
              <span style={{ color: "var(--red)" }}>Welcome Home!</span>
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", fontStyle: "italic", margin: "0 0 30px" }}>It&apos;s more than a greeting — it&apos;s our lifestyle.</p>
          </Reveal>
          <Reveal delay={240}>
            <Link href="/about" className="press card-lift" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: "var(--ink)", textDecoration: "none", padding: "14px 24px", borderRadius: 999, border: "1.5px solid var(--ink)" }}>
              Read Our Story <span aria-hidden style={{ fontSize: 17 }}>→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
