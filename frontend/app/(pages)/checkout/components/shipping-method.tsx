"use client";

import { type CurrencyCode } from "@/lib/currency";

type ShippingMethod = "pickup" | "delivery";

type Props = {
  method: ShippingMethod;
  onChange: (method: ShippingMethod) => void;
  /** Fee of the matched location, shown regardless of the selected method */
  deliveryFee?: number;
  /** Country currently selected in the delivery address */
  selectedCountry: string;
  /** True when the country has region-specific rates and no region is picked yet */
  needsRegion: boolean;
  currency: CurrencyCode;
  priceFormatter: (amount: number, currency?: CurrencyCode) => string;
  matchedLocation?: string;
};

export default function ShippingMethodSection({
  method,
  onChange,
  deliveryFee,
  selectedCountry,
  needsRegion,
  currency,
  priceFormatter,
  matchedLocation,
}: Props) {
  const hasLocation = selectedCountry.trim().length > 0;
  const hasRate = deliveryFee !== undefined;

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <h2 className="mb-5 text-[1.1rem] font-medium sm:mb-6 sm:text-[1.2rem]">
        Shipping method
      </h2>

      <div className="space-y-3">
        {/* Pickup */}
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors sm:p-4 ${
            method === "pickup"
              ? "border-[#FD3F92] bg-[#FD3F92]/5"
              : "border-black/10 hover:border-black/20"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <input
              type="radio"
              name="shipping"
              value="pickup"
              checked={method === "pickup"}
              onChange={() => onChange("pickup")}
              className="h-4 w-4 shrink-0 accent-[#FD3F92]"
            />
            <div className="min-w-0">
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

        {/* Door Delivery */}
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors sm:p-4 ${
            method === "delivery"
              ? "border-[#FD3F92] bg-[#FD3F92]/5"
              : "border-black/10 hover:border-black/20"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <input
              type="radio"
              name="shipping"
              value="delivery"
              checked={method === "delivery"}
              onChange={() => onChange("delivery")}
              className="h-4 w-4 shrink-0 accent-[#FD3F92]"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium">Door delivery</p>
              <p className="text-xs text-black/50">
                {matchedLocation
                  ? `Delivered to ${matchedLocation}`
                  : "Select country & region to see the fee"}
              </p>

              {/* Location chosen, but the admin hasn't set a fee for it */}
              {hasLocation && !hasRate && !needsRegion && (
                <p className="mt-1 text-xs text-red-600">
                  Delivery isn&apos;t available in your location
                </p>
              )}

              {/* Country has region-specific rates, region not chosen yet */}
              {hasLocation && !hasRate && needsRegion && (
                <p className="mt-1 text-xs text-black/50">
                  Select your region to see the delivery fee
                </p>
              )}
            </div>
          </div>

          <span className="shrink-0 text-right text-sm font-medium text-black/70">
            {hasRate
              ? priceFormatter(deliveryFee, currency)
              : hasLocation
                ? needsRegion
                  ? "Select region"
                  : "Unavailable"
                : "Select location"}
          </span>
        </label>
      </div>
    </section>
  );
}