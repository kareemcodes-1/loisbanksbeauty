// lib/shipping.ts

export type ShippingMethod = "pickup" | "delivery";

/** Pickup is always free */
export const PICKUP_FEE = 0;

/**
 * Door delivery fees by country (ISO 3166-1 alpha-2).
 * Amounts are in the same unit as product prices (NGN).
 */
export const DELIVERY_FEES_BY_COUNTRY: Record<string, number> = {
  NG: 5000, // Nigeria
  US: 45000, // United States
  GB: 40000, // United Kingdom
  CA: 42000, // Canada
  AE: 35000, // UAE
  SA: 35000, // Saudi Arabia
  // add more as the client provides rates
};

/** Used when country is missing or not in the list */
export const DEFAULT_DELIVERY_FEE = 50000;

/**
 * @param method - pickup | delivery
 * @param countryCode - e.g. "NG", "US" (from address)
 */
export function getShippingFee(
  method: ShippingMethod,
  countryCode?: string | null
): number {
  if (method === "pickup") {
    return PICKUP_FEE;
  }

  const code = (countryCode || "").trim().toUpperCase();

  if (code && code in DELIVERY_FEES_BY_COUNTRY) {
    return DELIVERY_FEES_BY_COUNTRY[code];
  }

  return DEFAULT_DELIVERY_FEE;
}