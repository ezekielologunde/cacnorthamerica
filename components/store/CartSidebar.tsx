"use client";

import { useCart } from "@/contexts/CartContext";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Minus, Plus, Shield, ShoppingBag, Trash2, X } from "lucide-react";
import { playRemove, playCheckout, playOpen, haptic } from "@/lib/feedback";

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function CartSidebar() {
  const { items, open, closeCart, setQty, removeItem, totalCents, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevOpen = useRef(false);

  // Play sound + haptic when cart opens
  useEffect(() => {
    if (open && !prevOpen.current) {
      playOpen();
      haptic(18);
    }
    prevOpen.current = open;
  }, [open]);

  function handleRemove(id: string, variant?: string) {
    playRemove();
    haptic(30);
    removeItem(id, variant);
  }

  function handleClear() {
    haptic([50, 25, 50]);
    playRemove();
    clearCart();
  }

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try { playCheckout(); haptic([60, 30, 100]); } catch { /* ignore */ }
    try {
      const orderItems = items.map(({ id, quantity, variant }) => ({ id, quantity, variant }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderItems }),
      });
      let data: { url?: string; error?: string } = {};
      try { data = await res.json(); } catch { /* non-JSON response from server */ }
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout. Please try again.");
        setLoading(false);
        return;
      }
      // Keep loading=true while Stripe page loads (overlay stays until navigation)
      window.location.href = data.url;
    } catch {
      setError("Could not connect to checkout. Please try again.");
      setLoading(false);
    }
  }

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          role="presentation"
          onClick={closeCart}
          style={{
            position: "fixed", inset: 0, background: "rgba(27,19,14,.55)",
            zIndex: 998, backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Drawer */}
      <aside
        aria-label="Shopping cart"
        aria-hidden={!open}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(420px, 100vw)",
          background: "var(--cream)", zIndex: 999,
          display: "flex", flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .3s cubic-bezier(.4,0,.2,1)",
          boxShadow: "-8px 0 40px rgba(27,19,14,.18)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 24px 18px",
          borderBottom: "1px solid var(--line)", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingBag size={18} strokeWidth={2} color="var(--ink)" aria-hidden />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--ink)" }}>
              Your cart
            </span>
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 14 }}
                style={{
                  background: "var(--red)", color: "#fff", borderRadius: 999,
                  fontSize: 11, fontWeight: 800, padding: "2px 8px",
                  display: "inline-block",
                }}
              >
                {itemCount}
              </motion.span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "var(--ink-soft)" }}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 80 }}>
              <ShoppingBag size={48} color="var(--line)" strokeWidth={1.5} aria-hidden />
              <p style={{ marginTop: 16, color: "var(--ink-soft)", fontSize: 15 }}>Your cart is empty.</p>
              <button
                onClick={closeCart}
                style={{ marginTop: 16, background: "none", border: "none", color: "var(--red)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
              >
                Continue shopping →
              </button>
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              <AnimatePresence>
                {items.map((item) => {
                  const key = item.variant ? `${item.id}::${item.variant}` : item.id;
                  return (
                    <motion.li
                      key={key}
                      layout
                      initial={{ opacity: 0, x: 22 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 60, transition: { duration: 0.22 } }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{
                        background: "var(--paper)", border: "1px solid var(--line)",
                        borderRadius: 16, padding: "14px 16px",
                        display: "flex", gap: 14, alignItems: "flex-start",
                      }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: item.accent, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)", lineHeight: 1.3 }}>{item.name}</div>
                        {item.variant && (
                          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>{item.variant}</div>
                        )}
                        {item.isDigital && (
                          <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, marginTop: 2 }}>Digital download</div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--cream-2)", borderRadius: 999, padding: "4px 10px" }}>
                            <button
                              onClick={() => setQty(item.id, item.variant, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--ink)", display: "flex" }}
                            >
                              <Minus size={13} strokeWidth={2.5} />
                            </button>
                            <span style={{ fontSize: 14, fontWeight: 700, minWidth: 16, textAlign: "center" }}>{item.quantity}</span>
                            <button
                              onClick={() => setQty(item.id, item.variant, item.quantity + 1)}
                              aria-label="Increase quantity"
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--ink)", display: "flex" }}
                            >
                              <Plus size={13} strokeWidth={2.5} />
                            </button>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontWeight: 800, fontSize: 14, color: "var(--ink)" }}>
                              {fmt(item.priceCents * item.quantity)}
                            </span>
                            <button
                              onClick={() => handleRemove(item.id, item.variant)}
                              aria-label={`Remove ${item.name}`}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--ink-soft)" }}
                            >
                              <Trash2 size={14} strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            borderTop: "1px solid var(--line)", padding: "20px 24px 28px",
            flexShrink: 0, background: "var(--cream)",
          }}>
            {items.some((i) => i.isDigital) && (
              <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 14, lineHeight: 1.6 }}>
                Digital downloads delivered via email within 24 hours of payment.
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Subtotal</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink)" }}>
                {fmt(totalCents)}
              </span>
            </div>
            {error && (
              <div style={{ background: "#FFF0F0", border: "1px solid #D62828", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#9E1B1B", marginBottom: 14 }}>
                {error}
              </div>
            )}
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                background: loading ? "#b91c1c" : "var(--red)",
                color: "#fff", fontWeight: 800, fontSize: 16,
                padding: "16px 24px", borderRadius: 999, border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 10px 28px rgba(214,40,40,.32)",
                transition: "background .2s",
              }}
            >
              {loading ? (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin .7s linear infinite", flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  Redirecting to Stripe…
                </>
              ) : (
                <>
                  <CreditCard size={17} strokeWidth={2.2} aria-hidden />
                  Proceed to Checkout
                </>
              )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, fontSize: 12, color: "var(--ink-soft)" }}>
              <Shield size={12} strokeWidth={2} aria-hidden />
              Secure payment powered by Stripe
            </div>
            <button
              onClick={handleClear}
              style={{ display: "block", width: "100%", background: "none", border: "none", cursor: "pointer", marginTop: 10, fontSize: 12.5, color: "var(--ink-soft)", textAlign: "center" }}
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>

    </>
  );
}
