'use client';

import Marquee from "react-fast-marquee";

const testimonials = [
  {
    name: 'Amara O.',
    date: '2 days ago',
    review:
      "Absolutely obsessed with my extensions. They blend so naturally — nobody can even tell they're not my real hair!",
  },
  {
    name: 'Temi A.',
    date: '1 week ago',
    review:
      "The quality is unmatched. I've tried so many brands and this is the only one that actually lasts. Will be ordering again.",
  },
  {
    name: 'Chloe B.',
    date: '3 days ago',
    review:
      "Fast delivery, gorgeous packaging, and the hair itself is just chef's kiss. So soft and easy to style.",
  },
  {
    name: 'Fatima K.',
    date: '5 days ago',
    review:
      "I was skeptical at first but wow. These extensions made me feel like a whole new person. 10/10 recommend.",
  },
];

const Testimonials = () => {
  return (
    <section className="w-full bg-white px-4 py-24 flex flex-col gap-14 overflow-hidden">

      <div className="flex flex-col items-center gap-3 text-center">
        <span className="md:text-[1.4rem] text-[#caa11b]">
          Testimonials
        </span>

        <h2 className="md:text-[3.5rem] lg:text-[4rem] text-[#0d0d0d] px-[3rem] text-center mx-auto leading-[1.1]">
          Trusted by Women Who Choose Luxury
        </h2>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative w-full">

        {/* Left Fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-16 sm:w-24 md:w-32 bg-gradient-to-r from-white to-transparent" />

        {/* Right Fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-16 sm:w-24 md:w-32 bg-gradient-to-l from-white to-transparent" />

        <Marquee
          speed={35}
          pauseOnHover
          gradient={false}
          autoFill
          className="py-2"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 flex flex-col gap-4 mx-3 min-h-[270px] w-[400px] sm:w-[340px] border border-black/5 shadow-sm transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className="text-[#FD3F92] text-lg">
                    ★
                  </span>
                ))}
              </div>

              {/* Review */}
              <p className="text-[#0d0d0d]/70 text-sm leading-[1.7] flex-1">
                {t.review}
              </p>

              {/* Footer */}
              <div className="border-t border-[#FD3F92]/20 pt-4 flex flex-col gap-1">
                <p className="text-[#0d0d0d] font-semibold text-sm">
                  {t.name}
                </p>
                <p className="text-[#0d0d0d]/40 text-xs">
                  {t.date}
                </p>
              </div>
            </div>
          ))}
        </Marquee>

      </div>
    </section>
  );
};

export default Testimonials;