import type { Product } from "@/types";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "unmanaged";

/**
 * Mirrors the Mongoose virtuals on the Product schema (inStock / isLowStock /
 * isOutOfStock). Those virtuals don't survive `.lean()` in the API response,
 * so this recomputes the same logic on the client.
 */
export const getStockStatus = (product: Product): StockStatus => {
  if (!product.trackInventory) return "unmanaged";
  if (!product.isActive || product.stock <= 0) return "out-of-stock";
  if (product.stock <= product.lowStockThreshold) return "low-stock";
  return "in-stock";
};

export const getStockLabel = (product: Product): string => {
  const status = getStockStatus(product);

  switch (status) {
    case "out-of-stock":
      return "Out of Stock";
    case "low-stock":
      return `Only ${product.stock} left`;
    case "in-stock":
    case "unmanaged":
    default:
      return "In Stock";
  }
};

export const isAddToCartDisabled = (product: Product): boolean =>
  getStockStatus(product) === "out-of-stock";