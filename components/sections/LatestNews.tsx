import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { POSTS, badgeTextColor, type BlogPost, type PostCategory } from "@/lib/blog";

const CATEGORIES: PostCategory[] = ["Event Spotlight", "Ministry Update", "Devotional", "Reflection"];

/** Picks the most recent post from each category first (so the section always
 *  reads as a mix of everything CACNA covers, not just whichever category
 *  happened to post most recently), then fills remaining slots by recency. */
function pickDiverse(posts: BlogPost[], count: number): BlogPost[] {
  const sorted = [...posts].sort((a, b) => b.dateIso.localeCompare(a.dateIso));
  const picked: BlogPost[] = [];
  const seen = new Set<string>();

  for (const cat of CATEGORIES) {
    const match = sorted.find((p) => p.category === cat && !seen.has(p.slug));
    if (match) { picked.push(match); seen.add(match.slug); }
  }
  for (const p of sorted) {
    if (picked.length >= count) break;
    if (!seen.has(p.slug)) { picked.push(p); seen.add(p.slug); }
  }
  return picked.slice(0, count);
}

function NewsCard({ p, delay, featured }: { p: BlogPost; delay: number; featured?: boolean }) {
  const isPortrait = p.image?.orientation === "portrait";
  return (
    <Reveal delay={delay}>
      <Link href={p.href ?? `/blog/${p.slug}`} className="card-lift" style={{ textDecoration: "none", color: "inherit", background: "var(--paper)", borderRadius: 24, overflow: "hidden", boxShadow: "0 10px 26px rgba(18,20,30,.06)", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{
          position: "relative", height: featured ? 280 : 168,
          ...(p.image ? {
            backgroundImage: `url(${p.image.url})`, backgroundSize: "cover",
            backgroundPosition: isPortrait ? "center 20%" : "center",
          } : { background: p.accent }),
        }}>
          <span style={{
            position: "absolute", top: 14, left: 14,
            background: p.categoryColor, color: badgeTextColor(p.categoryColor),
            fontWeight: 800, fontSize: featured ? 12.5 : 11.5, padding: featured ? "7px 16px" : "6px 14px", borderRadius: 999, letterSpacing: ".3px",
            boxShadow: "0 6px 16px rgba(18,20,30,.2)",
          }}>
            {p.category}
          </span>
        </div>
        <div style={{ padding: featured ? 32 : 26, display: "flex", flexDirection: "column", flex: 1, gap: featured ? 14 : 12 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: featured ? "clamp(22px,2.2vw,28px)" : 20, letterSpacing: "-.3px", lineHeight: 1.2, margin: 0, textWrap: "balance" }}>{p.title}</h3>
          <p style={{
            fontSize: featured ? 15.5 : 14, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0, flex: 1,
            display: "-webkit-box", WebkitLineClamp: featured ? 3 : 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{p.excerpt}</p>
          <div style={{ fontSize: featured ? 13.5 : 12.5, color: "var(--ink-soft)", display: "flex", justifyContent: "space-between" }}>
            <span>{p.date}</span><span>{p.readTime}</span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function LatestNews() {
  const posts = pickDiverse(POSTS, 6);
  const [featured, rest] = [posts.slice(0, 2), posts.slice(2)];

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

        {featured.length > 0 && (
          <div className="r2" style={{ gap: 22, marginBottom: 22 }}>
            {featured.map((p, i) => <NewsCard key={p.slug} p={p} delay={i * 80} featured />)}
          </div>
        )}

        {rest.length > 0 && (
          <div className="r3" style={{ gap: 22 }}>
            {rest.map((p, i) => <NewsCard key={p.slug} p={p} delay={(featured.length + i) * 80} />)}
          </div>
        )}
      </div>
    </section>
  );
}
