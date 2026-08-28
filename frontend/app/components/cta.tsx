"use client";

import React, { useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import toast from "react-hot-toast";
import { SplitLines } from "@/components/animations/SplitLines";

gsap.registerPlugin(SplitText);

const CTA = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(data.message || "You're on the list! Watch your inbox.");
      setEmail("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex w-full flex-col overflow-hidden lg:h-[100svh] lg:flex-row">
      {/* Image */}
      <div className="h-[40vh] w-full overflow-hidden sm:h-[45vh] lg:h-full lg:w-1/2">
        <Image
          src="/cta.jpg"
          alt="LoisBanks Beauty"
          width={1000}
          height={1000}
          className="h-full w-full object-cover object-center"
          priority={false}
        />
      </div>

      {/* Content */}
      <div className="flex h-full w-full flex-col justify-center gap-5 bg-[#FD3F92] px-5 py-12 text-white shadow-2xl sm:gap-6 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:w-1/2 lg:px-14 lg:pt-[7rem]">
        <div className="w-full max-w-[min(37.5rem,100%)]">
          <SplitLines
            text="Be First To Know"
            tag="h1"
            className="heading-1"
            duration={1}
            stagger={0.025}
            ease="power4.out"
            yPercent={100}
            threshold={0.1}
            rootMargin="-100px"
          />

          <SplitLines
            text="New Drops & Offers"
            tag="h1"
            className="heading-1"
            duration={1}
            stagger={0.025}
            ease="power4.out"
            yPercent={100}
            threshold={0.1}
            rootMargin="-100px"
          />
        </div>

        <SplitLines
          text="Subscribe for early access to new arrivals, restocks, and subscribers-only discounts."
          tag="p"
          className="max-w-[min(28rem,100%)] overflow-hidden text-[0.9rem] leading-relaxed text-white/80 sm:text-[1rem]"
          duration={1}
          stagger={0.025}
          ease="power3.out"
          yPercent={100}
          threshold={0.1}
          rootMargin="-100px"
        />

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[min(28rem,100%)] flex-col gap-3 sm:flex-row sm:gap-3 md:gap-4"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-full border border-white/30 bg-white/10 px-5 py-3 text-[0.85rem] text-white transition placeholder:text-white/60 focus:border-white focus:outline-none sm:px-6 md:px-8 md:py-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-full bg-white px-6 py-3 text-center font-geist text-[0.75rem] font-medium uppercase text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-8 sm:text-[0.8rem] md:px-12 md:py-4"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CTA;