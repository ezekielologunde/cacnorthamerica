"use client";

import { useState, useTransition, useEffect } from "react";
import { createPost, updatePost, deletePost } from "@/app/admin/(protected)/blog/actions";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  published: boolean;
  image_url: string | null;
  image_alt: string | null;
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
}

const inp: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid rgba(0,0,0,0.12)",
  borderRadius: 8,
  fontSize: 15,
  fontFamily: "inherit",
  background: "white",
  boxSizing: "border-box",
  outline: "none",
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--ink)",
  marginBottom: 6,
};

const muted: React.CSSProperties = { fontWeight: 400, opacity: 0.5 };

export default function PostForm({ post }: { post?: Post }) {
  const isEdit = !!post;
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [imageUrl, setImageUrl] = useState(post?.image_url ?? "");
  const [imageAlt, setImageAlt] = useState(post?.image_alt ?? "");
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const id = "cloudinary-widget-script";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://upload-widget.cloudinary.com/global/all.js";
    document.head.appendChild(s);
  }, []);

  function openUploadWidget() {
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dkmn2rtbc";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cld = (window as any).cloudinary;
    if (!cld) { alert("Upload widget is still loading — try again in a moment."); return; }
    setUploading(true);
    const widget = cld.createUploadWidget(
      {
        cloudName: cloud,
        uploadSignature: async (
          callback: (data: Record<string, string>) => void,
          paramsToSign: Record<string, string | number>,
        ) => {
          const res = await fetch("/api/cloudinary/sign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paramsToSign),
          });
          callback(await res.json());
        },
        multiple: false,
        folder: "blog",
        sources: ["local", "url", "camera"],
        cropping: false,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_err: unknown, result: any) => {
        if (result?.event === "close") setUploading(false);
        if (result?.event === "success") {
          setImageUrl(result.info.secure_url);
          setImageAlt((prev) => prev || (result.info.original_filename ?? ""));
          setSaved(false);
          setUploading(false);
        }
      },
    );
    widget.open();
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    if (!slugTouched) setSlug(slugify(val));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (isEdit) {
          await updatePost(post.id, formData);
          setSaved(true);
        } else {
          await createPost(formData);
        }
      } catch (err) {
        if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
        setError(err instanceof Error ? err.message : "Failed to save");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deletePost(post!.id);
      } catch (err) {
        if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
        setError(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 820 }}>
      <style>{`
        .adm-inp { transition: border-color 0.15s, box-shadow 0.15s; }
        .adm-inp:focus-visible { border-color: var(--red); box-shadow: 0 0 0 3px rgba(200,30,58,0.12); }
        .adm-inp:hover:not(:focus-visible) { border-color: rgba(18,20,30,0.24); }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        <div>
          <label style={label}>Title *</label>
          <input name="title" value={title} onChange={handleTitleChange} required className="adm-inp" style={inp} />
        </div>

        <div>
          <label style={label}>
            Slug * <span style={muted}>— appears in the URL</span>
          </label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); setSaved(false); }}
            required
            className="adm-inp"
            style={{ ...inp, fontFamily: "monospace", fontSize: 13 }}
          />
        </div>

        <div>
          <label style={label}>
            Excerpt <span style={muted}>— short summary shown on blog index</span>
          </label>
          <textarea
            name="excerpt"
            value={excerpt}
            onChange={(e) => { setExcerpt(e.target.value); setSaved(false); }}
            rows={3}
            className="adm-inp"
            style={{ ...inp, resize: "vertical" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div>
            <label style={label}>Cover Photo <span style={muted}>— optional</span></label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="url"
                name="image_url"
                value={imageUrl}
                onChange={(e) => { setImageUrl(e.target.value); setSaved(false); }}
                placeholder="https://…"
                className="adm-inp"
                style={{ ...inp, flex: 1 }}
              />
              <button
                type="button"
                onClick={openUploadWidget}
                disabled={uploading}
                style={{
                  padding: "10px 14px",
                  background: "var(--ink)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: uploading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  opacity: uploading ? 0.65 : 1,
                }}
              >
                {uploading ? "…" : "Upload"}
              </button>
            </div>
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={imageAlt || "preview"} style={{ marginTop: 8, maxHeight: 80, borderRadius: 6, objectFit: "cover", display: "block" }} />
            )}
          </div>
          <div>
            <label style={label}>Image Alt Text <span style={muted}>— optional</span></label>
            <input
              name="image_alt"
              value={imageAlt}
              onChange={(e) => { setImageAlt(e.target.value); setSaved(false); }}
              className="adm-inp"
              style={inp}
            />
          </div>
        </div>

        <div>
          <label style={label}>
            Body * <span style={muted}>— Markdown supported</span>
          </label>
          <textarea
            name="body"
            value={body}
            onChange={(e) => { setBody(e.target.value); setSaved(false); }}
            rows={24}
            required
            className="adm-inp"
            style={{ ...inp, resize: "vertical", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6 }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input type="hidden" name="published" value={published ? "true" : "false"} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "var(--ink)" }}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => { setPublished(e.target.checked); setSaved(false); }}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            Publish (visible on site)
          </label>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", paddingTop: 8 }}>
          <button
            type="submit"
            disabled={isPending}
            style={{
              background: "var(--red)",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor: isPending ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: isPending ? 0.65 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Post"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              style={{
                background: "transparent",
                color: "#dc2626",
                border: "1.5px solid #dc2626",
                borderRadius: 8,
                padding: "9px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: isPending ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              Delete
            </button>
          )}

          {error && <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }}>{error}</p>}
          {saved && <p style={{ color: "#16a34a", fontSize: 14, margin: 0 }}>Saved!</p>}
        </div>

      </div>
    </form>
  );
}
