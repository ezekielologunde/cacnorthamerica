import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { Reveal } from "@/components/ui/Reveal";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { POSTS, type BlogPost, badgeTextColor } from "@/lib/blog";
import { specialEvents } from "@/lib/events";
import { getApprovedCacWorldNews, type CacWorldNewsItem } from "@/lib/cacWorldNews";
import { GIVING_CAMPAIGNS, type GivingCampaign } from "@/lib/giving";
import { currentOrNextConvention, dateRangeLabel, hasExternalRegistrationUrl } from "@/lib/conventions";
import { ConventionAdWidget } from "@/components/blog/ConventionAdWidget";
import Link from "next/link";
import { Clock, Calendar, ArrowRight, Globe2, Landmark, Sparkles, Archive, BookHeart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const revalidate = 3600;

type DbBlogRow = {
  id: string; title: string; slug: string; excerpt: string | null;
  body: string; published_at: string | null; created_at: string;
  image_url: string | null; image_alt: string | null;
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
    categoryColor: "#C81E3A",
    accent: "#C81E3A",
    readTime: `${Math.max(1, Math.round(words / 200))} min read`,
    featured: true,
    image: p.image_url ? { url: p.image_url, alt: p.image_alt ?? p.title } : undefined,
    body: p.body.split(/\n\n+/),
  };
}

export const metadata = {
  title: "Blog & News — Christ Apostolic Church North America (CACNA)",
  description:
    "Devotionals, ministry updates, and reflections from across CACNA — written for the body, by the body.",
  alternates: { canonical: "/blog" },
};

const WHATSAPP_SHARE = (title: string, slug: string) =>
  `https://wa.me/?text=${encodeURIComponent(`${title} — https://www.cacnorthamerica.com/blog/${slug}`)}`;

function CategoryBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 800,
      letterSpacing: "1.8px", textTransform: "uppercase",
      color: badgeTextColor(color), background: color,
      borderRadius: 999, padding: "3px 11px",
    }}>{label}</span>
  );
}

function ArticleCard({ post, archival }: { post: typeof POSTS[number]; archival?: boolean }) {
  return (
    <article className="card-lift" style={{
      background: archival ? "var(--cream-2)" : "var(--paper)",
      border: `1px solid ${archival ? "var(--line)" : "var(--line)"}`,
      opacity: archival ? 0.88 : 1,
      borderRadius: 22, overflow: "hidden", display: "flex",
      flexDirection: "column", height: "100%",
    }}>
      {post.image ? (
        <div style={{ height: 240, position: "relative", flexShrink: 0, opacity: archival ? 0.85 : 1 }}>
          <ImageLightbox src={post.image.url} alt={post.image.alt} />
        </div>
      ) : (
        <div style={{ height: 6, background: archival ? "var(--line)" : post.accent, flexShrink: 0 }} />
      )}
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
            <Calendar size={12} strokeWidth={2.5} aria-hidden /> {archival ? `Archival · ${post.date}` : post.date}
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
      boxShadow: "0 16px 50px rgba(18,20,30,.10)",
    }}>
      <div style={{ height: 320, background: post.image ? "var(--ink)" : post.accent, position: "relative" }}>
        {post.image ? (
          <ImageLightbox src={post.image.url} alt={post.image.alt} />
        ) : (
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%,rgba(255,255,255,.2),transparent 65%)" }} />
        )}
        {post.image && <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(18,20,30,0),rgba(18,20,30,.5) 100%)", pointerEvents: "none" }} />}
        <div style={{ position: "absolute", top: 22, left: 24, pointerEvents: "none" }}>
          <span style={{ display: "inline-block", fontSize: 9.5, fontWeight: 900, letterSpacing: "2.5px", textTransform: "uppercase", color: "#fff", background: "rgba(0,0,0,.35)", borderRadius: 999, padding: "5px 12px" }}>
            Latest · {post.readTime}
          </span>
        </div>
        <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, pointerEvents: "none" }}>
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
            boxShadow: "0 8px 20px rgba(200,30,58,.3)",
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

