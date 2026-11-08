import "@/components/about-people-mobile.css";
import "./faq.css";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { FAQ_GROUPS, FAQ_SOURCE_URL, faqJsonLd } from "@/lib/faq";
import { FaqHashOpener } from "./FaqHashOpener";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "FAQs — Christ Apostolic Church North America (CACNA)",
    description:
      "Answers to common questions about Christ Apostolic Church: its origin and motto, divine healing and the Holy Spirit, membership, water baptism, what to wear, and online services.",
    alternates: { canonical: `${SITE_URL}/faq` },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content" className="ap-main">
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()).replace(/</g, "\\u003c") }} />

      {/* Hero */}
      <section style={{ background: "var(--cream)", padding: "140px clamp(20px,5vw,64px) 70px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(42px,6vw,78px)", letterSpacing: "-0.03em", color: "var(--ink)", margin: "16px 0", lineHeight: 0.96, textWrap: "balance" }}>
              Frequently asked questions.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "var(--ink-soft)", lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
              Where Christ Apostolic Church came from, what it believes, and how to join and worship with us.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <p style={{ fontSize: 14.5, color: "var(--ink-soft)", margin: "20px 0 0" }}>
              Adapted from the FAQs at{" "}
              <a href={FAQ_SOURCE_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>
                cacworld.org
              </a>
              , the website of Christ Apostolic Church Nigeria and Overseas.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Questions. Not wrapped in Reveal: the accordion must stay visible and usable without JS. */}
      <section style={{ background: "var(--paper)", padding: "clamp(40px,5vw,72px) clamp(20px,5vw,64px) clamp(72px,9vw,110px)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(40px,5vw,56px)" }}>
          {FAQ_GROUPS.map((group, gi) => (
            <div key={group.title}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,3vw,34px)", letterSpacing: "-.6px", color: "var(--ink)", margin: "0 0 8px", lineHeight: 1.1 }}>
                {group.title}
              </h2>
              {group.items.map((item, ii) => (
                <details key={item.id} id={item.id} className="faq-item" open={gi === 0 && ii === 0}>
                  <summary>{item.question}</summary>
                  <div className="faq-answer">
                    {item.answer.map((block, bi) =>
                      block.kind === "p" ? (
                        <p key={bi}>{block.text}</p>
                      ) : (
                        <dl key={bi}>
                          {block.items.map((entry) => (
                            <div key={entry.term}>
                              <dt>{entry.term}</dt>
                              <dd>{entry.text}</dd>
                            </div>
                          ))}
                        </dl>
                      )
                    )}
                    {item.local && (
                      <p className="faq-local">
                        {item.local.text}{" "}
                        {item.local.links.map((l, li) => (
                          <span key={l.href}>
                            {li > 0 && " · "}
                            <Link href={l.href}>{l.label} →</Link>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--ink)", padding: "80px clamp(20px,5vw,64px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,4.5vw,52px)", letterSpacing: "-1.2px", color: "var(--cream)", margin: "0 0 16px", lineHeight: 0.98 }}>
            Still have a question?
          </h2>
          <p style={{ fontSize: 16.5, color: "rgba(245,246,250,.6)", margin: "0 0 32px" }}>Reach the CACNA team, or find a member church near you.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 30px rgba(200,30,58,.4)" }}>Contact us →</Link>
            <Link href="/zones" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(245,246,250,.1)", color: "var(--cream)", fontWeight: 700, fontSize: 16, padding: "17px 30px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,246,250,.2)" }}>Find a Zone</Link>
          </div>
        </Reveal>
      </section>

      <FaqHashOpener />
      <FooterExperience />
    </main>
  );
}
