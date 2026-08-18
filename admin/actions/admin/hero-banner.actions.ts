import type { HeroBanner } from "@/types";

export interface HeroBannerPayload {
  title: string;
  description: string;
  media: string;
  mediaType: "image" | "video";
  buttonText: string;
  buttonLink: string;
}

export async function getHeroBanner(): Promise<HeroBanner | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/hero-banner`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  // 404 = no banner yet
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch hero banner");
  }

  return response.json();
}

export async function createHeroBanner(data: HeroBannerPayload) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/hero-banner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to create hero banner");
  }

  return response.json();
}

export async function updateHeroBanner(data: HeroBannerPayload) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/hero-banner`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to update hero banner");
  }

  return response.json();
}

export async function deleteHeroBanner() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/hero-banner`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to delete hero banner");
  }

  return response.json();
}