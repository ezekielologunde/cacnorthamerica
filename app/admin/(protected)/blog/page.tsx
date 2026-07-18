import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function BlogListPage() {
  const supabase = createServiceClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, published, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <style>{`.adm-row:hover { background: var(--cream); transition: background 0.1s; }`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0, display: "flex", alignItems: "center" }}>
          Blog Posts
          {!!posts?.length && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-soft)", marginLeft: 10 }}>{posts.length}</span>}
        </h1>
        <Link
          href="/admin/blog/new"
          style={{ background: "var(--red)", color: "white", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}
        >
          + New Post
        </Link>
      </div>

      {!posts?.length ? (
        <div style={{ background: "white", borderRadius: 12, padding: "48px 32px", textAlign: "center", color: "var(--ink-soft)" }}>
          <p style={{ fontSize: 16, margin: "0 0 12px" }}>No posts yet.</p>
          <Link href="/admin/blog/new" style={{ color: "var(--red)", fontWeight: 600 }}>Create your first post →</Link>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#fafafa" }}>
                {["Title", "Slug", "Status", "Date", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post.id} className="adm-row" style={{ borderBottom: i < posts.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <Link href={`/admin/blog/${post.id}`} style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
                      {post.title}
                    </Link>
                  </td>
                  <td style={{ padding: "14px 20px", fontFamily: "monospace", fontSize: 12, color: "var(--ink-soft)" }}>
                    {post.slug}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{
                      background: post.published ? "#dcfce7" : "#fef9c3",
                      color: post.published ? "#15803d" : "#854d0e",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--ink-soft)" }}>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                    }
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <Link
                      href={`/admin/blog/${post.id}`}
                      style={{ color: "var(--red)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
