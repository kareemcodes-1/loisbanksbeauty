// components/chat/chat-product-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCurrencyStore } from "@/store/currency";
import { priceFormatter } from "@/lib/priceFormatter";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image?: string | null;
    inStock?: boolean;
    sizes?: string[];
    media?: any[];
  };
};

export default function ChatProductCard({ product }: Props) {
  const currency = useCurrencyStore((s) => s.currency);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem(
      {
        _id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        media: product.media || (product.image ? [{ url: product.image, type: "image" }] : []),
      } as any,
      1,
      product.sizes?.[0] ?? null
    );
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-w-[150px] max-w-[160px] shrink-0 overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
      <Link href={`/shop/p/${product.slug}`} className="block">
        <div className="relative aspect-square bg-neutral-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : null}
        </div>
      </Link>

      <div className="p-2.5">
        <Link href={`/shop/p/${product.slug}`}>
          <p className="line-clamp-2 text-[12px] font-medium leading-snug text-black">
            {product.name}
          </p>
        </Link>

        <p className="mt-1 text-[12px] font-medium text-[#FD3F92]">
          {priceFormatter(product.price, currency)}
        </p>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-2 w-full rounded-lg bg-[#FD3F92] px-2 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#e83784]"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}