"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  type CurrencyCode,
  COUNTRY_TO_CURRENCY,
  getCurrency,
} from "@/lib/currency";

type CurrencyState = {
  currency: CurrencyCode;
  isAuto: boolean;
  setCurrency: (code: CurrencyCode) => void;
  setAutoLocation: () => Promise<void>;
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "NGN",
      isAuto: false,

      setCurrency: (code) =>
        set({
          currency: code,
          isAuto: false,
        }),

      setAutoLocation: async () => {
        try {
          const res = await fetch("https://ipapi.co/json/", {
            cache: "no-store",
          });

          if (!res.ok) throw new Error("Geo lookup failed");

          const data = (await res.json()) as { country_code?: string };
          const country = data.country_code?.toUpperCase() ?? "";
          const code = COUNTRY_TO_CURRENCY[country] ?? "NGN";

          set({
            currency: code,
            isAuto: true,
          });
        } catch {
          set({
            currency: "NGN",
            isAuto: true,
          });
        }
      },
    }),
    {
      name: "currency-preference",
    },
  ),
);

/** Helper for components that only need the active option */
export function useActiveCurrency() {
  const code = useCurrencyStore((s) => s.currency);
  return getCurrency(code);
}