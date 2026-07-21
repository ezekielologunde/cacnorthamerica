import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { getLeaders } from "@/lib/leaders";
import { GraduationCap } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "CACNA Bible Institute — Christ Apostolic Church North America (CACNA)",
  description: "CACNA's ministerial training arm — meet the Chancellor, Provost, Dean, Registrar, and Lecturer leading the Bible Institute.",
  alternates: { canonical: "/bible-institute" },
};

function initials(name: string) {
  const parts = name.replace(/^(Pastor|Prophet|Evangelist|Apostle)\s+(Dr\.?\s+)?(\(Mrs\.?\)\s+)?/i, "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")).toUpperCase();
}

const gradients = [
  "linear-gradient(135deg,var(--red-deep),var(--red))",
  "linear-gradient(135deg,var(--red),var(--blue))",
  "linear-gradient(135deg,var(--blue),var(--gold))",
  "linear-gradient(135deg,var(--ink),var(--red-deep))",
  "linear-gradient(135deg,var(--red-deep),var(--blue))",
];

export default async function BibleInstitutePage() {
  const faculty = await getLeaders(["bible_institute"]);

  return (
    <main id="main-content">
      <Nav heroDark />

      {/* Hero */}
      <section style={{ background: "var(--ink)", padding: "150px clamp(20px,5vw,64px) 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -100, width: 640, height: 500, background: "radial-gradient(circle,rgba(45,66,201,.3),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>CACNA Bible Institute</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(42px,6vw,80px)", letterSpacing: "-2px", color: "#fff", margin: "16px 0", lineHeight: .95 }}>
              Raising ministers.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(245,246,250,.72)", lineHeight: 1.65, maxWidth: 620, margin: "0 auto" }}>
              The CACNA Bible Institute is the region's ministerial training arm — equipping workers and ministers across CACNA's member churches for the work of the Gospel.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Graduation photo */}
      <section style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", marginTop: -48, position: "relative", zIndex: 3 }}>
          <Reveal>
            <div style={{ position: "relative", width: "100%", height: "clamp(240px,32vw,420px)", borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 60px rgba(18,20,30,.25)" }}>
              <ImageLightbox src="/images/bible-institute-graduation.jpg" alt="CACNA Bible Institute graduates processing at a past commencement" objectPosition="center 35%" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Faculty */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 36 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Institute Leadership</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.5vw,44px)", letterSpacing: "-1px", color: "var(--ink)", margin: "10px 0 0", lineHeight: 1 }}>
              Faculty & administration.
            </h2>
          </Reveal>
          {faculty.length === 0 ? (
            <p style={{ fontSize: 16, color: "var(--ink-soft)", textAlign: "center" }}>Faculty listing coming soon.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
              {faculty.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <div className="card-lift" style={{
                    height: "100%", background: "var(--paper)", border: "1px solid var(--line)",
                    borderRadius: 20, padding: "26px 24px", display: "flex", flexDirection: "column",
                    alignItems: "center", textAlign: "center", gap: 14,
                  }}>
                    <div aria-hidden style={{
                      width: 64, height: 64, borderRadius: 18,
                      background: gradients[i % gradients.length],
                      display: "grid", placeItems: "center",
                      color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22,
                      letterSpacing: "-0.5px", boxShadow: "0 10px 22px rgba(45,66,201,.28)",
                    }}>{initials(p.full_name)}</div>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 4 }}>{p.title}</div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "-0.3px", color: "var(--ink)", margin: 0, lineHeight: 1.2 }}>{p.full_name}</h3>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Programs */}
      <section style={{ background: "var(--ink)", padding: "clamp(64px,8vw,100px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <GraduationCap size={40} strokeWidth={1.5} color="var(--gold)" aria-hidden style={{ marginBottom: 20 }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Our First Course</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-1px", color: "#fff", margin: "14px 0 30px", lineHeight: 1.05 }}>
              Deacons & Deaconesses.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="card-lift" style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "30px 28px", textAlign: "left" }}>
              <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.75, margin: "0 0 20px" }}>
                A Deacon or Deaconess assists the Pastor in the spiritual and administrative affairs of the church. Deacons and Deaconesses are to help free the Pastor from tasks not requiring special pastoral training, permitting the Pastor time for graver responsibilities, while always being observant and ready to serve appropriately to the physical needs of the members of the body of Christ.
              </p>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>This training covers</div>
              <ul style={{ margin: 0, padding: "0 0 0 20px", fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.9 }}>
                <li>Assisting the Pastor and ministerial staff in spiritual guidance for the church family and community</li>
                <li>Teaching, prayer, and providing service when needed</li>
                <li>Being available to participate in all worship services, weekly prayer meetings, and Bible studies</li>
                <li>Communicating with and visiting members and families, as appropriate</li>
                <li>Welcoming, orientation, and follow-up for new disciples</li>
                <li>Assisting with funerals and special services</li>
                <li>Coordinating and assisting with the discipleship of members and families</li>
                <li>Assisting with the emergency needs of members</li>
                <li>Performing other duties as appropriate to ensure the orderly operation of the church and membership</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: 15, color: "rgba(245,246,250,.6)", lineHeight: 1.7, margin: "28px 0 0" }}>
              More course offerings and how to apply will be published here as they're finalized. For now, reach out through our{" "}
              <a href="/contact" style={{ color: "var(--gold)" }}>contact page</a> for enquiries.
            </p>
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
