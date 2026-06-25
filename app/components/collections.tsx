'use client';

import Image from 'next/image';
import Link from 'next/link';
import { collections } from '../data';

const Collections = () => {
  return (
    <section className="w-full py-[5rem] px-[3rem] bg-white">
      <div className="flex flex-col gap-10 sm:gap-14 md:gap-[3rem]">

        {/* Subtext + Heading */}
        <div className="flex flex-col gap-3 items-center text-center">

  {/* Subtext */}
  <span className="md:text-[1.4rem] text-[#caa11b]">
    Luxury Collections
  </span>

  {/* Main Heading */}
  <h2 className="text-[2rem] md:text-[4rem] leading-[1.1]">
    Shop Collections
  </h2>

</div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-[1rem]">

          {collections.map((item, idx) => (
            <div
              key={idx}
              className="relative w-full rounded-[0.5rem] overflow-hidden h-[20rem] md:h-[30rem]"
            >

              {/* Image */}
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 w-full h-[45%] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Text + Button */}
              <div className="absolute bottom-4 sm:bottom-6 px-[1.5rem] z-[100]">
                <div className="flex flex-col w-full gap-3">

                  <h3 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] text-white leading-tight">
                    {item.name}
                  </h3>

                   <Link
                href="/shop"
                className="self-start bg-[#FD3F92] text-white uppercase px-[2rem] py-[1rem] inline-block rounded-full text-sm font-medium tracking-wide hover:bg-[#E63281] hover:text-white transition transition-colors duration-300 w-auto"
              >
                Shop Now
              </Link>

                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Collections;