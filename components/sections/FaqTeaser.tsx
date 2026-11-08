import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FAQ_GROUPS, type FaqItem } from "@/lib/faq";
import "./home-mobile.css";
import "./home-refresh.css";

const TEASER_IDS = ["visitors", "find-a-church", "online-services"];

function teaserItems(): FaqItem[] {
  const all = FAQ_GROUPS.flatMap((g) => g.items);
  return TEASER_IDS.map((id) => all.find((item) => item.id === id)).filter((item): item is FaqItem => item !== undefined);
}

/** Three visitor questions from lib/faq.ts as native <details>, linking to /faq. */
export function FaqTeaser() {
  const items = teaserItems();

  return (
    <section aria-labelledby="faq-teaser-heading" className="hm-section" style={{ background: "var(--cream)", padding: "clamp(64px,8vw,110px) clamp(20px,5vw,64px) clamp(40px,5vw,64px)" }}>
      <div className="hm-faq-grid" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div>
          <h2 id="faq-teaser-heading" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px,4.6vw,60px)", letterSpacing: "-1.5px", lineHeight: 1, margin: "0 0 18px", textWrap: "balance" }}>
            New to CAC?
          </h2>
          <p style={{ fontSize: 16.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: "0 0 14px", maxWidth: 420 }}>
            A few answers for first-time visitors. More about what the church believes and how it is organized is on the FAQ page.
          </p>
          <Link href="/faq" className="hm-link hm-text-link" style={{ display: "inline-flex", alignItems: "center", gap: 7, minHeight: 44, fontWeight: 700, fontSize: 15, color: "var(--red)", textDecoration: "none" }}>
            All FAQs <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
          </Link>
        </div>

        <div style={{ borderTop: "1px solid var(--line)" }}>
          {items.map((item) => (
            <details key={item.id} className="hm-faq-item">
              <summary>{item.question}</summary>
              <div className="hm-faq-answer">
                {item.answer.map((block, i) =>
                  block.kind === "p" ? (
                    <p key={i}>{block.text}</p>
                  ) : (
                    <dl key={i}>
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
                  <p>
                    {item.local.text}{" "}
                    {item.local.links.map((l, i) => (
                      <span key={l.href}>
                        {i > 0 && " · "}
                        <Link href={l.href} className="hm-text-link" style={{ color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>
                          {l.label}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
