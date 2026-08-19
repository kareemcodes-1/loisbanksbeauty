"use client";

import Link from "next/link";

import type { HeroBanner } from "@/types";
import { SplitLines } from "@/components/animations/SplitLines";

interface HeroProps {
  heroBanner: HeroBanner | null;
}

export default function Hero({ heroBanner }: HeroProps) {
  if (!heroBanner) {
    return null;
  }

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {/* Background Video */}
      {heroBanner.mediaType === "video" && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={heroBanner.media}
          autoPlay
          muted
          loop
          playsInline
         preload="auto"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-black/30" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex w-full flex-col items-start gap-4 px-5 pb-10 pt-[7.5rem] text-left sm:gap-5 sm:px-8 sm:pb-14 md:px-12 md:pb-20">
        <SplitLines
          tag="h1"
          text={heroBanner.title}
          className="heading-hero w-full max-w-[min(500px,90vw)] text-white"
          duration={1}
          stagger={0.025}
          yPercent={100}
          ease="power4.out"
        />

        <SplitLines
          tag="p"
          text={heroBanner.description}
          className="paragraph max-w-[min(500px,90vw)] text-white/90"
          duration={1}
          stagger={0.025}
          yPercent={100}
          ease="power4.out"
        />

        <Link
          href={heroBanner.buttonLink || "/shop"}
          className="btn-primary w-full max-w-[12rem] sm:w-auto lg:w-[10rem]"
        >
          {heroBanner.buttonText || "Shop Now"}
        </Link>
      </div>
    </section>
  );
}