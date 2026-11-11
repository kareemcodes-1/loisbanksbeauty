"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, ShoppingBag } from "lucide-react";

import { useCartStore } from "@/store/cart";
import { useCurrencyStore } from "@/store/currency";
import { priceFormatter } from "@/lib/priceFormatter";
import { getDeliveryEstimate } from "@/lib/delivery-estimate";

import { Skeleton } from "@/components/ui/skeleton";

import ContactSection from "./contact-section";
import DeliverySection, {
  type DeliveryData,
  type SavedAddress,
} from "./delivery-section";
import ShippingMethodSection from "./shipping-method";
import PaymentSection from "./payment-section";
import OrderSummary from "./order-summary";
import EmptyState from "@/app/components/empty-state";

type UserData = {
  email: string;
  phone: string;
  name?: string;
  addresses: SavedAddress[];
};

type Props = {
  user: UserData;
};

type PublicShippingRate = {
  _id: string;
  country: string;
  countryName: string;
  state?: string | null;
  stateCode?: string | null;
  /** Sub-region within a state with its own fee, e.g. "Lagos Island" */
  area?: string | null;
  fee: number;
};

const normalize = (value?: string | null) => value?.trim().toLowerCase() ?? "";

export default function CheckoutForm({ user }: Props) {
  const { items, _hasHydrated } = useCartStore();
  const currency = useCurrencyStore((s) => s.currency);

  const [contact, setContact] = useState({
    email: user.email || "",
    phone: user.phone || "",
  });

  const [delivery, setDelivery] = useState<DeliveryData>({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">(
    "new"
  );

  const [shippingMethod, setShippingMethod] = useState<"pickup" | "delivery">(
    "pickup"
  );

  // Sub-region within the selected state, e.g. "Lagos Island" vs "Lagos Mainland"
  const [selectedArea, setSelectedArea] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipping rates from database
  const [shippingRates, setShippingRates] = useState<PublicShippingRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(true);

  useEffect(() => {
    const loadRates = async () => {
      try {
        const res = await fetch("/api/shipping-rates");
        if (!res.ok) throw new Error("Failed to load shipping rates");
        const data = await res.json();
        setShippingRates(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load delivery fees");
      } finally {
        setLoadingRates(false);
      }
    };

    loadRates();
  }, []);

  // Cancelled payment return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("cancelled") === "1") {
      toast.error(
        "Payment was cancelled. You can try again when you're ready."
      );
    }
  }, []);

  // Auto-select default address (logged-in users with saved addresses)
  useEffect(() => {
    if (user.addresses.length === 0) {
      setSelectedAddressId("new");
      setDelivery((prev) => ({
        ...prev,
        firstName: prev.firstName || user.name?.split(" ")[0] || "",
        lastName:
          prev.lastName || user.name?.split(" ").slice(1).join(" ") || "",
      }));
      return;
    }

    const defaultAddr =
      user.addresses.find((a) => a.isDefault) || user.addresses[0];

    setSelectedAddressId(defaultAddr._id);
    setDelivery({
      firstName: defaultAddr.firstName,
      lastName: defaultAddr.lastName,
      address: defaultAddr.address,
      apartment: defaultAddr.apartment || "",
      city: defaultAddr.city,
      state: defaultAddr.state,
      postalCode: defaultAddr.postalCode,
      country: defaultAddr.country,
    });
  }, [user.addresses, user.name]);

  // A new country or state can change which area options apply,
  // so don't carry an old area selection across
  useEffect(() => {
    setSelectedArea("");
  }, [delivery.country, delivery.state]);

  // ===== Shipping rate matching =====
  const countryRates = delivery.country
    ? shippingRates.filter(
        (rate) => rate.country.toUpperCase() === delivery.country.toUpperCase()
      )
    : [];

  const stateRates = delivery.state
    ? countryRates.filter(
        (rate) =>
          normalize(rate.stateCode) === normalize(delivery.state) ||
          normalize(rate.state) === normalize(delivery.state)
      )
    : [];

  // Areas within the selected state that have their own fee (e.g. Lagos Island / Mainland)
  const areaOptions = Array.from(
    new Map(
      stateRates
        .filter((rate) => rate.area)
        .map((rate) => [
          rate.area as string,
          { area: rate.area as string, fee: rate.fee },
        ])
    ).values()
  );

  // Priority: 1. Exact area match  2. Exact state match  3. Country-wide rate
  const matchedRate = (() => {
    if (!delivery.country || countryRates.length === 0) return null;

    if (delivery.state) {
      if (areaOptions.length > 0) {
        if (!selectedArea) return null;

        return (
          stateRates.find(
            (rate) => normalize(rate.area) === normalize(selectedArea)
          ) || null
        );
      }

      const plainStateRate = stateRates.find((rate) => !rate.area);
      if (plainStateRate) return plainStateRate;
    }

    // Fall back to a country-wide rate (no state, no area)
    const countryWide = countryRates.find(
      (rate) => !rate.state && !rate.stateCode && !rate.area
    );

    return countryWide || null;
  })();

  const deliveryEstimate = getDeliveryEstimate(delivery.country, delivery.state);

  const handleSelectAddress = (id: string | "new") => {
    setSelectedAddressId(id);

    if (id === "new") {
      setDelivery({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
      return;
    }

    const addr = user.addresses.find((a) => a._id === id);
    if (!addr) return;

    setDelivery({
      firstName: addr.firstName,
      lastName: addr.lastName,
      address: addr.address,
      apartment: addr.apartment || "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    });
  };

  const handleContactChange = (
    field: keyof typeof contact,
    value: string
  ) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeliveryChange = (
    field: keyof DeliveryData,
    value: string
  ) => {
    setDelivery((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Block double submits (double click / double tap)
    if (isSubmitting) return;

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!contact.email || !contact.phone) {
      toast.error("Please fill in your contact details.");
      return;
    }

    if (
      !delivery.firstName ||
      !delivery.lastName ||
      !delivery.address ||
      !delivery.city ||
      !delivery.state ||
      !delivery.country ||
      !delivery.postalCode
    ) {
      toast.error("Please complete your delivery address.");
      return;
    }

    if (
      shippingMethod === "delivery" &&
      areaOptions.length > 0 &&
      !selectedArea
    ) {
      toast.error("Please select your delivery area.");
      return;
    }

    setIsSubmitting(true);

    // Stays true while the browser is being sent to the payment page,
    // so the button doesn't re-enable and allow a second order.
    let redirecting = false;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          delivery: {
            ...delivery,
            area: selectedArea || null,
          },
          shippingMethod,
          selectedAddressId,
          selectedShippingRateId: matchedRate?._id ?? null,
          items,
          currency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to place your order.");
        return;
      }

      if (data.checkoutUrl) {
        redirecting = true;
        window.location.href = data.checkoutUrl;
        return;
      }

      toast.error(
        data.message || "Payment could not be started. Please try again."
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      if (!redirecting) setIsSubmitting(false);
    }
  };

  if (!_hasHydrated || loadingRates) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-12">
        <div className="space-y-5 sm:space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        message="Your cart is empty."
        buttonText="Continue Shopping"
        buttonHref="/shop"
      />
    );
  }

  const shippingFee =
    shippingMethod === "delivery" ? matchedRate?.fee ?? 0 : 0;

  // Country has region-specific rates, but the customer hasn't picked a region yet
  const needsRegion =
    Boolean(delivery.country) &&
    !matchedRate &&
    !delivery.state &&
    shippingRates.some(
      (rate) =>
        rate.country.toUpperCase() === delivery.country.toUpperCase() &&
        Boolean(rate.state || rate.stateCode)
    );

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-12">
        <div className="min-w-0 space-y-5 sm:space-y-6">
          <ContactSection data={contact} onChange={handleContactChange} />

          <DeliverySection
            data={delivery}
            onChange={handleDeliveryChange}
            savedAddresses={user.addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={handleSelectAddress}
          />

          <ShippingMethodSection
            method={shippingMethod}
            onChange={setShippingMethod}
            deliveryFee={matchedRate?.fee}
            selectedCountry={delivery.country}
            needsRegion={needsRegion}
            currency={currency}
            priceFormatter={priceFormatter}
            matchedLocation={
  matchedRate
    ? selectedArea
      ? `${selectedArea}, ${matchedRate.state}, ${matchedRate.countryName}`
      : matchedRate.state
        ? `${matchedRate.state}, ${matchedRate.countryName}`
        : matchedRate.countryName
    : undefined
}
            deliveryEstimate={deliveryEstimate}
            areaOptions={areaOptions}
            selectedArea={selectedArea}
            onAreaChange={setSelectedArea}
          />

          <PaymentSection />

          <button
            type="submit"
            disabled={
              isSubmitting ||
              (shippingMethod === "delivery" && !matchedRate)
            }
            className="btn-primary w-full disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="mx-auto size-5 animate-spin" />
            ) : (
              "Pay Now"
            )}
          </button>
        </div>

        <div className="min-w-0">
          <OrderSummary shippingFee={shippingFee} />
        </div>
      </div>
    </form>
  );
}