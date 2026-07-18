import { createClient } from "@supabase/supabase-js";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { POSTS, type BlogPost } from "@/lib/blog";
import { specialEvents } from "@/lib/events";
import { bibleReadingPlan } from "@/lib/biblePlan";
import Link from "next/link";
import { Clock, Calendar, ShoppingBag, BookOpen, ArrowRight, Building2 } from "lucide-react";

export const revalidate = 3600;

type DbBlogRow = {
  id: string; title: string; slug: string; excerpt: string | null;
  body: string; published_at: string | null; created_at: string;
};

function dbPostToBlogPost(p: DbBlogRow): BlogPost {
  const date = new Date(p.published_at ?? p.created_at);
  const words = p.body.split(/\s+/).length;
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? p.body.slice(0, 160) + "…",
    date: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    dateIso: p.published_at ?? p.created_at,
    category: "Ministry Update",
    categoryColor: "#D62828",
    accent: "#D62828",
    readTime: `${Math.max(1, Math.round(words / 200))} min read`,
    body: p.body.split(/\n\n+/),
  };
}

export const metadata = {
  title: "Blog & News — CAC Salvation Center",
  description:
    "Devotionals, ministry updates, and reflections from the Salvation Center — written for the body, by the body.",
  alternates: { canonical: "/blog" },
};

const WHATSAPP_SHARE = (title: string, slug: string) =>
  `https://wa.me/?text=${encodeURIComponent(`${title} — https://www.cacsalvationcenter.org/blog/${slug}`)}`;

function CategoryBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 800,
      letterSpacing: "1.8px", textTransform: "uppercase",
      color: "#fff", background: color,
      borderRadius: 999, padding: "3px 11px",
    }}>{label}</span>
  );
}

function ArticleCard({ post }: { post: typeof POSTS[number] }) {
  return (
    <article className="card-lift" style={{
      background: "var(--paper)", border: "1px solid var(--line)",
      borderRadius: 22, overflow: "hidden", display: "flex",
      flexDirection: "column", height: "100%",
    }}>
      <div style={{ height: 6, background: post.accent, flexShrink: 0 }} />
      <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <CategoryBadge label={post.category} color={post.categoryColor} />
          <span style={{ fontSize: 11.5, color: "var(--ink-soft)", fontWeight: 600 }}>{post.readTime}</span>
        </div>
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20,
          letterSpacing: "-.4px", color: "var(--ink)", margin: "0 0 10px", lineHeight: 1.15,
        }}>
          <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            {post.title}
          </Link>
        </h3>
        <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.72, margin: "0 0 20px", flex: 1 }}>
          {post.excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, borderTop: "1px solid var(--line)", paddingTop: 16, marginTop: "auto" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--ink-soft)", fontWeight: 600 }}>
            <Calendar size={12} strokeWidth={2.5} aria-hidden /> {post.date}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href={WHATSAPP_SHARE(post.title, post.slug)} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 11.5, fontWeight: 700, color: "#25D366", textDecoration: "none" }}
              aria-label="Share on WhatsApp">Share ↗</a>
            <Link href={`/blog/${post.slug}`}
              style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
              Read →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function FeaturedCard({ post }: { post: typeof POSTS[number] }) {
  return (
    <article style={{
      background: "var(--paper)", border: "1px solid var(--line)",
      borderRadius: 28, overflow: "hidden",
      boxShadow: "0 16px 50px rgba(27,19,14,.10)",
    }}>
      <div style={{ height: 220, background: post.accent, position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%,rgba(255,255,255,.2),transparent 65%)" }} />
        <div style={{ position: "absolute", top: 22, left: 24 }}>
          <span style={{ display: "inline-block", fontSize: 9.5, fontWeight: 900, letterSpacing: "2.5px", textTransform: "uppercase", color: "#fff", background: "rgba(0,0,0,.35)", borderRadius: 999, padding: "5px 12px" }}>
            Latest · {post.readTime}
          </span>
        </div>
        <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
          <CategoryBadge label={post.category} color="rgba(0,0,0,.45)" />
        </div>
      </div>
      <div style={{ padding: "28px 32px 32px" }}>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(26px,3.2vw,40px)", letterSpacing: "-1px",
          color: "var(--ink)", margin: "0 0 14px", lineHeight: 1.06,
        }}>
          <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            {post.title}
          </Link>
        </h2>
        <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.75, margin: "0 0 24px" }}>
          {post.excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "var(--ink-soft)", fontWeight: 600 }}>
            <Clock size={13} strokeWidth={2.5} aria-hidden /> {post.date}
          </span>
          <Link href={`/blog/${post.slug}`} className="press" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 14,
            padding: "10px 22px", borderRadius: 999, textDecoration: "none",
            boxShadow: "0 8px 20px rgba(214,40,40,.3)",
          }}>
            Read full story <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
          </Link>
          <a href={WHATSAPP_SHARE(post.title, post.slug)} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12.5, fontWeight: 700, color: "#25D366", textDecoration: "none" }}>
            Share on WhatsApp ↗
          </a>
        </div>
      </div>
    </article>
  );
}

