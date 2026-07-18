import { createServiceClient } from "@/lib/supabase/server";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonyForm } from "@/components/sections/TestimonyForm";
import { Quote, Sparkles } from "lucide-react";
import { googleReviews } from "@/lib/reviews";

export const metadata = {
  title: "Testimonies — CAC Salvation Center",
  description:
    "Real stories of God's faithfulness from the Salvation Center family — healing, restoration, salvation, and answered prayer.",
  alternates: { canonical: "/testimonies" },
};

const stories = [
  {
    name: "Grace O.",
    where: "Baltimore",
    quote: "After years of silence, God broke open the door to motherhood for my husband and me. Wakati Itusile carried us through the wait.",
    tag: "Family",
  },
  {
    name: "Daniel A.",
    where: "Online · Lagos",
    quote: "I joined Bible Study from across the ocean, broken and barely standing. The Word met me there. Today I am whole.",
    tag: "Healing",
  },
  {
    name: "Mary E.",
    where: "Randallstown",
    quote: "I walked in one Sunday looking for somewhere to belong. I left knowing I had walked into family — and into Christ.",
    tag: "Salvation",
  },
  {
    name: "Anonymous",
    where: "Maryland",
    quote: "An impossible diagnosis. The elders prayed. The next scan showed nothing. Glory be to God.",
    tag: "Healing",
  },
  {
    name: "Pastor F.",
    where: "Sister Church",
    quote: "The mantle on this house is real. The Salvation Center has discipled my own ministry across two continents.",
    tag: "Ministry",
  },
  {
    name: "Tunde & Bisi",
    where: "Baltimore DCC",
    quote: "Our marriage was in pieces. Through prayer ministry and the counsel of the pastors, God put us back together — better.",
    tag: "Restoration",
  },
];

const tagColor: Record<string, string> = {
  Family: "linear-gradient(135deg,#E8A33D,#F15F22)",
  Healing: "linear-gradient(135deg,#D62828,#9E1B1B)",
  Salvation: "linear-gradient(135deg,#F15F22,#D62828)",
  Ministry: "linear-gradient(135deg,#9E1B1B,#1B130E)",
  Restoration: "linear-gradient(135deg,#F15F22,#E8A33D)",
  Testimony: "linear-gradient(135deg,#D62828,#F15F22)",
};

export default async function TestimoniesPage() {
  const service = createServiceClient();
  const { data: dbRows } = await service
    .from("testimonies")
    .select("id, name, content")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  const dynamicStories = (dbRows ?? []).map((t: { id: string; name: string; content: string }) => ({
    name: t.name,
    where: "Congregation",
    quote: t.content,
    tag: "Testimony",
  }));
  const allStories = [...stories, ...dynamicStories];

  return (
    <main>
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 96px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -80, width: 560, height: 460, background: "radial-gradient(circle,rgba(232,163,61,.22),transparent 65%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -120, left: -100, width: 480, height: 480, background: "radial-gradient(circle,rgba(214,40,40,.18),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Testimonies</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(46px,7vw,98px)", letterSpacing: "-2.2px", color: "#fff", margin: "16px 0 24px", lineHeight: 0.93 }}>
              What God has<br />
              <span style={{ background: "linear-gradient(100deg,#F15F22,#D62828,#E8A33D)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>done for us.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,247,239,.72)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
              Stories from the Salvation Center family — healing, restoration, answered prayer, and the steady hand of God.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Scripture anchor */}
      <section style={{ background: "var(--cream)", padding: "clamp(60px,8vw,90px) clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(24px,3.4vw,38px)", letterSpacing: "-.8px", color: "var(--ink)", margin: 0, lineHeight: 1.3, fontStyle: "italic", maxWidth: 760, marginInline: "auto" }}>
            &ldquo;They triumphed over him by the blood of the Lamb and by the word of their testimony.&rdquo;
          </p>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)", marginTop: 18 }}>Revelation 12:11</p>
        </Reveal>
      </section>

      {/* Testimonies grid */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(40px,5vw,72px) clamp(20px,5vw,64px) clamp(60px,8vw,100px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22 }}>
            {allStories.map((s, i) => (
              <Reveal key={i} delay={(i % 3) * 80}>
                <article style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 24, padding: "28px 28px 26px", display: "flex", flexDirection: "column", boxShadow: "0 12px 30px rgba(27,19,14,.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <div style={{ display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 12, background: tagColor[s.tag] || "var(--ink)", boxShadow: "0 8px 18px rgba(214,40,40,.22)" }}>
                      <Quote size={18} strokeWidth={2.5} color="#fff" aria-hidden />
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "1.8px", textTransform: "uppercase", color: "var(--red)" }}>{s.tag}</span>
                  </div>
                  <p style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.7, margin: "0 0 22px", flex: 1, fontStyle: "italic" }}>&ldquo;{s.quote}&rdquo;</p>
                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>{s.name}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>{s.where}</div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,.12)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <span style={{ fontWeight: 900, fontSize: 20, background: "linear-gradient(135deg,#4285F4 25%,#EA4335 50%,#FBBC05 75%,#34A853)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>G</span>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 24, color: "var(--ink)", lineHeight: 1 }}>4.9</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-soft)", fontWeight: 600, marginTop: 1 }}>16 Google reviews</div>
                </div>
              </div>
              <div style={{ fontSize: 22, letterSpacing: 1, color: "#FBBC04", lineHeight: 1 }}>★★★★★</div>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.6vw,46px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0 }}>What our community says</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {googleReviews.map((r, i) => (
              <Reveal key={i} delay={(i % 3) * 70}>
                <article style={{ height: "100%", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 22, padding: "22px 22px 18px", display: "flex", flexDirection: "column", boxShadow: "0 8px 24px rgba(27,19,14,.05)" }}>
                  <div style={{ fontSize: 17, letterSpacing: 1, color: "#FBBC04", marginBottom: 12 }}>★★★★★</div>
                  <p style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.65, margin: "0 0 20px", flex: 1, fontStyle: "italic" }}>&ldquo;{r.quote}&rdquo;</p>
                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "var(--ink)" }}>{r.name}</div>
                      {r.isLocalGuide && <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--ink-soft)", letterSpacing: "0.5px", marginTop: 2 }}>Local Guide</div>}
                    </div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--ink-soft)", letterSpacing: "1px", textTransform: "uppercase" }}>Google</div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Share your story */}
      <section style={{ background: "var(--ink)", padding: "clamp(70px,9vw,120px) clamp(20px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, left: -100, width: 460, height: 460, background: "radial-gradient(circle,rgba(232,163,61,.18),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>
              <Sparkles size={14} strokeWidth={2.5} aria-hidden /> Share your story
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,4.5vw,56px)", letterSpacing: "-1.2px", color: "#fff", margin: "0 0 14px", lineHeight: 1 }}>
              Has God touched your life?
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,247,239,.72)", lineHeight: 1.65, margin: 0 }}>
              Tell us what He has done. Your story might be the very thing someone else needs to hear today.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <TestimonyForm />
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
