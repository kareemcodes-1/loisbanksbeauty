"use client";

import Image from "next/image";
import Link from "next/link";

import { priceFormatter } from "@/lib/priceFormatter";
import { getProductPricing } from "@/lib/product-pricing";
import type { Product } from "@/types";
import { useCurrencyStore } from "@/store/currency";

const ProductCard = ({ item }: { item: Product }) => {
  const currency = useCurrencyStore((s) => s.currency);
  const images = item.media.filter((media) => media.type === "image");
  const firstImage = images[0];
  const secondImage = images[1];
  const video = item.media.find((media) => media.type === "video");

  const fallbackImage = firstImage?.url || "/placeholder.jpg";
  const hoverImage = secondImage?.url || fallbackImage;

  const { originalPrice, finalPrice, hasDiscount, discountLabel } =
    getProductPricing(item);

  return (
    <Link href={`/shop/p/${item.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={fallbackImage}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
          className={`object-cover transition-opacity duration-500 ${
            video || secondImage ? "group-hover:opacity-0" : ""
          }`}
        />

        {video && (
          <video
            src={video.url}
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {!video && secondImage && (
          <Image
            src={hoverImage}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
            className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Discount badge */}
        {hasDiscount && discountLabel && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-[#FD3F92] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:text-[0.7rem]">
            {discountLabel}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1.5 sm:mt-4 sm:gap-2">
        <span className="subtitle">
          {typeof item.collectionId === "object" ? item.collectionId.name : ""}
        </span>

        <h4 className="text-[1.05rem] leading-snug sm:text-[1.25rem] lg:text-[1.5rem]">
          {item.name}
        </h4>

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[1rem] font-semibold uppercase text-black/90 sm:text-[1.1rem] lg:text-[1.2rem]">
            {priceFormatter(finalPrice, currency)}
          </p>

          {hasDiscount && (
            <p className="text-[0.9rem] text-black/40 line-through sm:text-[1rem]">
              {priceFormatter(originalPrice, currency)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;