"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ProductGrid } from "@/components/product/product-grid";
import { ActiveFilterChip, FilterSidebar } from "@/components/shop/filter-sidebar";
import {
  FilterDrawerTrigger,
  MobileFilterDrawer,
} from "@/components/shop/mobile-filter-drawer";
import { cataloguePriceRange, products } from "@/data/products";
import { applyFilters, emptyFilters } from "@/lib/filters";
import { familyLabels, genderLabels, sizeLabel, tierLabels } from "@/lib/utils";
import type { FilterState, Gender, PriceTier, SortOption, ScentFamily } from "@/types";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

/**
 * The interactive collection view: search, filters, sorting and the grid.
 * All filtering happens locally against the mock catalogue.
 */
export function CollectionView({ initialFilters }: { initialFilters?: Partial<FilterState> }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    ...emptyFilters,
    ...initialFilters,
  });
  const [queryInput, setQueryInput] = useState(initialFilters?.query ?? "");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Keep the address bar in sync so filters can be shared or bookmarked.
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query.trim()) params.set("q", filters.query.trim());
    if (filters.brands.length) params.set("brand", filters.brands.join(","));
    if (filters.genders.length) params.set("gender", filters.genders.join(","));
    if (filters.families.length) params.set("family", filters.families.join(","));
    if (filters.sizes.length) params.set("size", filters.sizes.join(","));
    if (filters.tiers.length) params.set("tier", filters.tiers.join(","));
    if (filters.minPrice > cataloguePriceRange.min) {
      params.set("min", String(filters.minPrice));
    }
    if (filters.maxPrice < cataloguePriceRange.max) {
      params.set("max", String(filters.maxPrice));
    }
    if (filters.sort !== "featured") params.set("sort", filters.sort);

    const query = params.toString();
    router.replace(query ? `/shop?${query}` : "/shop", { scroll: false });
  }, [filters, router]);

  // Debounce the search field so typing stays smooth.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilters((current) =>
        current.query === queryInput ? current : { ...current, query: queryInput },
      );
    }, 280);
    return () => window.clearTimeout(timer);
  }, [queryInput]);

  // Reflect back-navigation changes from the URL.
  useEffect(() => {
    const param = searchParams.get("q");
    if (param !== null && param !== filters.query) {
      setQueryInput(param);
      setFilters((current) => ({ ...current, query: param }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const visible = useMemo(() => applyFilters(products, filters), [filters]);

  const toggle = useCallback(
    <T,>(list: T[], value: T): T[] =>
      list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
    [],
  );

  const update = (patch: Partial<FilterState>) =>
    setFilters((current) => ({ ...current, ...patch }));

  const reset = () => {
    setFilters({ ...emptyFilters });
    setQueryInput("");
  };

  const activeChips: { label: string; onRemove: () => void }[] = [];
  filters.brands.forEach((brand) =>
    activeChips.push({
      label: brand,
      onRemove: () => update({ brands: filters.brands.filter((item) => item !== brand) }),
    }),
  );
  filters.genders.forEach((gender) =>
    activeChips.push({
      label: genderLabels[gender],
      onRemove: () => update({ genders: filters.genders.filter((item) => item !== gender) }),
    }),
  );
  filters.families.forEach((family) =>
    activeChips.push({
      label: familyLabels[family],
      onRemove: () =>
        update({ families: filters.families.filter((item) => item !== family) }),
    }),
  );
  filters.sizes.forEach((size) =>
    activeChips.push({
      label: sizeLabel(size),
      onRemove: () => update({ sizes: filters.sizes.filter((item) => item !== size) }),
    }),
  );
  filters.tiers.forEach((tier) =>
    activeChips.push({
      label: tierLabels[tier],
      onRemove: () => update({ tiers: filters.tiers.filter((item) => item !== tier) }),
    }),
  );
  if (filters.minPrice > cataloguePriceRange.min || filters.maxPrice < cataloguePriceRange.max) {
    activeChips.push({
      label: `৳${filters.minPrice}–৳${filters.maxPrice}`,
      onRemove: () =>
        update({
          minPrice: cataloguePriceRange.min,
          maxPrice: cataloguePriceRange.max,
        }),
    });
  }
  if (filters.query.trim()) {
    activeChips.push({
      label: `“${filters.query.trim()}”`,
      onRemove: () => {
        setQueryInput("");
        update({ query: "" });
      },
    });
  }

  return (
    <div className="page-shell pb-4">
      <div className="flex flex-col gap-4 border-b border-[var(--sc-line)] pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--sc-muted)]"
              aria-hidden="true"
            />
            <label className="sr-only" htmlFor="collection-search">
              Search fragrances
            </label>
            <input
              id="collection-search"
              type="search"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Search name, brand or notes…"
              className="field pl-9 pr-9"
            />
            {queryInput ? (
              <button
                type="button"
                onClick={() => {
                  setQueryInput("");
                  update({ query: "" });
                }}
                className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)]"
                aria-label="Clear search"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <FilterDrawerTrigger onClick={() => setDrawerOpen(true)} />
        </div>

        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <p className="text-[12px] uppercase tracking-[0.14em] text-[var(--sc-muted)]">
            {visible.length} of {products.length}
          </p>
          <div className="flex items-center gap-2">
            <label
              htmlFor="collection-sort"
              className="text-[11px] uppercase tracking-[0.14em] text-[var(--sc-muted)]"
            >
              Sort
            </label>
            <select
              id="collection-sort"
              value={filters.sort}
              onChange={(event) => update({ sort: event.target.value as SortOption })}
              className="field w-auto py-2 pr-8 text-[12px]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeChips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--sc-line)] py-3">
          {activeChips.map((chip) => (
            <ActiveFilterChip
              key={chip.label}
              label={chip.label}
              onRemove={chip.onRemove}
            />
          ))}
          <button
            type="button"
            onClick={reset}
            className="text-[11px] uppercase tracking-[0.14em] text-[var(--sc-muted)] underline underline-offset-4 transition-colors hover:text-[var(--sc-charcoal)]"
          >
            Clear all
          </button>
        </div>
      ) : null}

      <div className="flex gap-10 pt-8">
        <div className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2">
            <FilterSidebar
              filters={filters}
              onToggleBrand={(brand) => update({ brands: toggle(filters.brands, brand) })}
              onToggleGender={(gender) => update({ genders: toggle(filters.genders, gender) })}
              onToggleFamily={(family) => update({ families: toggle(filters.families, family) })}
              onToggleSize={(size) => update({ sizes: toggle(filters.sizes, size) })}
              onToggleTier={(tier) => update({ tiers: toggle(filters.tiers, tier) })}
              onPriceChange={(minPrice, maxPrice) => update({ minPrice, maxPrice })}
              onReset={reset}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <ProductGrid
            products={visible}
            columns={4}
            emptyMessage="Try removing a filter or searching for a different note, brand or fragrance name."
          />
        </div>
      </div>

      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        resultCount={visible.length}
        onToggleBrand={(brand) => update({ brands: toggle(filters.brands, brand) })}
        onToggleGender={(gender) => update({ genders: toggle(filters.genders, gender) })}
        onToggleFamily={(family) => update({ families: toggle(filters.families, family) })}
        onToggleSize={(size) => update({ sizes: toggle(filters.sizes, size) })}
        onToggleTier={(tier) => update({ tiers: toggle(filters.tiers, tier) })}
        onPriceChange={(minPrice, maxPrice) => update({ minPrice, maxPrice })}
        onReset={reset}
      />
    </div>
  );
}
