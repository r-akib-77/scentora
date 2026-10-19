import {
  FlaskConical,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  flask: FlaskConical,
  truck: Truck,
  wallet: Wallet,
  refresh: RefreshCw,
};

interface TrustPointsProps {
  className?: string;
  /** Limit the number of points rendered. */
  limit?: number;
  columns?: 2 | 3;
}

/**
 * The "Why shop with us" grid.
 *
 * The wording is sample content configured in `src/config/site.ts`; adjust it
 * to match the claims a real business can actually make.
 */
export function TrustPoints({ className, limit, columns = 3 }: TrustPointsProps) {
  const points = limit ? siteConfig.trustPoints.slice(0, limit) : siteConfig.trustPoints;

  return (
    <ul
      className={cn(
        "grid gap-px border border-[var(--sc-line)] bg-[var(--sc-line)]",
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {points.map((point) => {
        const Icon = icons[point.icon] ?? Sparkles;
        return (
          <li key={point.title} className="bg-[var(--sc-ivory)] p-6 sm:p-7">
            <span className="flex size-10 items-center justify-center border border-[var(--sc-gold)]/50 text-[var(--sc-gold)]">
              <Icon className="size-[18px]" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-serif text-[19px] leading-snug text-[var(--sc-charcoal)]">
              {point.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--sc-muted)] text-pretty">
              {point.body}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
