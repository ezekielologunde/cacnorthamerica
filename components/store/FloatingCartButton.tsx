"use client";

import { useCart } from "@/contexts/CartContext";
import { ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function FloatingCartButton() {
  const { count, openCart } = useCart();
  const prevCount = useRef(0);
  const [entered, setEntered] = useState(false);
  const [bump, setBump] = useState(false);

  // Entrance animation: first time count goes 0 → 1
  useEffect(() => {
    if (count > 0 && prevCount.current === 0) {
      setEntered(true);
    }
    // Badge bump on any increase
    if (count > prevCount.current && prevCount.current > 0) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 320);
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  if (count === 0) return null;

  return (
    <>
      <style>{`
        @keyframes fab-enter {
          0%   { opacity: 0; transform: scale(0.55) translateY(12px); }
          70%  { transform: scale(1.08) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes badge-bump {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.45); }
          100% { transform: scale(1); }
        }
        @media (max-width: 639px) {
          .fab-cart { bottom: 20px !important; right: 16px !important; }
        }
      `}</style>
      <button
        className="fab-cart"
        onClick={openCart}
        aria-label={`Open cart — ${count} item${count !== 1 ? "s" : ""}`}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 990,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--red, #D62828)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 24px rgba(214,40,40,.42), 0 2px 8px rgba(0,0,0,.18)",
          animation: entered ? "fab-enter .38s cubic-bezier(.34,1.56,.64,1) both" : undefined,
          transition: "box-shadow .18s, transform .15s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.06)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      >
        <ShoppingBag size={22} color="#fff" strokeWidth={2.2} aria-hidden />
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            minWidth: 20,
            height: 20,
            borderRadius: 999,
            background: "#fff",
            color: "var(--red, #D62828)",
            fontSize: 11,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 5px",
            lineHeight: 1,
            boxShadow: "0 1px 4px rgba(0,0,0,.22)",
            animation: bump ? "badge-bump .32s cubic-bezier(.34,1.56,.64,1) both" : undefined,
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      </button>
    </>
  );
}
