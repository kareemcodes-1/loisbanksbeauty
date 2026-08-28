// components/checkout/checkout-form.tsx
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useCartStore } from "@/store/cart";
import { useCurrencyStore } from "@/store/currency";
import { priceFormatter } from "@/lib/priceFormatter";
import { getShippingFee } from "@/lib/shipping";

import { Skeleton } from "@/components/ui/skeleton";

import ContactSection from "./contact-section";
import DeliverySection, {
  type DeliveryData,
  type SavedAddress,
} from "./delivery-section";
import ShippingMethodSection from "./shipping-method";
import PaymentSection from "./payment-section";
import OrderSummary from "./order-summary";

type UserData = {
  email: string;
  phone: string;
  name?: string;
  addresses: SavedAddress[];
};

type Props = {
  user: UserData;
};

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-select default address
  useEffect(() => {
    if (user.addresses.length === 0) {
      setSelectedAddressId("new");
      setDelivery((prev) => ({
        ...prev,
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
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

  // Pickup = 0 · Delivery = fee for selected country
  const shippingFee = getShippingFee(shippingMethod, delivery.country);

  // Fee shown on the delivery option (based on current country)
  const deliveryOptionFee = getShippingFee("delivery", delivery.country);

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
      !delivery.country ||
      !delivery.postalCode
    ) {
      toast.error("Please complete your delivery address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const subtotalBase = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Recalculate from shared helper (same as UI)
      const shippingFeeBase = getShippingFee(
        shippingMethod,
        delivery.country
      );
      const totalAmountBase = subtotalBase + shippingFeeBase;

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact,
          delivery,
          shippingMethod,
          shippingFee: shippingFeeBase,
          selectedAddressId,
          items,
          subtotal: subtotalBase,
          totalAmount: totalAmountBase,
          currency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to initialize payment");
        return;
      }

      window.location.href = data.authorization_url;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!_hasHydrated) {
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
      <div className="py-20 text-center">
        <p className="text-black/60">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-12">
        <div className="space-y-5 sm:space-y-6">
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
            shippingFee={deliveryOptionFee}
            currency={currency}
            priceFormatter={priceFormatter}
            countryCode={delivery.country}
          />

          <PaymentSection />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Pay now"}
          </button>
        </div>

        <div>
          <OrderSummary shippingFee={shippingFee} />
        </div>
      </div>
    </form>
  );
}