"use client";

import Image from "next/image";

export default function PaymentSection() {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <h2 className="mb-5 text-[1.1rem] font-medium sm:mb-6 sm:text-[1.2rem]">
        Payment
      </h2>

      <div className="space-y-4">
        {/* Paystack notice */}
        <div className="flex items-start gap-3 rounded-xl border border-black/10 bg-neutral-50 p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0BA4DB]/10">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                fill="#0BA4DB"
              />
              <path
                d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                fill="#0BA4DB"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium">Pay with Paystack</p>
            <p className="mt-0.5 text-xs leading-relaxed text-black/50">
              You’ll be redirected to Paystack to complete your payment
              securely. We never store your card details.
            </p>
          </div>
        </div>

        {/* Accepted methods */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-black/40">
            We accept
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Visa */}
            <div
  className="relative flex h-10 w-[3.25rem] items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-white px-2"
  title="Visa"
>
  <Image
    src="/Visa-Logo.png"
    alt="Visa"
    fill
    quality={75}
    className="object-contain p-1.5"
    sizes="52px"
  />
</div>

            {/* Mastercard */}
            <div
              className="flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3"
              title="Mastercard"
            >
              <svg viewBox="0 0 48 32" className="h-5 w-8" aria-label="Mastercard">
                <rect width="48" height="32" rx="4" fill="#fff" />
                <circle cx="19" cy="16" r="8" fill="#EB001B" />
                <circle cx="29" cy="16" r="8" fill="#F79E1B" />
                <path
                  d="M24 10.5c1.6 1.3 2.6 3.3 2.6 5.5S25.6 20.2 24 21.5c-1.6-1.3-2.6-3.3-2.6-5.5s1-4.2 2.6-5.5z"
                  fill="#FF5F00"
                />
              </svg>
            </div>

            {/* Verve */}
           <div
  className="relative flex h-10 w-[3.25rem] items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-white px-2"
  title="Visa"
>
  <Image
    src="/Verve-Logo.png"
    alt="Visa"
    fill
    quality={75}
    className="object-contain p-1.5"
    sizes="52px"
  />
</div>

            {/* Bank transfer */}
            <div
              className="flex h-10 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3"
              title="Bank transfer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="text-black/60"
                aria-hidden
              >
                <path d="M3 10h18M5 10V19h14V10M12 3l9 7H3l9-7z" />
              </svg>
              <span className="text-[11px] font-medium text-black/70">
                Bank
              </span>
            </div>

            {/* USSD */}
            <div
              className="flex h-10 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3"
              title="USSD"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="text-black/60"
                aria-hidden
              >
                <rect x="6" y="3" width="12" height="18" rx="2" />
                <path d="M10 17h4" />
              </svg>
              <span className="text-[11px] font-medium text-black/70">
                USSD
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-black/45">
            Cards, bank transfer, USSD, and other methods supported by Paystack.
          </p>
        </div>
      </div>
    </section>
  );
}