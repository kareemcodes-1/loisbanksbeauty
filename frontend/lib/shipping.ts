export const SHIPPING = {
  pickup: 0,
  delivery: 5, // base currency (same unit as product prices)
} as const;

export type ShippingMethod = keyof typeof SHIPPING;

export function getShippingFee(method: ShippingMethod) {
  return SHIPPING[method];
}