"use client";

import { Truck } from "lucide-react";

import { siteConfig } from "@/config/site";

/**
 * Slim announcement bar above the header.
 * Set `announcement.text` to an empty string in `src/config/site.ts` to hide it.
 */
export function AnnouncementBar() {
  const { text, secondary } = siteConfig.announcement;
  if (!text) return null;

  return (
    <div className="relative z-50 bg-[var(--sc-charcoal)] text-[var(--sc-ivory)]">
      <div className="page-shell flex min-h-[38px] items-center justify-center gap-2 py-1.5 text-center">
        <Truck className="size-3.5 shrink-0 text-[var(--sc-gold-soft)]" aria-hidden="true" />
        <p className="text-[11px] leading-relaxed tracking-[0.06em] sm:text-[12px]">
          {text}
        </p>
        {secondary ? (
          <span className="hidden text-[11px] text-[var(--sc-gold-soft)] lg:inline">
            · {secondary}
          </span>
        ) : null}
      </div>
    </div>
  );
}
