import { createServiceClient } from "@/lib/supabase/server";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonyForm } from "@/components/sections/TestimonyForm";
import { Quote, Sparkles } from "lucide-react";

export const metadata = {
  title: "Testimonies — Christ Apostolic Church North America (CACNA)",
  description:
    "Real stories of God's faithfulness from across CACNA's member churches — healing, restoration, salvation, and answered prayer.",
  alternates: { canonical: "/testimonies" },
};

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
  const allStories = dynamicStories;

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
              Stories from across CACNA's member churches — healing, restoration, answered prayer, and the steady hand of God.
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
          {allStories.length === 0 ? (
            <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, textAlign: "center" }}>
              No testimonies have been shared yet — be the first to tell us what God has done.
            </p>
          ) : (
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
          )}
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
