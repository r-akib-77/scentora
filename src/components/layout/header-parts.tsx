"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Primary desktop navigation. Every entry resolves to a real route. */
export const navigation = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Brands", href: "/brands" },
  { label: "Collections", href: "/shop#collections" },
  { label: "Combos", href: "/combos" },
  { label: "Fragrance Guide", href: "/fragrance-guide" },
  { label: "About", href: "/about" },
];

/** True when the given href matches the current route. */
export function isActivePath(pathname: string, href: string): boolean {
  const clean = href.split("#")[0];
  if (clean === "/") return pathname === "/";
  return pathname === clean || pathname.startsWith(`${clean}/`);
}

/**
 * Sticky header: the hairline border and shadow fade in once the page is
 * scrolled, so the top of the page feels airy.
 */
export function StickyHeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 z-50 bg-[var(--sc-ivory)]/92 backdrop-blur-md transition-shadow duration-300",
        scrolled ? "shadow-[0_1px_0_rgba(31,27,22,0.10)]" : "shadow-none",
      )}
    >
      {children}
    </div>
  );
}

/** The typographic wordmark — replace with an <img> logo if required. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-serif leading-none", className)}>
      {siteConfig.brand.wordmark}
    </span>
  );
}

/** Desktop navigation row. */
export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-7">
        {navigation.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative py-2 text-[12px] uppercase tracking-[0.16em] transition-colors duration-200",
                  active
                    ? "text-[var(--sc-charcoal)]"
                    : "text-[var(--sc-muted)] hover:text-[var(--sc-charcoal)]",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[var(--sc-gold)] transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
