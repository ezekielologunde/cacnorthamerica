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
  "Find a Member Church",
  "Zone / DCC Inquiry",
  "Annual Convention",
  "Prayer Request",
  "Pastoral Care",
  "Giving & Donations",
  "Media & Livestream",
  "Other",
];

const MEMBERSHIP_SUBJECTS = new Set([
  "Find a Member Church",
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
    padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid var(--line)", background: "var(--cream)",
    fontSize: 14.5, color: "var(--ink)",
    fontFamily: "var(--font-body)",
  };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 5 };

  return (
    <main>
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "112px clamp(20px,5vw,64px) 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -80, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,#2D42C9,#C81E3A 70%)", opacity: .1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Contact Us</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,5vw,54px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: "12px 0", lineHeight: .98, textWrap: "balance" }}>
              We&apos;d love to <span style={{ color: "var(--red)" }}>hear from you.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
              Fill in the form below and we&apos;ll be in touch.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ background: "var(--cream-2)", padding: "36px clamp(20px,5vw,64px) 64px" }}>
        <Reveal>
          <div style={{ maxWidth: 720, margin: "0 auto", background: "var(--paper)", borderRadius: 20, border: "1px solid var(--line)", padding: "clamp(24px,3.5vw,40px)", boxShadow: "0 16px 48px rgba(18,20,30,.06)" }}>
            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>🙏</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--ink)", margin: "0 0 10px" }}>Message received!</h2>
                <p style={{ color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  Thank you for reaching out. Someone from our team will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(19px,2.5vw,26px)", color: "var(--ink)", margin: "0 0 20px", letterSpacing: "-0.4px" }}>
                  Send us a message
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>Your Name <span style={{ color: "var(--red)" }}>*</span></label>
                    <input className="field-input" style={inputStyle} type="text" placeholder="Jane Smith" value={fields.name} onChange={update("name")} autoComplete="name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address <span style={{ color: "var(--red)" }}>*</span></label>
                    <input className="field-input" style={inputStyle} type="email" placeholder="you@example.com" value={fields.email} onChange={update("email")} autoComplete="email" />
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>Subject</label>
                  <select className="field-input" style={{ ...inputStyle, cursor: "pointer" }} value={fields.subject} onChange={update("subject")}>
                    <option value="">Select a topic…</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMembershipSubject ? "repeat(auto-fit,minmax(200px,1fr))" : "1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>
                      Phone{" "}
                      {isMembershipSubject
                        ? <span style={{ color: "var(--red)" }}>*</span>
                        : <span style={{ fontWeight: 400, opacity: .6 }}>(optional)</span>}
                    </label>
                    <input className="field-input" style={inputStyle} type="tel" placeholder="+1 (443) 000-0000" value={fields.phone} onChange={update("phone")} autoComplete="tel" />
                  </div>
                  {isMembershipSubject && (
                    <div>
                      <label style={labelStyle}>Country <span style={{ fontWeight: 400, opacity: .6 }}>(optional)</span></label>
                      <select className="field-input" style={{ ...inputStyle, cursor: "pointer" }} value={fields.country} onChange={update("country")} autoComplete="country-name">
                        <option value="">Select country…</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {isMembershipSubject && (
                  <div style={{ background: "rgba(200,30,58,.06)", border: "1px solid rgba(200,30,58,.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>💡</span>
                    <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                      For a faster welcome, fill out our{" "}
                      <a href="/visit" style={{ color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>Connect Card</a>{" "}
                      — it captures your full details and ministry interests so we can connect you with the right people straight away.
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>Message <span style={{ color: "var(--red)" }}>*</span></label>
                  <textarea className="field-input" style={{ ...inputStyle, minHeight: 120, resize: "vertical", lineHeight: 1.6 }} placeholder="How can we help you?" value={fields.message} onChange={update("message")} required />
                </div>

                {errMsg && (
                  <p style={{ color: "var(--red)", fontSize: 13.5, fontWeight: 600, margin: "0 0 14px" }}>{errMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="press"
                  style={{ padding: "13px 32px", borderRadius: 999, background: status === "loading" ? "var(--line)" : "linear-gradient(100deg,#2D42C9,#C81E3A)", color: "#fff", fontWeight: 700, fontSize: 14.5, border: "none", cursor: status === "loading" ? "not-allowed" : "pointer", letterSpacing: ".3px" }}
                >
                  {status === "loading" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>

      {/* Other ways to reach us */}
      <section style={{ background: "var(--cream)", padding: "56px clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,34px)", letterSpacing: "-0.8px", color: "var(--ink)", margin: 0 }}>Other ways to reach us</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
            {[
              { icon: MapPin, title: "Address", lines: [{ text: "14051 Stahley Road", href: "https://maps.google.com/?q=14051+Stahley+Road+Blue+Ridge+Summit+PA+17214" }, { text: "Blue Ridge Summit, PA 17214", href: "https://maps.google.com/?q=14051+Stahley+Road+Blue+Ridge+Summit+PA+17214" }] },
              { icon: Phone, title: "Phone", lines: [{ text: "(305) 469-0346", href: "tel:+13054690346" }] },
              { icon: Mail, title: "Email", lines: [{ text: "info@cacnorthamerica.com", href: "mailto:info@cacnorthamerica.com" }, { text: "cacna@hotmail.com", href: "mailto:cacna@hotmail.com" }] },
              { icon: Clock, title: "Annual Convention", lines: [{ text: "Six days in July", href: undefined }, { text: "CAC Village, PA", href: undefined }] },
            ].map((card) => (
              <Reveal key={card.title}>
                <div className="card-lift" style={{ background: "var(--paper)", borderRadius: 18, padding: "22px 20px", border: "1px solid var(--line)", boxShadow: "0 8px 22px rgba(18,20,30,.05)" }}>
                  <IconBadge icon={card.icon} style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 7 }}>{card.title}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)", lineHeight: 1.6 }}>
                    {card.lines.map((l, i) => l.href ? (
                      <a key={i} href={l.href} style={{ display: "block", color: "var(--ink)", textDecoration: "none" }}>{l.text}</a>
                    ) : (
                      <span key={i} style={{ display: "block" }}>{l.text}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <p style={{ textAlign: "center", fontSize: 13.5, color: "var(--ink-soft)", marginTop: 24 }}>
              General correspondence is handled through the CACNA Regional Secretariat, Pastor Joseph Olawale Latunde, Regional Secretary.
            </p>
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
