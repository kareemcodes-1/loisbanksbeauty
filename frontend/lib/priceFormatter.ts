import { type CurrencyCode, getCurrency } from "@/lib/currency";

/**
 * @param priceInNgn - price stored in the database (Naira)
 * @param currencyCode - display currency (default NGN)
 */
export function priceFormatter(
  priceInNgn: number,
  currencyCode: CurrencyCode = "NGN"
) {
  const { code, locale, rateFromNgn } = getCurrency(currencyCode);
  const converted = priceInNgn * rateFromNgn;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: code === "KWD" ? 3 : 2,
  }).format(converted);
}