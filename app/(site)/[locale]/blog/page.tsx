import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import type { ReactNode } from "react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { POSTS, type BlogPost, CATEGORY_COLOR, CATEGORY_ACCENT } from "@/lib/blog";
import { specialEvents } from "@/lib/events";
import { getLatestCacWorldNews, type CacWorldNewsItem } from "@/lib/cacWorldNews";
import { GIVING_CAMPAIGNS, type GivingCampaign } from "@/lib/giving";
import { ConventionAdWidget } from "@/components/blog/ConventionAdWidget";
import Link from "next/link";
import { Clock, ArrowRight, Globe2, Landmark } from "lucide-react";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { setRequestLocale } from "next-intl/server";

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
    categoryColor: CATEGORY_COLOR["Ministry Update"],
    accent: CATEGORY_ACCENT["Ministry Update"],
    readTime: `${Math.max(1, Math.round(words / 200))} min read`,
    featured: true,
    image: p.image_url ? { url: p.image_url, alt: p.image_alt ?? p.title } : undefined,
    body: p.body.split(/\n\n+/),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog & News — Christ Apostolic Church North America (CACNA)",
    description:
      "Devotionals, ministry updates, and reflections from across CACNA.",
    alternates: { canonical: `${SITE_URL}/blog` },
  };
}

function Meta({ items }: { items: (string | null | undefined)[] }) {
  return (
    <p className="ed-meta">
      {items.filter(Boolean).map((t, i) => (
        <span key={i}>{t}</span>
      ))}
    </p>
  );
}

function StoryRow({ post, archival }: { post: BlogPost; archival?: boolean }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="ed-row">
      <div className="ed-row-text">
        <p className="ed-kicker">{archival ? "Archive" : post.category}</p>
        <h3 className="ed-row-title">
          <Link href={href}>{post.title}</Link>
        </h3>
        <p className="ed-row-dek">{post.excerpt}</p>
        <Meta items={[post.date, post.readTime]} />
      </div>
      {post.image && (
        <Link href={href} className="ed-row-thumb" tabIndex={-1} aria-hidden>
          <Image
            src={post.image.url}
            alt=""
            fill
            sizes="(max-width: 640px) 100px, 168px"
            style={{ objectFit: "cover", objectPosition: post.image.orientation === "portrait" ? "center 15%" : "center" }}
          />
        </Link>
      )}
    </article>
  );
}

function LeadStory({ post }: { post: BlogPost }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="ed-lead">
      {post.image && (
        <Link href={href} className="ed-lead-img" tabIndex={-1} aria-hidden>
          <Image
            src={post.image.url}
            alt=""
            fill
            preload
            sizes="(max-width: 860px) 100vw, 560px"
            style={{ objectFit: "cover", objectPosition: post.image.orientation === "portrait" ? "center 15%" : "center" }}
          />
        </Link>
      )}
      <div className="ed-lead-text">
        <p className="ed-kicker">Latest · {post.category}</p>
        <h2 className="ed-lead-title">
          <Link href={href}>{post.title}</Link>
        </h2>
        <p className="ed-lead-dek">{post.excerpt}</p>
        <Meta items={[post.date, post.readTime]} />
        <Link href={href} className="ed-readlink">
          Read the story <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
        </Link>
      </div>
    </article>
  );
}

function WorldRow({ item }: { item: CacWorldNewsItem }) {
  const date = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
    : null;
  return (
    <article className="ed-row">
      <div className="ed-row-text">
        <p className="ed-kicker">CAC World News</p>
        <h3 className="ed-row-title">
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.title}</a>
        </h3>
        {item.excerpt && <p className="ed-row-dek">{item.excerpt}</p>}
        <Meta items={[date, "Opens cacworldnews.com"]} />
      </div>
      {item.imageUrl && (
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="ed-row-thumb" tabIndex={-1} aria-hidden>
          <Image src={item.imageUrl} alt="" fill sizes="(max-width: 640px) 100px, 168px" style={{ objectFit: "cover" }} />
        </a>
      )}
    </article>
  );
}

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} className="ed-section">
      <header className="ed-section-head">
        <h2>{title}</h2>
        {note && <span>{note}</span>}
      </header>
      {children}
    </section>
  );
}

