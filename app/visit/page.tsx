"use client";
import { useState } from "react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { MapPin, Clock, Phone, PartyPopper } from "lucide-react";
import { submitLead, isValidEmail } from "@/lib/forms";

const faqs = [
  { q: "What should I wear?", a: "Come as you are. Some members dress formally, others casually — all are equally welcome." },
  { q: "How long is the service?", a: "Sunday services typically run about 2 hours (10:30 AM – 12:30 PM ET)." },
  { q: "Do you have childcare?", a: "Yes — we have a dedicated Kids Ministry for children during Sunday service." },
  { q: "Can I join online?", a: "Absolutely. All Sunday services are streamed live. Wednesday and Friday services are online-only." },
  { q: "Is Wakati Itusile for non-Yoruba speakers?", a: "It's primarily in Yoruba, our mother tongue. Even without the language, the worship and the presence of God carry across." },
];

const VISIT_TYPES = [
  { value: "First-time visitor", label: "First-time visitor" },
  { value: "Returning visitor",  label: "Returning visitor" },
  { value: "New member",         label: "Looking to join / become a member" },
];

const GROUPS = [
  "Sisters Fellowship",
  "Brothers Fellowship",
  "Youth Fellowship",
  "Choir / Worship Team",
  "Ushers",
  "Prayer Team",
  "Evangelism Team",
];

const COUNTRIES = [
  "United States", "Nigeria", "United Kingdom", "Canada",
  "Ghana", "Jamaica", "Trinidad & Tobago", "Other",
];

const BLANK = {
  first: "", last: "", email: "", phone: "",
  address: "", city: "", state: "", zip: "", country: "United States",
  visitType: "",
};