function ScriptureWidget() {
  const week = bibleReadingPlan[1];
  return (
    <aside style={{
      background: "var(--ink)", borderRadius: 20, padding: "24px 26px",
      marginBottom: 24, position: "relative", overflow: "hidden",
    }}>
      <div aria-hidden style={{ position: "absolute", top: -40, right: -40, width: 180, height: 140, background: "radial-gradient(circle,rgba(232,163,61,.25),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
          <BookOpen size={12} strokeWidth={2.5} color="var(--gold)" aria-hidden />
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)" }}>
            This Week&apos;s Reading
          </span>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(255,247,239,.55)", marginBottom: 10 }}>Week 2 — {week.theme}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            ["Sun", week.sun], ["Mon", week.mon], ["Tue", week.tue],
            ["Wed", week.wed], ["Thu", week.thu],
          ].map(([day, reading]) => (
            <div key={day} style={{ display: "flex", gap: 10, fontSize: 13 }}>
              <span style={{ minWidth: 30, fontWeight: 800, color: "var(--gold)", fontSize: 11 }}>{day}</span>
              <span style={{ color: "rgba(255,247,239,.75)", lineHeight: 1.45 }}>{reading}</span>
            </div>
          ))}
        </div>
        <Link href="/bible-plan" style={{ display: "inline-block", marginTop: 16, fontSize: 12, fontWeight: 700, color: "var(--gold)", textDecoration: "none" }}>
          Full reading plan →
        </Link>
      </div>
    </aside>
  );
}

function UpcomingEventWidget() {
  const ev = specialEvents.find(e => e.href) ?? specialEvents[0];
  return (
    <aside style={{
      background: "var(--cream-2)", border: "1px solid var(--line)",
      borderRadius: 20, padding: "22px 24px", marginBottom: 24,
    }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>
        Upcoming Event
      </div>
      {ev.month && (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ textAlign: "center", minWidth: 44 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)" }}>{ev.month}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, lineHeight: 1, color: "var(--ink)" }}>{ev.day}</div>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)", lineHeight: 1.2, marginBottom: 6 }}>{ev.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 4 }}>
              <Clock size={11} strokeWidth={2.5} aria-hidden /> {ev.timeLabel}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{ev.desc.slice(0, 80)}…</div>
          </div>
        </div>
      )}
      {ev.href && (
        <Link href={ev.href} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--red)", textDecoration: "none", marginTop: 8 }}>
          Event details <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
        </Link>
      )}
    </aside>
  );
}

function StoreAdWidget() {
  return (
    <aside style={{
      background: "linear-gradient(140deg,#9E1B1B,#D62828)",
      borderRadius: 20, padding: "24px 26px", position: "relative", overflow: "hidden",
      marginBottom: 24,
    }}>
      <div aria-hidden style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, background: "radial-gradient(circle,rgba(232,163,61,.35),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
          <ShoppingBag size={12} strokeWidth={2.5} color="var(--gold)" aria-hidden />
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,247,239,.7)" }}>
            From the Store
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>
          Wear the Word.
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,247,239,.78)", lineHeight: 1.6, marginBottom: 18 }}>
          CAC Salvation Center merchandise — shirts, bibles, custom prints, and more. Quality that carries the message.
        </p>
        <Link href="/store" className="press" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "#fff", color: "var(--red)", fontWeight: 800,
          fontSize: 13, padding: "10px 20px", borderRadius: 999, textDecoration: "none",
        }}>
          Shop Now <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
        </Link>
      </div>
    </aside>
  );
}

function HallRentalAdWidget() {
  return (
    <aside style={{
      background: "linear-gradient(140deg,#1C3A2A,#2E6040)",
      borderRadius: 20, padding: "24px 26px", position: "relative", overflow: "hidden",
    }}>
      <div aria-hidden style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, background: "radial-gradient(circle,rgba(232,163,61,.28),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
          <Building2 size={12} strokeWidth={2.5} color="var(--gold)" aria-hidden />
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,247,239,.7)" }}>
            Space for Rent
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 21, color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>
          Host Your Event Here.
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,247,239,.82)", lineHeight: 1.65, marginBottom: 14 }}>
          Our hall and parking lots are available for events, conferences, and birthdays. Flexible packages for any size gathering.
        </p>
        <a href="mailto:info@cacsalvationcenter.org"
          style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--gold)", textDecoration: "none", marginBottom: 14 }}>
          info@cacsalvationcenter.org
        </a>
        <Link href="/venue" className="press" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "#fff", color: "#1C3A2A", fontWeight: 800,
          fontSize: 13, padding: "10px 20px", borderRadius: 999, textDecoration: "none",
        }}>
          View Venue &amp; Book <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
        </Link>
      </div>
    </aside>
  );
}

