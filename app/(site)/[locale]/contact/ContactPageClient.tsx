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

const VISIT_TYPES = [
  { value: "First-time visitor", label: "First-time visitor" },
  { value: "Returning visitor",  label: "Returning visitor" },
  { value: "New member",         label: "Looking for a member church" },
];

const GROUPS = [
  "Administration",
  "Christian Education",
  "Evangelism, Prayer & Counselling",
  "Youth & Young Adult",
  "Missions",
  "Music",
  "Welfare & Outreach",
  "ICT & Technical",
  "CAC Good Women Association",
  "CAC Men Association (CACMA)",
];

const faqs = [
  { q: "What is CACNA?", a: "Christ Apostolic Church North America is the regional body uniting CAC member churches across the United States, Canada, and South America, organized into 24 Zones & DCCs (District Church Councils), each led by a Zonal Superintendent." },
  { q: "Do all CACNA member churches share the same service times?", a: "No — each member church sets its own weekly schedule. Reach out to the Zonal Superintendent nearest you to find service times for a specific church." },
  { q: "Where is the CACNA Annual Convention held?", a: "At CAC Village, 14051 Stahley Road, Blue Ridge Summit, PA 17214 — six days of worship and teaching every July, onsite and online." },
  { q: "Can I join a CACNA member church online?", a: "Many member churches stream their services — check with your nearest zone. The Annual Convention itself streams on YouTube and Zoom." },
];

const BLANK_FIELDS = {
  name: "", email: "", phone: "", subject: "", country: "", message: "",
  visitType: "", address: "", city: "", state: "", zip: "",
};

