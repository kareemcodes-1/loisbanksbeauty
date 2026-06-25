'use client';

import React from 'react';
import { SplitLines } from '@/components/animations/SplitLines';
import Link from 'next/link';

const About = () => {
  return (
    <section className="relative w-full flex flex-col lg:flex-row lg:h-screen overflow-hidden">

      {/* LEFT — Pink Content */}
      <div className="bg-[#FD3F92] w-full lg:w-1/2 px-[1.5rem] lg:px-[3rem] py-[5rem] flex items-center">

        <div className="w-full flex flex-col gap-6 lg:gap-8">

          {/* Heading */}
          <SplitLines
            text="A Brand With One Mission. Flawless Hair."
            tag="h2"
            className="text-[2rem] lg:text-[3.5rem] text-white leading-[1.15]"
            duration={1}
            stagger={0.1}
            ease="power3.out"
            yPercent={150}
            threshold={0.1}
            rootMargin="-100px"
          />

          {/* Description */}
          <p className="text-white/80 text-[0.95rem] lg:text-[1rem] leading-[1.7] max-w-[480px]">
            We are a growing hair extension brand offering premium-quality products designed for natural looks, durability, and everyday confidence — because every woman deserves her best hair day.
          </p>

          {/* Stats */}
          <div className="flex gap-12">
            <div>
              <p className="text-white text-[2rem] font-semibold">100%</p>
              <p className="text-white/70 text-sm">Virgin Human Hair</p>
            </div>
            <div>
              <p className="text-white text-[2rem] font-semibold">100+</p>
              <p className="text-white/70 text-sm">Happy Customers</p>
            </div>
            <div>
              <p className="text-white text-[2rem] font-semibold">20+</p>
              <p className="text-white/70 text-sm">Premium Products</p>
            </div>
          </div>

          <Link
            href="/about"
            className="w-fit border border-white text-white px-[3rem] py-[1.1rem] inline-block rounded-full text-sm font-medium tracking-wide uppercase hover:bg-white hover:text-pink-500 transition"
          >
            Learn More
          </Link>

        </div>
      </div>

      {/* RIGHT — Image */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full overflow-hidden">
        <img
          src="/about.jpg"
          alt="About our brand"
          className="w-full h-full object-cover object-center"
        />
      </div>

    </section>
  );
};

export default About;