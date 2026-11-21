import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight, ClipboardList, HandHeart, HeartHandshake, Mail, Newspaper, ShoppingBag, Sparkles, Ticket, type LucideIcon,
} from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { FORM_CATEGORIES, getSiteForms } from "@/lib/siteForms";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "All Forms — Christ Apostolic Church North America (CACNA)",
    description:
      "Every form on the CACNA website in one place: contact us, newsletter, convention and youth registration, serve as a volunteer, give, manage a recurring gift, and the convention store.",
    alternates: { canonical: `${SITE_URL}/forms` },
  };
}

const FORM_ICONS: Record<string, LucideIcon> = {
  contact: Mail,
  newsletter: Newspaper,
  registration: Ticket,
  "youth-registration": Sparkles,
  serve: HandHeart,
  giving: HeartHandshake,
  "cancel-giving": ClipboardList,
  store: ShoppingBag,
};

const SECTION_PAD = "clamp(48px,6vw,80px) clamp(20px,5vw,64px)";
const h2Style = { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3.2vw,34px)", letterSpacing: "-1px", color: "var(--ink)", margin: 0, lineHeight: 1.05 } as const;

export default async function FormsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const forms = getSiteForms();

  return (
    <main id="main-content">
      <Nav />

      <section style={{ background: "var(--cream)", padding: "calc(var(--bar-h, 0px) + 100px) clamp(20px,5vw,64px) clamp(32px,4vw,52px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", bottom: -80, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,var(--blue),var(--red) 70%)", opacity: .1, filter: "blur(6px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px,5.4vw,58px)", letterSpacing: "-1.5px", color: "var(--ink)", margin: "0 0 14px", lineHeight: 1.02, textWrap: "balance" }}>
              Every <span style={{ color: "var(--red)" }}>form,</span> in one place.
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p style={{ fontSize: "clamp(16px,1.7vw,18px)", color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 540, margin: "0 auto" }}>
              Looking to register, volunteer, give or just get in touch? Find the right form below. Not sure which one you need? <Link href="/contact" style={{ color: "var(--red)", fontWeight: 700 }}>Send us a message</Link> and we&apos;ll point you there.
            </p>
          </Reveal>
        </div>
      </section>

      {FORM_CATEGORIES.map((category, ci) => {
        const group = forms.filter((f) => f.category === category);
        if (group.length === 0) return null;
        const headingId = `forms-${ci}`;
        return (
          <section key={category} aria-labelledby={headingId} style={{ background: ci % 2 === 0 ? "var(--paper)" : "var(--cream)", padding: SECTION_PAD }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <Reveal style={{ marginBottom: 24 }}>
                <h2 id={headingId} style={h2Style}>{category}</h2>
              </Reveal>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))", gap: 14 }}>
                {group.map((form, i) => (
                  <li key={form.id} style={{ display: "flex" }}>
                    <Reveal delay={(i % 3) * 60} style={{ flex: 1, display: "flex" }}>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: ci % 2 === 0 ? "var(--cream)" : "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "22px 22px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                          <IconBadge icon={FORM_ICONS[form.id] ?? ClipboardList} size={44} iconSize={21} bg={ci % 2 === 0 ? "var(--paper)" : "var(--cream-2)"} />
                          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", margin: 0, lineHeight: 1.2 }}>{form.name}</h3>
                        </div>
                        <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6, margin: "0 0 10px" }}>{form.purpose}</p>
                        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: "0 0 16px" }}>
                          <strong style={{ color: "var(--ink)" }}>For:</strong> {form.audience}
                        </p>
                        <div style={{ marginTop: "auto" }}>
                          {form.href ? (
                            <Link href={form.href} className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, color: "var(--red)", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                              {form.cta} <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
                            </Link>
                          ) : (
                            <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.55, margin: 0, paddingTop: 12, borderTop: "1px solid var(--line)" }}>{form.foundAt}</p>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <FooterExperience />
    </main>
  );
}
