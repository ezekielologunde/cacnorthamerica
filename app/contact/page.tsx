"use client";
import { useState } from "react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { submitLead, isValidEmail } from "@/lib/forms";

const SUBJECTS = [
  "General Enquiry",
  "New Membership / Join Church",
  "Join Sisters Fellowship",
  "Join Brothers Fellowship",
  "First Visit",
  "Prayer Request",
  "Pastoral Care",
  "Hall / Venue Hire",
  "Giving & Donations",
  "Media & Livestream",
  "Other",
];

const MEMBERSHIP_SUBJECTS = new Set([
  "New Membership / Join Church",
  "Join Sisters Fellowship",
  "Join Brothers Fellowship",
  "First Visit",
]);

const COUNTRIES = [
  "United States", "Nigeria", "United Kingdom", "Canada",
  "Ghana", "Jamaica", "Trinidad & Tobago", "Other",
];

export default function ContactPage() {
  const [fields, setFields] = useState({ name: "", email: "", phone: "", subject: "", country: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  function update(k: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields(f => ({ ...f, [k]: e.target.value }));
  }

  const isMembershipSubject = MEMBERSHIP_SUBJECTS.has(fields.subject);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg("");
    if (!fields.name.trim()) { setErrMsg("Please enter your name."); return; }
    if (!fields.email.trim()) { setErrMsg("Please enter your email address."); return; }
    if (!isValidEmail(fields.email)) { setErrMsg("Please enter a valid email address."); return; }
    if (isMembershipSubject && !fields.phone.trim()) { setErrMsg("Please enter your phone number so we can reach you."); return; }
    if (!fields.message.trim()) { setErrMsg("Please write a message."); return; }
    setStatus("loading");
    try {
      await submitLead(
        { "Name": fields.name, "Email": fields.email, "Phone": fields.phone, "Country": fields.country, "Subject": fields.subject, "Message": fields.message },
        `Contact — ${fields.subject || "General"}`
      );
      setStatus("success");
    } catch {
      setStatus("error");
      setErrMsg("Something went wrong. Please try again or email us directly.");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    padding: "13px 16px", borderRadius: 12,
    border: "1.5px solid var(--line)", background: "var(--cream)",
    fontSize: 15, color: "var(--ink)", outline: "none",
    fontFamily: "var(--font-body)", transition: "border-color .15s",
  };

  return (
    <main>
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "140px clamp(20px,5vw,64px) 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -80, right: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#F15F22,#D62828 70%)", opacity: .1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Contact Us</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(46px,6.5vw,90px)", letterSpacing: "-2px", color: "var(--ink)", margin: "16px 0", lineHeight: .92 }}>
              We&apos;d love to<br />
              <span style={{ background: "linear-gradient(100deg,#F15F22,#D62828)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>hear from you.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
              Whether you&apos;re visiting for the first time or looking to connect more deeply — fill in the form below and we&apos;ll be in touch.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ background: "var(--cream-2)", padding: "60px clamp(20px,5vw,64px) 100px" }}>
        <Reveal>
          <div style={{ maxWidth: 820, margin: "0 auto", background: "var(--paper)", borderRadius: 24, border: "1px solid var(--line)", padding: "clamp(28px,4vw,52px)", boxShadow: "0 16px 48px rgba(27,19,14,.06)" }}>
            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--ink)", margin: "0 0 12px" }}>Message received!</h2>
                <p style={{ color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                  Thank you for reaching out. Someone from our team will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,32px)", color: "var(--ink)", margin: "0 0 28px", letterSpacing: "-0.5px" }}>
                  Send us a message
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 6 }}>Your Name <span style={{ color: "var(--red)" }}>*</span></label>
                    <input style={inputStyle} type="text" placeholder="Jane Smith" value={fields.name} onChange={update("name")} autoComplete="name" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 6 }}>Email Address <span style={{ color: "var(--red)" }}>*</span></label>
                    <input style={inputStyle} type="email" placeholder="you@example.com" value={fields.email} onChange={update("email")} autoComplete="email" />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 6 }}>
                      Phone{" "}
                      {isMembershipSubject
                        ? <span style={{ color: "var(--red)" }}>*</span>
                        : <span style={{ fontWeight: 400, opacity: .6 }}>(optional)</span>}
                    </label>
                    <input style={inputStyle} type="tel" placeholder="+1 (443) 000-0000" value={fields.phone} onChange={update("phone")} autoComplete="tel" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 6 }}>Country <span style={{ fontWeight: 400, opacity: .6 }}>(optional)</span></label>
                    <select style={{ ...inputStyle, cursor: "pointer" }} value={fields.country} onChange={update("country")} autoComplete="country-name">
                      <option value="">Select country…</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 6 }}>Subject</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={fields.subject} onChange={update("subject")}>
                    <option value="">Select a topic…</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {isMembershipSubject && (
                  <div style={{ background: "rgba(214,40,40,.06)", border: "1px solid rgba(214,40,40,.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
                    <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                      For a faster welcome, fill out our{" "}
                      <a href="/visit" style={{ color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>Connect Card</a>{" "}
                      — it captures your full details and ministry interests so we can connect you with the right people straight away.
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: 22 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 6 }}>Message <span style={{ color: "var(--red)" }}>*</span></label>
                  <textarea style={{ ...inputStyle, minHeight: 150, resize: "vertical", lineHeight: 1.6 }} placeholder="How can we help you?" value={fields.message} onChange={update("message")} required />
                </div>

                {errMsg && (
                  <p style={{ color: "var(--red)", fontSize: 14, fontWeight: 600, margin: "0 0 16px" }}>{errMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{ padding: "14px 36px", borderRadius: 999, background: status === "loading" ? "var(--line)" : "linear-gradient(100deg,#F15F22,#D62828)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: status === "loading" ? "not-allowed" : "pointer", transition: "opacity .15s", letterSpacing: ".3px" }}
                >
                  {status === "loading" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>

      {/* Other ways to reach us */}
      <section style={{ background: "var(--cream)", padding: "80px clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.5vw,48px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0 }}>Other ways to reach us</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            {[
              { icon: MapPin, title: "Address", lines: ["10710 Marriottsville Rd", "Randallstown, MD 21133"], href: "https://maps.google.com/?q=10710+Marriottsville+Rd+Randallstown+MD+21133" },
              { icon: Phone, title: "Phone", lines: ["+1 443-272-6794", "+1 410-701-8315"], href: "tel:+14432726794" },
              { icon: Mail, title: "Email", lines: ["info@cacsalvationcenter.org"], href: "mailto:info@cacsalvationcenter.org" },
              { icon: Clock, title: "Sunday Service", lines: ["Sunday School 9:25 AM", "Sunday Worship 10:30 AM ET"], href: null },
            ].map((card) => (
              <Reveal key={card.title}>
                <div style={{ background: "var(--paper)", borderRadius: 20, padding: "28px 24px", border: "1px solid var(--line)", boxShadow: "0 8px 22px rgba(27,19,14,.05)" }}>
                  <IconBadge icon={card.icon} style={{ marginBottom: 14 }} />
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>{card.title}</div>
                  {card.href ? (
                    <a href={card.href} style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", textDecoration: "none", lineHeight: 1.65 }}>
                      {card.lines.map((l, i) => <span key={i} style={{ display: "block" }}>{l}</span>)}
                    </a>
                  ) : (
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", lineHeight: 1.65 }}>
                      {card.lines.map((l, i) => <span key={i} style={{ display: "block" }}>{l}</span>)}
                    </div>
                  )}
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
