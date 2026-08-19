import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden px-5 pt-20 text-center sm:px-6 sm:pt-[5rem]">
      <p className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#FD3F92]">
        Oops
      </p>

      <h1 className="heading-1 mb-4">We can&apos;t find that page</h1>

      <p className="mx-auto mb-8 max-w-[22rem] text-[0.95rem] leading-relaxed text-black/50 sm:mb-10 sm:max-w-[28rem]">
        It may have been moved, renamed, or never existed. No worries — you can
        head home or keep shopping.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <Home size={16} strokeWidth={1.8} />
          Back to home
        </Link>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-[0.75rem] font-medium uppercase tracking-[0.1em] transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
        >
          <Search size={16} strokeWidth={1.8} />
          Browse shop
        </Link>
      </div>
    </div>
  );
}