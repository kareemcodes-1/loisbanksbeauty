import Image from "next/image";
import BlurText from "@/components/animations/blur-text";
import { SplitLines } from "@/components/animations/SplitLines";

export default function AboutHero() {
  return (
    <section className="relative flex min-h-[85svh] w-full items-center justify-center overflow-hidden sm:min-h-[85svh] lg:min-h-[100svh]">
      <Image
        src="https://res.cloudinary.com/datpkisht/image/upload/v1785710850/g5yrwfeq0aeb7cfti39u.jpg"
        alt="LoisBanks Beauty — About us"
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 z-10 bg-black/40" />

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-3 px-5 text-center sm:gap-4 sm:px-8 md:px-12 lg:px-16">
        <BlurText
          text="About Us"
          delay={100}
          animateBy="words"
          direction="bottom"
          className="subtitle"
        />

        <SplitLines
          text="Where Beauty Meets Purpose"
          tag="h1"
          className="heading-hero max-w-[min(48rem,100%)] text-white"
          duration={1}
          stagger={0.025}
          ease="power3.out"
          yPercent={150}
          threshold={0.1}
          rootMargin="-100px"
        />
      </div>
    </section>
  );
}