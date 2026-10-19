"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Delay in seconds before the reveal starts. */
  delay?: number;
  /** Direction the content travels in from. */
  from?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  /** Distance in pixels the content travels. */
  distance?: number;
}

const offset = (from: RevealProps["from"], distance: number) => {
  switch (from) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    default:
      return { x: 0, y: 0 };
  }
};

/**
 * Scroll-triggered reveal.
 *
 * Uses an IntersectionObserver plus a scroll-based safety net so content can
 * never be left permanently hidden — if the observer does not fire (slow
 * device, unusual viewport, screenshot tooling) the section still becomes
 * visible as soon as it is scrolled into view.
 *
 * Falls back to a plain render when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  className,
  distance = 24,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => setShown(true);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    observer.observe(element);

    // Safety net: anything already at or above the fold is shown immediately.
    const check = () => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.98) {
        reveal();
        observer.disconnect();
        window.removeEventListener("scroll", check);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", check);
    };
  }, []);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const hidden = { opacity: 0, ...offset(from, distance) };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={shown ? { opacity: 1, x: 0, y: 0 } : hidden}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
