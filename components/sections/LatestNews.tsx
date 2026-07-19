import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { POSTS, badgeTextColor } from "@/lib/blog";

export function LatestNews() {
  const posts = [...POSTS].sort((a, b) => b.dateIso.localeCompare(a.dateIso)).slice(0, 3);

  return (
    <section style={{ background: "var(--cream)", padding: "clamp(70px,9vw,120px) clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal style={{ marginBottom: 46, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>From CACNA</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px,5vw,68px)", letterSpacing: "-1.5px", margin: "12px 0 0", lineHeight: 1 }}>Latest News</h2>
          </div>
          <Link href="/blog" className="press" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: "var(--red)", textDecoration: "none" }}>
            All posts <span aria-hidden style={{ fontSize: 17 }}>→</span>
          </Link>
        </Reveal>

        <div className="r3" style={{ gap: 22 }}>
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <Link href={p.href ?? `/blog/${p.slug}`} className="card-lift" style={{ textDecoration: "none", color: "inherit", background: "var(--paper)", borderRadius: 24, padding: 30, boxShadow: "0 10px 26px rgba(18,20,30,.06)", display: "flex", flexDirection: "column", height: "100%", gap: 14 }}>
                <span style={{ alignSelf: "flex-start", background: p.categoryColor, color: badgeTextColor(p.categoryColor), fontWeight: 800, fontSize: 11.5, padding: "6px 14px", borderRadius: 999, letterSpacing: ".3px" }}>
                  {p.category}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 21, letterSpacing: "-.3px", lineHeight: 1.2, margin: 0 }}>{p.title}</h3>
                <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0, flex: 1 }}>{p.excerpt}</p>
                <div style={{ fontSize: 13, color: "var(--ink-soft)", display: "flex", justifyContent: "space-between" }}>
                  <span>{p.date}</span><span>{p.readTime}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
