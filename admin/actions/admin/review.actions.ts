import type { Review } from "@/types";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface GetReviewsResult {
  reviews: Review[];
  pagination: PaginationMeta;
}

interface GetReviewsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: "all" | "approved" | "pending";
}

export async function getReviews({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  status = "all",
}: GetReviewsParams = {}): Promise<GetReviewsResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
    sortOrder,
    status,
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reviews?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
}

export async function updateReviewApproval(
  id: string,
  isApproved: boolean
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reviews/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isApproved }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to update review");
  }

  return response.json();
}

export async function deleteReview(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reviews/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to delete review");
  }

  return response.json();
}