"use client";

import { useEffect, useMemo, useState } from "react";
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

type Props = {
  initialProducts: Product[];
  collections: Collection[];
  pagination: PaginationMeta;
};

const isHairWig = (product: Product) => {
  const name = product.collectionId?.name?.toLowerCase() || "";
  return (
    name.includes("wigs")
  );
};

function isProductInStock(product: Product) {
  if (!product.trackInventory) return true;
  return product.stock > 0;
}

export default function ShopClient({
  initialProducts,
  collections,
  pagination,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sort, setSort] = useState<SortValue>("default");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<
    AvailabilityFilter[]
  >([]);
  const [draftAvailability, setDraftAvailability] = useState<
    AvailabilityFilter[]
  >([]);

  const { minPrice, maxPrice } = useMemo(() => {
    if (initialProducts.length === 0) {
      return { minPrice: 0, maxPrice: 0 };
    }

    const prices = initialProducts.map((product) => product.price);

    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [initialProducts]);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  const [draftCollections, setDraftCollections] = useState<string[]>([]);
  const [draftPriceRange, setDraftPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    if (filterSheetOpen) {
      setDraftCollections(selectedCollections);
      setDraftPriceRange(priceRange);
      setDraftAvailability(selectedAvailability);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSheetOpen]);

  const handleToggleAvailability = (value: AvailabilityFilter) => {
    setDraftAvailability((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
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
    setFilterSheetOpen(false);
  };

  const handleToggleCollection = (collectionId: string) => {
    setDraftCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId],
    );
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const activeFilterCount =
    selectedCollections.length +
    selectedAvailability.length +
    (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0);

  const filteredProducts = initialProducts.filter((product) => {
    const matchesCollection =
      selectedCollections.length === 0 ||
      (product.collectionId?._id &&
        selectedCollections.includes(product.collectionId._id));

    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    const inStock = isProductInStock(product);
    const matchesAvailability =
      selectedAvailability.length === 0 ||
      (selectedAvailability.includes("in-stock") && inStock) ||
      (selectedAvailability.includes("out-of-stock") && !inStock);

    return matchesCollection && matchesPrice && matchesAvailability;
  });

const sortedProducts = [...filteredProducts].sort((a, b) => {
  // First priority: Hair Wigs always come before other products
  const aIsWig = isHairWig(a);
  const bIsWig = isHairWig(b);

  if (aIsWig && !bIsWig) return -1;
  if (!aIsWig && bIsWig) return 1;

  // Then apply the selected sort
  if (sort === "price-asc") return a.price - b.price;
  if (sort === "price-desc") return b.price - a.price;

  return 0; // keep original order for "default"
});

  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.value === sort)?.label ?? "Default";

   return (
    <section className="w-full px-[1.5rem] sm:px-8 lg:px-[3rem] pb-[4rem] pt-[9rem]">
      <div className="mx-auto w-full">
        <div className="mx-auto flex max-w-[min(50rem,100%)] flex-col items-center gap-3 text-center">
          <span className="subtitle">Shop</span>

          <SplitLines
                      text="Find Your Perfect Match"
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
           Luxury hair, beauty essentials, and athleisure curated for 
women who know exactly what they want.
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
                <span className="max-w-[10rem] truncate">{activeSortLabel}</span>
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
                  onClick={() => setSort(option.value)}
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

        <div className="py-4 sm:py-6">
          <p className="text-[0.7rem] uppercase tracking-[0.05em] text-black/35">
            {sortedProducts.length}{" "}
            {sortedProducts.length === 1 ? "Product" : "Products"}
          </p>
        </div>

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3">
            {sortedProducts.map((product) => (
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