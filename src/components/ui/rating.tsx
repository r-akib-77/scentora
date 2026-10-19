import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface RatingProps {
  /** Rating value, 0–5. */
  value: number;
  /** Number of (demo) reviews. */
  count?: number;
  size?: "sm" | "md";
  /** Show the "demo rating" caption. */
  showCaption?: boolean;
  className?: string;
}

const starSizes = { sm: "size-3", md: "size-3.5" };

/**
 * Star rating. The values behind it are sample data — the caption makes that
 * explicit so the interface is never mistaken for verified reviews.
 */
export function Rating({
  value,
  count,
  size = "sm",
  showCaption = false,
  className,
}: RatingProps) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className="flex items-center gap-0.5"
        aria-label={`Rated ${value.toFixed(1)} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden="true"
            className={cn(
              starSizes[size],
              "shrink-0",
              star <= rounded
                ? "fill-[var(--sc-gold)] text-[var(--sc-gold)]"
                : "fill-transparent text-[var(--sc-line)]",
            )}
          />
        ))}
      </span>
      <span className="text-[12px] text-[var(--sc-muted)]">
        {value.toFixed(1)}
        {typeof count === "number" ? ` (${count})` : null}
      </span>
      {showCaption ? (
        <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--sc-muted)]/80">
          Demo rating
        </span>
      ) : null}
    </div>
  );
}
