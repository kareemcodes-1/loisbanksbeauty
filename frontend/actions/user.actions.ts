import type { User } from "@/types";

export async function getUser(userId: string): Promise<User> {
  const response = await fetch(`/api/users/${userId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }

    throw new Error("Failed to fetch user");
  }

  return response.json();
}