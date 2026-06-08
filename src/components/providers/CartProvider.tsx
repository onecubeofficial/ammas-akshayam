"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => { capped: boolean; max: number };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (productId: string) => boolean;
  getQuantityInCart: (productId: string) => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ammas-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("ammas-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, quantity = 1): { capped: boolean; max: number } => {
    const max = product.stockCount;
    let capped = false;
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      const currentQty = existing?.quantity ?? 0;
      const newQty = Math.min(currentQty + quantity, max);
      if (newQty === currentQty) { capped = true; return prev; }
      if (currentQty + quantity > max) capped = true;
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { product, quantity: newQty }];
    });
    return { capped, max };
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id !== productId) return i;
        const max = i.product.stockCount;
        return { ...i, quantity: Math.min(quantity, max) };
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const isInCart = (productId: string) =>
    items.some((i) => i.product.id === productId);

  const getQuantityInCart = (productId: string) =>
    items.find((i) => i.product.id === productId)?.quantity ?? 0;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInCart,
        getQuantityInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
