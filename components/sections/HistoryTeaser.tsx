import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import "./home-mobile.css";
import "./home-refresh.css";

/* Each entry jumps to a chapter id on the /history page. */
const milestones: { year: string; text: string; href: `/history#${string}` }[] = [
  { year: "1918", text: "A prayer group in Ijebu-Ode", href: "/history#beginnings" },
  { year: "1930", text: "Revival at Oke Ooye, Ilesa", href: "/history#revival" },
  { year: "1943", text: "Registered as Christ Apostolic Church", href: "/history#name" },
  { year: "1972", text: "The Supreme Court judgment", href: "/history#judgment" },
];

/** Short history of CAC on the home page, pointing to the full /history page. */
export function HistoryTeaser() {
  return (
    <section aria-labelledby="history-teaser-heading" className="hm-section" style={{ background: "var(--paper)", padding: "clamp(64px,8vw,110px) clamp(20px,5vw,64px)" }}>
      <div className="r2c hm-history-grid" style={{ maxWidth: 1200, margin: "0 auto", gap: "clamp(32px,5vw,72px)" }}>
        <div>
          <h2 id="history-teaser-heading" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px,4.6vw,60px)", letterSpacing: "-1.5px", lineHeight: 1, margin: "0 0 20px", textWrap: "balance" }}>
            A church that began in prayer
          </h2>
          <p style={{ fontSize: 16.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: "0 0 14px", maxWidth: 560 }}>
            Christ Apostolic Church grew out of a small prayer group that started meeting in Ijebu-Ode in 1918.
            In 1930 revival broke out at Oke Ooye in Ilesa, and Apostle Joseph Ayo Babalola, who later became the
            church&apos;s first General Evangelist, was among those God used in it.
          </p>
          <p style={{ fontSize: 16.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: "0 0 26px", maxWidth: 560 }}>
            The church was registered under its present name in May 1943, and a 1972 Supreme Court judgment affirmed
            it as the main body. CACNA carries that work on across the United States, Canada and South America.
          </p>

          <ol style={{ listStyle: "none", margin: "0 0 22px", padding: 0, borderTop: "1px solid var(--line)", maxWidth: 560 }}>
            {milestones.map((m) => (
              <li key={m.href} style={{ borderBottom: "1px solid var(--line)" }}>
                <Link href={m.href} className="hm-text-link hm-milestone" style={{ display: "flex", alignItems: "center", gap: 16, minHeight: 48, padding: "6px 0", color: "var(--ink)", textDecoration: "none", fontSize: 15.5, fontWeight: 600 }}>
                  <span style={{ flexShrink: 0, width: 48, fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--red)", fontVariantNumeric: "tabular-nums" }}>{m.year}</span>
                  <span>{m.text}</span>
                </Link>
              </li>
            ))}
          </ol>

          <Link href="/history" className="hm-link hm-text-link" style={{ display: "inline-flex", alignItems: "center", gap: 7, minHeight: 44, fontWeight: 700, fontSize: 15, color: "var(--red)", textDecoration: "none" }}>
            Read the full history <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
          </Link>
        </div>

        <figure className="hm-history-photo" style={{ margin: 0, position: "relative", aspectRatio: "4 / 3", borderRadius: 28, overflow: "hidden", boxShadow: "0 28px 60px rgba(18,20,30,.22)", background: "var(--ink)" }}>
          <Image
            src="/photos/gallery-archive/dsc-8508-1569.jpg"
            alt="A congregation in colorful attire and head wraps seated on red chairs in a fellowship hall"
            fill
            sizes="(max-width: 860px) 100vw, 580px"
            style={{ objectFit: "cover" }}
          />
        </figure>
      </div>
    </section>
  );
}