export default function VisitPage() {
  const [openFaq,    setOpenFaq]    = useState<number | null>(null);
  const [submitted,  setSubmitted]  = useState(false);
  const [form,       setForm]       = useState(BLANK);
  const [groups,     setGroups]     = useState<string[]>([]);
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [loading,    setLoading]    = useState(false);
  const [submitError,setSubmitError]= useState("");

  function set(k: keyof typeof BLANK) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(p => ({ ...p, [k]: e.target.value }));
      setErrors(p => { const n = { ...p }; delete n[k]; return n; });
    };
  }

  function toggleGroup(g: string) {
    setGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.first.trim()) next.first = "Please enter your first name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!isValidEmail(form.email)) next.email = "Please enter a valid email.";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(["first","email"].find(k => next[k]) ?? "first")?.focus();
      return;
    }
    setSubmitError(""); setLoading(true);
    try {
      await submitLead({
        "First Name":    form.first,
        "Last Name":     form.last,
        "Email":         form.email,
        "Phone":         form.phone,
        "Visit Type":    form.visitType,
        "Address":       form.address,
        "City/Town":     form.city,
        "State/Province":form.state,
        "Zip/Post Code": form.zip,
        "Country":       form.country,
        "Groups":        groups.join(", "),
      }, "Connect Card");
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again, or call us at (443) 272-6794.");
    } finally { setLoading(false); }
  }

  const inputBase: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,247,239,.07)",
    border: "1px solid rgba(255,247,239,.16)",
    borderRadius: 14, padding: "13px 18px",
    fontSize: 15, color: "var(--cream)",
    fontFamily: "inherit", outline: "none",
  };
  const labelBase: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 700,
    color: "rgba(255,247,239,.45)", letterSpacing: "1px",
    textTransform: "uppercase", marginBottom: 8,
  };

  return (
    <main>
      <Nav />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "140px clamp(20px,5vw,64px) 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -80, right: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#F15F22,#D62828 70%)", opacity: .1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>Plan Your Visit</span></Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(46px,6.5vw,90px)", letterSpacing: "-2px", color: "var(--ink)", margin: "16px 0", lineHeight: .92 }}>
              We&apos;re ready<br />
              <span style={{ background: "linear-gradient(100deg,#F15F22,#D62828)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>for you.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
              Your first visit sets the tone. Here&apos;s everything you need — and a connect card so we can welcome you properly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Info cards */}
      <section style={{ background: "var(--cream-2)", padding: "80px clamp(20px,5vw,64px)" }}>
        <div className="r3" style={{ maxWidth: 1100, margin: "0 auto", gap: 18 }}>
          {[
            { icon: MapPin, title: "Address", value: "10710 Marriottsville Rd\nRandallstown, MD 21133", link: "https://maps.google.com/?q=10710+Marriottsville+Rd+Randallstown+MD+21133" },
            { icon: Clock,  title: "Sunday Service", value: "Sunday School 9:25 AM\nService 10:30 AM ET", link: null },
            { icon: Phone,  title: "Phone", value: "+1 443-272-6794\n+1 410-701-8315", link: "tel:+14432726794" },
          ].map((card, i) => (
            <Reveal key={card.title} delay={i * 80}>
              <div style={{ background: "var(--paper)", borderRadius: 20, padding: "28px 24px", border: "1px solid var(--line)", boxShadow: "0 8px 22px rgba(27,19,14,.05)" }}>
                <IconBadge icon={card.icon} style={{ marginBottom: 16 }} />
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>{card.title}</div>
                {card.link
                  ? <a href={card.link} style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", textDecoration: "none", lineHeight: 1.6, display: "block", whiteSpace: "pre-line" }}>{card.value}</a>
                  : <p style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", margin: 0, lineHeight: 1.6, whiteSpace: "pre-line" }}>{card.value}</p>
                }
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Map + First Sunday */}
      <section style={{ background: "var(--cream)", padding: "80px clamp(20px,5vw,64px)" }}>
        <div className="r2" style={{ maxWidth: 1100, margin: "0 auto", gap: 60 }}>
          <Reveal>
            <div style={{ height: 320, borderRadius: 20, overflow: "hidden", border: "1px solid var(--line)", marginBottom: 20, boxShadow: "0 10px 26px rgba(27,19,14,.06)" }}>
              <iframe title="Map to CAC Salvation Center" src="https://maps.google.com/maps?q=10710%20Marriottsville%20Rd%20Randallstown%20MD%2021133&z=15&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
            </div>
            <a href="https://maps.google.com/?q=10710+Marriottsville+Rd+Randallstown+MD+21133" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
              <MapPin size={16} strokeWidth={2} aria-hidden /> Get Directions →
            </a>
          </Reveal>
          <Reveal delay={140}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "var(--ink)", margin: "0 0 28px" }}>Your First Sunday</h2>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 22 }}>
              {[
                { num: "01", title: "Pick a service", body: "Sunday at 10:30 AM is our main gathering — perfect for a first visit." },
                { num: "02", title: "Arrive & be welcomed", body: "Our welcome team greets you at the door. Parking is available. Bring nothing but yourself." },
                { num: "03", title: "Experience worship", body: "Spirit-led worship, biblical teaching, and a warm, authentic community." },
                { num: "04", title: "Connect after service", body: "Stay for coffee and conversation. Fill out the connect card below — no pressure." },
              ].map(s => (
                <li key={s.num} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--red)", flexShrink: 0, minWidth: 40, lineHeight: 1, marginTop: 2 }}>{s.num}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)", marginBottom: 4 }}>{s.title}</div>
                    <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0 }}>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "var(--cream-2)", padding: "80px clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0 }}>FAQ</h2>
          </Reveal>
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 50}>
              <div style={{ borderBottom: "1px solid var(--line)" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", paddingRight: 24 }}>{faq.q}</span>
                  <span style={{ color: "var(--red)", fontSize: 20, flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
                </button>
                {openFaq === i && <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, padding: "0 0 20px", margin: 0 }}>{faq.a}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Connect Card */}
      <section style={{ background: "var(--ink)", padding: "clamp(60px,8vw,100px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)" }}>Connect Card</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-1px", color: "#fff", margin: "12px 0 14px" }}>Let us know you&apos;re here</h2>
            <p style={{ fontSize: 16, color: "rgba(255,247,239,.6)", margin: 0 }}>Whether it&apos;s your first visit or you&apos;re ready to join — we&apos;d love to connect with you.</p>
          </Reveal>

          <Reveal delay={80}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "56px 32px", background: "rgba(255,247,239,.06)", borderRadius: 24, border: "1px solid rgba(255,247,239,.12)" }}>
                <PartyPopper size={48} strokeWidth={1.75} color="var(--gold)" aria-hidden style={{ margin: "0 auto 18px" }} />
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "#fff", margin: "0 0 10px" }}>Welcome to the family!</p>
                <p style={{ fontSize: 15, color: "rgba(255,247,239,.6)", margin: 0 }}>We&apos;ll be in touch soon. See you Sunday.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Visit type */}
                <div>
                  <p style={{ ...labelBase, marginBottom: 12 }}>What brings you here?</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {VISIT_TYPES.map(t => (
                      <button key={t.value} type="button" onClick={() => setForm(p => ({ ...p, visitType: t.value }))}
                        style={{ padding: "10px 18px", borderRadius: 999, fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", border: form.visitType === t.value ? "none" : "1px solid rgba(255,247,239,.2)", background: form.visitType === t.value ? "var(--red)" : "transparent", color: form.visitType === t.value ? "#fff" : "rgba(255,247,239,.7)" }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name + contact */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
                  {[
                    { id: "first", label: "First Name *", placeholder: "Jane", type: "text", autoComplete: "given-name", required: true },
                    { id: "last",  label: "Last Name",    placeholder: "Smith", type: "text", autoComplete: "family-name", required: false },
                  ].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id} style={labelBase}>{f.label}</label>
                      <input id={f.id} type={f.type} placeholder={f.placeholder} autoComplete={f.autoComplete}
                        value={(form as Record<string,string>)[f.id]} onChange={set(f.id as keyof typeof BLANK)}
                        style={{ ...inputBase, borderColor: errors[f.id] ? "#ff6b6b" : undefined }} />
                      {errors[f.id] && <span role="alert" style={{ display: "block", fontSize: 13, color: "#ff8a8a", marginTop: 6 }}>{errors[f.id]}</span>}
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
                  {[
                    { id: "email", label: "Email *",        placeholder: "jane@example.com", type: "email", autoComplete: "email" },
                    { id: "phone", label: "Phone (optional)",placeholder: "+1 (443) 000-0000", type: "tel",   autoComplete: "tel" },
                  ].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id} style={labelBase}>{f.label}</label>
                      <input id={f.id} type={f.type} placeholder={f.placeholder} autoComplete={f.autoComplete}
                        value={(form as Record<string,string>)[f.id]} onChange={set(f.id as keyof typeof BLANK)}
                        style={{ ...inputBase, borderColor: errors[f.id] ? "#ff6b6b" : undefined }} />
                      {errors[f.id] && <span role="alert" style={{ fontSize: 13, color: "#ff8a8a", marginTop: 6, display: "block" }}>{errors[f.id]}</span>}
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" style={labelBase}>Address <span style={{ fontWeight: 400, opacity: .5 }}>(optional)</span></label>
                  <input id="address" type="text" placeholder="123 Main Street" autoComplete="street-address"
                    value={form.address} onChange={set("address")} style={inputBase} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 16 }}>
                  {[
                    { id: "city",  label: "City / Town",   placeholder: "Randallstown", autoComplete: "address-level2" },
                    { id: "state", label: "State / Province", placeholder: "MD",         autoComplete: "address-level1" },
                    { id: "zip",   label: "Zip / Post Code", placeholder: "21133",        autoComplete: "postal-code" },
                  ].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id} style={labelBase}>{f.label}</label>
                      <input id={f.id} type="text" placeholder={f.placeholder} autoComplete={f.autoComplete}
                        value={(form as Record<string,string>)[f.id]} onChange={set(f.id as keyof typeof BLANK)} style={inputBase} />
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="country" style={labelBase}>Country</label>
                  <select id="country" autoComplete="country-name" value={form.country} onChange={set("country")}
                    style={{ ...inputBase, cursor: "pointer" }}>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Groups */}
                <div>
                  <p style={{ ...labelBase, marginBottom: 14 }}>Groups / Ministries interested in <span style={{ fontWeight: 400, opacity: .5 }}>(optional)</span></p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {GROUPS.map(g => {
                      const active = groups.includes(g);
                      return (
                        <button key={g} type="button" onClick={() => toggleGroup(g)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 999, fontSize: 13.5, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", transition: "all .15s", border: active ? "none" : "1px solid rgba(255,247,239,.2)", background: active ? "var(--gold)" : "transparent", color: active ? "#1B130E" : "rgba(255,247,239,.7)" }}>
                          {active && <span aria-hidden style={{ fontSize: 12 }}>✓</span>}
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {submitError && <p role="alert" style={{ fontSize: 14, fontWeight: 600, color: "#ff8a8a", margin: 0 }}>{submitError}</p>}

                <button type="submit" disabled={loading}
                  style={{ padding: "18px", borderRadius: 999, background: "var(--red)", color: "#fff", fontWeight: 800, fontSize: 16, border: "none", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.6 : 1, boxShadow: "0 14px 30px rgba(214,40,40,.4)" }}>
                  {loading ? "Sending…" : "Submit Connect Card →"}
                </button>
                <p style={{ fontSize: 12.5, color: "rgba(255,247,239,.35)", textAlign: "center", margin: "-10px 0 0" }}>We&apos;ll only use your details to welcome you. No spam, ever.</p>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
