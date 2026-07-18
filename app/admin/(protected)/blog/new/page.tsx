import Link from "next/link";
import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin/blog" style={{ color: "var(--ink-soft)", fontSize: 13, textDecoration: "none" }}>
          ← Blog Posts
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "8px 0 0" }}>New Post</h1>
      </div>
      <div style={{ background: "white", borderRadius: 12, padding: "32px 36px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <PostForm />
      </div>
    </div>
  );
}
