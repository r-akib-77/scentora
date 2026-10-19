"use client";

import { Check, X } from "lucide-react";

import { catalogueBrands, cataloguePriceRange } from "@/data/products";
import { activeFilterCount } from "@/lib/filters";
import { cn, familyLabels, formatPrice, genderLabels, sizeLabel, tierLabels } from "@/lib/utils";
import type { FilterState, Gender, PriceTier, ScentFamily } from "@/types";

interface FilterSidebarProps {
  filters: FilterState;
  onToggleBrand: (brand: string) => void;
  onToggleGender: (gender: Gender) => void;
  onToggleFamily: (family: ScentFamily) => void;
  onToggleSize: (size: FilterState["sizes"][number]) => void;
  onToggleTier: (tier: PriceTier) => void;
  onPriceChange: (min: number, max: number) => void;
  onReset: () => void;
  className?: string;
}

const genderOrder: Gender[] = ["women", "men", "unisex"];
const familyOrder: ScentFamily[] = [
  "fresh",
  "citrus",
  "aquatic",
  "floral",
  "woody",
  "spicy",
  "sweet",
  "amber",
  "oud",
  "musk",
  "leather",
  "incense",
];
const tierOrder: PriceTier[] = ["affordable", "mid-range", "premium"];
const sizeOrder: FilterState["sizes"][number][] = [3, 5, 10, 15];

/** The desktop filter sidebar. */
export function FilterSidebar({
  filters,
  onToggleBrand,
  onToggleGender,
  onToggleFamily,
  onToggleSize,
  onToggleTier,
  onPriceChange,
  onReset,
  className,
}: FilterSidebarProps) {
  const activeCount = activeFilterCount(filters);

  return (
    <aside className={cn("w-full", className)} aria-label="Product filters">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--sc-line)] pb-3">
        <h2 className="font-serif text-[19px] text-[var(--sc-charcoal)]">
          Refine
          {activeCount > 0 ? (
            <span className="ml-2 text-[12px] font-sans text-[var(--sc-muted)]">
              ({activeCount})
            </span>
          ) : null}
        </h2>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] uppercase tracking-[0.14em] text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)]"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div className="divide-y divide-[var(--sc-line)]">
        <FilterGroup title="Gender">
          <div className="flex flex-wrap gap-1.5">
            {genderOrder.map((gender) => (
              <Chip
                key={gender}
                label={genderLabels[gender]}
                selected={filters.genders.includes(gender)}
                onClick={() => onToggleGender(gender)}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Scent family">
          <ul className="max-h-64 space-y-0.5 overflow-y-auto pr-1">
            {familyOrder.map((family) => (
              <li key={family}>
                <CheckRow
                  label={familyLabels[family]}
                  checked={filters.families.includes(family)}
                  onChange={() => onToggleFamily(family)}
                />
              </li>
            ))}
          </ul>
        </FilterGroup>

        <FilterGroup title="Bottle size">
          <div className="flex flex-wrap gap-1.5">
            {sizeOrder.map((size) => (
              <Chip
                key={size}
                label={sizeLabel(size)}
                selected={filters.sizes.includes(size)}
                onClick={() => onToggleSize(size)}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Price range">
          <div className="flex items-center gap-2">
            <label className="flex-1">
              <span className="sr-only">Minimum price</span>
              <input
                type="number"
                inputMode="numeric"
                value={filters.minPrice}
                min={cataloguePriceRange.min}
                max={filters.maxPrice}
                onChange={(event) =>
                  onPriceChange(
                    Math.max(cataloguePriceRange.min, Number(event.target.value) || 0),
                    filters.maxPrice,
                  )
                }
                className="field px-2.5 py-2 text-[12px]"
                placeholder={String(cataloguePriceRange.min)}
              />
            </label>
            <span className="text-[12px] text-[var(--sc-muted)]">to</span>
            <label className="flex-1">
              <span className="sr-only">Maximum price</span>
              <input
                type="number"
                inputMode="numeric"
                value={filters.maxPrice}
                min={filters.minPrice}
                max={cataloguePriceRange.max}
                onChange={(event) =>
                  onPriceChange(
                    filters.minPrice,
                    Math.min(cataloguePriceRange.max, Number(event.target.value) || 0),
                  )
                }
                className="field px-2.5 py-2 text-[12px]"
                placeholder={String(cataloguePriceRange.max)}
              />
            </label>
          </div>
          <p className="mt-2 text-[11px] text-[var(--sc-muted)]">
            Catalogue range {formatPrice(cataloguePriceRange.min)} –{" "}
            {formatPrice(cataloguePriceRange.max)}
          </p>
        </FilterGroup>

        <FilterGroup title="Price bracket">
          <div className="flex flex-wrap gap-1.5">
            {tierOrder.map((tier) => (
              <Chip
                key={tier}
                label={tierLabels[tier]}
                selected={filters.tiers.includes(tier)}
                onClick={() => onToggleTier(tier)}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Brand">
          <ul className="max-h-64 space-y-0.5 overflow-y-auto pr-1">
            {catalogueBrands.map((brand) => (
              <li key={brand}>
                <CheckRow
                  label={brand}
                  checked={filters.brands.includes(brand)}
                  onChange={() => onToggleBrand(brand)}
                />
              </li>
            ))}
          </ul>
        </FilterGroup>
      </div>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-5">
      <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--sc-charcoal)]">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "border px-3 py-1.5 text-[12px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]",
        selected
          ? "border-[var(--sc-charcoal)] bg-[var(--sc-charcoal)] text-[var(--sc-ivory)]"
          : "border-[var(--sc-line)] text-[var(--sc-muted)] hover:border-[var(--sc-gold)] hover:text-[var(--sc-charcoal)]",
      )}
    >
      {label}
    </button>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-[13px] text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)]">
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center border transition-colors",
          checked
            ? "border-[var(--sc-charcoal)] bg-[var(--sc-charcoal)] text-[var(--sc-ivory)]"
            : "border-[var(--sc-line)] bg-transparent",
        )}
      >
        {checked ? <Check className="size-2.5" aria-hidden="true" /> : null}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="truncate">{label}</span>
    </label>
  );
}

/** A removable chip describing one active filter. */
export function ActiveFilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-[var(--sc-line)] bg-[var(--sc-ivory)] px-2.5 py-1 text-[11px] text-[var(--sc-muted)]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--sc-gold)]"
        aria-label={`Remove filter ${label}`}
      >
        <X className="size-3" aria-hidden="true" />
      </button>
    </span>
  );
}
