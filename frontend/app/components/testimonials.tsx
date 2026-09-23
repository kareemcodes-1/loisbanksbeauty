"use client";

import FadeContent from "@/components/animations/fade-content";
import { SplitLines } from "@/components/animations/SplitLines";
import Marquee from "react-fast-marquee";

const testimonials = [
  {
    name: "Adaeze O.",
    review:
      "I was a bit unsure about ordering online, but the whole process was straightforward. My order arrived well packaged and the hair looked just like the pictures.",
  },
  {
    name: "Chioma E.",
    review:
      "The lace melting spray has actually made my installs much easier. It holds the lace down nicely without me having to use too much product.",
  },
  {
    name: "Blessing A.",
    review:
      "I ordered the hair wax stick because I needed something for flyaways. It does exactly what I wanted and doesn't leave my hair looking overly greasy.",
  },
  {
    name: "Hauwa B.",
    review:
      "My order got to me in a few days and everything was neatly packaged. I also liked that I could easily find the products I was looking for on the site.",
  },
  {
    name: "Tola A.",
    review:
      "The frontal glue remover was really useful when I needed to take my install off. It made the process much easier than trying to pull everything off normally.",
  },
  {
    name: "Ngozi N.",
    review:
      "I had a question before ordering and customer service actually got back to me. My order arrived as expected and the whole experience was pretty smooth.",
  },
];

function TestimonialCard({
  t,
}: {
  t: (typeof testimonials)[number];
}) {
  return (
    <div className="flex min-h-[14rem] w-full flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:min-h-[16rem] sm:gap-4 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, s) => (
            <span key={s} className="text-base text-[#FD3F92] sm:text-lg">
              ★
            </span>
          ))}
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-700 sm:text-[0.7rem]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Verified Purchase
        </span>
      </div>

      <p className="flex-1 text-[0.875rem] leading-6 text-black/70 sm:text-sm sm:leading-7">
        {t.review}
      </p>

      <div className="flex flex-col gap-1 border-t border-dashed border-[#FD3F92]/40 pt-3 sm:pt-4">
        <p className="text-sm font-semibold text-black">{t.name}</p>
      </div>
    </div>
  );
}

const Testimonials = () => {
  const mobileTestimonials = testimonials.slice(0, 3);

  return (
    <section className="section-spacing w-full overflow-hidden bg-white">
      <div className="flex flex-col gap-8 sm:gap-10 lg:gap-14">
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

        {/* Mobile: grid (3 cards) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:hidden">
          {mobileTestimonials.map((t, i) => (
            <FadeContent blur={true} key={i} duration={1000} initialOpacity={0}>
              <TestimonialCard t={t} />
            </FadeContent>
          ))}
        </div>

        {/* Desktop: marquee */}
        <div className="relative hidden w-full md:block">
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
               <FadeContent blur={true} key={i} duration={1000} initialOpacity={0}>
              <div
                className="mx-2 w-[min(18rem,85vw)] sm:mx-3 sm:w-[20rem] md:w-[22.5rem] lg:w-[25rem]"
              >
                <TestimonialCard t={t} />
              </div>
              </FadeContent>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;