function CacWorldCard({ item }: { item: CacWorldNewsItem }) {
  const date = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;
  return (
    <article className="card-lift" style={{
      background: "var(--paper)", border: "1px solid var(--line)",
      borderRadius: 22, overflow: "hidden", display: "flex",
      flexDirection: "column", height: "100%",
    }}>
      <div style={{ height: 140, background: "var(--ink)", position: "relative", overflow: "hidden" }}>
        {item.imageUrl ? (
          <ImageLightbox src={item.imageUrl} alt={item.title} />
        ) : (
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%,rgba(253,200,65,.25),transparent 65%)" }} />
        )}
        <div style={{ position: "absolute", top: 14, left: 16, pointerEvents: "none" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 9.5, fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", color: "#fff", background: "rgba(0,0,0,.5)", borderRadius: 999, padding: "5px 12px" }}>
            <Globe2 size={11} strokeWidth={2.5} aria-hidden /> CAC World
          </span>
        </div>
      </div>
      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18,
          letterSpacing: "-.3px", color: "var(--ink)", margin: "0 0 10px", lineHeight: 1.2,
        }}>
          {item.title}
        </h3>
        {item.excerpt && (
          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.68, margin: "0 0 18px", flex: 1 }}>
            {item.excerpt}…
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: "auto" }}>
          {date && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--ink-soft)", fontWeight: 600 }}>
              <Calendar size={12} strokeWidth={2.5} aria-hidden /> {date}
            </span>
          )}
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>
            Read on CAC World News →
          </a>
        </div>
      </div>
    </article>
  );
}

function SectionHeading({ icon: Icon, eyebrow, title, description, meta, gradient }: { icon: LucideIcon; eyebrow: string; title: string; description?: string; meta?: string; gradient: string }) {
  return (
    <Reveal style={{ marginBottom: 32 }}>
      <div style={{
        position: "relative", overflow: "hidden", borderRadius: 22,
        padding: "clamp(22px,3vw,30px) clamp(22px,3vw,30px)",
        background: gradient,
      }}>
        <div aria-hidden style={{ position: "absolute", top: -60, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.14),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.25)", display: "grid", placeItems: "center", flexShrink: 0, backdropFilter: "blur(6px)" }}>
              <Icon size={22} strokeWidth={2} color="#fff" aria-hidden />
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.75)" }}>{eyebrow}</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3vw,34px)", letterSpacing: "-.8px", color: "#fff", margin: "4px 0 6px", lineHeight: 1.1 }}>{title}</h2>
              {description && <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", margin: 0, maxWidth: 460, lineHeight: 1.6 }}>{description}</p>}
            </div>
          </div>
          {meta && <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.8)", whiteSpace: "nowrap", marginTop: 12 }}>{meta}</span>}
        </div>
      </div>
    </Reveal>
  );
}

function GivingAdWidget({ campaign }: { campaign: GivingCampaign }) {
  return (
    <aside style={{
      background: "linear-gradient(140deg,#12141E,#2D42C9)",
      borderRadius: 20, padding: "24px 26px", position: "relative", overflow: "hidden",
      marginBottom: 24,
    }}>
      <div aria-hidden style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, background: "radial-gradient(circle,rgba(253,200,65,.3),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
          <Landmark size={12} strokeWidth={2.5} color="var(--gold)" aria-hidden />
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(245,246,250,.7)" }}>
            {campaign.eyebrow}
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>
          {campaign.title}
        </div>
        <p style={{ fontSize: 13, color: "rgba(245,246,250,.78)", lineHeight: 1.6, marginBottom: 18 }}>
          {campaign.adBlurb}
        </p>
        <Link href="/giving" className="press" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "#fff", color: "var(--ink)", fontWeight: 800,
          fontSize: 13, padding: "10px 20px", borderRadius: 999, textDecoration: "none",
        }}>
          Give Now <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
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

