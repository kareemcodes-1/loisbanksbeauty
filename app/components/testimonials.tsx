"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Star } from "lucide-react";
import Badge from "@/components/badge";
import BlurText from "@/components/animations/blur-text";

const testimonials = [
  {
    name: "James Carter",
    role: "CEO at TechFlow Solutions",
    quote:
      "Working with Kareem was seamless. He delivered a website that didn't just look great — it actually brought in new clients within the first week of launch.",
    image:
      "https://framerusercontent.com/images/Ja6vnrdyxR6DoP2iS9CRMnsQXSo.jpg",
  },
  {
    name: "Sophia Martinez",
    role: "Operations Manager at NexaCorp",
    quote:
      "We had no online presence before. Now our website runs 24/7 generating leads while we focus on the work. Best investment we've made for our business.",
    image:
      "https://framerusercontent.com/images/prJVkx4ybEf6YSyZs9EZDABPto.jpg",
  },
  {
    name: "David Reynolds",
    role: "Head of Sales at GrowthPeak",
    quote:
      "The attention to detail was incredible. Every section was built with purpose. Our bounce rate dropped and our conversion rate doubled in 30 days.",
    image:
      "https://framerusercontent.com/images/HDIEzwzzph6mZtBFYG3fS721U.jpg",
  },
  {
    name: "Emily Wong",
    role: "Customer Success Lead at SupportHive",
    quote:
      "I finally have a website I'm proud to send people to. It looks premium, loads instantly, and actually represents our brand the way it deserves.",
    image:
      "https://framerusercontent.com/images/90CasD9H2md40g35aUqp4n8xyE.png",
  },
];

function Stars() {
  return (
    <div className="mb-4 sm:mb-6 flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
      ))}
    </div>
  );
}

function TestimonialCard({
  name,
  role,
  quote,
  image,
}: (typeof testimonials)[0]) {
  return (
    <div
      className="
        relative mx-2 sm:mx-3
        flex h-full min-h-[240px] sm:min-h-[290px]
        w-[280px] sm:w-[340px] md:w-[380px]
        flex-col justify-between overflow-hidden
        rounded-2xl sm:rounded-3xl
        border border-white/10
        p-5 sm:p-8
        transition-all duration-300
        hover:border-orange-400/30
      "
      style={{
        background:
          "radial-gradient(circle at bottom right, rgba(249,115,22,0.18), #0d0d0d 60%)",
      }}
    >
      {/* Glow Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.02))]" />

      {/* Content */}
      <div className="relative z-10">
        <Stars />

        <p className="text-[0.85rem] sm:text-[1rem] leading-[1.7] sm:leading-[1.9] text-gray-400">
          "{quote}"
        </p>
      </div>

      {/* User */}
      <div className="relative z-10 mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4">
        <Image
          src={image}
          alt={name}
          width={40}
          height={40}
          className="sm:w-[44px] sm:h-[44px] rounded-full border border-orange-400/20 object-cover"
        />

        <div>
          <p className="text-[0.85rem] sm:text-[0.95rem] font-medium text-white">
            {name}
          </p>
          <p className="text-[0.75rem] sm:text-[0.85rem] text-white/40">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="section-spacing overflow-hidden px-4 sm:px-6 lg:px-0">
      <div className="flex w-full flex-col items-center">
        <Badge text="Testimonials" />

        {/* Header */}
        <div className="mb-12 md:mb-16 flex flex-col items-center gap-4 text-center">
          <div className="flex flex-col items-center text-center">
            <BlurText
              text="My clients love"
              delay={50}
              animateBy="words"
              direction="bottom"
              className="text-white overflow-hidden"
            />
            <BlurText
              text="working with me"
              delay={50}
              animateBy="words"
              direction="bottom"
              stepDuration={0.4}
              className="text-white/70 overflow-hidden"
            />
          </div>

          <p className="max-w-[500px] text-center text-[1rem] md:text-[1.2rem] text-gray-400">
            Don't take our word for it — here's what they said after we worked together.
          </p>
        </div>

        {/* Marquee Section */}
        <div className="relative w-full sm:w-[90%] md:w-[80%]">
          {/* Left Blur */}
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-20 sm:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent" />

          {/* Right Blur */}
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-20 sm:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent" />

          <Marquee
            speed={40}
            pauseOnHover
            gradient={false}
            autoFill
            className="overflow-visible py-2"
          >
            {testimonials.map((item, index) => (
              <TestimonialCard key={index} {...item} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}