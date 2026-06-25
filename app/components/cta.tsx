'use client';

import React from "react";
import gsap from "gsap";
import { SplitText } from 'gsap/SplitText';
import Link from "next/link";
import { SplitLines } from "@/components/animations/SplitLines";

gsap.registerPlugin(SplitText);

const CTA = () => {
  return (
    <section className="relative w-full flex flex-col md:flex-row lg:h-screen overflow-hidden">

      {/* Video */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full overflow-hidden">
        <video
          src="/video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="true"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content */}
      <div
        className="
          bg-[#FD3F92] 
          px-[1.5rem] py-[4rem]
          md:p-14 md:pt-[7rem]
          text-white shadow-2xl
          w-full md:w-1/2
          flex flex-col justify-center h-full
        "
      >

        {/* Heading */}
        <SplitLines
          text="Your Best Hair Starts Here"
          tag="h1"
          className="
            text-[2rem] xs:text-[2.4rem] sm:text-[3rem] md:text-[5rem]
            leading-tight
            mb-5 sm:mb-6 md:mb-8
            overflow-hidden
            w-full md:w-[600px]
          "
          duration={1}
          stagger={0.1}
          ease="power3.out"
          yPercent={150}
          threshold={0.1}
          rootMargin="-100px"
        />

        {/* Description */}
        <SplitLines
          text="Luxury wigs and premium hair essentials crafted to elevate your confidence, beauty, and everyday style — because flawless hair should never be optional."
          tag="p"
          className="
            text-[0.75rem] xs:text-[0.8rem] sm:text-[0.9rem]
            text-white/80 uppercase
            mb-6 sm:mb-8 md:mb-12
            max-w-full sm:max-w-md
            leading-relaxed
            overflow-hidden
          "
          duration={1}
          stagger={0.1}
          ease="power3.out"
          yPercent={150}
          threshold={0.1}
          rootMargin="-100px"
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-[1rem]">

          <Link
            href="/shop"
            className="
              px-6 py-3 
              md:px-[3rem] md:py-[1rem]
              bg-[#C9A227]
              uppercase text-white
              text-xs md:text-[0.9rem]
              rounded-full transition
              text-center
              hover:bg-[#B8911F]
            "
          >
            Shop Luxury Hair
          </Link>

          <Link
            href="/contact"
            className="
              px-6 py-3 
              md:px-[3rem] md:py-[1rem]
              uppercase border border-white text-white
              text-xs md:text-[0.9rem]
              rounded-full transition
              text-center
              hover:bg-white hover:text-[#FD3F92]
            "
          >
            Talk to Our Stylist
          </Link>

        </div>
      </div>
    </section>
  );
};

export default CTA;