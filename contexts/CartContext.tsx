"use client";

import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  category: string;
  priceCents: number;
  priceDisplay: string;
  quantity: number;
  variant?: string;
  accent: string;
  isDigital?: boolean;
}

interface CartState {
  items: CartItem[];
  open: boolean;
}

type Action =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string; variant?: string }
  | { type: "SET_QTY"; id: string; variant?: string; qty: number }
  | { type: "CLEAR" }
  | { type: "SET_OPEN"; open: boolean }
  | { type: "HYDRATE"; items: CartItem[] };

function cartKey(id: string, variant?: string) {
  return variant ? `${id}::${variant}` : id;
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items };
    case "ADD": {
      const key = cartKey(action.item.id, action.item.variant);
      const existing = state.items.find(
        (i) => cartKey(i.id, i.variant) === key
      );
      if (existing) {
        return {
          ...state,
          open: true,
          items: state.items.map((i) =>
            cartKey(i.id, i.variant) === key
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, open: true, items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(
          (i) => cartKey(i.id, i.variant) !== cartKey(action.id, action.variant)
        ),
      };
    case "SET_QTY":
      if (action.qty < 1) {
        return {
          ...state,
          items: state.items.filter(
            (i) => cartKey(i.id, i.variant) !== cartKey(action.id, action.variant)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          cartKey(i.id, i.variant) === cartKey(action.id, action.variant)
            ? { ...i, quantity: action.qty }
            : i
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "SET_OPEN":
      return { ...state, open: action.open };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  open: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, variant?: string) => void;
  setQty: (id: string, variant: string | undefined, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalCents: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cac-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], open: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* ignore */
    }
  }, [state.items]);

  const totalCents = state.items.reduce(
    (sum, i) => sum + i.priceCents * i.quantity,
    0
  );
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        open: state.open,
        addItem: (item) => dispatch({ type: "ADD", item: { ...item, quantity: 1 } }),
        removeItem: (id, variant) => dispatch({ type: "REMOVE", id, variant }),
        setQty: (id, variant, qty) => dispatch({ type: "SET_QTY", id, variant, qty }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        openCart: () => dispatch({ type: "SET_OPEN", open: true }),
        closeCart: () => dispatch({ type: "SET_OPEN", open: false }),
        totalCents,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
