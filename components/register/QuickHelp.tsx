import Link from "next/link";
import { LifeBuoy, Mail, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

// "Quick help" on the registration pages: how to register, who uses which
// form, paying, and where the emails go. It is plain server-rendered content
// (native <details>, no JS) so it works before the form has hydrated.
// Wording rule: this is support on the registration and payment process.

const TIPS: { q: string; a: string }[] = [
  {
    q: "How do I register?",
    a: "Fill in the form on this page: add each person coming, enter your contact details, choose how you will pay, and submit. Adults 30 and over use the main form; children and young adults (under 30) use the Youth form. One person can register a whole family or group.",
  },
  {
    q: "I don't know my DCC or zone",
    a: "That is fine. Enter your church name instead and leave DCC / Zone blank. If you are not sure which church name to use, ask your pastor or youth leader, or write to us and we will help.",
  },
  {
    q: "Where is my confirmation email?",
    a: "It arrives within a few minutes at the email address you entered, with your check-in codes. Check your spam or promotions folder, and make sure the address was typed correctly. If it still has not come, contact us with the name you registered under and we will resend it.",
  },
  {
    q: "How do I pay by Zelle?",
    a: "Choose Zelle on the form, then send the amount to the Zelle email shown under Payment options. Put the reference from your confirmation email in the Zelle memo exactly as shown. That is how we match your payment to your registration.",
  },
  {
    q: "My card payment didn't go through",
    a: "Check the card number, expiry date and billing ZIP, then try again, or try a different card. You can also switch to Zelle. If the page stays stuck or you are unsure whether a payment went through, don't pay again: contact us and we will look it up for you.",
  },
  {
    q: "I want to change a detail on my registration",
    a: "Write to us with the name you registered under and what needs to change (a spelling, a meal choice, an email address). We will update it for you.",
  },
];

export function QuickHelp({ id = "quick-help" }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} style={{ marginTop: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <span
          aria-hidden
          style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(200,30,58,.1)", color: "var(--red)", display: "grid", placeItems: "center", flexShrink: 0 }}
        >
          <LifeBuoy size={22} strokeWidth={2.2} />
        </span>
        <h2 id={`${id}-title`} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,28px)", color: "var(--ink)", margin: 0, lineHeight: 1.15 }}>
          Quick help
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {TIPS.map((tip) => (
          <details key={tip.q} className="quick-help-item">
            <summary>{tip.q}</summary>
            <p>{tip.a}</p>
          </details>
        ))}
      </div>
      <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: "16px 0 10px" }}>
        Still stuck? We will walk you through the registration or the payment, step by step.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <a className="quick-help-link" href={`mailto:${SITE.email}?subject=Convention%20registration%20help`}>
          <Mail size={18} aria-hidden /> {SITE.email}
        </a>
        <a className="quick-help-link" href={`tel:${SITE.telephone}`}>
          <Phone size={18} aria-hidden /> Call us
        </a>
        <Link className="quick-help-link" href="/contact">Contact page</Link>
      </div>
    </section>
  );
}
