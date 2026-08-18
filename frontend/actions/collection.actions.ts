import type { Collection } from "@/types";

export async function getCollections(): Promise<Collection[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/collections`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch collections");
  }

  return response.json();
}