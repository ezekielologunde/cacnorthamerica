import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import PostForm from "@/components/admin/PostForm";

type PostRow = { id: string; title: string; slug: string; excerpt: string | null; body: string; published: boolean };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const result = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, body, published")
    .eq("id", id)
    .single();

  const post = result.data as PostRow | null;
  if (!post) notFound();

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin/blog" style={{ color: "var(--ink-soft)", fontSize: 13, textDecoration: "none" }}>
          ← Blog Posts
        </Link>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "8px 0 0" }}>
            Edit Post
          </h1>
          {post.published && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, fontWeight: 600, color: "var(--red)", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              View on site ↗
            </Link>
          )}
        </div>
      </div>
      <div style={{ background: "white", borderRadius: 12, padding: "32px 36px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <PostForm post={{ id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt, body: post.body, published: post.published }} />
      </div>
    </div>
  );
}
