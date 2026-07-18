"use client";

import { useState } from "react";
import { ShoppingBag, Shirt, BookOpen, Music2, Printer, Mail, ExternalLink } from "lucide-react";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { Reveal } from "@/components/ui/Reveal";

type Product = {
  id: string;
  name: string;
  category: string;
  price_cents: number;
  price_display: string;
  image_url: string | null;
  image_alt: string | null;
  badge: string | null;
  description: string | null;
  order_method: string;
  external_link: string | null;
  external_label: string | null;
  is_digital: boolean;
};

const CATEGORY_ICONS: Record<string, typeof ShoppingBag> = {
  apparel: Shirt,
  bibles:  BookOpen,
  music:   Music2,
  prints:  Printer,
};

const CATEGORY_ACCENTS: Record<string, string> = {
  apparel: "linear-gradient(135deg,#1B130E,#3A2518)",
  bibles:  "linear-gradient(135deg,#9E1B1B,#D62828)",
  music:   "linear-gradient(135deg,#E8A33D,#C87E20)",
  prints:  "linear-gradient(135deg,#D62828,#9E1B1B)",
  other:   "linear-gradient(135deg,#2C1F14,#4A2C18)",
};

function mailLink(name: string) {
  const sub = encodeURIComponent(`Store Order: ${name}`);
  const body = encodeURIComponent(
    `Hello,\n\nI would like to order "${name}" from the Salvation Center Store.\n\nPlease send me details on sizing/options, pricing, and how to proceed.\n\nThank you.`
  );
  return `mailto:info@cacsalvationcenter.org?subject=${sub}&body=${body}`;
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function StoreProducts({ products }: { products: Product[] }) {
  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <>
      {/* Category filter tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          overflowX: "auto",
          marginBottom: 32,
          paddingBottom: 4,
        }}
      >
        {categories.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: "7px 18px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.5px",
                cursor: "pointer",
                border: isActive ? "1.5px solid transparent" : "1.5px solid var(--line)",
                background: isActive ? "var(--red)" : "transparent",
                color: isActive ? "#fff" : "var(--ink-soft)",
                transition: "background .15s, color .15s",
                fontFamily: "var(--font-body)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {cat === "all" ? "All" : capitalize(cat)}
            </button>
          );
        })}
      </div>

      {/* Product grid or empty state */}
      {!filtered.length ? (
        <Reveal>
          <div
            style={{
              textAlign: "center",
              padding: "80px 32px",
              background: "var(--paper)",
              borderRadius: 20,
              border: "1px solid var(--line)",
            }}
          >
            <ShoppingBag size={40} color="rgba(27,19,14,.18)" strokeWidth={1.5} aria-hidden />
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", margin: "20px 0 8px" }}>Coming soon</p>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0 }}>
              Products will be listed here. Check back soon, or{" "}
              <a href="mailto:info@cacsalvationcenter.org" style={{ color: "var(--red)", fontWeight: 600 }}>
                contact us
              </a>{" "}
              to order directly.
            </p>
          </div>
        </Reveal>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,280px), 1fr))",
            gap: 24,
          }}
        >
          {filtered.map((product, i) => {
            const Icon = CATEGORY_ICONS[product.category] ?? ShoppingBag;
            const accent = CATEGORY_ACCENTS[product.category] ?? CATEGORY_ACCENTS.other;
            return (
              <Reveal key={product.id} delay={i * 60}>
                <article
                  style={{
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                    borderRadius: 22,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 8px 28px rgba(27,19,14,.07)",
                    height: "100%",
                  }}
                >
                  {/* Image band */}
                  <div
                    style={{
                      height: 160,
                      background: product.image_url ? "var(--cream-2)" : accent,
                      position: "relative",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image_url}
                        alt={product.image_alt ?? product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                        <Icon size={48} color="rgba(255,255,255,.25)" strokeWidth={1.5} aria-hidden />
                      </div>
                    )}
                    {product.badge && (
                      <div
                        style={{
                          position: "absolute", top: 14, left: 14,
                          background: "rgba(255,255,255,.18)", backdropFilter: "blur(6px)",
                          border: "1px solid rgba(255,255,255,.28)", borderRadius: 999,
                          padding: "4px 12px", fontSize: 11, fontWeight: 800,
                          letterSpacing: "1.5px", textTransform: "uppercase", color: "#fff",
                        }}
                      >
                        {product.badge}
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute", bottom: 14, right: 14,
                        fontFamily: "var(--font-display)", fontWeight: 800,
                        fontSize: 22, color: "#fff",
                        textShadow: "0 1px 6px rgba(0,0,0,.5)",
                      }}
                    >
                      {product.price_display}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "20px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                    {product.category && (
                      <span
                        style={{
                          fontSize: 11, fontWeight: 800, letterSpacing: "1.8px",
                          textTransform: "uppercase", color: "var(--red)", marginBottom: 6,
                        }}
                      >
                        {product.category}
                      </span>
                    )}
                    <h3
                      style={{
                        fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18,
                        color: "var(--ink)", margin: "0 0 8px", lineHeight: 1.2, letterSpacing: "-.3px",
                      }}
                    >
                      {product.name}
                    </h3>
                    {product.description && (
                      <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.7, margin: "0 0 18px", flex: 1 }}>
                        {product.description}
                      </p>
                    )}
                    <div style={{ marginTop: "auto" }}>
                      {product.order_method === "external" && product.external_link && (
                        <a
                          href={product.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 14,
                            padding: "12px 20px", borderRadius: 999, textDecoration: "none",
                            boxShadow: "0 8px 20px rgba(27,19,14,.18)",
                          }}
                        >
                          <ExternalLink size={14} strokeWidth={2.2} aria-hidden />
                          {product.external_label || "Order"}
                        </a>
                      )}
                      {product.order_method === "email" && (
                        <a
                          href={mailLink(product.name)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 14,
                            padding: "12px 20px", borderRadius: 999, textDecoration: "none",
                            boxShadow: "0 8px 20px rgba(27,19,14,.18)",
                          }}
                        >
                          <Mail size={14} strokeWidth={2.2} aria-hidden />
                          Request order
                        </a>
                      )}
                      {product.order_method === "stripe" && (
                        <AddToCartButton
                          id={product.id}
                          name={product.name}
                          category={product.category}
                          priceCents={product.price_cents}
                          priceDisplay={product.price_display}
                          accent={accent}
                          isDigital={product.is_digital}
                        />
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}
    </>
  );
}
