/**
 * Shared domain types for the Scentora demo storefront.
 *
 * Everything in the catalogue is typed here so that swapping the demo data
 * (see `src/data/products.ts`) never requires touching component code.
 */

/** Target audience for a fragrance. */
export type Gender = "men" | "women" | "unisex";

/** Scent family / olfactive family grouping. */
export type ScentFamily =
  | "fresh"
  | "floral"
  | "woody"
  | "oud"
  | "sweet"
  | "spicy"
  | "aquatic"
  | "musk"
  | "citrus"
  | "amber"
  | "leather"
  | "incense";

/** Where a fragrance is typically worn. */
export type Occasion =
  | "daily"
  | "office"
  | "date-night"
  | "party"
  | "formal"
  | "travel"
  | "wedding";

/** Season or weather the fragrance is designed for. */
export type Season = "summer" | "winter" | "rainy" | "spring" | "autumn" | "all-season";

/** Price bracket used by filters and the fragrance finder. */
export type PriceTier = "affordable" | "mid-range" | "premium";

/** Bottle sizes offered in the decant programme. */
export type BottleSize = 3 | 5 | 10 | 15;

/** Concentrations used for product detail pages. */
export type Concentration =
  | "Eau de Toilette"
  | "Eau de Parfum"
  | "Parfum"
  | "Extrait de Parfum"
  | "Eau Fraiche"
  | "Cologne";

/** A purchasable decant size with its own price. */
export interface ProductVariant {
  /** Bottle size in millilitres. */
  size: BottleSize;
  /** Price in the store currency (BDT). */
  price: number;
  /** Optional "was" price used to show a strike-through discount. */
  compareAtPrice?: number;
}

/** Top / heart / base note pyramid. */
export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

/** The full catalogue record for one fragrance. */
export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  /** Short editorial tagline shown under the product name. */
  tagline: string;
  description: string;
  /** Primary catalogue image (path inside /public). */
  image: string;
  /** Optional additional gallery images. */
  gallery: string[];
  /** Available bottle sizes and prices. */
  variants: ProductVariant[];
  notes: FragranceNotes;
  /** Primary olfactive family. */
  family: ScentFamily;
  /** Human readable family label, e.g. "Aromatic Fougère". */
  familyLabel: string;
  gender: Gender;
  occasions: Occasion[];
  seasons: Season[];
  tier: PriceTier;
  concentration: Concentration;
  /** Percentage of alcohol, illustrative demo data. */
  concentrationPercent: number;
  featured: boolean;
  bestseller: boolean;
  /** Demo rating shown across the storefront (clearly labelled as sample data). */
  rating: number;
  reviewCount: number;
  /** Illustrative wear time in hours. */
  longevity: number;
  /** Illustrative projection score, 1 (subtle) to 5 (strong). */
  projection: number;
  /** Free-form search + filter tags. */
  tags: string[];
  /** Optional merchandising label, e.g. "New Arrival". */
  badge?: string;
  /** Sort weight for the "Popularity" sort option. */
  popularity: number;
  /** Editorial description of why this product suits a quiz answer. */
  story?: string;
}

/** A single line inside the shopping bag. */
export interface CartLine {
  /** Stable composite key: `${productId}-${size}`. */
  key: string;
  productId: string;
  slug: string;
  brand: string;
  name: string;
  image: string;
  size: BottleSize;
  /** Unit price for the chosen size, captured at add-to-bag time. */
  price: number;
  quantity: number;
}

/** A curated bundle of fragrances sold together. */
export interface Bundle {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  /** Fragrances included in the bundle. */
  items: { productId: string; size: BottleSize }[];
  /** Bundle price in store currency. */
  bundlePrice: number;
  /** Optional merchandising label. */
  badge?: string;
}

/** A fragrance house shown in the brand directory. */
export interface Brand {
  slug: string;
  name: string;
  /** Short editorial description of the house. */
  description: string;
  /** Country or region of origin. */
  origin: string;
  /** Logo-ish wordmark treatment, purely typographic. */
  monogram: string;
  /** Whether the house is luxury/niche positioned. */
  niche: boolean;
}

/** A shopping category tile. */
export interface Category {
  slug: string;
  title: string;
  description: string;
  image: string;
  /** Filters applied when the tile is activated. */
  filter: { genders?: Gender[]; families?: ScentFamily[]; tiers?: PriceTier[] };
}

/** Sorting options for the collection page. */
export type SortOption =
  | "featured"
  | "popularity"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

/** The complete filter state for the collection page. */
export interface FilterState {
  query: string;
  brands: string[];
  genders: Gender[];
  families: ScentFamily[];
  sizes: BottleSize[];
  tiers: PriceTier[];
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
}

/** Answers collected by the fragrance finder. */
export interface QuizAnswers {
  occasion: Occasion | null;
  season: Season | null;
  scent: ScentFamily | null;
  budget: PriceTier | null;
  style: "subtle" | "balanced" | "bold" | null;
}

/** A scored recommendation produced by the finder. */
export interface Recommendation {
  product: Product;
  /** 0-100 match score. */
  score: number;
  /** Human readable reasons for the match. */
  reasons: string[];
}

/** A sample customer testimonial (illustrative demo content). */
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  /** Product the sample review refers to, if any. */
  productSlug?: string;
}

/** A frequently asked question entry. */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
