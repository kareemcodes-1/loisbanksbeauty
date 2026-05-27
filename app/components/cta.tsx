import AnimatedBorder from "@/components/animated-border";
import Link from "next/link";
import React from "react";
import BlurText from "@/components/animations/blur-text";

const CTA = () => {
  return (
    <section className="w-full section-spacing flex items-center justify-center lg:px-0">
      {/* Card */}
      <AnimatedBorder
        className="max-w-7xl w-full"
        innerClassName="shadow-[0_0_120px_rgba(246,58,34,0.08)]"
      >
        <div
          className="
            relative w-full
            rounded-2xl sm:rounded-3xl
            overflow-hidden
            border border-[#1f1f1f]
            px-4 md:px-8
            py-16 sm:py-20 md:py-24
            flex flex-col items-center justify-center text-center
          "
          style={{
            background:
              "radial-gradient(circle at bottom right, rgba(249,115,22,0.18), #0d0d0d 60%)",
          }}
        >
          {/* Subtle inner glow overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 55% 70% at 0% 50%, rgba(249,115,22,0.13) 0%, transparent 70%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-5 sm:gap-6">
            {/* Heading */}
            <div className="flex flex-col items-center text-center">
              <BlurText
                text="Let's build something"
                delay={50}
                animateBy="words"
                direction="bottom"
                className="text-white overflow-hidden text-center"
              />
              <BlurText
                text=" for your business"
                delay={50}
                animateBy="words"
                direction="bottom"
                stepDuration={0.4}
                className="text-white/70 overflow-hidden"
              />
            </div>

            {/* Subtitle */}
            <p className="text-[1rem] md:text-[1.2rem] text-gray-400 max-w-[480px] leading-[1.7] text-center">
              Reach out on WhatsApp or send me a message, let's figure out what your business needs.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-[2rem] w-full sm:w-auto">
              <Link
                href="https://wa.link/11epdm"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto"
              >
                Chat on WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </AnimatedBorder>
    </section>
  );
};

export default CTA;