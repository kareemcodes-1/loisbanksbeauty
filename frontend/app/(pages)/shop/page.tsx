import { getProducts } from "@/actions/product.actions";
import { getCollections } from "@/actions/collection.actions";

import ShopClient from "./components/shop-client";

const PRODUCTS_PER_PAGE = 10;

interface ShopPageProps {
  searchParams: Promise<{
    page?: string;
    collections?: string;
    availability?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: "default" | "price-asc" | "price-desc";
  }>;
}

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(1, Number(params.page) || 1);

  const collections = params.collections
    ? params.collections.split(",").filter(Boolean)
    : [];

  const availability = params.availability
    ? params.availability
        .split(",")
        .filter(
          (value): value is "in-stock" | "out-of-stock" =>
            value === "in-stock" || value === "out-of-stock",
        )
    : [];

  const minPrice =
    params.minPrice !== undefined
      ? Number(params.minPrice)
      : undefined;

  const maxPrice =
    params.maxPrice !== undefined
      ? Number(params.maxPrice)
      : undefined;

  const sort =
    params.sort === "price-asc" || params.sort === "price-desc"
      ? params.sort
      : "default";

  const [{ products, pagination, priceRange }, collectionList] =
    await Promise.all([
      getProducts({
        page: currentPage,
        limit: PRODUCTS_PER_PAGE,
        collections,
        availability,
        minPrice,
        maxPrice,
        sort,
      }),
      getCollections(),
    ]);

  return (
    <ShopClient
      initialProducts={products ?? []}
      collections={collectionList ?? []}
      pagination={pagination}
      priceRange={priceRange}
    />
  );
}