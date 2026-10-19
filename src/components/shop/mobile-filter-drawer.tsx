"use client";

import { SlidersHorizontal } from "lucide-react";

import { Drawer } from "@/components/ui/drawer";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import type { FilterState, Gender, PriceTier, ScentFamily } from "@/types";

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  resultCount: number;
  onToggleBrand: (brand: string) => void;
  onToggleGender: (gender: Gender) => void;
  onToggleFamily: (family: ScentFamily) => void;
  onToggleSize: (size: FilterState["sizes"][number]) => void;
  onToggleTier: (tier: PriceTier) => void;
  onPriceChange: (min: number, max: number) => void;
  onReset: () => void;
}

/** The filter drawer used on small screens. */
export function MobileFilterDrawer({
  open,
  onClose,
  filters,
  resultCount,
  onToggleBrand,
  onToggleGender,
  onToggleFamily,
  onToggleSize,
  onToggleTier,
  onPriceChange,
  onReset,
}: MobileFilterDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="left"
      title="Filters"
      description={`${resultCount} fragrance${resultCount === 1 ? "" : "s"} match`}
      footer={
        <div className="flex gap-2">
          <button type="button" onClick={onReset} className="btn-outline flex-1">
            Clear all
          </button>
          <button type="button" onClick={onClose} className="btn-primary flex-1">
            Show {resultCount} result{resultCount === 1 ? "" : "s"}
          </button>
        </div>
      }
    >
      <div className="px-5 py-4 sm:px-6">
        <FilterSidebar
          filters={filters}
          onToggleBrand={onToggleBrand}
          onToggleGender={onToggleGender}
          onToggleFamily={onToggleFamily}
          onToggleSize={onToggleSize}
          onToggleTier={onToggleTier}
          onPriceChange={onPriceChange}
          onReset={onReset}
        />
      </div>
    </Drawer>
  );
}

/** The button that opens the mobile filter drawer. */
export function FilterDrawerTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-outline flex items-center gap-2 px-4 py-2.5 lg:hidden"
    >
      <SlidersHorizontal className="size-3.5" aria-hidden="true" />
      Filters
    </button>
  );
}
