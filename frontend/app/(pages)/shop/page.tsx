import { getProducts } from "@/actions/product.actions";
import { getCollections } from "@/actions/collection.actions";
import ShopClient from "./components/shop-client";

const PRODUCTS_PER_PAGE = 10;

interface ShopPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const [{ products, pagination }, collections] = await Promise.all([
    getProducts({ page: currentPage, limit: PRODUCTS_PER_PAGE }),
    getCollections(),
  ]);

  return (
    <ShopClient
      initialProducts={products ?? []}
      collections={collections ?? []}
      pagination={pagination}
    />
  );
}