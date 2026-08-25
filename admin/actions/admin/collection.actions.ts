import type { Collection } from "@/types";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface CollectionPayload {
  name: string;
  slug: string;
  image: string;
  featured: boolean;
}

export interface GetCollectionsResult {
  collections: Collection[];
  pagination: PaginationMeta;
}

interface GetCollectionsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getCollections({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
}: GetCollectionsParams = {}): Promise<GetCollectionsResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
    sortOrder,
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/collections?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch collections");
  }

  return response.json();
}

export async function createCollection(data: CollectionPayload) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to create collection");
  }

  return response.json();
}

export async function updateCollection(
  id: string,
  data: CollectionPayload
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/collections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to update collection");
  }

  return response.json();
}

export async function deleteCollection(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/collections/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to delete collection");
  }

  // Some APIs return 204 No Content
  if (response.status === 204) {
    return { success: true };
  }

  return response.json();
}