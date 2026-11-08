"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { submitLead, isValidEmail } from "@/lib/forms";
import { HONEYPOT_FIELD, TURNSTILE_FIELD } from "@/lib/spam";
import { TurnstileField, resetTurnstile } from "@/components/TurnstileField";
import { CONTACT_SUBJECTS as SUBJECTS } from "@/app/api/contact/fields";

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

// Ported from the Convention site's lib/content/contacts.ts during the
// Phase C content merge (2026-09) -- the three officers who actually field
// convention-specific questions, distinct from CACNA's own general contact
// line above. Chairman updated 2026-11-05: the Golden Jubilee brochure names
// Pastor Famojuro as the new Convention Chairman (Pastor Adenodi is the former
// chairman). The secretary seat is not listed until the new secretary is known.
const CONVENTION_CONTACTS = [
  { name: "Pastor Oluwagbemiga Famojuro, D.Min.", roleKey: "chairman", org: "C.A.C. FITA, Brooklyn, NY", phone: "917-709-1892", email: "cacnaconvention@gmail.com" },
  { name: "Pastor Joseph Olawale", roleKey: "generalInquiries", org: "CAC DFW Metroplex, Irving, TX", phone: "305-469-0346", email: "cacna@hotmail.com" },
] as const;

const faqs = [
  { q: "What is CACNA?", a: "Christ Apostolic Church North America is the regional body uniting CAC member churches across the United States, Canada, and South America, organized into 26 Zones & DCCs (District Church Councils), each led by a Zonal Superintendent." },
  { q: "Do all CACNA member churches share the same service times?", a: "No — each member church sets its own weekly schedule. Reach out to the Zonal Superintendent nearest you to find service times for a specific church." },
  { q: "Where is the CACNA Annual Convention held?", a: "At CAC Village, 14051 Stahley Road, Blue Ridge Summit, PA 17214 — six days of worship and teaching every July, onsite and online." },
  { q: "Can I join a CACNA member church online?", a: "Many member churches stream their services — check with your nearest zone. The Annual Convention itself streams on YouTube and Zoom." },
];

const BLANK_FIELDS = {
  name: "", email: "", phone: "", subject: "", country: "", message: "",
  visitType: "", address: "", city: "", state: "", zip: "",
};

