import type { Order, User } from "@/types";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface UserWithStats extends User {
  orderCount: number;
}

export interface UserDetail extends UserWithStats {
  orders?: Order[];
}

export interface GetUsersResult {
  users: UserWithStats[];
  pagination: PaginationMeta;
}

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getUsers({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
}: GetUsersParams = {}): Promise<GetUsersResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
    sortOrder,
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function getUser(id: string): Promise<UserDetail> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}