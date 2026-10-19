"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { lockScroll } from "@/lib/scroll-lock";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left";
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** Hide the default close button (when the header provides its own). */
  hideClose?: boolean;
}

/**
 * Slide-in panel used by the cart, the mobile navigation and the search
 * overlay. Handles escape-to-close, backdrop click, scroll locking and
 * moving focus into the panel when it opens.
 */
export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  description,
  children,
  footer,
  className,
  hideClose = false,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const unlock = lockScroll();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const timer = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 40);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlock();
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-[rgba(24,20,16,0.45)] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className={cn(
              "absolute top-0 flex h-full w-full max-w-[27rem] flex-col bg-[var(--sc-ivory)] shadow-[0_0_60px_rgba(24,20,16,0.25)] outline-none",
              side === "right" ? "right-0" : "left-0",
              className,
            )}
            initial={reduceMotion ? { opacity: 0 } : { x: side === "right" ? "100%" : "-100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: side === "right" ? "100%" : "-100%" }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-[var(--sc-line)] px-5 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h2 className="font-serif text-[20px] leading-tight text-[var(--sc-charcoal)]">
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1 text-[12px] text-[var(--sc-muted)]">{description}</p>
                ) : null}
              </div>
              {!hideClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="-mr-1 -mt-1 flex size-9 shrink-0 items-center justify-center text-[var(--sc-muted)] transition hover:text-[var(--sc-charcoal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
                  aria-label="Close panel"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

            {footer ? (
              <footer className="border-t border-[var(--sc-line)] bg-[var(--sc-paper)] px-5 py-4 sm:px-6 sm:py-5">
                {footer}
              </footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
