"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Props {
  id: string;
  name: string;
  category: string;
  priceCents: number;
  priceDisplay: string;
  accent: string;
  isDigital?: boolean;
}

export function AddToCartButton({ id, name, category, priceCents, priceDisplay, accent, isDigital }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ id, name, category, priceCents, priceDisplay, accent, isDigital });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      onClick={handleAdd}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: added ? "#15803d" : "var(--red)",
        color: "#fff",
        fontWeight: 700,
        fontSize: 14,
        padding: "12px 20px",
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        transition: "background 0.2s",
        boxShadow: added
          ? "0 8px 20px rgba(21,128,61,.28)"
          : "0 8px 20px rgba(214,40,40,.28)",
        fontFamily: "var(--font-body)",
      }}
    >
      {added
        ? <><Check size={14} strokeWidth={2.5} aria-hidden /> Added to cart</>
        : <><ShoppingBag size={14} strokeWidth={2.2} aria-hidden /> Add to Cart</>
      }
    </button>
  );
}
