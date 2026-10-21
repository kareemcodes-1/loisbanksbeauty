"use client";

export default function PaymentSection() {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <h2 className="mb-5 text-[1.1rem] font-medium sm:mb-6 sm:text-[1.2rem]">
        Payment
      </h2>

      <div className="rounded-xl border border-black/10 bg-neutral-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FD3F92]/10">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              className="text-[#FD3F92]"
              aria-hidden
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-medium">Secure checkout</p>

            <p className="mt-1 text-xs leading-relaxed text-black/50">
              You&apos;ll be redirected to our secure payment page to complete
              your order. Pay with card, bank transfer, or other available
              methods
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}