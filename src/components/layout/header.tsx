"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import {
  DesktopNav,
  StickyHeaderShell,
  Wordmark,
  navigation,
} from "@/components/layout/header-parts";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { useUI } from "@/providers/ui-provider";

/**
 * The site header: wordmark, primary navigation, search and bag.
 */
export function Header() {
  const { itemCount, openCart } = useCart();
  const { openSearch, openMobileNav } = useUI();
  const [bump, setBump] = useState(false);
  const [count, setCount] = useState(itemCount);

  // Pulse the bag badge whenever the item count changes.
  useEffect(() => {
    if (count !== itemCount) {
      setCount(itemCount);
      setBump(true);
      const timer = window.setTimeout(() => setBump(false), 320);
      return () => window.clearTimeout(timer);
    }
  }, [itemCount, count]);

  return (
    <StickyHeaderShell>
      <header className="page-shell flex h-[68px] items-center justify-between gap-4 sm:h-[76px]">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={openMobileNav}
            className="-ml-2 flex size-10 items-center justify-center text-[var(--sc-charcoal)] transition-colors hover:text-[var(--sc-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
            aria-label="Open menu"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>

        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--sc-gold)]"
          aria-label={`${siteConfig.brand.name} — home`}
        >
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center border border-[var(--sc-gold)] text-[var(--sc-gold)]"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M9 3h6v3l2 3v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9l2-3V3Z" />
              <path d="M7 12h10" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <Wordmark className="text-[24px] tracking-[0.02em] text-[var(--sc-charcoal)] sm:text-[27px]" />
            <span className="mt-1 hidden text-[9px] uppercase tracking-[0.3em] text-[var(--sc-muted)] sm:block">
              {siteConfig.brand.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden flex-1 justify-center lg:flex">
          <DesktopNav />
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openSearch}
            className="flex size-10 items-center justify-center text-[var(--sc-charcoal)] transition-colors hover:text-[var(--sc-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
            aria-label="Search fragrances"
          >
            <Search className="size-[18px]" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={openCart}
            className="relative flex size-10 items-center justify-center text-[var(--sc-charcoal)] transition-colors hover:text-[var(--sc-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
            aria-label={`Open shopping bag, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          >
            <ShoppingBag className="size-[18px]" aria-hidden="true" />
            {itemCount > 0 ? (
              <span
                className={cn(
                  "absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--sc-gold)] px-1 text-[10px] font-semibold leading-none text-white transition-transform duration-300",
                  bump && "scale-125",
                )}
              >
                {itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      <nav
        aria-label="Primary mobile quick links"
        className="no-scrollbar flex gap-5 overflow-x-auto border-t border-[var(--sc-line)] px-5 py-2.5 lg:hidden"
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </StickyHeaderShell>
  );
}
