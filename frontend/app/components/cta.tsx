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
  <section className="relative flex w-full flex-col overflow-hidden lg:min-h-[100svh] lg:flex-row">
    {/* Image */}
    <div className="relative h-[45svh] min-h-[260px] w-full shrink-0 overflow-hidden sm:h-[50svh] sm:max-h-[520px] lg:h-auto lg:max-h-none lg:min-h-full lg:w-1/2">
      <Image
        src="/cta.jpg"
        alt="LoisBanks Beauty"
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover object-center"
        priority={false}
      />
    </div>

    {/* Content */}
    <div className="flex w-full flex-col justify-center gap-5 bg-[#FD3F92] px-5 py-12 text-white shadow-2xl sm:gap-6 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:w-1/2 lg:px-14 lg:pb-16 lg:pt-[7rem]">
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
        className="flex w-full max-w-[min(30rem,100%)] flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="min-w-0 w-full flex-1 rounded-full border border-white/30 bg-white/10 px-5 py-3.5 text-base text-white transition placeholder:text-white/60 focus:border-white focus:outline-none sm:px-6 sm:text-[0.9rem]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full shrink-0 whitespace-nowrap rounded-full bg-white px-6 py-3.5 text-center font-geist text-[0.75rem] font-medium uppercase text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8 sm:text-[0.8rem]"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  </section>
);
};

export default CTA;