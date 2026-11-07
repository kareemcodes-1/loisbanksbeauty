// store/cart.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

import type { Product } from "@/types";
import { getProductPricing } from "@/lib/product-pricing";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number; // final price (after discount)
  originalPrice: number; // original price (before discount)
  quantity: number;
  size: string | null;
  color: string | null;
  media: Product["media"];
}

// A cart line is one product in one size and one color.
// Items saved in the browser before colors existed have no color,
// so a missing color counts as "no color".
const isSameLine = (
  item: { productId: string; size?: string | null; color?: string | null },
  productId: string,
  size: string | null,
  color: string | null,
) =>
  item.productId === productId &&
  (item.size ?? null) === (size ?? null) &&
  (item.color ?? null) === (color ?? null);

interface CartState {
  items: CartItem[];
  _hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;

  addItem: (
    product: Product,
    quantity?: number,
    size?: string | null,
    color?: string | null,
  ) => void;

  removeItem: (
    productId: string,
    size?: string | null,
    color?: string | null,
  ) => void;

  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string | null,
    color?: string | null,
  ) => void;

  clearCart: () => void;

  getItemQuantity: (
    productId: string,
    size?: string | null,
    color?: string | null,
  ) => number;

  getTotalItems: () => number;

  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      addItem: (product, quantity = 1, size = null, color = null) => {
        const { originalPrice, finalPrice } = getProductPricing(product);

        set((state) => {
          const existingItemIndex = state.items.findIndex((item) =>
            isSameLine(item, product._id, size, color),
          );

          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items];

            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity:
                updatedItems[existingItemIndex].quantity + quantity,
              // keep price in sync in case discount changed
              price: finalPrice,
              originalPrice,
            };

            return { items: updatedItems };
          }

          const newItem: CartItem = {
            productId: product._id,
            name: product.name,
            slug: product.slug,
            price: finalPrice,
            originalPrice,
            quantity,
            size,
            color,
            media: product.media,
          };

          return {
            items: [...state.items, newItem],
          };
        });

        toast.success(`${product.name} added to cart`);
      },

      removeItem: (productId, size = null, color = null) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !isSameLine(item, productId, size, color),
          ),
        }));

        toast.success("Removed from cart");
      },

      updateQuantity: (productId, quantity, size = null, color = null) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            isSameLine(item, productId, size, color)
              ? { ...item, quantity }
              : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemQuantity: (productId, size = null, color = null) => {
        const item = get().items.find((item) =>
          isSameLine(item, productId, size, color),
        );

        return item?.quantity ?? 0;
      },

      getTotalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity,
          0,
        );
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "loisbanks-cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);