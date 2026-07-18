import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";
import { addImage, removeImage, toggleImagePublished } from "./actions";

export default async function GalleryAdminPage() {
  const supabase = createServiceClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("id, cloudinary_public_id, caption, alt_text, category, sort_order, published, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div>
      <style>{`
        .adm-inp { transition: border-color 0.15s, box-shadow 0.15s; }
        .adm-inp:focus-visible { border-color: var(--red); box-shadow: 0 0 0 3px rgba(214,40,40,0.12); outline: none; }
        .adm-inp:hover:not(:focus-visible) { border-color: rgba(27,19,14,0.24); }
      `}</style>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>
          Gallery
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0 }}>
          Manage photos shown on the public gallery page
        </p>
      </div>

      {/* Add Photo Form */}
      <div style={{
        background: "white",
        borderRadius: 12,
        padding: "28px 32px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        marginBottom: 36,
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: "0 0 16px" }}>
          Add Photo
        </h2>
        <form action={addImage} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
              Cloudinary Public ID <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <input
              name="cloudinary_public_id"
              required
              className="adm-inp"
              placeholder="e.g. congregation/sunday-service-2024"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid rgba(0,0,0,0.15)",
                borderRadius: 8,
                fontSize: 14,
                color: "var(--ink)",
                fontFamily: "inherit",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                Caption <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                name="caption"
                className="adm-inp"
                placeholder="Short caption for this photo"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1.5px solid rgba(0,0,0,0.15)",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "var(--ink)",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                Alt Text <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                name="alt_text"
                className="adm-inp"
                placeholder="Describe the image for accessibility"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1.5px solid rgba(0,0,0,0.15)",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "var(--ink)",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                Category
              </label>
              <select
                name="category"
                className="adm-inp"
                defaultValue="general"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1.5px solid rgba(0,0,0,0.15)",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "var(--ink)",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  background: "white",
                  outline: "none",
                }}
              >
                <option value="general">General</option>
                <option value="worship">Worship</option>
                <option value="events">Events</option>
                <option value="community">Community</option>
                <option value="leadership">Leadership</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                Sort Order
              </label>
              <input
                name="sort_order"
                type="number"
                className="adm-inp"
                defaultValue={0}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1.5px solid rgba(0,0,0,0.15)",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "var(--ink)",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0 }}>
              Enter the Cloudinary public ID of an image already uploaded to the CAC account (cloud: dkmn2rtbc)
            </p>
            <button
              type="submit"
              style={{
                background: "var(--red)",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              Add Photo
            </button>
          </div>
        </form>
      </div>

      {/* Photo Grid */}
      {!images?.length ? (
        <div style={{
          background: "white",
          borderRadius: 12,
          padding: "48px 32px",
          textAlign: "center",
          color: "var(--ink-soft)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <p style={{ fontSize: 16, margin: 0 }}>No photos yet. Add your first photo above.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}>
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                background: "white",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={`https://res.cloudinary.com/dkmn2rtbc/image/upload/f_auto,q_auto,w_400/${img.cloudinary_public_id}`}
                alt={img.alt_text ?? img.caption ?? "Gallery image"}
                style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10 }}
              />
              <div style={{ padding: "10px 12px" }}>
                {img.caption && (
                  <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "0 0 8px", lineHeight: 1.4 }}>
                    {img.caption}
                  </p>
                )}
                <div style={{ marginBottom: 10 }}>
                  <span style={{
                    background: img.published ? "#dcfce7" : "#f1f5f9",
                    color: img.published ? "#15803d" : "#64748b",
                    padding: "2px 9px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    {img.published ? "Published" : "Hidden"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Link
                    href={`/admin/gallery/${img.id}`}
                    style={{
                      flex: 1,
                      background: "transparent",
                      color: "var(--red)",
                      border: "1.5px solid var(--red)",
                      borderRadius: 6,
                      padding: "5px 0",
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: "none",
                      textAlign: "center",
                      display: "block",
                    }}
                  >
                    Edit
                  </Link>
                  <form action={toggleImagePublished.bind(null, img.id, !img.published)} style={{ flex: 1 }}>
                    <button
                      type="submit"
                      style={{
                        width: "100%",
                        background: "transparent",
                        color: img.published ? "#64748b" : "#15803d",
                        border: `1.5px solid ${img.published ? "rgba(0,0,0,0.15)" : "#16a34a"}`,
                        borderRadius: 6,
                        padding: "5px 0",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {img.published ? "Hide" : "Show"}
                    </button>
                  </form>
                  <form action={removeImage.bind(null, img.id)}>
                    <button
                      type="submit"
                      style={{
                        background: "transparent",
                        color: "#dc2626",
                        border: "1.5px solid #dc2626",
                        borderRadius: 6,
                        padding: "5px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      ✕
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
