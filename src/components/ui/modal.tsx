"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { lockScroll } from "@/lib/scroll-lock";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Hide the default close button. */
  hideClose?: boolean;
  /** Element rendered in the header on the far right. */
  headerAction?: ReactNode;
}

/** Centred modal used for quick views and the demo checkout. */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  hideClose = false,
  headerAction,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const unlock = lockScroll();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const timer = window.setTimeout(() => panelRef.current?.focus(), 40);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlock();
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-[rgba(24,20,16,0.5)] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className={cn(
              "relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden bg-[var(--sc-ivory)] shadow-[0_30px_80px_-30px_rgba(24,20,16,0.6)] outline-none",
              className,
            )}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-[var(--sc-line)] px-5 py-4 sm:px-7 sm:py-5">
              <div className="min-w-0">
                <h2 className="font-serif text-[22px] leading-tight text-[var(--sc-charcoal)]">
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1 text-[12px] leading-relaxed text-[var(--sc-muted)]">
                    {description}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {headerAction}
                {!hideClose ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex size-9 items-center justify-center text-[var(--sc-muted)] transition hover:text-[var(--sc-charcoal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
                    aria-label="Close dialog"
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
                ) : null}
              </div>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
