import Link from "next/link";
import { POSTS, badgeTextColor } from "@/lib/blog";

/** Small "what's new" strip on the store page — the 3 most recent posts,
 *  reusing lib/blog.ts (the same data the /blog page reads) rather than a
 *  second content source. */
export function StoreNews() {
  const latest = [...POSTS].sort((a, b) => b.dateIso.localeCompare(a.dateIso)).slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section style={{ background: "var(--paper)", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 26 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red)" }}>From the family</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3.2vw,34px)", letterSpacing: "-.6px", margin: "8px 0 0", color: "var(--ink)" }}>
              Latest news
            </h2>
          </div>
          <Link href="/blog" className="press" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
            See all news →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 22 }}>
          {latest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card-lift" style={{
              display: "block", textDecoration: "none",
              background: "var(--cream)", border: "1px solid var(--line)",
              borderRadius: 20, overflow: "hidden",
            }}>
              {post.image ? (
                <div style={{ height: 150, position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image.url} alt={post.image.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ height: 6, background: post.accent }} />
              )}
              <div style={{ padding: "18px 20px 20px" }}>
                <span style={{
                  display: "inline-block", fontSize: 10, fontWeight: 800,
                  letterSpacing: "1.8px", textTransform: "uppercase",
                  color: badgeTextColor(post.categoryColor), background: post.categoryColor,
                  borderRadius: 999, padding: "3px 11px", marginBottom: 12,
                }}>{post.category}</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "var(--ink)", margin: "0 0 8px", lineHeight: 1.2 }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
