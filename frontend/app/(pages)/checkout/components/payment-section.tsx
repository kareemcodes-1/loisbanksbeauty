"use client";

export default function PaymentSection() {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <h2 className="mb-5 text-[1.1rem] font-medium sm:mb-6 sm:text-[1.2rem]">Payment</h2>

      <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-neutral-50 p-3.5 sm:p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0BA4DB]/10">
          {/* Simple Paystack-style icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
          <p className="text-sm font-medium">Paystack</p>
          <p className="text-xs text-black/50">
            You will be redirected to Paystack to complete payment securely.
          </p>
        </div>
      </div>
    </section>
  );
}