export default function ContactPageClient() {
  const t = useTranslations("Contact");
  const [fields, setFields] = useState(BLANK_FIELDS);
  const [groups, setGroups] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [errField, setErrField] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

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
    // Show the message and move focus to the field it is about.
    const invalid = (id: string, msg: string) => {
      setErrMsg(msg);
      setErrField(id);
      document.getElementById(id)?.focus();
    };
    setErrField(null);
    if (!fields.name.trim()) return invalid("c-name", "Please enter your name.");
    if (!fields.email.trim()) return invalid("c-email", "Please enter your email address.");
    if (!isValidEmail(fields.email)) return invalid("c-email", "Please enter a valid email address.");
    if (isMembershipSubject && !fields.phone.trim()) return invalid("c-phone", "Please enter your phone number so we can reach you.");
    if (!fields.message.trim()) return invalid("c-message", "Please write a message.");
    setStatus("loading");
    const form = e.currentTarget as HTMLFormElement;
    const turnstileToken = new FormData(form).get(TURNSTILE_FIELD);
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
          [HONEYPOT_FIELD]: honeypot,
        },
        `Contact — ${fields.subject || "General"}`,
        typeof turnstileToken === "string" ? turnstileToken : "",
      );
      setStatus("success");
    } catch {
      resetTurnstile(form);
      setStatus("error");
      setErrMsg("Something went wrong. Please try again or email us directly.");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    padding: "12px 14px", minHeight: 48, borderRadius: 12,
    border: "1.5px solid var(--line)", background: "var(--cream)",
    fontSize: 16, color: "var(--ink)",
    fontFamily: "var(--font-body)",
  };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 6 };

  return (
    <main id="main-content">
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "calc(var(--bar-h, 0px) + 100px) clamp(20px,5vw,64px) 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -80, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,var(--blue),var(--red) 70%)", opacity: .1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
                    <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,5vw,54px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: "0 0 12px", lineHeight: 1.02, textWrap: "balance" }}>
              We&apos;d love to <span style={{ color: "var(--red)" }}>hear from you.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
              Send a question or prayer request, or ask for help finding a CACNA member church near you.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 18 }}>
              {[{ href: "tel:+13054690346", Icon: Phone, text: "Call" }, { href: "mailto:info@cacna.org", Icon: Mail, text: "Email" }].map(({ href, Icon, text }) => (
                <a key={text} href={href} style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, padding: "0 20px", borderRadius: 999, border: "1.5px solid var(--line)", background: "var(--paper)", color: "var(--ink)", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                  <Icon size={17} aria-hidden /> {text}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ background: "var(--cream-2)", padding: "24px clamp(16px,5vw,64px) 48px" }}>
        <Reveal>
          <div style={{ maxWidth: 720, margin: "0 auto", background: "var(--paper)", borderRadius: 20, border: "1px solid var(--line)", padding: "clamp(20px,3.5vw,40px)", boxShadow: "0 16px 48px rgba(18,20,30,.06)" }}>
            {status === "success" ? (
              <div role="status" style={{ textAlign: "center", padding: "28px 0" }}>
                <CheckCircle2 size={44} strokeWidth={2} aria-hidden style={{ color: "var(--red)", marginBottom: 14 }} />
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--ink)", margin: "0 0 10px" }}>Message received</h2>
                <p style={{ color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  Thank you for reaching out. Someone from our team will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot: bots fill every input, people never see this one. */}
                <input type="text" name={HONEYPOT_FIELD} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(19px,2.5vw,26px)", color: "var(--ink)", margin: "0 0 20px", letterSpacing: "-0.4px" }}>
                  Send us a message
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label htmlFor="c-name" style={labelStyle}>Your Name <span style={{ color: "var(--red)" }}>*</span></label>
                    <input className="field-input" style={inputStyle} id="c-name" aria-invalid={errField === "c-name" || undefined} aria-describedby={errField === "c-name" ? "c-error" : undefined} type="text" placeholder="Jane Smith" enterKeyHint="next" value={fields.name} onChange={update("name")} autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="c-email" style={labelStyle}>Email Address <span style={{ color: "var(--red)" }}>*</span></label>
                    <input className="field-input" style={inputStyle} id="c-email" aria-invalid={errField === "c-email" || undefined} aria-describedby={errField === "c-email" ? "c-error" : undefined} type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="you@example.com" enterKeyHint="next" value={fields.email} onChange={update("email")} autoComplete="email" />
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label htmlFor="c-subject" style={labelStyle}>Subject</label>
                  <select id="c-subject" className="field-input" style={{ ...inputStyle, cursor: "pointer" }} value={fields.subject} onChange={update("subject")}>
                    <option value="">Select a topic…</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMembershipSubject ? "repeat(auto-fit,minmax(min(100%,200px),1fr))" : "1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label htmlFor="c-phone" style={labelStyle}>
                      Phone{" "}
                      {isMembershipSubject
                        ? <span style={{ color: "var(--red)" }}>*</span>
                        : <span style={{ fontWeight: 400, opacity: .6 }}>(optional)</span>}
                    </label>
                    <input className="field-input" style={inputStyle} id="c-phone" aria-invalid={errField === "c-phone" || undefined} aria-describedby={errField === "c-phone" ? "c-error" : undefined} type="tel" inputMode="tel" placeholder="+1 (443) 000-0000" value={fields.phone} onChange={update("phone")} autoComplete="tel" />
                  </div>
                  {isMembershipSubject && (
                    <div>
                      <label htmlFor="c-country" style={labelStyle}>Country <span style={{ fontWeight: 400, opacity: .6 }}>(optional)</span></label>
                      <select id="c-country" className="field-input" style={{ ...inputStyle, cursor: "pointer" }} value={fields.country} onChange={update("country")} autoComplete="country-name">
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
                          <button key={t.value} type="button" aria-pressed={fields.visitType === t.value} onClick={() => setFields(p => ({ ...p, visitType: t.value }))}
                            style={{ minHeight: 44, padding: "0 16px", borderRadius: 999, fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", border: fields.visitType === t.value ? "none" : "1px solid var(--line)", background: fields.visitType === t.value ? "var(--red)" : "transparent", color: fields.visitType === t.value ? "#fff" : "var(--ink-soft)" }}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <label htmlFor="c-address" style={labelStyle}>Address <span style={{ fontWeight: 400, opacity: .6 }}>(optional)</span></label>
                      <input className="field-input" style={inputStyle} id="c-address" type="text" placeholder="123 Main Street" autoComplete="street-address" value={fields.address} onChange={update("address")} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,130px),1fr))", gap: 12, marginBottom: 12 }}>
                      <div>
                        <label htmlFor="c-city" style={labelStyle}>City / Town</label>
                        <input className="field-input" style={inputStyle} id="c-city" type="text" placeholder="Atlanta" autoComplete="address-level2" value={fields.city} onChange={update("city")} />
                      </div>
                      <div>
                        <label htmlFor="c-state" style={labelStyle}>State / Province</label>
                        <input className="field-input" style={inputStyle} id="c-state" type="text" placeholder="GA" autoComplete="address-level1" value={fields.state} onChange={update("state")} />
                      </div>
                      <div>
                        <label htmlFor="c-zip" style={labelStyle}>Zip / Post Code</label>
                        <input className="field-input" style={inputStyle} id="c-zip" type="text" placeholder="30301" autoComplete="postal-code" value={fields.zip} onChange={update("zip")} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <p style={{ ...labelStyle, marginBottom: 8 }}>Groups / Ministries interested in <span style={{ fontWeight: 400, opacity: .6 }}>(optional)</span></p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {GROUPS.map(g => {
                          const active = groups.includes(g);
                          return (
                            <button key={g} type="button" aria-pressed={active} onClick={() => toggleGroup(g)}
                              style={{ display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44, padding: "0 14px", borderRadius: 999, fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", transition: "all .15s", border: active ? "none" : "1px solid var(--line)", background: active ? "var(--gold)" : "transparent", color: active ? "var(--ink)" : "var(--ink-soft)" }}>
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
                  <label htmlFor="c-message" style={labelStyle}>Message <span style={{ color: "var(--red)" }}>*</span></label>
                  <textarea id="c-message" aria-invalid={errField === "c-message" || undefined} aria-describedby={errField === "c-message" ? "c-error" : undefined} className="field-input" style={{ ...inputStyle, minHeight: 120, resize: "vertical", lineHeight: 1.6 }} placeholder="How can we help you?" value={fields.message} onChange={update("message")} required />
                </div>

                <TurnstileField />

                {errMsg && (
                  <p id="c-error" role="alert" style={{ color: "var(--red)", fontSize: 15, fontWeight: 600, margin: "0 0 14px" }}>{errMsg}</p>
                )}

                <div style={{ position: "sticky", bottom: 0, margin: "0 calc(-1 * clamp(20px,3.5vw,40px)) calc(-1 * clamp(20px,3.5vw,40px))", padding: "12px clamp(20px,3.5vw,40px)", background: "linear-gradient(to top, var(--paper) 70%, transparent)", borderRadius: "0 0 20px 20px" }}>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="press"
                  style={{ width: "100%", minHeight: 52, padding: "0 32px", borderRadius: 999, background: status === "loading" ? "var(--line)" : "linear-gradient(100deg,var(--blue),var(--red))", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: status === "loading" ? "not-allowed" : "pointer" }}
                >
                  {status === "loading" ? "Sending…" : "Send Message"}
                </button>
                </div>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 14 }}>
            {[
              { icon: MapPin, title: "Address", lines: [{ text: "14051 Stahley Road", href: "https://maps.google.com/?q=14051+Stahley+Road+Blue+Ridge+Summit+PA+17214" }, { text: "Blue Ridge Summit, PA 17214", href: "https://maps.google.com/?q=14051+Stahley+Road+Blue+Ridge+Summit+PA+17214" }] },
              { icon: Phone, title: "Phone", lines: [{ text: "(305) 469-0346", href: "tel:+13054690346" }] },
              { icon: Mail, title: "Email", lines: [{ text: "info@cacna.org", href: "mailto:info@cacna.org" }, { text: "cacna@hotmail.com", href: "mailto:cacna@hotmail.com" }] },
              { icon: Clock, title: "Annual Convention", lines: [{ text: "Six days in July", href: undefined }, { text: "CAC Village, PA", href: undefined }] },
            ].map((card) => (
              <Reveal key={card.title}>
                <div className="card-lift" style={{ background: "var(--paper)", borderRadius: 18, padding: "22px 20px", border: "1px solid var(--line)", boxShadow: "0 8px 22px rgba(18,20,30,.05)" }}>
                  <IconBadge icon={card.icon} style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--red)", marginBottom: 6 }}>{card.title}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)", lineHeight: 1.6 }}>
                    {card.lines.map((l, i) => l.href ? (
                      <a key={i} href={l.href} style={{ display: "block", minHeight: 44, lineHeight: "44px", color: "var(--ink)", textDecoration: "none" }}>{l.text}</a>
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

      {/* Convention Committee leadership */}
      <section id="convention-committee" style={{ background: "var(--cream-2)", padding: "56px clamp(20px,5vw,64px)", scrollMarginTop: 90 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,34px)", letterSpacing: "-0.8px", color: "var(--ink)", margin: 0 }}>Convention Committee</h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6, margin: "10px auto 0", maxWidth: 560 }}>
              For questions specific to the Annual Convention — registration, schedule, or logistics — reach the committee directly.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 14 }}>
            {CONVENTION_CONTACTS.map((c) => (
              <Reveal key={c.name}>
                <div style={{ background: "var(--paper)", borderRadius: 18, padding: "20px 20px 22px", border: "1px solid var(--line)" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--red)", marginBottom: 6 }}>{t(c.roleKey)}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink)", lineHeight: 1.3, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 8 }}>{c.org}</div>
                  <a href={`tel:${c.phone.replace(/[^0-9+]/g, "")}`} style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--ink)", textDecoration: "none", lineHeight: "44px" }}>{c.phone}</a>
                  <a href={`mailto:${c.email}`} style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--ink)", textDecoration: "none", lineHeight: "44px", overflowWrap: "anywhere" }}>{c.email}</a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Finding Your Zone */}
      <section style={{ background: "var(--cream-2)", padding: "64px clamp(20px,5vw,64px)" }}>
        <div className="r2" style={{ maxWidth: 1100, margin: "0 auto", gap: 56 }}>
          <Reveal>
            <div style={{ height: "clamp(220px,60vw,300px)", borderRadius: 20, overflow: "hidden", border: "1px solid var(--line)", marginBottom: 18, boxShadow: "0 10px 26px rgba(18,20,30,.06)" }}>
              <iframe title="Map to CAC Village, Blue Ridge Summit, PA" src="https://maps.google.com/maps?q=14051%20Stahley%20Road%20Blue%20Ridge%20Summit%20PA%2017214&z=13&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
            </div>
            <a href="https://maps.google.com/?q=14051+Stahley+Road+Blue+Ridge+Summit+PA+17214" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44, fontSize: 15, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
              <MapPin size={16} strokeWidth={2} aria-hidden /> Get Directions to CAC Village →
            </a>
          </Reveal>
          <Reveal delay={140}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, color: "var(--ink)", margin: "0 0 24px" }}>Finding Your Zone</h2>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { num: "01", title: "Find your nearest zone", body: "CACNA is organized into 26 Zones & DCCs across the U.S., Canada, and South America — see the directory on our homepage." },
                { num: "02", title: "Reach out to the Superintendent", body: "Each zone has a Zonal Superintendent who can connect you with a member church near you." },
                { num: "03", title: "Visit a member church", body: "Every member church welcomes visitors — reach out ahead to confirm service times." },
                { num: "04", title: "Stay connected", body: "Fill out the form above with \"Find a Member Church\" as your subject, and join us each July at the Annual Convention." },
              ].map(s => (
                <li key={s.num} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--red)", flexShrink: 0, minWidth: 36, lineHeight: 1, marginTop: 2 }}>{s.num}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15.5, color: "var(--ink)", marginBottom: 4 }}>{s.title}</div>
                    <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{s.body}</p>
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
            <button aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", minHeight: 52, fontFamily: "inherit", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 15.5, fontWeight: 700, color: "var(--ink)", paddingRight: 24 }}>{faq.q}</span>
              <span style={{ color: "var(--red)", fontSize: 20, flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
            </button>
            {openFaq === i && <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7, padding: "0 0 18px", margin: 0 }}>{faq.a}</p>}
          </div>
        </Reveal>
      ))}
    </>
  );
}
