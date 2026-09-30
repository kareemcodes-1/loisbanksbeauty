"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Check, ShoppingBag } from "lucide-react";

import ProductCard from "@/app/components/products/product-card";
import { Product, Collection } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Pagination from "@/app/components/pagination";
import EmptyState from "@/app/components/empty-state";
import FilterSheet, { type AvailabilityFilter } from "./filter-sheet";
import { SplitLines } from "@/components/animations/SplitLines";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PriceRange {
  min: number;
  max: number;
}

type Props = {
  initialProducts: Product[];
  collections: Collection[];
  pagination: PaginationMeta;
  priceRange: PriceRange;
};

export default function ShopClient({
  initialProducts,
  collections,
  pagination,
  priceRange: apiPriceRange,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const minPrice = apiPriceRange.min;
  const maxPrice = apiPriceRange.max;

  const getCollectionIdsFromUrl = () => {
    const collectionsParam = searchParams.get("collections");

    if (collectionsParam) {
      return collectionsParam.split(",").filter(Boolean);
    }

    // Keep support for the old ?filter=collectionId URL
    const legacyFilter = searchParams.get("filter");

    return legacyFilter ? [legacyFilter] : [];
  };

  const getAvailabilityFromUrl = (): AvailabilityFilter[] => {
    const availabilityParam = searchParams.get("availability");

    if (!availabilityParam) {
      return [];
    }

    return availabilityParam.split(",").filter(
      (value): value is AvailabilityFilter =>
        value === "in-stock" || value === "out-of-stock",
    );
  };

  const getPriceRangeFromUrl = (): [number, number] => {
    const minParam = searchParams.get("minPrice");
    const maxParam = searchParams.get("maxPrice");

    const parsedMin = minParam !== null ? Number(minParam) : minPrice;
    const parsedMax = maxParam !== null ? Number(maxParam) : maxPrice;

    return [
      Number.isFinite(parsedMin) ? parsedMin : minPrice,
      Number.isFinite(parsedMax) ? parsedMax : maxPrice,
    ];
  };

  const getSortFromUrl = (): SortValue => {
    const sortParam = searchParams.get("sort");

    if (
      sortParam === "price-asc" ||
      sortParam === "price-desc"
    ) {
      return sortParam;
    }

    return "default";
  };

  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    getCollectionIdsFromUrl,
  );

  const [selectedAvailability, setSelectedAvailability] = useState<
    AvailabilityFilter[]
  >(getAvailabilityFromUrl);

  const [priceRange, setPriceRange] = useState<[number, number]>(
    getPriceRangeFromUrl,
  );

  const [sort, setSort] = useState<SortValue>(getSortFromUrl);

  const [draftCollections, setDraftCollections] = useState<string[]>(
    getCollectionIdsFromUrl,
  );

  const [draftAvailability, setDraftAvailability] = useState<
    AvailabilityFilter[]
  >(getAvailabilityFromUrl);

  const [draftPriceRange, setDraftPriceRange] = useState<[number, number]>(
    getPriceRangeFromUrl,
  );

  useEffect(() => {
    const nextCollections = getCollectionIdsFromUrl();
    const nextAvailability = getAvailabilityFromUrl();
    const nextPriceRange = getPriceRangeFromUrl();
    const nextSort = getSortFromUrl();

    setSelectedCollections(nextCollections);
    setSelectedAvailability(nextAvailability);
    setPriceRange(nextPriceRange);
    setSort(nextSort);

    if (filterSheetOpen) {
      setDraftCollections(nextCollections);
      setDraftAvailability(nextAvailability);
      setDraftPriceRange(nextPriceRange);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, minPrice, maxPrice]);

  useEffect(() => {
    if (filterSheetOpen) {
      setDraftCollections(selectedCollections);
      setDraftPriceRange(priceRange);
      setDraftAvailability(selectedAvailability);
    }
  }, [
    filterSheetOpen,
    selectedCollections,
    selectedAvailability,
    priceRange,
  ]);

  const updateUrl = ({
    collections = selectedCollections,
    availability = selectedAvailability,
    price = priceRange,
    sortValue = sort,
    page = 1,
  }: {
    collections?: string[];
    availability?: AvailabilityFilter[];
    price?: [number, number];
    sortValue?: SortValue;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    // Remove legacy filter parameter.
    params.delete("filter");

    if (collections.length > 0) {
      params.set("collections", collections.join(","));
    } else {
      params.delete("collections");
    }

    if (availability.length > 0) {
      params.set("availability", availability.join(","));
    } else {
      params.delete("availability");
    }

    const hasPriceFilter =
      price[0] !== minPrice || price[1] !== maxPrice;

    if (hasPriceFilter) {
      params.set("minPrice", String(price[0]));
      params.set("maxPrice", String(price[1]));
    } else {
      params.delete("minPrice");
      params.delete("maxPrice");
    }

    if (sortValue !== "default") {
      params.set("sort", sortValue);
    } else {
      params.delete("sort");
    }

    router.push(`?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleToggleAvailability = (value: AvailabilityFilter) => {
    setDraftAvailability((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handleClearFilters = () => {
    setDraftCollections([]);
    setDraftPriceRange([minPrice, maxPrice]);
    setDraftAvailability([]);
  };

  const handleApplyFilters = () => {
    setSelectedCollections(draftCollections);
    setPriceRange(draftPriceRange);
    setSelectedAvailability(draftAvailability);

    updateUrl({
      collections: draftCollections,
      availability: draftAvailability,
      price: draftPriceRange,
      sortValue: sort,
      page: 1,
    });

    setFilterSheetOpen(false);
  };

  const handleToggleCollection = (collectionId: string) => {
    setDraftCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId],
    );
  };

  const handleSortChange = (value: SortValue) => {
    setSort(value);

    updateUrl({
      collections: selectedCollections,
      availability: selectedAvailability,
      price: priceRange,
      sortValue: value,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    updateUrl({
      collections: selectedCollections,
      availability: selectedAvailability,
      price: priceRange,
      sortValue: sort,
      page,
    });
  };

  const activeFilterCount =
    selectedCollections.length +
    selectedAvailability.length +
    (priceRange[0] !== minPrice || priceRange[1] !== maxPrice
      ? 1
      : 0);

  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.value === sort)?.label ??
    "Default";

  return (
    <section className="w-full px-[1.5rem] pb-[4rem] pt-[9rem] sm:px-8 lg:px-[3rem]">
      <div className="mx-auto w-full">
        <div className="mx-auto flex max-w-[min(50rem,100%)] flex-col items-center gap-3 text-center">
          <span className="subtitle">Shop</span>

          <SplitLines
            text="Shop Our Collection"
            tag="h1"
            className="heading-1 max-w-[min(40rem,100%)]"
            duration={1}
            stagger={0.025}
            ease="power4.out"
            yPercent={150}
            threshold={0.1}
            rootMargin="-100px"
          />

          <p className="mx-auto max-w-[min(32rem,100%)] text-[0.875rem] leading-relaxed text-black/50 sm:text-[0.9rem] lg:text-[1rem]">
            Luxury hair, beauty essentials, and athleisure curated for women
            who know exactly what they want.
          </p>
        </div>

        {/* Filter + Sort */}
        <div className="mt-10 flex flex-col gap-3 pb-4 sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pb-5 lg:mt-[4rem]">
          <button
            type="button"
            onClick={() => setFilterSheetOpen(true)}
            className="relative flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.05em] text-black shadow-sm transition-all duration-300 hover:border-[#FD3F92] hover:bg-[#FD3F92]/10 hover:text-[#FD3F92] sm:w-auto sm:justify-start"
          >
            <span className="text-base leading-none">+</span>
            Filters

            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FD3F92] px-1 text-[0.6rem] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-black shadow-sm transition-all duration-300 hover:border-[#FD3F92] hover:bg-[#FD3F92]/10 hover:text-[#FD3F92] sm:w-auto sm:justify-start"
              >
                <ArrowUpDown
                  size={14}
                  className="text-black/50 transition-colors group-hover:text-[#FD3F92]"
                />

                <span className="max-w-[10rem] truncate">
                  {activeSortLabel}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="z-[350] w-52 rounded-2xl border border-black/10 p-1.5 shadow-lg"
            >
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`cursor-pointer gap-2 rounded-xl px-3 py-2.5 text-[0.8rem] font-medium ${
                    sort === option.value
                      ? "bg-[#FD3F92]/10 text-[#FD3F92]"
                      : ""
                  }`}
                >
                  <span className="flex-1">{option.label}</span>

                  {sort === option.value && (
                    <Check size={14} strokeWidth={2} />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Product Count */}
<div className="py-4 sm:py-6">
  <p className="text-[0.7rem] uppercase tracking-[0.05em] text-black/35">
    {initialProducts.length}{" "}
    {initialProducts.length === 1 ? "Product" : "Products"}
  </p>
</div>

        {/* Products */}
        {initialProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3">
            {initialProducts.map((product) => (
              <ProductCard key={product._id} item={product} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[16rem] items-center justify-center border border-black/10 sm:min-h-[20rem]">
            <EmptyState
              icon={ShoppingBag}
              message="No products available."
              buttonText="Back to Home"
              buttonHref="/"
            />
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          className="mt-10 sm:mt-14 lg:mt-16"
        />
      </div>

      <FilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        collections={collections}
        selectedCollections={draftCollections}
        onToggleCollection={handleToggleCollection}
        selectedAvailability={draftAvailability}
        onToggleAvailability={handleToggleAvailability}
        priceRange={draftPriceRange}
        onPriceRangeChange={setDraftPriceRange}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onClear={handleClearFilters}
        onApply={handleApplyFilters}
      />
    </section>
  );
}