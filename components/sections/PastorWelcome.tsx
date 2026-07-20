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
    <section style={{ background: "linear-gradient(155deg,var(--red) 0%,var(--flame) 55%,#7A1128 100%)", padding: "clamp(76px,10vw,130px) clamp(20px,5vw,64px)", position: "relative", overflow: "hidden" }}>
      {/* Warm decorative glows — joyful, not muted */}
      <div aria-hidden style={{ position: "absolute", top: "-20%", right: "-6%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle,rgba(253,200,65,.22),transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-18%", left: "-8%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.12),transparent 70%)", pointerEvents: "none" }} />

      <div className="r2c" style={{ maxWidth: 1200, margin: "0 auto", gap: "clamp(48px,5vw,80px)", position: "relative", zIndex: 1, alignItems: "center" }}>
        {/* Portrait */}
        <Reveal from="left" style={{ position: "relative" }}>
          <div style={{ width: "100%", height: "clamp(360px,44vw,560px)", borderRadius: 28, overflow: "hidden", boxShadow: "0 30px 70px rgba(18,20,30,.35)", position: "relative", background: "var(--ink)", border: "4px solid rgba(255,255,255,.25)" }}>
            {photoUrl ? (
              <Parallax distance={36} style={{ position: "absolute", left: 0, right: 0, top: "-9%", height: "118%" }}>
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <ImageLightbox src={photoUrl} alt={name} objectPosition="center 28%" />
                </div>
              </Parallax>
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "linear-gradient(150deg,var(--gold),#e0a92f)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 88, color: "var(--ink)" }}>{initials(name)}</span>
              </div>
            )}
          </div>
          <div style={{ position: "absolute", bottom: -22, left: -18, background: "var(--gold)", color: "var(--ink)", padding: "16px 22px", borderRadius: 16, boxShadow: "0 18px 36px rgba(18,20,30,.32)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, lineHeight: 1.2 }}>{name}</div>
            <div style={{ fontSize: 12.5, color: "var(--red)", fontWeight: 800, letterSpacing: ".5px", marginTop: 4 }}>{title}</div>
          </div>
        </Reveal>

        {/* Bold, joyful welcome */}
        <div>
          <Reveal>
            <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>A word from our Regional Superintendent</span>
          </Reveal>
          <Reveal delay={80}>
            <div style={{
              width: 60, height: 60, borderRadius: 18, margin: "24px 0 0",
              background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.28)",
              display: "grid", placeItems: "center", backdropFilter: "blur(6px)",
            }}>
              <Quote size={28} color="var(--gold)" strokeWidth={2.2} fill="var(--gold)" aria-hidden />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ fontSize: "clamp(18px,1.9vw,24px)", lineHeight: 1.6, color: "rgba(255,255,255,.92)", margin: "24px 0 20px", textWrap: "pretty", fontWeight: 500 }}>
              Calvary greetings, in the name of our Lord and Savior Jesus Christ, by whose precious blood we are all redeemed. Wherever you call home — the United States, Canada, or South America — you belong to one family, under one Father, gathered as one fold and one Shepherd. The Lord is calling us to walk in unity with our brethren, to grow together in every area of life and ministry, and to do all things in the spirit of excellence, that when people see and hear of our works, His name will be praised.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.4vw,52px)", letterSpacing: "-1px", lineHeight: 1.05, margin: "8px 0 14px", color: "#fff", textWrap: "balance" }}>
              Welcome home!
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,.85)", margin: "0 0 34px", maxWidth: 480, lineHeight: 1.6 }}>
              You are not a visitor passing through — you are family sitting down. That is not a greeting I extend once; it is a lifestyle we share every day.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <Link href="/about" className="press card-lift btn-sheen" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 16, color: "var(--ink)", textDecoration: "none", padding: "16px 28px", borderRadius: 999, background: "var(--gold)", boxShadow: "0 14px 34px rgba(253,200,65,.4)" }}>
              Read Our Story <span aria-hidden style={{ fontSize: 17 }}>→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
