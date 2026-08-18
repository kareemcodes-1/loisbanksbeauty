import type { HeroBanner } from "@/types";

export async function getHeroBanner(): Promise<HeroBanner> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/hero-banner`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hero banner");
  }

  return response.json();
}