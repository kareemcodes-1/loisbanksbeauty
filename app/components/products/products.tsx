'use client';

import ProductCard from './product-card';
import { products } from '@/app/data';
import { useRef } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from "lucide-react";

import 'swiper/css';
import 'swiper/css/navigation';

const Products = () => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section className="products w-full py-16 sm:py-20 md:py-[5rem] md:px-[3rem]">
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="w-full flex flex-col items-center justify-center gap-3 text-center">

          {/* Subtext */}
          <span className="md:text-[1.4rem] text-[#caa11b]">
            Just In
          </span>

          {/* Heading */}
          <h2 className="md:text-[3.5rem] lg:text-[4rem] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[55%] leading-[1.1] text-center">
            New Arrivals
          </h2>

        </div>

        {/* Swiper Section */}
        <div className="relative w-full">

          {/* Left Button */}
          <button
            ref={prevRef}
            className="hidden md:flex absolute left-[-2rem] top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full border border-black/20 items-center justify-center cursor-pointer bg-white hover:bg-[#FD3F92] hover:text-white transition-colors duration-300 shadow-sm"
          >
            <ArrowLeft size={22} />
          </button>

          <button
            ref={nextRef}
            className="hidden md:flex absolute right-[-2rem] top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full border border-black/20 items-center justify-center cursor-pointer bg-white hover:bg-[#FD3F92] hover:text-white transition-colors duration-300 shadow-sm"
          >
            <ArrowRight size={22} />
          </button>

          <Swiper
            className="w-full"
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={3}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onBeforeInit={(swiper) => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !== "boolean"
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
          >
            {products.map((item, i) => (
              <SwiperSlide key={i} className="flex">
                <ProductCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>

        </div>

        {/* CTA Button */}
        <div className="w-full flex justify-center mt-10">
          <a
            href="/shop"
            className="bg-[#FD3F92] text-white uppercase px-[2rem] py-[1rem] rounded-full text-sm font-medium tracking-wide hover:bg-[#E63281] transition-colors duration-300"
          >
            See all products
          </a>
        </div>

      </div>
    </section>
  );
};

export default Products;