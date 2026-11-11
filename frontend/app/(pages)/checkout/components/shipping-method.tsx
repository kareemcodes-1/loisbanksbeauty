"use client";

import { type CurrencyCode } from "@/lib/currency";

type ShippingMethod = "pickup" | "delivery";

type AreaOption = {
  area: string;
  fee: number;
};

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
  deliveryEstimate?: string;
  /** Areas within the selected state that have their own fee (e.g. Lagos Island vs Mainland) */
  areaOptions?: AreaOption[];
  selectedArea?: string;
  onAreaChange?: (area: string) => void;
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
  deliveryEstimate,
  areaOptions = [],
  selectedArea = "",
  onAreaChange,
}: Props) {
  const hasLocation = selectedCountry.trim().length > 0;
  const hasRate = deliveryFee !== undefined;
  const hasAreas = areaOptions.length > 0;

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
        <div
          className={`rounded-xl border transition-colors ${
            method === "delivery"
              ? "border-[#FD3F92] bg-[#FD3F92]/5"
              : "border-black/10 hover:border-black/20"
          }`}
        >
          <label className="flex cursor-pointer items-center justify-between gap-3 p-3.5 sm:p-4">
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
                    ? `Delivered to ${matchedLocation}${
                        deliveryEstimate ? ` • ${deliveryEstimate}` : ""
                      }`
                    : "Select country & region to see the fee"}
                </p>

                {/* Location chosen, but the admin hasn't set a fee for it */}
                {hasLocation && !hasRate && !needsRegion && !hasAreas && (
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

                {/* Region chosen, but it's split into areas with their own fee */}
                {hasAreas && !selectedArea && (
                  <p className="mt-1 text-xs text-black/50">
                    Select your area below to see the delivery fee
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
                    : hasAreas
                      ? "Select area"
                      : "Unavailable"
                  : "Select location"}
            </span>
          </label>

          {/* Area picker: shown once a state with multiple delivery zones is selected */}
          {method === "delivery" && hasAreas && (
            <div className="space-y-2 border-t border-black/10 px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
              <p className="text-xs font-medium uppercase tracking-[0.05em] text-black/50">
                Select your area
              </p>

              <div className="space-y-2">
                {areaOptions.map(({ area, fee }) => (
                  <label
                    key={area}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 transition-colors ${
                      selectedArea === area
                        ? "border-[#FD3F92] bg-[#FD3F92]/5"
                        : "border-black/10 hover:border-black/20"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <input
                        type="radio"
                        name="delivery-area"
                        value={area}
                        checked={selectedArea === area}
                        onChange={() => onAreaChange?.(area)}
                        className="h-4 w-4 shrink-0 accent-[#FD3F92]"
                      />
                      <span className="truncate text-sm">{area}</span>
                    </div>

                    <span className="shrink-0 text-sm font-medium text-black/70">
                      {priceFormatter(fee, currency)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}