export default function ContactPageClient() {
  const [fields, setFields] = useState(BLANK_FIELDS);
  const [groups, setGroups] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  function update(k: keyof typeof BLANK_FIELDS) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields(f => ({ ...f, [k]: e.target.value }));
  }

  function toggleGroup(g: string) {
    setGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
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
        {
          "Name": fields.name, "Email": fields.email, "Phone": fields.phone,
          "Country": fields.country, "Subject": fields.subject, "Message": fields.message,
          ...(isMembershipSubject ? {
            "Visit Type": fields.visitType,
            "Address": fields.address, "City/Town": fields.city,
            "State/Province": fields.state, "Zip/Post Code": fields.zip,
            "Groups": groups.join(", "),
          } : {}),
        },
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
    <main id="main-content">
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "112px clamp(20px,5vw,64px) 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -80, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,var(--blue),var(--red) 70%)", opacity: .1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Contact &amp; Visit</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,5vw,54px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: "12px 0", lineHeight: .98, textWrap: "balance" }}>
              We&apos;d love to <span style={{ color: "var(--red)" }}>hear from you.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
              Fill in the form below — whether it&apos;s a question, a prayer request, or you&apos;re looking for a CACNA member church near you.
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
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ ...labelStyle, marginBottom: 8 }}>What brings you here?</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {VISIT_TYPES.map(t => (
                          <button key={t.value} type="button" onClick={() => setFields(p => ({ ...p, visitType: t.value }))}
                            style={{ padding: "8px 15px", borderRadius: 999, fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", border: fields.visitType === t.value ? "none" : "1px solid var(--line)", background: fields.visitType === t.value ? "var(--red)" : "transparent", color: fields.visitType === t.value ? "#fff" : "var(--ink-soft)" }}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <label style={labelStyle}>Address <span style={{ fontWeight: 400, opacity: .6 }}>(optional)</span></label>
                      <input className="field-input" style={inputStyle} type="text" placeholder="123 Main Street" autoComplete="street-address" value={fields.address} onChange={update("address")} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={labelStyle}>City / Town</label>
                        <input className="field-input" style={inputStyle} type="text" placeholder="Atlanta" autoComplete="address-level2" value={fields.city} onChange={update("city")} />
                      </div>
                      <div>
                        <label style={labelStyle}>State / Province</label>
                        <input className="field-input" style={inputStyle} type="text" placeholder="GA" autoComplete="address-level1" value={fields.state} onChange={update("state")} />
                      </div>
                      <div>
                        <label style={labelStyle}>Zip / Post Code</label>
                        <input className="field-input" style={inputStyle} type="text" placeholder="30301" autoComplete="postal-code" value={fields.zip} onChange={update("zip")} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <p style={{ ...labelStyle, marginBottom: 8 }}>Groups / Ministries interested in <span style={{ fontWeight: 400, opacity: .6 }}>(optional)</span></p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {GROUPS.map(g => {
                          const active = groups.includes(g);
                          return (
                            <button key={g} type="button" onClick={() => toggleGroup(g)}
                              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", transition: "all .15s", border: active ? "none" : "1px solid var(--line)", background: active ? "var(--gold)" : "transparent", color: active ? "var(--ink)" : "var(--ink-soft)" }}>
                              {active && <span aria-hidden style={{ fontSize: 11 }}>✓</span>}
                              {g}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
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
                  style={{ padding: "13px 32px", borderRadius: 999, background: status === "loading" ? "var(--line)" : "linear-gradient(100deg,var(--blue),var(--red))", color: "#fff", fontWeight: 700, fontSize: 14.5, border: "none", cursor: status === "loading" ? "not-allowed" : "pointer", letterSpacing: ".3px" }}
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

      {/* Map + Finding Your Zone */}
      <section style={{ background: "var(--cream-2)", padding: "64px clamp(20px,5vw,64px)" }}>
        <div className="r2" style={{ maxWidth: 1100, margin: "0 auto", gap: 56 }}>
          <Reveal>
            <div style={{ height: 300, borderRadius: 20, overflow: "hidden", border: "1px solid var(--line)", marginBottom: 18, boxShadow: "0 10px 26px rgba(18,20,30,.06)" }}>
              <iframe title="Map to CAC Village, Blue Ridge Summit, PA" src="https://maps.google.com/maps?q=14051%20Stahley%20Road%20Blue%20Ridge%20Summit%20PA%2017214&z=13&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
            </div>
            <a href="https://maps.google.com/?q=14051+Stahley+Road+Blue+Ridge+Summit+PA+17214" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
              <MapPin size={16} strokeWidth={2} aria-hidden /> Get Directions to CAC Village →
            </a>
          </Reveal>
          <Reveal delay={140}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, color: "var(--ink)", margin: "0 0 24px" }}>Finding Your Zone</h2>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { num: "01", title: "Find your nearest zone", body: "CACNA is organized into 24 Zones & DCCs across the U.S., Canada, and South America — see the directory on our homepage." },
                { num: "02", title: "Reach out to the Superintendent", body: "Each zone has a Zonal Superintendent who can connect you with a member church near you." },
                { num: "03", title: "Visit a member church", body: "Every member church welcomes visitors — reach out ahead to confirm service times." },
                { num: "04", title: "Stay connected", body: "Fill out the form above with \"Find a Member Church\" as your subject, and join us each July at the Annual Convention." },
              ].map(s => (
                <li key={s.num} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--red)", flexShrink: 0, minWidth: 36, lineHeight: 1, marginTop: 2 }}>{s.num}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15.5, color: "var(--ink)", marginBottom: 4 }}>{s.title}</div>
                    <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "var(--cream)", padding: "64px clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0 }}>FAQ</h2>
          </Reveal>
          <FaqList />
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}

function FaqList() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <>
      {faqs.map((faq, i) => (
        <Reveal key={i} delay={i * 50}>
          <div style={{ borderBottom: "1px solid var(--line)" }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 15.5, fontWeight: 700, color: "var(--ink)", paddingRight: 24 }}>{faq.q}</span>
              <span style={{ color: "var(--red)", fontSize: 20, flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
            </button>
            {openFaq === i && <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7, padding: "0 0 18px", margin: 0 }}>{faq.a}</p>}
          </div>
        </Reveal>
      ))}
    </>
  );
}
