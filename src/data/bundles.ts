import type { Bundle, Category } from "@/types";
import { getProductById } from "./products";

/**
 * Curated bundles. Each bundle references real catalogue product ids so the
 * cart can expand a bundle into its individual decant lines.
 */
export const bundles: Bundle[] = [
  {
    id: "b-001",
    slug: "everyday-collection",
    name: "The Everyday Collection",
    description:
      "Four dependable signatures for the commute, the desk and the weekend. A soft introduction to the house.",
    image: "/images/bundles/everyday-collection.jpg",
    badge: "Best value",
    items: [
      { productId: "p-003", size: 5 },
      { productId: "p-004", size: 5 },
      { productId: "p-007", size: 5 },
      { productId: "p-017", size: 5 },
    ],
    bundlePrice: 3050,
  },
  {
    id: "b-002",
    slug: "office-essentials",
    name: "The Office Essentials Set",
    description:
      "Clean, professional and never too loud. Five decants that keep you composed from 9 AM to closing time.",
    image: "/images/bundles/office-essentials.jpg",
    items: [
      { productId: "p-002", size: 5 },
      { productId: "p-014", size: 5 },
      { productId: "p-019", size: 5 },
      { productId: "p-022", size: 5 },
      { productId: "p-033", size: 5 },
    ],
    bundlePrice: 3850,
  },
  {
    id: "b-003",
    slug: "luxury-discovery-set",
    name: "The Luxury Discovery Set",
    description:
      "Five 5 ml decants of the houses we rate highest. The most thoughtful gift in the collection.",
    image: "/images/bundles/luxury-discovery-set.jpg",
    badge: "Gift ready",
    items: [
      { productId: "p-008", size: 5 },
      { productId: "p-009", size: 5 },
      { productId: "p-010", size: 5 },
      { productId: "p-023", size: 5 },
      { productId: "p-024", size: 5 },
    ],
    bundlePrice: 5450,
  },
  {
    id: "b-004",
    slug: "date-night-collection",
    name: "The Date Night Collection",
    description:
      "Warm, magnetic and a little bit dangerous. Four evening decants built for after-dark plans.",
    image: "/images/bundles/date-night-collection.jpg",
    items: [
      { productId: "p-005", size: 5 },
      { productId: "p-012", size: 5 },
      { productId: "p-020", size: 5 },
      { productId: "p-032", size: 5 },
    ],
    bundlePrice: 3600,
  },
  {
    id: "b-005",
    slug: "fresh-fragrance-set",
    name: "The Fresh Fragrance Set",
    description:
      "Aquatics, citruses and marine notes for hot, humid days. The set people re-order every summer.",
    image: "/images/bundles/fresh-fragrance-set.jpg",
    badge: "Summer edit",
    items: [
      { productId: "p-007", size: 5 },
      { productId: "p-018", size: 5 },
      { productId: "p-022", size: 5 },
      { productId: "p-027", size: 5 },
    ],
    bundlePrice: 3150,
  },
];

/**
 * Shopping category tiles. Each tile maps onto collection-page filters.
 */
export const categories: Category[] = [
  {
    slug: "mens",
    title: "Men's Fragrances",
    description: "Woods, spices and marine notes built for the masculine repertoire.",
    image: "/images/categories/men.jpg",
    filter: { genders: ["men"] },
  },
  {
    slug: "womens",
    title: "Women's Fragrances",
    description: "Florals, soft musks and modern orientals with depth.",
    image: "/images/categories/women.jpg",
    filter: { genders: ["women"] },
  },
  {
    slug: "unisex",
    title: "Unisex Fragrances",
    description: "Shared signatures that suit everyone at the table.",
    image: "/images/categories/unisex.jpg",
    filter: { genders: ["unisex"] },
  },
  {
    slug: "luxury-niche",
    title: "Luxury & Niche",
    description: "Creed, MFK, Tom Ford, Byredo and Le Labo â€” the connoisseur's shelf.",
    image: "/images/categories/luxury.jpg",
    filter: { tiers: ["premium"] },
  },
  {
    slug: "fresh-aquatic",
    title: "Fresh & Aquatic",
    description: "Marine, citrus and green notes for hot, humid days.",
    image: "/images/categories/fresh.jpg",
    filter: { families: ["aquatic", "citrus", "fresh"] },
  },
  {
    slug: "woody-oud",
    title: "Woody & Oud",
    description: "Cedar, sandalwood, resins and dense oriental oud.",
    image: "/images/categories/woody.jpg",
    filter: { families: ["woody", "oud", "leather"] },
  },
];

/** Convenience map used by the bundle components. */
export const bundleBySlug = new Map(bundles.map((bundle) => [bundle.slug, bundle]));

/** Resolve a bundle's decant lines into product records. */
export function resolveBundleItems(bundle: Bundle) {
  return bundle.items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      const variant = product.variants.find((v) => v.size === item.size);
      return { product, size: item.size, price: variant?.price ?? 0 };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

