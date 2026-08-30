"use client";

import { X } from "lucide-react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { priceFormatter } from "@/lib/priceFormatter";
import { useCurrencyStore } from "@/store/currency";
import { Collection } from "@/types";

export type AvailabilityFilter = "in-stock" | "out-of-stock";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collections: Collection[];
  selectedCollections: string[];
  onToggleCollection: (collectionId: string) => void;
  selectedAvailability: AvailabilityFilter[];
  onToggleAvailability: (value: AvailabilityFilter) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
  onClear: () => void;
  onApply: () => void;
}

const AVAILABILITY_OPTIONS: { value: AvailabilityFilter; label: string }[] = [
  { value: "in-stock", label: "In Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
];

const FilterSheet = ({
  open,
  onOpenChange,
  collections,
  selectedCollections,
  onToggleCollection,
  selectedAvailability,
  onToggleAvailability,
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
  onClear,
  onApply,
}: FilterSheetProps) => {
  const currency = useCurrencyStore((s) => s.currency);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="z-[350] flex h-full w-full max-w-full flex-col gap-0 border-none bg-white p-0 sm:max-w-[28rem] lg:max-w-[32rem] [&>button]:hidden"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-dashed border-[#FD3F92]/40 px-5 py-4 sm:px-6 sm:py-5 lg:px-8">
          <SheetTitle className="heading-3">Filters</SheetTitle>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close filters"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-dashed border-[#FD3F92]/40 transition-colors duration-300 hover:bg-[#FD3F92] hover:text-white sm:h-10 sm:w-10"
          >
            <X size={18} strokeWidth={1.5} className="sm:size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6 lg:px-8">
          {/* Collection */}
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-black/80">
              Collection
            </p>

            <div className="mt-4 flex flex-col gap-3.5 sm:gap-4">
              {collections.map((collection) => (
                <label
                  key={collection._id}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <Checkbox
                    checked={selectedCollections.includes(collection._id)}
                    onCheckedChange={() => onToggleCollection(collection._id)}
                    className="border-black/25 data-[state=checked]:border-[#FD3F92] data-[state=checked]:bg-[#FD3F92]"
                  />
                  <span className="text-sm font-medium text-black/70">
                    {collection.name}
                  </span>
                </label>
              ))}

              {collections.length === 0 && (
                <p className="text-sm text-black/40">
                  No collections available.
                </p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="mt-7 border-t border-black/10 pt-7 sm:mt-8 sm:pt-8">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-black/80">
              Availability
            </p>

            <div className="mt-4 flex flex-col gap-3.5 sm:gap-4">
              {AVAILABILITY_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <Checkbox
                    checked={selectedAvailability.includes(option.value)}
                    onCheckedChange={() => onToggleAvailability(option.value)}
                    className="border-black/25 data-[state=checked]:border-[#FD3F92] data-[state=checked]:bg-[#FD3F92]"
                  />
                  <span className="text-sm font-medium text-black/70">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mt-7 border-t border-black/10 pt-7 sm:mt-8 sm:pt-8">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.05em] text-black/80">
              Price
            </p>

            <div className="mt-5 px-1 sm:mt-6">
              <Slider
                min={minPrice}
                max={maxPrice}
                step={1}
                value={priceRange}
                onValueChange={(value) =>
                  onPriceRangeChange(value as [number, number])
                }
                className="[&_.bg-primary]:bg-[#FD3F92] [&_[role=slider]]:border-[#FD3F92] [&_[role=slider]]:bg-white"
              />

              <div className="mt-4 flex items-center justify-between gap-3 text-xs font-medium text-black/50">
                <span className="truncate">
                  {priceFormatter(priceRange[0], currency)}
                </span>
                <span className="truncate">
                  {priceFormatter(priceRange[1], currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* Footer */}
<div className="flex w-full shrink-0 items-center gap-2.5 border-t border-black/10 px-5 py-4 sm:gap-3 sm:px-6 sm:py-5 lg:px-8">
  <button
    type="button"
    onClick={onClear}
    className={`w-full rounded-full py-3 text-[0.7rem] font-medium uppercase transition-colors duration-300 ${
      selectedCollections.length > 0 ||
      selectedAvailability.length > 0 ||
      priceRange[0] !== minPrice ||
      priceRange[1] !== maxPrice
        ? "bg-black text-white hover:bg-black/90"
        : "border border-black/15 text-black hover:border-black"
    }`}
  >
    Clear All
  </button>

  <button type="button" onClick={onApply} className="btn-primary w-full">
    Apply
  </button>
</div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;