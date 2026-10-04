"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { useCartStore } from "@/store/cart";
import { useCurrencyStore } from "@/store/currency";
import { priceFormatter } from "@/lib/priceFormatter";
import { Loader2 } from "lucide-react";

type Props = {
  orderId: string;
  totalAmount: number;
  paymentStatus: "pending" | "paid";
  customerNotifiedAt: string | null;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
};

export default function PaymentInstructions({
  orderId,
  totalAmount,
  paymentStatus,
  customerNotifiedAt,
  bankDetails,
}: Props) {
  const currency = useCurrencyStore((state) => state.currency);
  const clearCart = useCartStore((state) => state.clearCart);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasNotified, setHasNotified] = useState(Boolean(customerNotifiedAt));

  const handleCopy = async (text: string, label: string) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handlePaymentNotification = async () => {
    if (isSubmitting || hasNotified) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/orders/${orderId}/payment-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to notify us about your payment.");
        return;
      }

      setHasNotified(true);
      clearCart();
      toast.success("Payment notification sent.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedAmount = priceFormatter(totalAmount, currency);

  // ── Paid state ──────────────────────────────────────────────
  if (paymentStatus === "paid") {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-600"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold">Payment confirmed</h1>

          <p className="mt-3 text-sm leading-relaxed text-black/60">
            Your payment has been verified and your order is now confirmed.
          </p>

          <div className="mt-6 w-full rounded-xl bg-neutral-50 p-5 text-left">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-black/50">Order reference</span>
              <span className="max-w-[220px] truncate text-sm font-medium">
                {orderId}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-sm text-black/50">Amount</span>
              <span className="text-sm font-semibold">{formattedAmount}</span>
            </div>
          </div>

          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
            <Link
              href="/orders"
              className="btn-primary flex w-full items-center justify-center"
            >
              View my orders
            </Link>
            <Link
              href="/shop"
              className="flex w-full items-center justify-center rounded-xl border border-black/10 px-5 py-3 text-sm font-medium transition hover:bg-black/[0.03]"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Notified state ──────────────────────────────────────────
if (hasNotified) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-orange-500"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold">Payment pending</h1>

        <p className="mt-3 text-sm leading-relaxed text-black/60">
          We’ve received your payment notification. Your order is now pending
          while we verify the transfer.
        </p>

        <div className="mt-6 w-full rounded-xl bg-neutral-50 p-5 text-left">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black/50">Order reference</span>
            <span className="max-w-[220px] truncate text-sm font-medium">
              {orderId}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-sm text-black/50">Amount</span>
            <span className="text-sm font-semibold">{formattedAmount}</span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-sm text-black/50">Status</span>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
              Pending
            </span>
          </div>
        </div>

        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href="/orders"
            className="btn-primary flex w-full items-center justify-center"
          >
            View my orders
          </Link>
          <Link
            href="/shop"
            className="flex w-full items-center justify-center rounded-xl border border-black/10 px-5 py-3 text-sm font-medium transition hover:bg-black/[0.03]"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

  // ── Main pending state ──────────────────────────────────────
  return (
   <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
  {/* Icon + Heading */}
  <div className="text-center">
    {/* Bouncing dots icon */}
    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FD3F92]/10">
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#FD3F92] [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#FD3F92] [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#FD3F92]" />
      </div>
    </div>

    <h1 className="text-2xl font-semibold">Complete your payment</h1>

    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-black/60">
      Please do not refresh or leave this page. Transfer the exact amount
      below. Payment confirmation takes up to 24 hours.
    </p>
  </div>

  {/* Amount only (with copy) */}
  <div className="mt-8 rounded-2xl bg-neutral-50 p-5 sm:p-6">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-black/40">
          Amount to transfer
        </p>
        <p className="mt-1 text-2xl font-semibold">{formattedAmount}</p>
      </div>

      <button
        type="button"
        onClick={() => handleCopy(String(totalAmount), "Amount")}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 transition hover:bg-black/[0.03]"
        aria-label="Copy amount"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="text-black/60"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
    </div>
  </div>

  {/* Bank details with copy buttons */}
  <div className="mt-5 rounded-2xl border border-black/10 p-5 sm:p-6">
    <h2 className="text-base font-semibold">Bank transfer details</h2>

    <div className="mt-5 space-y-5">
      {/* Bank name */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-black/40">Bank name</p>
          <p className="mt-1 text-sm font-medium">
            {bankDetails.bankName || "Bank details not configured"}
          </p>
        </div>
        {bankDetails.bankName && (
          <button
            type="button"
            onClick={() => handleCopy(bankDetails.bankName, "Bank name")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 transition hover:bg-black/[0.03]"
            aria-label="Copy bank name"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              className="text-black/60"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        )}
      </div>

      {/* Account name */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-black/40">Account name</p>
          <p className="mt-1 text-sm font-medium">
            {bankDetails.accountName || "Bank details not configured"}
          </p>
        </div>
        {bankDetails.accountName && (
          <button
            type="button"
            onClick={() =>
              handleCopy(bankDetails.accountName, "Account name")
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 transition hover:bg-black/[0.03]"
            aria-label="Copy account name"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              className="text-black/60"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        )}
      </div>

      {/* Account number */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-black/40">Account number</p>
          <p className="mt-1 text-sm font-medium">
            {bankDetails.accountNumber || "Bank details not configured"}
          </p>
        </div>
        {bankDetails.accountNumber && (
          <button
            type="button"
            onClick={() =>
              handleCopy(bankDetails.accountNumber, "Account number")
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 transition hover:bg-black/[0.03]"
            aria-label="Copy account number"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              className="text-black/60"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        )}
      </div>
    </div>
  </div>

  {/* Exact amount reminder */}
  <div className="mt-5 rounded-xl border border-[#FD3F92]/20 bg-[#FD3F92]/5 p-4">
    <p className="text-sm leading-relaxed text-black/70">
      Please transfer exactly{" "}
      <span className="font-semibold">{formattedAmount}</span>.
    </p>
  </div>

  <button
    type="button"
    onClick={handlePaymentNotification}
    disabled={isSubmitting}
    className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
  >
    {isSubmitting ? <Loader2 /> : "I've Sent the Money"}
  </button>

  <p className="mt-4 text-center text-xs leading-relaxed text-black/40">
    Your order will remain pending until we verify the payment in our bank
    account.
  </p>
</div>
  );
}