import Image from "next/image";
import { ArrowUpRight, BookOpen } from "lucide-react";
import type { StoreProduct } from "@/lib/conventions";

// CACNA Christian Education sells these manuals through its own shop, so
// this page presents them and sends the order there instead of re-selling
// them in this site's cart.
export const EDUCATION_SHOP_URL = "https://cacnachristianeducation.com/shop";

export function EducationMaterials({ products }: { products: StoreProduct[] }) {
  const shelf = products.filter((p) => p.imageSrc && p.name.startsWith("2027"));

  return (
    <section style={{ background: "var(--ink)", padding: "clamp(48px,7vw,84px) 0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(20px,5vw,64px)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap", justifyContent: "space-between" }}>
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px,4.4vw,40px)", letterSpacing: "-0.03em", color: "#fff", margin: 0, lineHeight: 1.05 }}>
              Christian Education materials
            </h2>
            <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.65, color: "rgba(245,246,250,.74)" }}>
              Sunday School lessons, Bible study manuals and devotionals are ordered from the Christian Education Department&apos;s own shop, not from this page.
            </p>
          </div>
          <a
            href={EDUCATION_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="press"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 48, padding: "0 24px", borderRadius: 999, background: "#fff", color: "var(--ink)", fontWeight: 800, fontSize: 15, textDecoration: "none" }}
          >
            Order at cacnachristianeducation.com
            <ArrowUpRight size={18} aria-hidden />
          </a>
        </div>

        {shelf.length > 0 && (
          <ul
            aria-label="2027 materials"
            style={{ listStyle: "none", margin: "34px -20px 0", padding: "4px 20px 18px", display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            {shelf.map((p) => (
              <li key={p.id} style={{ flex: "0 0 auto", width: 148, scrollSnapAlign: "start" }}>
                <a href={EDUCATION_SHOP_URL} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", borderRadius: 14, overflow: "hidden", background: "rgba(245,246,250,.08)", boxShadow: "0 10px 24px rgba(0,0,0,.35)" }}>
                    <Image src={p.imageSrc!} alt="" fill sizes="148px" style={{ objectFit: "cover" }} />
                  </div>
                  <span style={{ display: "block", marginTop: 10, fontSize: 13, fontWeight: 600, lineHeight: 1.35, color: "rgba(245,246,250,.85)" }}>
                    {p.name.replace(/^2027\s+/, "")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <p style={{ margin: "8px 0 0", display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "rgba(245,246,250,.6)" }}>
          <BookOpen size={16} aria-hidden /> Prices and availability are set by the shop.
        </p>
      </div>
    </section>
  );
}
