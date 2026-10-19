"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface SmartImageProps extends Omit<ImageProps, "onError" | "src" | "alt"> {
  src: string;
  alt: string;
  /** Text shown inside the fallback panel. */
  fallbackLabel?: string;
  className?: string;
}

/**
 * An image with a graceful fallback.
 *
 * If the underlying file is missing (or fails to decode) a branded placeholder
 * panel is rendered instead of the browser's broken-image icon. This keeps the
 * catalogue looking intentional even before real photography is loaded.
 */
export function SmartImage({
  src,
  alt,
  fallbackLabel = "Scentora",
  className,
  ...rest
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-[var(--sc-paper)] text-center",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <span className="px-4 font-serif text-[13px] tracking-[0.3em] text-[var(--sc-muted)] uppercase">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
