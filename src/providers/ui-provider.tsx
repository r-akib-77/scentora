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

import type { Product } from "@/types";
import { lockScroll } from "@/lib/scroll-lock";

interface UIContextValue {
  /** Mobile navigation drawer visibility. */
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  /** Search overlay visibility. */
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  /** Product shown in the quick-view modal. */
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

/** Holds the visibility state for every global overlay in the storefront. */
export function UIProvider({ children }: { children: ReactNode }) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openQuickView = useCallback((product: Product) => setQuickViewProduct(product), []);
  const closeQuickView = useCallback(() => setQuickViewProduct(null), []);

  // Lock body scroll whenever an overlay is open.
  const anyOverlay = isMobileNavOpen || isSearchOpen || quickViewProduct !== null;
  useEffect(() => {
    if (!anyOverlay) return;
    return lockScroll();
  }, [anyOverlay]);

  // Close every overlay when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const handler = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileNavOpen(false);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const value = useMemo(
    () => ({
      isMobileNavOpen,
      openMobileNav,
      closeMobileNav,
      isSearchOpen,
      openSearch,
      closeSearch,
      quickViewProduct,
      openQuickView,
      closeQuickView,
    }),
    [
      isMobileNavOpen,
      openMobileNav,
      closeMobileNav,
      isSearchOpen,
      openSearch,
      closeSearch,
      quickViewProduct,
      openQuickView,
      closeQuickView,
    ],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/** Access the global overlay controls. */
export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used inside <UIProvider>");
  }
  return context;
}
