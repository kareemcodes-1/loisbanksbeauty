export type CurrencyCode =
  | "NGN"
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "EGP"
  | "KWD"
  | "SAR"
  | "AED"
  | "QAR";

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
    label: "Nigerian Naira",
    locale: "en-NG",
    rateFromNgn: 1,
    countryCode: "ng",
  },
  {
    code: "USD",
    label: "US Dollar",
    locale: "en-US",
    // ~1600 NGN = 1 USD  →  1 NGN ≈ 1/1600 USD
    rateFromNgn: 1 / 1600,
    countryCode: "us",
  },
  {
    code: "EUR",
    label: "Euro",
    locale: "de-DE",
    rateFromNgn: 1 / 1740, // approx — update when you want
    countryCode: "eu",
  },
  {
    code: "GBP",
    label: "British Pound",
    locale: "en-GB",
    rateFromNgn: 1 / 2020,
    countryCode: "gb",
  },
  {
    code: "CAD",
    label: "Canadian Dollar",
    locale: "en-CA",
    rateFromNgn: 1 / 1170,
    countryCode: "ca",
  },
  {
    code: "EGP",
    label: "Egyptian Pound",
    locale: "ar-EG",
    rateFromNgn: 1 / 32, // rough
    countryCode: "eg",
  },
  {
    code: "KWD",
    label: "Kuwaiti Dinar",
    locale: "ar-KW",
    rateFromNgn: 1 / 5200,
    countryCode: "kw",
  },
  {
    code: "SAR",
    label: "Saudi Riyal",
    locale: "ar-SA",
    rateFromNgn: 1 / 427,
    countryCode: "sa",
  },
  {
    code: "AED",
    label: "UAE Dirham",
    locale: "ar-AE",
    rateFromNgn: 1 / 436,
    countryCode: "ae",
  },
  {
    code: "QAR",
    label: "Qatari Riyal",
    locale: "ar-QA",
    rateFromNgn: 1 / 440,
    countryCode: "qa",
  },
];

export function flagUrl(countryCode: string, width = 40) {
  return `https://flagcdn.com/w${width}/${countryCode}.png`;
}

/** ISO country → preferred currency */
export const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  NG: "NGN",
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  EG: "EGP",
  KW: "KWD",
  SA: "SAR",
  AE: "AED",
  QA: "QAR",
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
};

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