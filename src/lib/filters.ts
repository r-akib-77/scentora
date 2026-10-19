import type { FilterState, Gender, PriceTier, Product, SortOption, ScentFamily } from "@/types";
import { cataloguePriceRange } from "@/data/products";

/** A fresh, empty filter state. */
export const emptyFilters: FilterState = {
  query: "",
  brands: [],
  genders: [],
  families: [],
  sizes: [],
  tiers: [],
  minPrice: cataloguePriceRange.min,
  maxPrice: cataloguePriceRange.max,
  sort: "featured",
};

const GENDER_VALUES: Gender[] = ["men", "women", "unisex"];
const TIER_VALUES: PriceTier[] = ["affordable", "mid-range", "premium"];
const SIZE_VALUES: FilterState["sizes"][number][] = [3, 5, 10, 15];
const SORT_VALUES: SortOption[] = [
  "featured",
  "popularity",
  "price-asc",
  "price-desc",
  "name-asc",
  "name-desc",
];

/**
 * Parses URL search parameters into a filter state.
 *
 * Lives in this shared module (rather than inside a client component) so the
 * server-rendered collection page can use it directly.
 */
export function parseFiltersFromParams(
  params: URLSearchParams | Readonly<Record<string, string | string[] | undefined>>,
): Partial<FilterState> {
  const get = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const list = (key: string): string[] =>
    (get(key) ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

  const min = get("min");
  const max = get("max");
  const sort = get("sort");
  const families = list("family").filter((value): value is ScentFamily =>
    Boolean(value),
  );

  return {
    query: get("q") ?? "",
    brands: list("brand"),
    genders: list("gender").filter((value): value is Gender =>
      GENDER_VALUES.includes(value as Gender),
    ),
    families,
    sizes: list("size")
      .map((value) => Number(value))
      .filter((value) => SIZE_VALUES.includes(value as FilterState["sizes"][number]))
      .filter((value): value is FilterState["sizes"][number] =>
        SIZE_VALUES.includes(value as FilterState["sizes"][number]),
      ),
    tiers: list("tier").filter((value): value is PriceTier =>
      TIER_VALUES.includes(value as PriceTier),
    ),
    minPrice: min ? Math.max(cataloguePriceRange.min, Number(min)) : cataloguePriceRange.min,
    maxPrice: max
      ? Math.min(cataloguePriceRange.max, Number(max))
      : cataloguePriceRange.max,
    sort: (SORT_VALUES.includes(sort as SortOption) ? sort : "featured") as SortOption,
  };
}

/** True when anything other than the sort order has been applied. */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.query.trim().length > 0 ||
    filters.brands.length > 0 ||
    filters.genders.length > 0 ||
    filters.families.length > 0 ||
    filters.sizes.length > 0 ||
    filters.tiers.length > 0 ||
    filters.minPrice > cataloguePriceRange.min ||
    filters.maxPrice < cataloguePriceRange.max
  );
}

/** Count of active filter chips (shown in the "Clear all" pill). */
export function activeFilterCount(filters: FilterState): number {
  let count = filters.brands.length + filters.genders.length + filters.families.length;
  count += filters.sizes.length + filters.tiers.length;
  if (filters.query.trim()) count += 1;
  if (filters.minPrice > cataloguePriceRange.min || filters.maxPrice < cataloguePriceRange.max) {
    count += 1;
  }
  return count;
}

/** All prices a product is sold at, across its available sizes. */
export function productPrices(product: Product): number[] {
  return product.variants.map((variant) => variant.price);
}

/** The price a product is "from" — its cheapest available size. */
export function productFromPrice(product: Product): number {
  return Math.min(...productPrices(product));
}

/** Does the product match the free-text query? */
export function matchesQuery(product: Product, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    product.name,
    product.brand,
    product.tagline,
    product.familyLabel,
    product.concentration,
    product.description,
    ...product.tags,
    ...product.notes.top,
    ...product.notes.heart,
    ...product.notes.base,
  ]
    .join(" ")
    .toLowerCase();
  return needle.split(/\s+/).every((token) => haystack.includes(token));
}

/** Does the product match every active filter group? */
export function matchesFilters(product: Product, filters: FilterState): boolean {
  if (!matchesQuery(product, filters.query)) return false;

  if (filters.brands.length && !filters.brands.includes(product.brand)) return false;

  if (filters.genders.length && !filters.genders.includes(product.gender)) return false;

  if (filters.families.length && !filters.families.includes(product.family)) return false;

  if (filters.tiers.length && !filters.tiers.includes(product.tier)) return false;

  if (filters.sizes.length) {
    const available = product.variants.map((variant) => variant.size);
    const matchesSize = filters.sizes.some((size) => available.includes(size));
    if (!matchesSize) return false;
  }

  // A product matches the price range if ANY of its sizes falls inside it.
  const prices = productPrices(product);
  const withinRange = prices.some(
    (price) => price >= filters.minPrice && price <= filters.maxPrice,
  );
  if (!withinRange) return false;

  return true;
}

/** Apply the chosen sort to a list of products. */
export function sortProducts(items: Product[], sort: SortOption): Product[] {
  const sorted = [...items];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => productFromPrice(a) - productFromPrice(b));
      break;
    case "price-desc":
      sorted.sort((a, b) => productFromPrice(b) - productFromPrice(a));
      break;
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "popularity":
      sorted.sort((a, b) => b.popularity - a.popularity);
      break;
    case "featured":
    default:
      sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.popularity - a.popularity;
      });
      break;
  }
  return sorted;
}

/** Full pipeline: filter then sort. */
export function applyFilters(items: Product[], filters: FilterState): Product[] {
  return sortProducts(items.filter((product) => matchesFilters(product, filters)), filters.sort);
}
