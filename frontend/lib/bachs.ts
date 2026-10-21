import crypto from "crypto";

const BACHS_API_BASE =
  process.env.BACHS_API_BASE || "https://sandbox-api.bachs.io";
const BACHS_SECRET_KEY = process.env.BACHS_SECRET_KEY!;

export type CreateBachsCheckoutInput = {
  amount: number; // NGN major units, e.g. 16000
  orderId: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  successUrl: string;
  cancelUrl: string;
};

export async function createBachsCheckoutSession(
  input: CreateBachsCheckoutInput & { usdAmount?: number }
) {
  const amountNgn = input.amount.toFixed(2);

  // Approximate USD from your rate, or a fixed rate — used only as base for FX / USD_CARD
  const amountUsd = (input.usdAmount ?? input.amount / 1600).toFixed(2);

  const res = await fetch(`${BACHS_API_BASE}/v1/checkout-sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BACHS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pricing: {
        currency: "USD",
        amount: amountUsd,
        // Exact ₦ so Nigerian checkout matches your order total
        currency_options: {
          NGN: amountNgn,
        },
      },
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
      },
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      expires_in_minutes: 60,
      // Leave omitted so all enabled methods show (USD card, NGN transfer, momo, crypto…)
      // payment_method_types: ["USD_CARD", "NGN_CARD", "NGN_BANK_TRANSFER", "CRYPTO"],
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

  // Prefer V2: t=...,v1=...
  if (signatureV2Header) {
    const parts = Object.fromEntries(
      signatureV2Header
        .split(",")
        .map((p) => p.split("=") as [string, string])
        .filter(([k, v]) => k && v)
    );

    const timestamp = Number(parts.t);
    if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > toleranceSeconds) {
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

    return signatures.some((s) =>
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(s))
    );
  }

  // Fallback: X-Bachs-Signature + X-Bachs-Timestamp
  if (!signatureHeader || !timestampHeader) return false;

  const timestamp = Number(timestampHeader);
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > toleranceSeconds) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signatureHeader)
    );
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

  // Card: CARD, USD_CARD, NGN_CARD
  if (t === "CARD" || t === "USD_CARD" || t === "NGN_CARD" || t.includes("CARD")) {
    return { channel: "card", label: "Card" };
  }

  // Bank transfer: BANK_TRANSFER, NGN_BANK_TRANSFER, bank_transfer
  if (
    t === "BANK_TRANSFER" ||
    t === "NGN_BANK_TRANSFER" ||
    t.includes("BANK_TRANSFER")
  ) {
    return { channel: "bank_transfer", label: "Bank transfer" };
  }

  // Mobile money: MOMO_GHS, MOMO_KES, MOBILE_MONEY, etc.
  if (
    t.startsWith("MOMO_") ||
    t.includes("MOBILE_MONEY") ||
    t.includes("MOMO")
  ) {
    return { channel: "mobile_money", label: "Mobile money" };
  }

  // Crypto
  if (t === "CRYPTO" || t.includes("CRYPTO") || t.includes("USDT")) {
    return { channel: "crypto", label: "Crypto" };
  }

  return {
    channel: "unknown",
    label: String(raw),
  };
}