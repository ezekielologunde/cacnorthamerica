import { CartProvider } from "@/contexts/CartContext";
import { CartSidebar } from "@/components/store/CartSidebar";
import { FloatingCartButton } from "@/components/store/FloatingCartButton";
import type { ReactNode } from "react";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartSidebar />
      <FloatingCartButton />
    </CartProvider>
  );
}
