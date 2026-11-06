import { notFound } from "next/navigation";
import "@/app/(site)/[locale]/mobile-events-media.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Share2, ExternalLink } from "lucide-react";
import { Nav } from "@/components/navigation/Nav";
import { FooterExperience } from "@/components/sections/FooterExperience";
import { POSTS, getPost } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/site";
import { BylineCompact, BylineFull } from "@/components/blog/Byline";
import { parseAuthors } from "@/lib/blog-authors";
import { ConventionAdWidget } from "@/components/blog/ConventionAdWidget";
import { BlogAd } from "@/components/blog/BlogAd";
import { ServeCallout } from "@/components/ServeCallout";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { setRequestLocale } from "next-intl/server";

// db.schema: "cacna" -- see lib/supabase/server.ts's comment; without it
// this silently hits cac-salvation-center's own project instead.
function makePublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "cacna" } }
  );
}

function dbRowToPost(row: {
  title: string; slug: string; excerpt: string | null; body: string;
  published_at: string | null; created_at: string;
  image_url?: string | null; image_alt?: string | null; authors?: unknown;
}): BlogPost {
  const date = new Date(row.published_at ?? row.created_at);
  const words = row.body.split(/\s+/).length;
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? row.body.slice(0, 160) + "…",
    date: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    dateIso: row.published_at ?? row.created_at,
    category: "Ministry Update",
    categoryColor: "var(--red)",
    accent: "var(--red)",
    readTime: `${Math.max(1, Math.round(words / 200))} min read`,
    image: row.image_url ? { url: row.image_url, alt: row.image_alt ?? row.title } : undefined,
    authors: parseAuthors(row.authors),
    body: row.body.split(/\n\n+/),
  };
}

export async function generateStaticParams() {
  const staticParams = POSTS.map((p) => ({ slug: p.slug }));
  try {
    const { data } = await makePublicClient()
      .from("blog_posts")
      .select("slug")
      .eq("published", true);
    const dbParams = (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
    return [...staticParams, ...dbParams];
  } catch {
    return staticParams;
  }
}

async function resolvePost(slug: string): Promise<BlogPost | null> {
  const post = getPost(slug);
  if (post) return post;
  try {
    const { data } = await makePublicClient()
      .from("blog_posts")
      .select("title, slug, excerpt, body, published_at, created_at, image_url, image_alt, authors")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return data ? dbRowToPost(data) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — CACNA`,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.dateIso,
    },
  };
}

function renderBody(text: string): ReactNode[] {
  const parts: ReactNode[] = [];

  function parseInline(raw: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    let cursor = 0;
    const combined = /\*\*(.+?)\*\*|_(.+?)_/g;
    let m: RegExpExecArray | null;
    while ((m = combined.exec(raw)) !== null) {
      if (m.index > cursor) nodes.push(raw.slice(cursor, m.index));
      if (m[1] !== undefined) nodes.push(<strong key={m.index}>{m[1]}</strong>);
      else if (m[2] !== undefined) nodes.push(<em key={m.index}>{m[2]}</em>);
      cursor = m.index + m[0].length;
    }
    if (cursor < raw.length) nodes.push(raw.slice(cursor));
    return nodes;
  }

  parts.push(...parseInline(text));
  return parts;
}

function BodyParagraph({ text, first }: { text: string; first?: boolean }) {
  return <p className={first ? "ed-post-p ed-post-lead" : "ed-post-p"}>{renderBody(text)}</p>;
}

function RelatedRow({ post }: { post: BlogPost }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="ed-row">
      <div className="ed-row-text">
        <p className="ed-kicker">{post.category}</p>
        <h3 className="ed-row-title">
          <Link href={href}>{post.title}</Link>
        </h3>
        <p className="ed-row-dek">{post.excerpt}</p>
        <p className="ed-meta">
          <BylineCompact authors={post.authors} />
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </p>
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


export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await resolvePost(slug);
  if (!post) notFound();

  // Fetch recent DB posts to include alongside static posts
  let dbRelated: BlogPost[] = [];
  try {
    const { data } = await makePublicClient()
      .from("blog_posts")
      .select("title, slug, excerpt, body, published_at, created_at, image_url, image_alt, authors")
      .eq("published", true)
      .neq("slug", slug)
      .order("published_at", { ascending: false })
      .limit(6);
    dbRelated = (data ?? []).map(dbRowToPost);
  } catch {
    // fall through to static posts only
  }
  // DB posts first (newest), then static — deduped by slug
  const seen = new Set<string>([slug]);
  const allRelated: BlogPost[] = [];
  for (const p of [...dbRelated, ...POSTS]) {
    if (!seen.has(p.slug)) { seen.add(p.slug); allRelated.push(p); }
  }
  const related = allRelated.slice(0, 3);

  const shareUrl = `${SITE_URL}/blog/${post.slug}`;
  const shareText = encodeURIComponent(`${post.title} — ${shareUrl}`);
  const whatsappUrl = `https://wa.me/?text=${shareText}`;

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <main id="main-content" className="ed-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
      <Nav />

      <header className="ed-post-head">
        <div className="ed-post-col">
          <Link href="/blog" className="ed-back">
            <ArrowLeft size={15} strokeWidth={2.5} aria-hidden /> News &amp; Stories
          </Link>
          <p className="ed-kicker">{post.category}</p>
          <h1 className="ed-post-title">{post.title}</h1>
          <p className="ed-post-dek">{post.excerpt}</p>
          <BylineFull authors={post.authors} />
          <div className="ed-post-by">
            <p className="ed-meta" style={{ margin: 0 }}>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </p>
            <a className="ed-share" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Share2 size={14} strokeWidth={2.5} aria-hidden /> Share on WhatsApp
            </a>
            {post.href && (
              <Link href={post.href} className="ed-share">
                Event details <ExternalLink size={13} strokeWidth={2.5} aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Landscape photos run wide above the text; portrait photos (headshots)
          sit inline with the prose instead, so a tall face is never cropped
          into a short band. Click either to view full-size. */}
      {post.image && post.image.orientation !== "portrait" && (
        <figure className="ed-post-hero">
          <div className="ed-post-hero-img">
            <ImageLightbox src={post.image.url} alt={post.image.alt} />
          </div>
        </figure>
      )}

      <div className="ed-post-col ed-post-body">
        <article>
          {post.image && post.image.orientation === "portrait" && (
            <div className="ed-post-portrait">
              <div style={{ position: "relative", aspectRatio: "3 / 4" }}>
                <ImageLightbox src={post.image.url} alt={post.image.alt} objectPosition="center 20%" />
              </div>
            </div>
          )}
          {post.body.map((para, i) => (
            <BodyParagraph key={i} text={para} first={i === 0} />
          ))}
          <div style={{ clear: "both" }} />
          {post.gallery && post.gallery.length > 0 && (
            <div className="ed-post-gallery">
              {post.gallery.map((g) => (
                <div key={g.url} style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: 6, overflow: "hidden" }}>
                  <ImageLightbox src={g.url} alt={g.alt} />
                </div>
              ))}
            </div>
          )}
        </article>

        <div className="ed-post-after">
          <ServeCallout style={{ marginTop: 0 }} />
          <ConventionAdWidget />
          <BlogAd />
        </div>
      </div>

      <section className="ed-post-next">
        <div className="ed-wrap">
          <header className="ed-section-head">
            <h2>Read next</h2>
            <Link href="/blog" className="ed-share">All stories →</Link>
          </header>
          {related.map((p) => (
            <RelatedRow key={p.slug} post={p} />
          ))}
        </div>
      </section>

      <FooterExperience />
    </main>
  );
}
