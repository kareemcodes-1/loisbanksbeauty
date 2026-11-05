import { CURRENCIES } from "./currency";

export type PaidAmount = {
  /** "$533.81", "₦16,000", "533.81 USDC" */
  primary: string;
  /** "Solana" for crypto, otherwise null */
  network: string | null;
  isNaira: boolean;
};

const NETWORKS: Record<string, string> = {
  SOL: "Solana",
  ETH: "Ethereum",
  BASE: "Base",
  POLYGON: "Polygon",
  MATIC: "Polygon",
  TRX: "Tron",
  TRON: "Tron",
  BSC: "BNB Chain",
  BNB: "BNB Chain",
  ARB: "Arbitrum",
  ARBITRUM: "Arbitrum",
  OP: "Optimism",
  AVAX: "Avalanche",
};

let fiatCodes: Set<string> | null = null;

// Real ISO currencies only (USD, NGN, GBP...), so crypto tickers like BTC or ETH
// aren't treated as normal money
function isFiat(code: string) {
  try {
    fiatCodes ??= new Set(Intl.supportedValuesOf("currency"));
    return fiatCodes.has(code);
  } catch {
    return /^[A-Z]{3}$/.test(code);
  }
}

/**
 * Format what the customer actually paid, in the currency they paid in.
 * Returns null when nothing was paid yet.
 */
export function formatPaidAmount(
  amountPaid?: string | null,
  currencyPaid?: string | null
): PaidAmount | null {
  if (!amountPaid || !currencyPaid) return null;

  const amount = Number(amountPaid);
  if (!Number.isFinite(amount)) return null;

  const raw = currencyPaid.trim().toUpperCase();
  const [token, networkCode] = raw.split("_");

  // Normal money: USD, NGN, GBP, EUR...
  if (!networkCode && isFiat(token)) {
    const locale = CURRENCIES.find((c) => c.code === token)?.locale ?? "en-US";

    try {
      const primary = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: token,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);

      return { primary, network: null, isNaira: token === "NGN" };
    } catch {
      // fall through to the plain format below
    }
  }

  // Crypto (USDC_SOL, USDT_TRX, BTC...): "533.81 USDC" + network name
  const isStablecoin = token.startsWith("USD");

  const number = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: isStablecoin ? 2 : 0,
    maximumFractionDigits: isStablecoin ? 2 : 6,
  }).format(amount);

  return {
    primary: `${number} ${token}`,
    network: networkCode ? (NETWORKS[networkCode] ?? networkCode) : null,
    isNaira: false,
  };
}