const ARCHIVE_VISIBLE = 6;


function GivingAdWidget({ campaign }: { campaign: GivingCampaign }) {
  return (
    <aside style={{
      background: "linear-gradient(140deg,var(--ink),var(--blue))",
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
        <Link className="mm-tap" href={ev.href} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--red)", textDecoration: "none", marginTop: 8 }}>
          Event details <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
        </Link>
      )}
    </aside>
  );
}

function CacWorldTeaserWidget({ item }: { item: CacWorldNewsItem }) {
  return (
    <aside style={{
      background: "linear-gradient(140deg,var(--ink),var(--blue))",
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

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // db.schema: "cacna" -- see lib/supabase/server.ts's comment; without it
  // this silently hits cac-salvation-center's own project instead.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "cacna" } }
  );
  const { data: dbRows } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, body, published_at, created_at, image_url, image_alt")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const cacWorldNews = await getLatestCacWorldNews(6);
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

  const topics = [
    conventionCoverage.length > 0 && { href: "#convention-coverage", label: "Convention" },
    archiveArticles.length > 0 && { href: "#archives", label: "Archive" },
    cacWorldNews.length > 0 && { href: "#cac-world", label: "CAC World" },
    devotionalArticles.length > 0 && { href: "#devotionals", label: "Devotionals" },
  ].filter(Boolean) as { href: string; label: string }[];

  const archiveShown = archiveArticles.slice(0, ARCHIVE_VISIBLE);
  const archiveMore = archiveArticles.slice(ARCHIVE_VISIBLE);

  return (
    <main id="main-content" className="ed-page">
      <Nav />

      <header className="ed-masthead">
        <div className="ed-wrap">
          <p className="ed-date">{dateStr}</p>
          <h1>News &amp; Stories</h1>
          <p className="ed-tagline">
            Messages, reports and reflections from Christ Apostolic Church North America.
          </p>
          <nav aria-label="Blog sections" className="ed-topics">
            {topics.map((t) => (
              <a key={t.href} href={t.href}>{t.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <div className="ed-wrap ed-body">
        <div className="ed-main">
          <LeadStory post={featured} />

          {conventionCoverage.length > 0 && (
            <Section id="convention-coverage" title="Convention coverage" note="Addresses, messages and highlights">
              {conventionCoverage.map((p) => <StoryRow key={p.slug} post={p} />)}
            </Section>
          )}

          {archiveArticles.length > 0 && (
            <Section id="archives" title="From the archive" note={`${archiveArticles.length} earlier entries`}>
              {archiveShown.map((p) => <StoryRow key={p.slug} post={p} archival />)}
              {archiveMore.length > 0 && (
                <details className="ed-more">
                  <summary>Show {archiveMore.length} more archive entries</summary>
                  {archiveMore.map((p) => <StoryRow key={p.slug} post={p} archival />)}
                </details>
              )}
            </Section>
          )}

          {cacWorldNews.length > 0 && (
            <Section id="cac-world" title="From CAC World" note="News from the worldwide church, via cacworldnews.com">
              {cacWorldNews.map((item) => <WorldRow key={item.id} item={item} />)}
            </Section>
          )}

          {devotionalArticles.length > 0 && (
            <Section id="devotionals" title="Devotionals" note="Short reflections on Scripture">
              {devotionalArticles.map((p) => <StoryRow key={p.slug} post={p} />)}
            </Section>
          )}
        </div>

        <aside className="ed-side" aria-label="Also from CACNA">
          <UpcomingEventWidget />
          <ConventionAdWidget />
          {cacWorldNews[0] && <CacWorldTeaserWidget item={cacWorldNews[0]} />}
          <GivingAdWidget campaign={givingCampaign} />
        </aside>
      </div>

      <FooterExperience />
    </main>
  );
}
