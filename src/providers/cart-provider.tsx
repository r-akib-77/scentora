"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { BottleSize, CartLine, Product } from "@/types";

const STORAGE_KEY = "scentora.cart.v1";

interface CartContextValue {
  /** Current bag contents. */
  lines: CartLine[];
  /** Total number of physical bottles in the bag. */
  itemCount: number;
  /** Sum of every line total. */
  subtotal: number;
  /** Whether the cart drawer is open. */
  isCartOpen: boolean;
  /** Add a product variant to the bag. Returns the resulting line. */
  addItem: (product: Product, size: BottleSize, quantity?: number) => CartLine;
  /** Remove a line completely. */
  removeItem: (key: string) => void;
  /** Set the quantity of a line (removes it when set to 0). */
  setQuantity: (key: string, quantity: number) => void;
  /** Empty the bag. */
  clearCart: () => void;
  /** Open / close the cart drawer. */
  openCart: () => void;
  closeCart: () => void;
  /** True once the bag has been read back from localStorage. */
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string, size: BottleSize) {
  return `${productId}-${size}`;
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<CartLine>;
  return (
    typeof line.key === "string" &&
    typeof line.productId === "string" &&
    typeof line.name === "string" &&
    typeof line.brand === "string" &&
    typeof line.size === "number" &&
    typeof line.price === "number" &&
    typeof line.quantity === "number" &&
    typeof line.image === "string" &&
    typeof line.slug === "string"
  );
}

/** Shared shopping-bag state, persisted to localStorage. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Read the persisted bag once, on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLines(parsed.filter(isCartLine));
        }
      }
    } catch {
      // Corrupted storage — start with an empty bag rather than crashing.
    }
    setHydrated(true);
  }, []);

  // Persist the bag whenever it changes (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage may be unavailable (private mode) — the app still works.
    }
  }, [lines, hydrated]);

  const addItem = useCallback(
    (product: Product, size: BottleSize, quantity = 1) => {
      const variant = product.variants.find((item) => item.size === size);
      const price = variant?.price ?? product.variants[0]?.price ?? 0;
      const key = lineKey(product.id, size);

      const nextLine: CartLine = {
        key,
        productId: product.id,
        slug: product.slug,
        brand: product.brand,
        name: product.name,
        image: product.image,
        size,
        price,
        quantity: Math.max(1, quantity),
      };

      setLines((current) => {
        const existing = current.find((line) => line.key === key);
        if (existing) {
          return current.map((line) =>
            line.key === key
              ? { ...line, price, quantity: line.quantity + nextLine.quantity }
              : line,
          );
        }
        return [...current, nextLine];
      });

      return nextLine;
    },
    [],
  );

  const removeItem = useCallback((key: string) => {
    setLines((current) => current.filter((line) => line.key !== key));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((current) => {
      if (quantity <= 0) return current.filter((line) => line.key !== key);
      return current.map((line) => (line.key === key ? { ...line, quantity } : line));
    });
  }, []);

  const clearCart = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    return {
      lines,
      itemCount,
      subtotal,
      isCartOpen,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      openCart,
      closeCart,
      hydrated,
    };
  }, [
    lines,
    isCartOpen,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    openCart,
    closeCart,
    hydrated,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Access the shared shopping bag. */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
