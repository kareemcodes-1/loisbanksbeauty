"use client";

import FadeContent from "@/components/animations/fade-content";
import { SplitLines } from "@/components/animations/SplitLines";
import Marquee from "react-fast-marquee";

const testimonials = [
  {
    name: "Amara O.",
    date: "2 days ago",
    review:
      "Absolutely obsessed with my extensions. They blend so naturally — nobody can even tell they're not my real hair!",
  },
  {
    name: "Temi A.",
    date: "1 week ago",
    review:
      "The quality is unmatched. I've tried so many brands and this is the only one that actually lasts. Will be ordering again.",
  },
  {
    name: "Chloe B.",
    date: "3 days ago",
    review:
      "Fast delivery, gorgeous packaging, and the hair itself is just chef's kiss. So soft and easy to style.",
  },
  {
    name: "Fatima K.",
    date: "5 days ago",
    review:
      "I was skeptical at first but wow. These extensions made me feel like a whole new person. 10/10 recommend.",
  },
];

const Testimonials = () => {
  return (
    <section className="section-spacing w-full overflow-hidden bg-white">
      <div className="flex flex-col gap-8 sm:gap-10 lg:gap-14">
        {/* Heading */}
        <div className="flex flex-col items-center gap-3 px-1 text-center sm:gap-4">
           <FadeContent blur={true} duration={0.5} initialOpacity={0}>
              <span className="subtitle">Testimonials</span>
          </FadeContent>

          <SplitLines
            tag="h2"
            text="Trusted by Women Who Choose Luxury"
            className="heading-1 mx-auto max-w-[min(36rem,100%)] text-balance text-black"
            duration={1}
            stagger={0.025}
            yPercent={100}
            rootMargin="-100px"
            ease="power4.out"
          />
        </div>

        {/* Marquee */}
        <div className="relative w-full">
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-8 bg-gradient-to-r from-white to-transparent sm:w-16 lg:w-32" />
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-8 bg-gradient-to-l from-white to-transparent sm:w-16 lg:w-32" />

          <Marquee
            speed={30}
            pauseOnHover
            gradient={false}
            autoFill
            className="py-2"
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="mx-2 flex min-h-[14rem] w-[min(18rem,85vw)] flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:mx-3 sm:min-h-[16rem] sm:w-[20rem] sm:gap-4 sm:p-6 md:w-[22.5rem] lg:min-h-[260px] lg:w-[25rem]"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className="text-base text-[#FD3F92] sm:text-lg">
                      ★
                    </span>
                  ))}
                </div>

                <p className="flex-1 text-[0.875rem] leading-6 text-black/70 sm:text-sm sm:leading-7">
                  {t.review}
                </p>

                <div className="flex flex-col gap-1 border-t border-dashed border-[#FD3F92]/40 pt-3 sm:pt-4">
                  <p className="text-sm font-semibold text-black">{t.name}</p>
                  <p className="text-xs text-black/40">{t.date}</p>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;