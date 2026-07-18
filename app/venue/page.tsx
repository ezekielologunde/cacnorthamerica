import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { Building2, Car, Users, Calendar, PartyPopper, Briefcase, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venue Hire — CAC Salvation Center",
  description:
    "Book the CAC Salvation Center hall and parking lots for your event, conference, birthday, or community gathering in Randallstown, MD. Contact us to check availability.",
  alternates: { canonical: "/venue" },
};

const SPACES = [
  {
    icon: Building2,
    name: "Main Hall",
    desc: "A spacious, air-conditioned hall suitable for worship services, conferences, seminars, and large celebrations. Flexible seating arrangements to fit your event.",
    features: ["Flexible seating layout", "Audio-visual ready", "Air-conditioned", "Stage & podium area"],
  },
  {
    icon: Car,
    name: "Parking Lots",
    desc: "Generous on-site parking available for rent alongside or independent of the hall. Ideal for large gatherings where overflow parking is needed.",
    features: ["Capacity for dozens of vehicles", "Well-lit", "On-site for hall events", "Available independently"],
  },
];

const USES = [
  { icon: PartyPopper, label: "Birthdays & Celebrations" },
  { icon: Briefcase, label: "Conferences & Seminars" },
  { icon: Users, label: "Community Gatherings" },
  { icon: Calendar, label: "Church Events" },
];

export default function VenuePage() {
  return (
    <main>
      <Nav />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(140deg,#1C3A2A,#2E6040)",
        padding: "130px clamp(20px,5vw,64px) 80px",
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden style={{ position: "absolute", top: -120, right: -80, width: 560, height: 440, background: "radial-gradient(circle,rgba(232,163,61,.2),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>
              Space for Rent
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(46px,7vw,96px)", letterSpacing: "-0.025em",
              color: "#fff", margin: "16px 0 20px", lineHeight: 0.94,
            }}>
              Host your event<br />
              <span style={{ color: "var(--gold)" }}>at Salvation Center.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,247,239,.78)", lineHeight: 1.65, maxWidth: 600, marginBottom: 36 }}>
              Our hall and parking lots are available for events of all kinds — conferences, birthdays, community gatherings, and more — right in Randallstown, MD.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <a href="mailto:info@cacsalvationcenter.org" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--gold)", color: "#1C3A2A", fontWeight: 800,
                fontSize: 15, padding: "13px 26px", borderRadius: 999, textDecoration: "none",
              }}>
                <Mail size={15} strokeWidth={2.5} aria-hidden /> Email to enquire
              </a>
              <Link href="/contact" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,.15)", color: "#fff", fontWeight: 700,
                fontSize: 15, padding: "13px 26px", borderRadius: 999, textDecoration: "none",
                border: "1px solid rgba(255,255,255,.25)",
              }}>
                Fill a contact form <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Spaces */}
      <section style={{ background: "var(--cream)", padding: "clamp(56px,7vw,90px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Available Spaces</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,56px)", letterSpacing: "-1px", color: "var(--ink)", margin: "12px 0 0", lineHeight: 1.04 }}>
              What we have.
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: 24 }}>
            {SPACES.map(({ icon: Icon, name, desc, features }) => (
              <Reveal key={name}>
                <div className="card-lift" style={{
                  background: "var(--paper)", borderRadius: 24, overflow: "hidden",
                  border: "1px solid var(--line)", boxShadow: "0 8px 28px rgba(27,19,14,.07)",
                }}>
                  <div style={{ height: 6, background: "linear-gradient(90deg,#1C3A2A,#2E6040)" }} />
                  <div style={{ padding: "32px 36px" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#EDF5F0", display: "grid", placeItems: "center", marginBottom: 20 }}>
                      <Icon size={22} strokeWidth={2} color="#1C3A2A" aria-hidden />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, letterSpacing: "-.4px", color: "var(--ink)", margin: "0 0 12px" }}>
                      {name}
                    </h3>
                    <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: "0 0 24px" }}>
                      {desc}
                    </p>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                      {features.map((f) => (
                        <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--ink)", fontWeight: 600 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2E6040", flexShrink: 0 }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Best for */}
      <section style={{ background: "var(--cream-2)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Perfect for</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,50px)", letterSpacing: "-.8px", color: "var(--ink)", margin: "12px 0 0", lineHeight: 1.06 }}>
              Any gathering. Any size.
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 18 }}>
            {USES.map(({ icon: Icon, label }) => (
              <Reveal key={label}>
                <div style={{
                  background: "var(--paper)", border: "1px solid var(--line)",
                  borderRadius: 18, padding: "28px 24px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 14, textAlign: "center",
                  boxShadow: "0 4px 16px rgba(27,19,14,.05)",
                }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "#EDF5F0", display: "grid", placeItems: "center" }}>
                    <Icon size={24} strokeWidth={1.75} color="#1C3A2A" aria-hidden />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)", lineHeight: 1.3 }}>{label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How to book */}
      <section style={{ background: "var(--cream)", padding: "clamp(50px,6vw,80px) clamp(20px,5vw,64px) clamp(70px,9vw,110px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Reveal>
            <div style={{
              background: "linear-gradient(140deg,#1C3A2A,#2E6040)",
              borderRadius: 28, padding: "clamp(32px,4vw,52px)",
              position: "relative", overflow: "hidden",
              boxShadow: "0 24px 60px rgba(28,58,42,.28)",
            }}>
              <div aria-hidden style={{ position: "absolute", top: -60, right: -50, width: 300, height: 260, background: "radial-gradient(circle,rgba(232,163,61,.25),transparent 65%)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>
                  Book or Consult
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3.5vw,44px)", letterSpacing: "-.8px", color: "#fff", margin: "14px 0 16px", lineHeight: 1.04 }}>
                  Ready to book? We&apos;d love to host you.
                </h2>
                <p style={{ fontSize: 16, color: "rgba(255,247,239,.78)", lineHeight: 1.65, margin: "0 0 32px", maxWidth: 520 }}>
                  Reach out to check availability, get a quote, or ask any questions. We respond within one business day.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                  <a href="mailto:info@cacsalvationcenter.org" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "var(--gold)", color: "#1C3A2A", fontWeight: 800,
                    fontSize: 15, padding: "13px 26px", borderRadius: 999, textDecoration: "none",
                  }}>
                    <Mail size={15} strokeWidth={2.5} aria-hidden />
                    info@cacsalvationcenter.org
                  </a>
                  <Link href="/contact" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,.15)", color: "#fff", fontWeight: 700,
                    fontSize: 15, padding: "13px 26px", borderRadius: 999, textDecoration: "none",
                    border: "1px solid rgba(255,255,255,.25)",
                  }}>
                    Fill a contact form <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