function CacWorldTeaserWidget({ item }: { item: CacWorldNewsItem }) {
  return (
    <aside style={{
      background: "linear-gradient(140deg,#12141E,#2D42C9)",
      borderRadius: 20, padding: "22px 24px", position: "relative", overflow: "hidden",
      marginBottom: 24,
    }}>
      <div aria-hidden style={{ position: "absolute", bottom: -30, left: -30, width: 130, height: 130, background: "radial-gradient(circle,rgba(253,200,65,.25),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
          <Globe2 size={12} strokeWidth={2.5} color="var(--gold)" aria-hidden />
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(245,246,250,.7)" }}>
            From CAC World
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "#fff", lineHeight: 1.3, marginBottom: 14 }}>
          {item.title}
        </div>
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(255,255,255,.14)", color: "#fff", fontWeight: 700,
          fontSize: 12.5, padding: "9px 16px", borderRadius: 999, textDecoration: "none",
        }}>
          Read on CAC World <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
        </a>
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
    .select("id, title, slug, excerpt, body, published_at, created_at, image_url, image_alt")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const cacWorldNews = await getApprovedCacWorldNews(6);
  const dynamicPosts = (dbRows ?? []).map(dbPostToBlogPost);
  const [featured, ...rest] = POSTS;
  const allArticles = [...rest, ...dynamicPosts];
  const byDateDesc = (a: BlogPost, b: BlogPost) => (a.dateIso < b.dateIso ? 1 : a.dateIso > b.dateIso ? -1 : 0);
  const heraldArticles = allArticles.filter((p) => p.category !== "Devotional").sort(byDateDesc);
  const conventionCoverage = heraldArticles.filter((p) => p.featured);
  const archiveArticles = heraldArticles.filter((p) => !p.featured);
  const devotionalArticles = allArticles.filter((p) => p.category === "Devotional").sort(byDateDesc);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  // Deterministic per-calendar-day rotation — same campaign for every visitor
  // on a given day, changes daily, no client-side layout shift.
  const dayOfYear = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - Date.UTC(now.getUTCFullYear(), 0, 0)) / 86400000);
  const givingCampaign = GIVING_CAMPAIGNS[dayOfYear % GIVING_CAMPAIGNS.length];
  const cy = currentOrNextConvention();

  return (
    <main>
      <Nav heroDark />

      {/* Masthead */}
      <section style={{ background: "var(--ink)", padding: "170px clamp(20px,5vw,64px) 110px", position: "relative", overflow: "hidden", minHeight: "72vh", display: "flex", alignItems: "center" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0 }}>
          <Image
            src="/images/cac-youth-convention.jpg"
            alt="CACNA youth at a past Annual Convention"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(12,14,19,.55) 0%,rgba(12,14,19,.72) 55%,var(--ink) 100%)" }} />
        </div>
        <div aria-hidden style={{ position: "absolute", top: -100, right: -80, width: 560, height: 440, background: "radial-gradient(circle,rgba(253,200,65,.18),transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 2, width: "100%" }}>
          <Reveal>
            <div style={{ borderBottom: "1px solid rgba(245,246,250,.16)", paddingBottom: 18, marginBottom: 26, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(245,246,250,.55)", letterSpacing: ".5px" }}>{dateStr}</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(245,246,250,.55)", letterSpacing: ".5px" }}>cacnorthamerica.com</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(64px,11vw,160px)", letterSpacing: "-0.03em",
              color: "#fff", margin: "0 0 10px", lineHeight: 0.9, textAlign: "center",
              textShadow: "0 8px 40px rgba(0,0,0,.35)",
            }}>CACNA News</h1>
          </Reveal>
          <Reveal delay={140}>
            <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 34 }}>
              Christ Apostolic Church North America
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {[
                { href: "#convention-coverage", label: "Convention Coverage" },
                { href: "#archives", label: "Archives" },
                { href: "#cac-world", label: "CAC World" },
                { href: "#devotionals", label: "Devotionals" },
              ].map((l) => (
                <a key={l.href} href={l.href} style={{
                  fontSize: 12.5, fontWeight: 700, color: "rgba(245,246,250,.85)",
                  background: "rgba(245,246,250,.1)", border: "1px solid rgba(245,246,250,.22)",
                  backdropFilter: "blur(6px)",
                  padding: "8px 16px", borderRadius: 999, textDecoration: "none",
                }}>
                  {l.label}
                </a>
              ))}
            </div>
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
              <UpcomingEventWidget />
            </Reveal>
            <Reveal delay={140}>
              <ConventionAdWidget />
            </Reveal>
            {cacWorldNews[0] && (
              <Reveal delay={200}>
                <CacWorldTeaserWidget item={cacWorldNews[0]} />
              </Reveal>
            )}
            <Reveal delay={260}>
              <GivingAdWidget campaign={givingCampaign} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Convention Coverage — current-year featured posts */}
      {conventionCoverage.length > 0 && (
        <section id="convention-coverage" style={{ background: "var(--cream-2)", padding: "clamp(40px,5vw,72px) clamp(20px,5vw,64px) clamp(20px,3vw,32px)", scrollMarginTop: 90 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <SectionHeading
              icon={Sparkles}
              eyebrow="Featured coverage"
              title="2026 Convention Coverage"
              description="Welcome addresses, messages, and the closing word from CACNA's flagship gathering."
              gradient="linear-gradient(135deg,#7A1128,#FDC841)"
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: 22 }}>
              {conventionCoverage.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 6) * 70}>
                  <ArticleCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* From the Archives — earlier newsletter material, honestly dated */}
      {archiveArticles.length > 0 && (
        <section id="archives" style={{ background: "var(--cream-2)", padding: "clamp(20px,3vw,32px) clamp(20px,5vw,64px) clamp(20px,3vw,32px)", scrollMarginTop: 90 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <SectionHeading
              icon={Archive}
              eyebrow="Looking back"
              title="From the Archives"
              description="Earlier reflections and updates from across the CACNA family."
              meta={`${archiveArticles.length} entries`}
              gradient="linear-gradient(135deg,#3A3D4A,#12141E)"
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: 22 }}>
              {archiveArticles.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 6) * 70}>
                  <ArticleCard post={p} archival />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* From CAC World News */}
      {cacWorldNews.length > 0 && (
        <section id="cac-world" style={{ background: "var(--cream)", padding: "clamp(40px,5vw,72px) clamp(20px,5vw,64px) clamp(20px,3vw,32px)", scrollMarginTop: 90 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <SectionHeading
              icon={Globe2}
              eyebrow="Beyond CACNA"
              title="From CAC World"
              description="News from Christ Apostolic Church Worldwide, headquartered in Nigeria."
              meta="via cacworldnews.com"
              gradient="linear-gradient(135deg,#2D42C9,#12141E)"
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: 22 }}>
              {cacWorldNews.map((item, i) => (
                <Reveal key={item.id} delay={(i % 6) * 70}>
                  <CacWorldCard item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Devotionals */}
      {devotionalArticles.length > 0 && (
        <section id="devotionals" style={{ background: "var(--cream-2)", padding: "clamp(24px,4vw,40px) clamp(20px,5vw,64px) clamp(60px,8vw,100px)", scrollMarginTop: 90 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <SectionHeading
              icon={BookHeart}
              eyebrow="Daily bread"
              title="Devotionals"
              description="Short reflections to ground your day in the Word."
              meta={`${devotionalArticles.length} entries`}
              gradient="linear-gradient(135deg,#C81E3A,#7A1128)"
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: 22 }}>
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
            background: "linear-gradient(135deg,#7A1128,#C81E3A)",
            borderRadius: 28, padding: "clamp(28px,4vw,44px)",
            display: "flex", flexWrap: "wrap", alignItems: "center",
            justifyContent: "space-between", gap: 24,
            boxShadow: "0 24px 60px rgba(200,30,58,.28)",
            position: "relative", overflow: "hidden",
          }}>
            <div aria-hidden style={{ position: "absolute", top: -80, right: -60, width: 320, height: 280, background: "radial-gradient(circle,rgba(253,200,65,.3),transparent 65%)", pointerEvents: "none" }} />
            <div style={{ flex: "1 1 320px", position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(245,246,250,.8)", marginBottom: 10 }}>
                Save the date
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(22px,3vw,36px)", letterSpacing: "-.6px", color: "#fff", margin: "0 0 8px", lineHeight: 1.05 }}>
                {`CACNA ${cy.year} National Convention`}
              </h2>
              <p style={{ fontSize: 15, color: "rgba(245,246,250,.82)", margin: 0, lineHeight: 1.6 }}>
                {dateRangeLabel(cy)} at CAC Village, Blue Ridge Summit, PA.
              </p>
            </div>
            {cy.registrationUrl ? (
              hasExternalRegistrationUrl(cy) ? (
                <a href={cy.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-sheen press"
                  style={{ position: "relative", zIndex: 2, flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 9, background: "#fff", color: "var(--red)", fontWeight: 800, fontSize: 15, padding: "14px 28px", borderRadius: 999, textDecoration: "none" }}>
                  {`Convention ${cy.year}`} →
                </a>
              ) : (
                <Link href={cy.registrationUrl} className="btn-sheen press"
                  style={{ position: "relative", zIndex: 2, flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 9, background: "#fff", color: "var(--red)", fontWeight: 800, fontSize: 15, padding: "14px 28px", borderRadius: 999, textDecoration: "none" }}>
                  {`Convention ${cy.year}`} →
                </Link>
              )
            ) : (
              <Link href={cy.href} className="btn-sheen press"
                style={{ position: "relative", zIndex: 2, flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 9, background: "#fff", color: "var(--red)", fontWeight: 800, fontSize: 15, padding: "14px 28px", borderRadius: 999, textDecoration: "none" }}>
                Event Details →
              </Link>
            )}
          </div>
        </Reveal>
      </section>

      <FooterExperience />
    </main>
  );
}
