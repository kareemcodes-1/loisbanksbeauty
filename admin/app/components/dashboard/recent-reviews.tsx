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

import type { Review } from "@/types"; // ← use the shared type

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
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base">Recent Reviews</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest customer feedback
          </p>
        </div>
        <MessageSquareTextIcon className="size-5 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        {reviews.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center text-sm text-muted-foreground">
            No reviews yet.
          </div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="flex gap-3 py-3 first:pt-0 last:pb-0"
              >
                {/* Avatar */}
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {getInitial(getUserName(review.userId))}
                </div>

                {/* Review content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    {/* Stars */}
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

                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                    {review.comment}
                  </p>

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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}