export default async function BlogPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: dbRows } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, body, published_at, created_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const dynamicPosts = (dbRows ?? []).map(dbPostToBlogPost);
  const [featured, ...rest] = POSTS;
  const allArticles = [...rest, ...dynamicPosts];
  const byDateDesc = (a: BlogPost, b: BlogPost) => (a.dateIso < b.dateIso ? 1 : a.dateIso > b.dateIso ? -1 : 0);
  const heraldArticles = allArticles.filter((p) => p.category !== "Devotional").sort(byDateDesc);
  const devotionalArticles = allArticles.filter((p) => p.category === "Devotional").sort(byDateDesc);
  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <main>
      <Nav heroDark />

      {/* Masthead */}
      <section style={{ background: "var(--ink)", padding: "130px clamp(20px,5vw,64px) 72px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 560, height: 440, background: "radial-gradient(circle,rgba(232,163,61,.2),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ borderBottom: "1px solid rgba(255,247,239,.12)", paddingBottom: 18, marginBottom: 22, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(255,247,239,.45)", letterSpacing: ".5px" }}>{dateStr}</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(255,247,239,.45)", letterSpacing: ".5px" }}>cacsalvationcenter.org</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(56px,9vw,130px)", letterSpacing: "-0.025em",
              color: "#fff", margin: "0 0 8px", lineHeight: 0.92, textAlign: "center",
            }}>Salvation Herald</h1>
          </Reveal>
          <Reveal delay={140}>
            <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 0 }}>
              Christ Apostolic Church Salvation Center · Baltimore
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured + Sidebar */}
      <section style={{ background: "var(--cream)", padding: "clamp(40px,5vw,70px) clamp(20px,5vw,64px)" }}>
        <div className="blog-featured-grid" style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div>
            <Reveal>
              <FeaturedCard post={featured} />
            </Reveal>
          </div>
          <div>
            <Reveal delay={80}>
              <ScriptureWidget />
            </Reveal>
            <Reveal delay={120}>
              <UpcomingEventWidget />
            </Reveal>
            <Reveal delay={160}>
              <StoreAdWidget />
            </Reveal>
            <Reveal delay={200}>
              <HallRentalAdWidget />
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Herald — news, events & reflections */}
      {heraldArticles.length > 0 && (
        <section style={{ background: "var(--cream-2)", padding: "clamp(40px,5vw,72px) clamp(20px,5vw,64px) clamp(20px,3vw,32px)" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <Reveal style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid var(--ink)", paddingBottom: 12 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, letterSpacing: "3px", textTransform: "uppercase", color: "var(--ink)" }}>
                  The Herald
                </span>
                <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 22 }}>
              {heraldArticles.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 6) * 70}>
                  <ArticleCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Devotionals */}
      {devotionalArticles.length > 0 && (
        <section style={{ background: "var(--cream-2)", padding: "clamp(24px,4vw,40px) clamp(20px,5vw,64px) clamp(60px,8vw,100px)" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <Reveal style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid var(--ink)", paddingBottom: 12 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, letterSpacing: "3px", textTransform: "uppercase", color: "var(--ink)" }}>
                  Devotionals
                </span>
                <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-soft)" }}>{devotionalArticles.length} entries</span>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 22 }}>
              {devotionalArticles.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 9) * 55}>
                  <ArticleCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CACNA CTA */}
      <section style={{ background: "var(--cream)", padding: "0 clamp(20px,5vw,64px) clamp(56px,7vw,90px)" }}>
        <Reveal>
          <div style={{
            maxWidth: 900, margin: "0 auto",
            background: "linear-gradient(135deg,#9E1B1B,#D62828)",
            borderRadius: 28, padding: "clamp(28px,4vw,44px)",
            display: "flex", flexWrap: "wrap", alignItems: "center",
            justifyContent: "space-between", gap: 24,
            boxShadow: "0 24px 60px rgba(214,40,40,.28)",
            position: "relative", overflow: "hidden",
          }}>
            <div aria-hidden style={{ position: "absolute", top: -80, right: -60, width: 320, height: 280, background: "radial-gradient(circle,rgba(232,163,61,.3),transparent 65%)", pointerEvents: "none" }} />
            <div style={{ flex: "1 1 320px", position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,247,239,.8)", marginBottom: 10 }}>
                Registration open
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,36px)", letterSpacing: "-.6px", color: "#fff", margin: "0 0 8px", lineHeight: 1.05 }}>
                Register for CACNA 2026
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,247,239,.82)", margin: 0, lineHeight: 1.6 }}>
                July 13–18 at CAC Village, Blue Ridge Summit, PA.
              </p>
            </div>
            <a href="https://cacnaconvention.org/2026-cacna-national-convention-registration-credit-debit-card/" target="_blank" rel="noopener noreferrer" className="btn-sheen press"
              style={{ position: "relative", zIndex: 2, flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 9, background: "#fff", color: "var(--red)", fontWeight: 800, fontSize: 15, padding: "14px 28px", borderRadius: 999, textDecoration: "none" }}>
              Register Now →
            </a>
          </div>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
