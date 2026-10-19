import manifest from "./image-manifest.json";

/**
 * A custom `next/image` loader.
 *
 * Next.js asks for a specific width; we serve the closest pre-generated
 * variant that is already in the repository. This keeps the storefront fully
 * static — no image optimiser, no server, no external service — while still
 * delivering correctly sized, responsive images at every breakpoint.
 *
 * The variants are produced by `scripts/build-image-variants.mjs`.
 */

const sizes = manifest as Record<string, number[]>;

function pickVariant(src: string, width: number): number | null {
  const available = sizes[src];
  if (!available || available.length === 0) return null;

  const target = Math.max(1, Math.round(width));
  // Smallest variant that is at least as wide as requested.
  const exact = available.find((value) => value >= target);
  if (exact !== undefined) return exact;

  // Otherwise the largest variant we have.
  return available[available.length - 1];
}

export default function scentoraImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Remote or absolute URLs are passed through untouched.
  if (!src.startsWith("/")) return src;

  const variant = pickVariant(src, width);
  if (variant === null) return src;

  const dot = src.lastIndexOf(".");
  const withoutExtension = src.slice(0, dot);
  const extension = src.slice(dot);
  return `${withoutExtension}-${variant}${extension}`;
}
