"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shirt, BookOpen, Music2, Printer, ShoppingBag,
  Star, ExternalLink, Mail, Plus, Check,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartSidebar } from "@/components/store/CartSidebar";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import type { StoreProduct, ProductCategory } from "@/lib/products";
import Image from "next/image";
import { playAdd, haptic } from "@/lib/feedback";

const EMAIL = "info@cacsalvationcenter.org";

function mailLink(product: string) {
  const sub = encodeURIComponent(`Store Order: ${product}`);
  const body = encodeURIComponent(
    `Hello,\n\nI would like to order "${product}" from the Salvation Center Store.\n\nPlease send me details on sizing/options, pricing, and how to proceed.\n\nThank you.`
  );
  return `mailto:${EMAIL}?subject=${sub}&body=${body}`;
}

const CATEGORY_ICONS: Record<ProductCategory, typeof ShoppingBag> = {
  apparel: Shirt,
  bibles:  BookOpen,
  music:   Music2,
  prints:  Printer,
};

function ProductCard({ p }: { p: StoreProduct }) {
  const Icon = CATEGORY_ICONS[p.category];
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string>(
    p.variants?.options[0] ?? ""
  );
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!p.priceCents) return;
    addItem({
      id: p.id,
      name: p.name,
      category: p.category,
      priceCents: p.priceCents,
      priceDisplay: p.priceDisplay,
      variant: p.variants ? `${p.variants.label}: ${selectedVariant}` : undefined,
      accent: p.accent,
      isDigital: p.isDigital,
    });
    setAdded(true);
    playAdd();
    haptic([40, 20, 40]);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {/* Card with green ring pulse on add */}
      <motion.article
        className="card-lift"
        animate={{
          boxShadow: added
            ? "0 0 0 2.5px rgba(34,197,94,.55), 0 14px 36px rgba(27,19,14,.08)"
            : "0 14px 36px rgba(27,19,14,.08)",
          scale: added ? [1, 1.018, 1] : 1,
        }}
        transition={{
          scale:     { duration: 0.32, ease: "easeOut" },
          boxShadow: { duration: 0.22 },
        }}
        style={{
          height: "100%", background: "var(--paper)",
          border: "1px solid var(--line)", borderRadius: 22,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        {/* Color band */}
        <div style={{ height: 140, background: p.accent, position: "relative", flexShrink: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 25%,rgba(255,255,255,.15),transparent 55%)" }} />
          {p.image ? (
            <>
              <Image
                src={p.image}
                alt={p.imageAlt ?? p.name}
                fill
                sizes="(max-width: 640px) 45vw, 30vw"
                style={{ objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.52) 0%,transparent 52%)" }} />
            </>
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <Icon size={48} color="rgba(255,255,255,.22)" strokeWidth={1.5} aria-hidden />
            </div>
          )}
          {p.badge && (
            <div style={{
              position: "absolute", top: 14, left: 14,
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(255,255,255,.18)", backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,.28)", borderRadius: 999,
              padding: "4px 12px", fontSize: 11, fontWeight: 800,
              letterSpacing: "1.5px", textTransform: "uppercase", color: "#fff",
            }}>
              <Star size={10} aria-hidden /> {p.badge}
            </div>
          )}
          <div style={{
            position: "absolute", bottom: 14, right: 14,
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: 22, color: "#fff", letterSpacing: "-.3px",
            textShadow: p.image ? "0 1px 6px rgba(0,0,0,.6)" : "none",
          }}>
            {p.priceDisplay}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "22px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: 18, letterSpacing: "-.4px", color: "var(--ink)",
            margin: "0 0 8px", lineHeight: 1.18,
          }}>
            {p.name}
          </h3>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.72, margin: "0 0 18px", flex: 1 }}>
            {p.desc}
          </p>

          {p.variants && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 8 }}>
                {p.variants.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {p.variants.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariant(opt)}
                    aria-pressed={selectedVariant === opt}
                    style={{
                      padding: "5px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 700,
                      cursor: "pointer",
                      background: selectedVariant === opt ? "var(--ink)" : "var(--cream-2)",
                      color: selectedVariant === opt ? "#fff" : "var(--ink)",
                      border: `1.5px solid ${selectedVariant === opt ? "var(--ink)" : "var(--line)"}`,
                      transition: "all .15s",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {p.orderMethod === "stripe" && p.priceCents && (
            <button
              onClick={handleAdd}
              className="press"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: added ? "#16a34a" : "var(--ink)",
                color: "#fff", fontWeight: 700, fontSize: 14,
                padding: "12px 20px", borderRadius: 999, border: "none",
                cursor: "pointer", transition: "background .25s",
                boxShadow: "0 8px 20px rgba(27,19,14,.18)",
              }}
            >
              {added
                ? <><Check size={15} strokeWidth={2.5} aria-hidden /> Added to cart</>
                : <><Plus size={15} strokeWidth={2.5} aria-hidden /> Add to cart</>
              }
            </button>
          )}

          {p.orderMethod === "external" && p.externalLink && (
            <a
              href={p.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="press"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 14,
                padding: "12px 20px", borderRadius: 999, textDecoration: "none",
                boxShadow: "0 8px 20px rgba(27,19,14,.18)",
              }}
            >
              <ExternalLink size={14} strokeWidth={2.2} aria-hidden /> {p.externalLabel ?? "View"}
            </a>
          )}

          {p.orderMethod === "email" && (
            <a
              href={mailLink(p.name)}
              className="press"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 14,
                padding: "12px 20px", borderRadius: 999, textDecoration: "none",
                boxShadow: "0 8px 20px rgba(27,19,14,.18)",
              }}
            >
              <Mail size={14} strokeWidth={2.2} aria-hidden /> Request order
            </a>
          )}
        </div>
      </motion.article>

      {/* Floating +1 badge — floats up out of the card */}
      <AnimatePresence>
        {added && (
          <motion.div
            key="badge"
            initial={{ opacity: 1, y: 0, scale: 0.82 }}
            animate={{ opacity: 0, y: -72, scale: 1.08 }}
            exit={{}}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              bottom: 68,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#16a34a",
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
              borderRadius: 999,
              padding: "6px 16px",
              zIndex: 20,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 8px 22px rgba(22,163,74,.45)",
            }}
          >
            +1
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function StoreShelf() {
  const [active, setActive] = useState<"all" | ProductCategory>("all");
  const { count, openCart } = useCart();

  const visible =
    active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

  return (
    <>
      <CartSidebar />

      {/* Floating cart button — spring-bounces on every count change */}
      {count > 0 && (
        <motion.button
          key={count}
          initial={{ scale: 1.32 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 370, damping: 13 }}
          onClick={openCart}
          aria-label={`Open cart — ${count} item${count > 1 ? "s" : ""}`}
          style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 990,
            display: "flex", alignItems: "center", gap: 10,
            background: "var(--red)", color: "#fff",
            fontWeight: 800, fontSize: 15,
            padding: "14px 22px", borderRadius: 999, border: "none", cursor: "pointer",
            boxShadow: "0 12px 32px rgba(214,40,40,.4)",
          }}
          className="press btn-sheen"
        >
          <ShoppingBag size={18} strokeWidth={2} aria-hidden />
          Cart · {count}
        </motion.button>
      )}

      {/* Category tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 44 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className="press"
            aria-pressed={active === c.key}
            style={{
              padding: "10px 22px", borderRadius: 999,
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              background: active === c.key ? "var(--ink)" : "var(--paper)",
              color: active === c.key ? "#fff" : "var(--ink-soft)",
              boxShadow: active === c.key
                ? "0 8px 20px rgba(27,19,14,.22)"
                : "0 2px 8px rgba(27,19,14,.08)",
              border: "1px solid",
              borderColor: active === c.key ? "var(--ink)" : "var(--line)",
              transition: "all .2s",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,280px), 1fr))",
        gap: 22,
      }}>
        {visible.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>

      {count > 0 && (
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button
            onClick={openCart}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "var(--red)", textDecoration: "underline" }}
          >
            View cart ({count} item{count > 1 ? "s" : ""}) →
          </button>
        </div>
      )}

      {/* Ordering info */}
      <div style={{
        marginTop: 56, padding: "clamp(24px,4vw,36px)",
        background: "var(--paper)", border: "1px solid var(--line)",
        borderRadius: 22, boxShadow: "0 12px 30px rgba(27,19,14,.06)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>
          How ordering works
        </div>
        <p style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.72, margin: "0 0 10px" }}>
          <strong>Apparel & Music</strong> — add items to your cart and check out securely via Stripe. Cards, Apple Pay, and Google Pay accepted. Physical items ship within 5 business days; digital downloads are delivered by email within 24 hours.
        </p>
        <p style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.72, margin: 0 }}>
          <strong>Bibles</strong> link directly to Amazon for instant purchase. <strong>Custom prints</strong> are ordered via email — we confirm details, quote the exact price, and take payment from there. All proceeds support CAC Salvation Center ministries.
        </p>
      </div>
    </>
  );
}
