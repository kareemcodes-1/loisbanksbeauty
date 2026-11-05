export type CurrencyCode =
  | "NGN"
  | "USD"
  | "GBP"
  | "EUR"
  | "CAD"
  | "AED"
  | "ZAR"
  | "GHS"
  | "AUD";

export type CurrencyOption = {
  code: CurrencyCode;
  label: string;
  locale: string;
  /** Multiply NGN price by this to get the display currency */
  rateFromNgn: number;
  countryCode: string;
};

export const CURRENCIES: CurrencyOption[] = [
  {
    code: "NGN",
    label: "NGN",
    locale: "en-NG",
    rateFromNgn: 1,
    countryCode: "ng",
  },
  {
    code: "USD",
    label: "USD",
    locale: "en-US",
    rateFromNgn: 1 / 1600,
    countryCode: "us",
  },
  {
    code: "GBP",
    label: "GBP",
    locale: "en-GB",
    rateFromNgn: 1 / 2020,
    countryCode: "gb",
  },
  {
    code: "EUR",
    label: "EUR",
    locale: "en-IE",
    rateFromNgn: 1 / 1740,
    countryCode: "eu",
  },
  {
    code: "CAD",
    label: "CAD",
    locale: "en-CA",
    rateFromNgn: 1 / 1170,
    countryCode: "ca",
  },
  {
    code: "AED",
    label: "AED",
    locale: "en-AE",
    rateFromNgn: 1 / 436,
    countryCode: "ae",
  },
  {
    code: "ZAR",
    label: "ZAR",
    locale: "en-ZA",
    rateFromNgn: 1 / 90,
    countryCode: "za",
  },
  {
    code: "GHS",
    label: "GHS",
    locale: "en-GH",
    rateFromNgn: 1 / 145,
    countryCode: "gh",
  },
  {
    code: "AUD",
    label: "AUD",
    locale: "en-AU",
    rateFromNgn: 1 / 1050,
    countryCode: "au",
  },
];

export function flagUrl(countryCode: string, width = 40) {
  return `https://flagcdn.com/w${width}/${countryCode}.png`;
}

export const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  NG: "NGN",
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AE: "AED",
  ZA: "ZAR",
  GH: "GHS",
  AU: "AUD",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  IE: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  FI: "EUR",
}

const DEFAULT_CURRENCY: CurrencyCode = "NGN";

export function getCurrency(code: CurrencyCode): CurrencyOption {
  return (
    CURRENCIES.find((c) => c.code === code) ??
    CURRENCIES.find((c) => c.code === DEFAULT_CURRENCY)!
  );
}

/** Fallback when country is unknown */
export function getDefaultCurrencyCode(): CurrencyCode {
  return DEFAULT_CURRENCY;
}

export function currencyFromCountry(
  countryCode?: string | null
): CurrencyCode {
  if (!countryCode) return DEFAULT_CURRENCY;
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] ?? DEFAULT_CURRENCY;
}