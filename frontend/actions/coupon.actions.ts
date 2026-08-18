import type { Coupon } from "@/types";

export async function getCoupon(code: string): Promise<Coupon> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/coupons/${encodeURIComponent(code)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Invalid or inactive coupon");
    }

    if (response.status === 400) {
      throw new Error("Coupon is expired or unavailable");
    }

    throw new Error("Failed to fetch coupon");
  }

  return response.json();
}