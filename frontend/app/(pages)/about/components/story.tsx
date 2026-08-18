"use client";

import FadeContent from "@/components/animations/fade-content";
import { SplitLines } from "@/components/animations/SplitLines";
import CountUp from "@/components/animations/count-up";
import Image from "next/image";

export default function FounderStory() {
  return (
    <section className="w-full bg-black/90 section-spacing">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Image */}
          <div
            className="
              relative
              w-full
              overflow-hidden
              rounded-[1.5rem]
              h-[24rem]
              sm:h-[25rem]
              md:h-[30rem]
              lg:h-[35rem]
            "
          >
            <Image
              src="/about.jpg"
              alt="Founder of LoisBanks Beauty"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="flex flex-col gap-6">
            <FadeContent blur={true} duration={0.5} initialOpacity={0}>
              <span className="subtitle">Our Story</span>
            </FadeContent>

            <SplitLines
              tag="h2"
              text="Empowering Beauty Through Quality"
              className="heading-1 max-w-[38rem] text-white"
              duration={1}
              stagger={0.025}
              yPercent={100}
              rootMargin="-100px"
              ease="power4.out"
            />

            <SplitLines
              tag="p"
              text="LoisBanks Beauty is a luxury destination for premium hair and beauty, created with a passion for helping women feel confident, elegant, and effortlessly beautiful. Built on quality, style, and trust, the brand offers timeless hair collections designed to elevate everyday beauty."
              className="paragraph max-w-[36rem] text-white/75"
              duration={1}
              stagger={0.025}
              yPercent={100}
              rootMargin="-100px"
              ease="power4.out"
            />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2 sm:gap-5 lg:max-w-[34rem]">
              {[
                {
                  value: 8,
                  suffix: "+",
                  label: "Years of Experience",
                },
                {
                  value: 100,
                  suffix: "+",
                  label: "Satisfied Clients",
                },
                {
                  value: 20,
                  suffix: "+",
                  label: "Luxury Products",
                },
                {
                  value: 100,
                  suffix: "%",
                  label: "Premium Quality",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                    sm:p-5
                  "
                >
                  <h3 className="text-[1.75rem] text-white sm:text-[2.25rem] lg:text-[2.5rem]">
                    <CountUp
                      from={0}
                      to={item.value}
                      duration={0.5}
                      separator=","
                    />
                    {item.suffix}
                  </h3>

                  <p className="mt-1 text-sm text-white/60">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}