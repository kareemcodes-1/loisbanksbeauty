/**
 * Format money for the admin panel (always Naira).
 */
export function priceFormatter(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}