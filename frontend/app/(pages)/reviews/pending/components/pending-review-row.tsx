"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { PendingReviewItem } from "@/actions/review.actions";

type Props = {
  item: PendingReviewItem;
  onRate?: () => void;
};

export default function PendingReviewRow({ item, onRate }: Props) {
  const isNeedsReview = item.type === "needs_review";

  const deliveredDate = item.deliveredAt
    ? new Date(item.deliveredAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        {/* Left: Image + Info */}
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
            {item.productImage && (
              <Image
                src={item.productImage}
                alt={item.productName}
                fill
                sizes="64px"
                className="object-cover"
              />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-black">
              {item.productName}
            </p>

            {isNeedsReview ? (
              <div className="mt-1 space-y-0.5 text-xs text-black/50">
                {item.orderReference && (
                  <p className="font-mono">Order: {item.orderReference}</p>
                )}
                {deliveredDate && <p>Delivered: {deliveredDate}</p>}
              </div>
            ) : (
              <div className="mt-1.5 flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < (item.rating || 0)
                        ? "fill-[#F5C518] text-[#F5C518]"
                        : "fill-transparent text-black/15"
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Action or Status */}
        <div className="shrink-0">
          {isNeedsReview && onRate ? (
            <button
              type="button"
              onClick={onRate}
              className="btn-primary w-full px-6 text-sm sm:w-auto"
            >
              Rate this product
            </button>
          ) : (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
              Waiting for approval
            </span>
          )}
        </div>
      </div>

      {/* Review preview (only for pending approval) */}
      {!isNeedsReview && item.comment && (
        <div className="mt-4 rounded-xl border border-black/5 bg-neutral-50 p-3.5">
          {item.title && (
            <p className="text-sm font-medium text-black">{item.title}</p>
          )}
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-black/60">
            {item.comment}
          </p>
        </div>
      )}
    </div>
  );
}