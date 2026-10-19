import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { siteConfig } from "@/config/site";
import type { BottleSize, Gender, Occasion, PriceTier, Season, ScentFamily } from "@/types";

/** Merge conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as store currency, e.g. `৳1,250`. */
export function formatPrice(amount: number): string {
  const { symbol, locale } = siteConfig.currency;
  return `${symbol}${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.round(amount))}`;
}

/** Plain numeric formatting without the currency symbol. */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat(siteConfig.currency.locale, {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/** Human readable label for a bottle size. */
export function sizeLabel(size: BottleSize): string {
  return `${size} ml`;
}

/* -------------------------------------------------------------------------- */
/*  Label maps — display text for every enumerated value used in the UI.      */
/* -------------------------------------------------------------------------- */

export const genderLabels: Record<Gender, string> = {
  men: "Men",
  women: "Women",
  unisex: "Unisex",
};

export const familyLabels: Record<ScentFamily, string> = {
  fresh: "Fresh",
  floral: "Floral",
  woody: "Woody",
  oud: "Oud & Oriental",
  sweet: "Sweet & Gourmand",
  spicy: "Spicy & Aromatic",
  aquatic: "Aquatic",
  musk: "Musk & Skin",
  citrus: "Citrus",
  amber: "Amber",
  leather: "Leather & Smoke",
  incense: "Incense & Resin",
};

export const occasionLabels: Record<Occasion, string> = {
  daily: "Daily Wear",
  office: "Office",
  "date-night": "Date Night",
  party: "Party",
  formal: "Formal",
  travel: "Travel",
  wedding: "Wedding",
};

export const seasonLabels: Record<Season, string> = {
  summer: "Summer",
  winter: "Winter",
  rainy: "Rainy",
  spring: "Spring",
  autumn: "Autumn",
  "all-season": "All Season",
};

export const tierLabels: Record<PriceTier, string> = {
  affordable: "Affordable",
  "mid-range": "Mid-range",
  premium: "Premium",
};

export const sizeOptions: BottleSize[] = [3, 5, 10, 15];

/** The lowest price a product can be bought for. */
export function lowestPrice(prices: number[]): number {
  return prices.length ? Math.min(...prices) : 0;
}

/** The highest price a product can be bought for. */
export function highestPrice(prices: number[]): number {
  return prices.length ? Math.max(...prices) : 0;
}

/** Clamp a number into a range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Build a slug from arbitrary text. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Deterministic pseudo-random in [0,1) from a string — used for stable visuals. */
export function seededUnit(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 100000) / 100000;
}
