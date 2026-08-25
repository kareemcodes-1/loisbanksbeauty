"use client";

import FadeContent from "@/components/animations/fade-content";
import { SplitLines } from "@/components/animations/SplitLines";
import Marquee from "react-fast-marquee";

const testimonials = [
  {
    name: "Adaeze O.",
    review:
      "I ordered the camilla curls for my cousin’s wedding and they mixed with my own hair better than I expected. Washed them twice already and they still feel soft.",
  },
  {
    name: "Chioma E.",
    review:
      "Took about 4 days to get to Port Harcourt. The texture is close to what I saw on the site — not stiff. I’ve been using a light leave-in and it’s holding up.",
  },
  {
    name: "Blessing A.",
    review:
      "Second time ordering. First pack lasted me a few months with regular wear. Packaging was neat and the length was true to the description.",
  },
  {
    name: "Hauwa B.",
    review:
      "I was worried about shedding but it’s been minimal so far. Install was straightforward and the colour matched my dye job pretty well.",
  },
  {
    name: "Tola A.",
    review:
      "Bought these for everyday use, not just events. They don’t tangle as much as a cheaper set I had before. Will stick with this brand for now.",
  },
  {
    name: "Ngozi N.",
    review:
      "Customer service replied when I asked about maintenance, which helped. Hair looks good in a ponytail and when I straighten it lightly.",
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