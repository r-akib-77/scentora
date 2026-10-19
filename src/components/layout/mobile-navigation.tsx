"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { categories } from "@/data/bundles";
import { siteConfig } from "@/config/site";
import { useUI } from "@/providers/ui-provider";

/**
 * Slide-in mobile navigation drawer with the primary links, category links
 * and contact details.
 */
export function MobileNavigation() {
  const { isMobileNavOpen, closeMobileNav } = useUI();
  const { openSearch } = useUI();

  return (
    <>
      <div
        className={`fixed inset-0 z-[95] bg-[rgba(24,20,16,0.45)] transition-opacity duration-300 lg:hidden ${
          isMobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobileNav}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[96] flex w-[86%] max-w-[22rem] flex-col bg-[var(--sc-ivory)] shadow-[0_0_60px_rgba(24,20,16,0.3)] transition-transform duration-400 ease-out lg:hidden ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!isMobileNavOpen}
      >
        <div className="flex items-center justify-between border-b border-[var(--sc-line)] px-5 py-4">
          <span className="font-serif text-[22px] text-[var(--sc-charcoal)]">
            {siteConfig.brand.wordmark}
          </span>
          <button
            type="button"
            onClick={closeMobileNav}
            className="flex size-9 items-center justify-center text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
            aria-label="Close menu"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <nav aria-label="Mobile primary">
            <ul className="flex flex-col">
              {[
                { label: "Home", href: "/" },
                { label: "Shop All", href: "/shop" },
                { label: "Brands", href: "/brands" },
                { label: "Collections", href: "/shop#collections" },
                { label: "Combos", href: "/combos" },
                { label: "Fragrance Guide", href: "/fragrance-guide" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((item, index) => (
                <li key={item.href} className="border-b border-[var(--sc-line)]">
                  <Link
                    href={item.href}
                    onClick={closeMobileNav}
                    className="flex items-center justify-between py-3.5 font-serif text-[19px] text-[var(--sc-charcoal)] transition-colors hover:text-[var(--sc-gold)]"
                  >
                    {item.label}
                    <span className="text-[11px] tracking-[0.2em] text-[var(--sc-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => {
              closeMobileNav();
              openSearch();
            }}
            className="mt-5 flex w-full items-center justify-center gap-2 border border-[var(--sc-charcoal)] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--sc-charcoal)]"
          >
            Search the catalogue
          </button>

          <p className="eyebrow mt-8">Shop by category</p>
          <ul className="mt-3 flex flex-col gap-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  onClick={closeMobileNav}
                  className="text-[13px] text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)]"
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>

          <p className="eyebrow mt-8">Get in touch</p>
          <ul className="mt-3 flex flex-col gap-2.5 text-[13px] text-[var(--sc-muted)]">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-3.5 shrink-0 text-[var(--sc-gold)]" aria-hidden="true" />
              <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-[var(--sc-charcoal)]">
                {siteConfig.contact.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-3.5 shrink-0 text-[var(--sc-gold)]" aria-hidden="true" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-[var(--sc-charcoal)]">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-3.5 shrink-0 text-[var(--sc-gold)]" aria-hidden="true" />
              <span>{siteConfig.contact.address}</span>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
