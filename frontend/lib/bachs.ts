import crypto from "crypto";
import { getCurrency } from "@/lib/currency";
import type { CurrencyCode } from "@/lib/currency";

const BACHS_API_BASE =
  process.env.BACHS_API_BASE || "https://sandbox-api.bachs.io";
const BACHS_SECRET_KEY = process.env.BACHS_SECRET_KEY!;

/** Currencies Bachs can use as pricing.currency */
const BACHS_PRICING_CURRENCIES = new Set([
  "NGN",
  "USD",
  "GHS",
  "KES",
  "TZS",
  "UGX",
  "XAF",
  "XOF",
  "RWF",
  "MWK",
  "ZMW",
]);

export type CreateBachsCheckoutInput = {
  /** Order total in NGN major units (source of truth in your DB) */
  amount: number;
  /** Display / preferred currency from the storefront */
  currency?: CurrencyCode;
  orderId: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  successUrl: string;
  cancelUrl: string;
};

function buildPricing(amountNgn: number, preferred?: CurrencyCode) {
  const ngn = amountNgn.toFixed(2);
  const code = preferred ?? "NGN";

  // Local Naira: lock to NGN only
  if (code === "NGN") {
    return {
      currency: "NGN",
      amount: ngn,
    };
  }

  // USD selected
  if (code === "USD") {
    const usd = getCurrency("USD");
    const usdAmount = (amountNgn * usd.rateFromNgn).toFixed(2);

    return {
      currency: "USD",
      amount: usdAmount,
      currency_options: {
        NGN: ngn,
      },
    };
  }

  // Bachs-native local currency (GHS/KES/etc. if you add them later)
  if (BACHS_PRICING_CURRENCIES.has(code)) {
    const opt = getCurrency(code);
    const localAmount = (amountNgn * opt.rateFromNgn).toFixed(2);

    return {
      currency: code,
      amount: localAmount,
      currency_options: {
        NGN: ngn,
      },
    };
  }

  // EUR, GBP, CAD, SAR, AED, etc. — Bachs cannot price these.
  // Use USD base so international cards work; pin exact NGN.
  const usd = getCurrency("USD");
  const usdAmount = (amountNgn * usd.rateFromNgn).toFixed(2);

  return {
    currency: "USD",
    amount: usdAmount,
    currency_options: {
      NGN: ngn,
    },
  };
}

export async function createBachsCheckoutSession(
  input: CreateBachsCheckoutInput
) {
  const pricing = buildPricing(input.amount, input.currency);

  const res = await fetch(`${BACHS_API_BASE}/v1/checkout-sessions`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${BACHS_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    pricing,
    customer: {
      email: input.customer.email,
      name: input.customer.name,
      ...(input.customer.phone
        ? { phone_number: input.customer.phone }
        : {}),
    },
    reference: input.orderId,
    metadata: {
      order_id: input.orderId,
      storefront_currency: input.currency ?? "NGN",
    },
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    expires_in_minutes: 60,
  }),
});

  const data = await res.json();

  if (!res.ok) {
    console.error("Bachs checkout error:", data);
    throw new Error(
      data?.message || data?.error || "Failed to create Bachs checkout"
    );
  }

  return data as {
    checkout_id: string;
    checkout_url: string;
    status: string;
    expires_at: string;
    reference?: string;
  };

  
}

/** Verify X-Bachs-Signature / X-Bachs-Signature-V2 */
export function verifyBachsWebhook(params: {
  rawBody: string;
  signatureHeader: string | null;
  signatureV2Header: string | null;
  timestampHeader: string | null;
  secret: string;
  toleranceSeconds?: number;
}): boolean {
  const {
    rawBody,
    signatureHeader,
    signatureV2Header,
    timestampHeader,
    secret,
    toleranceSeconds = 300,
  } = params;

  if (signatureV2Header) {
    const parts = Object.fromEntries(
      signatureV2Header
        .split(",")
        .map((p) => p.split("=") as [string, string])
        .filter(([k, v]) => k && v)
    );

    const timestamp = Number(parts.t);
    if (
      !timestamp ||
      Math.abs(Date.now() / 1000 - timestamp) > toleranceSeconds
    ) {
      return false;
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");

    const signatures = signatureV2Header
      .split(",")
      .filter((p) => p.startsWith("v1="))
      .map((p) => p.slice(3));

    return signatures.some((s) => {
      try {
        const a = Buffer.from(expected);
        const b = Buffer.from(s);
        return a.length === b.length && crypto.timingSafeEqual(a, b);
      } catch {
        return false;
      }
    });
  }

  if (!signatureHeader || !timestampHeader) return false;

  const timestamp = Number(timestampHeader);
  if (
    !timestamp ||
    Math.abs(Date.now() / 1000 - timestamp) > toleranceSeconds
  ) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(signatureHeader);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }

  
}

export function mapBachsPaymentChannel(raw?: string | null): {
  channel: "card" | "bank_transfer" | "mobile_money" | "crypto" | "unknown";
  label: string;
} {
  if (!raw) {
    return { channel: "unknown", label: "Unknown" };
  }

  const t = raw.toUpperCase().replace(/\s+/g, "_");

  if (
    t === "CARD" ||
    t === "USD_CARD" ||
    t === "NGN_CARD" ||
    t.includes("CARD")
  ) {
    return { channel: "card", label: "Card" };
  }

  if (
    t === "BANK_TRANSFER" ||
    t === "NGN_BANK_TRANSFER" ||
    t.includes("BANK_TRANSFER")
  ) {
    return { channel: "bank_transfer", label: "Bank transfer" };
  }

  if (
    t.startsWith("MOMO_") ||
    t.includes("MOBILE_MONEY") ||
    t.includes("MOMO")
  ) {
    return { channel: "mobile_money", label: "Mobile money" };
  }

  if (t === "CRYPTO" || t.includes("CRYPTO") || t.includes("USDT")) {
    return { channel: "crypto", label: "Crypto" };
  }

  return {
    channel: "unknown",
    label: String(raw),
  };
}