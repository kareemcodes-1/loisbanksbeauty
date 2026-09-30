import type { Product } from "@/types";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  collections?: string[];
  availability?: ("in-stock" | "out-of-stock")[];
  minPrice?: number;
  maxPrice?: number;
  sort?: "default" | "price-asc" | "price-desc";
}

export interface GetProductsResult {
  products: Product[];
  pagination: PaginationMeta;
  priceRange: PriceRange;
}

export async function getProducts({
  page = 1,
  limit = 10,
  collections = [],
  availability = [],
  minPrice,
  maxPrice,
  sort = "default",
}: GetProductsParams = {}): Promise<GetProductsResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (collections.length > 0) {
    params.set("collections", collections.join(","));
  }

  if (availability.length > 0) {
    params.set("availability", availability.join(","));
  }

  if (minPrice !== undefined) {
    params.set("minPrice", String(minPrice));
  }

  if (maxPrice !== undefined) {
    params.set("maxPrice", String(maxPrice));
  }

  if (sort !== "default") {
    params.set("sort", sort);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`,
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

export async function getFeaturedProducts(): Promise<GetProductsResult> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/featured`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch featured products");
  }

  return response.json();
}

export async function searchProducts(
  q: string,
  limit = 12,
): Promise<{ products: Product[] }> {
  const params = new URLSearchParams({
    limit: String(limit),
  });

  if (q.trim()) {
    params.set("q", q.trim());
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/search?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to search products");
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