"use client";

import { useState, useTransition } from "react";
import { updateImage, removeImage } from "@/app/admin/(protected)/gallery/actions";

type ImageRow = {
  id: string;
  cloudinary_public_id: string;
  caption: string | null;
  alt_text: string | null;
  category: string;
  sort_order: number;
  published: boolean;
};

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

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--ink)",
  marginBottom: 6,
};

export default function GalleryImageForm({ image }: { image: ImageRow }) {
  const [caption, setCaption] = useState(image.caption ?? "");
  const [altText, setAltText] = useState(image.alt_text ?? "");
  const [category, setCategory] = useState(image.category);
  const [sortOrder, setSortOrder] = useState(image.sort_order);
  const [published, setPublished] = useState(image.published);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateImage(image.id, formData);
        setSaved(true);
      } catch (err) {
        if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
        setError(err instanceof Error ? err.message : "Failed to save");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Remove this photo from the gallery? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await removeImage(image.id);
      } catch (err) {
        if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
        setError(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <style>{`
        .adm-inp { transition: border-color 0.15s, box-shadow 0.15s; }
        .adm-inp:focus-visible { border-color: var(--red); box-shadow: 0 0 0 3px rgba(214,40,40,0.12); }
        .adm-inp:hover:not(:focus-visible) { border-color: rgba(27,19,14,0.24); }
      `}</style>
      <div>
        <label style={lbl}>Caption <span style={{ fontWeight: 400, opacity: 0.5 }}>(optional)</span></label>
        <input
          name="caption"
          value={caption}
          onChange={(e) => { setCaption(e.target.value); setSaved(false); }}
          placeholder="Short description of the photo"
          className="adm-inp"
          style={inp}
        />
      </div>

      <div>
        <label style={lbl}>Alt Text <span style={{ fontWeight: 400, opacity: 0.5 }}>(for accessibility)</span></label>
        <input
          name="alt_text"
          value={altText}
          onChange={(e) => { setAltText(e.target.value); setSaved(false); }}
          placeholder="Describe the image content"
          className="adm-inp"
          style={inp}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div>
          <label style={lbl}>Category</label>
          <select
            name="category"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setSaved(false); }}
            className="adm-inp"
            style={{ ...inp, background: "white" }}
          >
            <option value="general">General</option>
            <option value="worship">Worship</option>
            <option value="events">Events</option>
            <option value="community">Community</option>
            <option value="leadership">Leadership</option>
          </select>
        </div>
        <div>
          <label style={lbl}>Sort Order</label>
          <input
            name="sort_order"
            type="number"
            value={sortOrder}
            onChange={(e) => { setSortOrder(Number(e.target.value)); setSaved(false); }}
            className="adm-inp"
            style={inp}
          />
        </div>
      </div>

      <div>
        <input type="hidden" name="published" value={published ? "true" : "false"} />
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "var(--ink)" }}>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => { setPublished(e.target.checked); setSaved(false); }}
            style={{ width: 16, height: 16, cursor: "pointer" }}
          />
          Published (visible on gallery page)
        </label>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", paddingTop: 4 }}>
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
          {isPending ? "Saving…" : "Save Changes"}
        </button>

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
          Remove Photo
        </button>

        {error && <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }}>{error}</p>}
        {saved && <p style={{ color: "#16a34a", fontSize: 14, margin: 0 }}>Saved!</p>}
      </div>
    </form>
  );
}
