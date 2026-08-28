// components/checkout/shipping-method.tsx
"use client";

import { type CurrencyCode } from "@/lib/currency";

type ShippingMethod = "pickup" | "delivery";

type Props = {
  method: ShippingMethod;
  onChange: (method: ShippingMethod) => void;
  shippingFee: number;
  currency: CurrencyCode;
  priceFormatter: (amount: number, currency?: CurrencyCode) => string;
  countryCode?: string;
};

export default function ShippingMethodSection({
  method,
  onChange,
  shippingFee,
  currency,
  priceFormatter,
  countryCode,
}: Props) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <h2 className="mb-5 text-[1.1rem] font-medium sm:mb-6 sm:text-[1.2rem]">
        Shipping method
      </h2>

      <div className="space-y-3">
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors sm:p-4 ${
            method === "pickup"
              ? "border-[#FD3F92] bg-[#FD3F92]/5"
              : "border-black/10 hover:border-black/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="shipping"
              value="pickup"
              checked={method === "pickup"}
              onChange={() => onChange("pickup")}
              className="h-4 w-4 shrink-0 accent-[#FD3F92]"
            />
            <div>
              <p className="text-sm font-medium">Pickup at store</p>
              <p className="text-xs text-black/50">
                Free • Usually ready in 1–2 hours
              </p>
            </div>
          </div>
          <span className="shrink-0 text-sm font-medium text-black/70">
            Free
          </span>
        </label>

        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors sm:p-4 ${
            method === "delivery"
              ? "border-[#FD3F92] bg-[#FD3F92]/5"
              : "border-black/10 hover:border-black/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="shipping"
              value="delivery"
              checked={method === "delivery"}
              onChange={() => onChange("delivery")}
              className="h-4 w-4 shrink-0 accent-[#FD3F92]"
            />
            <div>
              <p className="text-sm font-medium">Door delivery</p>
              <p className="text-xs text-black/50">
                {countryCode
                  ? "Fee based on your delivery country"
                  : "Select a country in your address to see the fee"}
              </p>
            </div>
          </div>
          <span className="shrink-0 text-sm font-medium text-black/70">
            {priceFormatter(shippingFee, currency)}
          </span>
        </label>
      </div>
    </section>
  );
}