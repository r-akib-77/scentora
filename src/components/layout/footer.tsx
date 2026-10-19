import Link from "next/link";
import { Camera, Mail, MapPin, Phone, Play, Share2 } from "lucide-react";

import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

const socialIcons: Record<string, typeof Camera> = {
  Instagram: Camera,
  Facebook: Share2,
  YouTube: Play,
  TikTok: Share2,
};

/** Site footer with the brand blurb, link columns and contact details. */
export function Footer() {
  const year = new Date().getFullYear();
  const { brand, contact, delivery, footer, social } = siteConfig;

  return (
    <footer className="mt-20 border-t border-[var(--sc-line)] bg-[var(--sc-paper)]">
      <div className="page-shell grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr] lg:gap-16">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center border border-[var(--sc-gold)] text-[var(--sc-gold)]"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M9 3h6v3l2 3v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9l2-3V3Z" />
                <path d="M7 12h10" />
              </svg>
            </span>
            <span className="font-serif text-[26px] leading-none text-[var(--sc-charcoal)]">
              {brand.wordmark}
            </span>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-[var(--sc-muted)]">{footer.about}</p>

          <ul className="mt-6 space-y-2.5 text-[13px] text-[var(--sc-muted)]">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-3.5 shrink-0 text-[var(--sc-gold)]" aria-hidden="true" />
              <a href={`tel:${contact.phone}`} className="hover:text-[var(--sc-charcoal)]">
                {contact.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-3.5 shrink-0 text-[var(--sc-gold)]" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="hover:text-[var(--sc-charcoal)]">
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-3.5 shrink-0 text-[var(--sc-gold)]" aria-hidden="true" />
              <span>{contact.address}</span>
            </li>
          </ul>

          <ul className="mt-6 flex items-center gap-2">
            {social.map((item) => {
              const Icon = socialIcons[item.platform] ?? Camera;
              return (
                <li key={item.platform}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex size-9 items-center justify-center border border-[var(--sc-line)] text-[var(--sc-muted)] transition-colors hover:border-[var(--sc-gold)] hover:text-[var(--sc-charcoal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
                    aria-label={`${item.platform} (demo link)`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {Object.values(footer.columns).map((column) => (
            <div key={column.title}>
              <h3 className="eyebrow">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--sc-line)]">
        <div className="page-shell flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--sc-muted)]">
            {footer.legal.replace("{year}", String(year))}
          </p>
          <p className="text-[12px] text-[var(--sc-muted)]">
            Free delivery over {formatPrice(delivery.freeDeliveryThreshold)} ·{" "}
            {delivery.headline}
          </p>
        </div>
      </div>
    </footer>
  );
}
