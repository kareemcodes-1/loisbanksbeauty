"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  StarIcon,
  MessageSquareTextIcon,
} from "lucide-react";

import type { Review } from "@/types";

interface RecentReviewsProps {
  reviews: Review[];
}

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

function getInitial(name: string) {
  return name?.charAt(0).toUpperCase() || "?";
}

function getUserName(userId: Review["userId"]) {
  if (!userId) return "Customer";
  if (typeof userId === "string") return "Customer";
  return userId.name || "Customer";
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div className="min-w-0">
          <CardTitle className="text-base">
            Recent Reviews
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Latest customer feedback
          </p>
        </div>

        <MessageSquareTextIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        {reviews.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center text-center text-sm text-muted-foreground">
            No reviews yet.
          </div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => {
              const userName = getUserName(review.userId);

              return (
                <div
                  key={review._id}
                  className="flex gap-3 py-3 first:pt-0 last:pb-0"
                >
                  {/* Avatar */}
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {getInitial(userName)}
                  </div>

                  {/* Review content */}
                  <div className="min-w-0 flex-1">
                    {/* Rating + Date */}
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`size-3 ${
                              index < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Review */}
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                      {review.comment}
                    </p>

                    {/* Status */}
                    <div className="mt-1.5">
                      <Badge
                        variant="outline"
                        className={`h-5 px-1.5 text-[10px] ${
                          review.isApproved
                            ? "border-green-200 bg-green-100 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-950 dark:text-green-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}