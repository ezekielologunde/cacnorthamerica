"use client";

import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import type { StoreProduct } from "@/lib/conventions";

type CartLine = { productId: string; name: string; unitPriceCents: number; size: string | null; quantity: number };

const inputStyle: CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "11px 14px", borderRadius: 10,
  border: "1.5px solid var(--line)", background: "var(--cream)",
  fontSize: 14.5, color: "var(--ink)",
  fontFamily: "var(--font-body)",
};
const labelStyle: CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 5 };

function lineKey(productId: string, size: string | null) {
  return `${productId}::${size ?? ""}`;
}
function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function StoreCatalog({ categories }: { categories: { key: string; label: string; products: StoreProduct[] }[] }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});

  const total = useMemo(() => cart.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0), [cart]);

  function addToCart(product: StoreProduct) {
    const size = product.sizes.length > 0 ? selections[product.id] || product.sizes[0] : null;
    setCart((current) => {
      const key = lineKey(product.id, size);
      const existing = current.find((l) => lineKey(l.productId, l.size) === key);
      if (existing) {
        return current.map((l) => (lineKey(l.productId, l.size) === key ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...current, { productId: product.id, name: product.name, unitPriceCents: product.priceCents, size, quantity: 1 }];
    });
  }

  function removeLine(key: string) {
    setCart((current) => current.filter((l) => lineKey(l.productId, l.size) !== key));
  }

  async function handleCheckout(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);
    try {
      const response = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName,
          contactEmail,
          items: cart.map((l) => ({ productId: l.productId, size: l.size, quantity: l.quantity })),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.checkoutUrl) {
        setErrorMessage(typeof data?.error === "string" ? data.error : "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      {categories.filter((c) => c.products.length > 0).map((category) => (
        <div key={category.key}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--ink)", marginBottom: 14 }}>{category.label}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {category.products.map((product) => (
              <div key={product.id} style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "space-between", alignItems: "center", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {product.imageSrc && (
                    <div style={{ position: "relative", width: 52, height: 52, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: "1px solid var(--line)" }}>
                      <Image src={product.imageSrc} alt={product.name} fill style={{ objectFit: "cover" }} sizes="52px" />
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{product.name}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--red)", marginTop: 2 }}>{formatPrice(product.priceCents)}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {product.sizes.length > 0 && (
                    <select
                      value={selections[product.id] ?? product.sizes[0]}
                      onChange={(e) => setSelections((s) => ({ ...s, [product.id]: e.target.value }))}
                      style={{ ...inputStyle, width: "auto", padding: "8px 10px", cursor: "pointer" }}
                    >
                      {product.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="press"
                    style={{ background: "var(--ink)", color: "#fff", fontWeight: 700, fontSize: 13.5, padding: "10px 18px", borderRadius: 999, border: "none", cursor: "pointer" }}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "24px 26px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "var(--ink)", margin: "0 0 14px" }}>Your cart</h3>
        {cart.length === 0 ? (
          <p style={{ fontSize: 14.5, color: "var(--ink-soft)", margin: 0 }}>Your cart is empty. Add an item above to get started.</p>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {cart.map((line) => {
                const key = lineKey(line.productId, line.size);
                return (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14 }}>
                    <span style={{ color: "var(--ink)" }}>{line.name}{line.size ? ` — ${line.size}` : ""} × {line.quantity}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: "var(--ink-soft)" }}>{formatPrice(line.unitPriceCents * line.quantity)}</span>
                      <button type="button" onClick={() => removeLine(key)} style={{ background: "none", border: "none", color: "var(--red)", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: 14, marginBottom: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--ink-soft)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "var(--ink)" }}>{formatPrice(total)}</span>
            </div>

            <form onSubmit={handleCheckout}>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Full name <span style={{ color: "var(--red)" }}>*</span></label>
                <input className="field-input" style={inputStyle} value={contactName} onChange={(e) => setContactName(e.target.value)} required autoComplete="name" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email <span style={{ color: "var(--red)" }}>*</span></label>
                <input className="field-input" style={inputStyle} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required autoComplete="email" />
              </div>
              {status === "error" && errorMessage && (
                <p role="alert" style={{ color: "var(--red)", fontWeight: 600, fontSize: 14, marginBottom: 14 }}>{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-sheen press"
                style={{ width: "100%", padding: "15px 24px", borderRadius: 999, background: status === "loading" ? "var(--line)" : "linear-gradient(100deg,var(--red-deep),var(--red))", color: "#fff", fontWeight: 800, fontSize: 15.5, border: "none", cursor: status === "loading" ? "not-allowed" : "pointer" }}
              >
                {status === "loading" ? "Redirecting…" : "Checkout"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
