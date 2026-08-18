import type { Product } from "@/types";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetProductsResult {
  products: Product[];
  pagination: PaginationMeta;
}

export async function getProducts({
  page = 1,
  limit = 12,
}: {
  page?: number;
  limit?: number;
} = {}): Promise<GetProductsResult> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${page}&limit=${limit}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}


export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}