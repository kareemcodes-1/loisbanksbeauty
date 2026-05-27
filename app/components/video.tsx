"use client";

import AnimatedBorder from "@/components/animated-border";
import { Play } from "lucide-react";
import Image from "next/image";

const Video = () => {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      {/* IMAGE CONTAINER */}
      <div className="relative z-[3] max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedBorder innerClassName="shadow-[0_0_120px_rgba(246,58,34,0.08)]">
          <div className="relative">
            <Image
              src="https://framerusercontent.com/images/HHzMyjWY0ZoBCUaFUuEKEd7hyQ.png?scale-down-to=2048&width=4096&height=2706"
              alt="dashboard"
              width={500}
              height={500}
              className="
                w-full
                h-[45vh] sm:h-[60vh] md:h-[75vh] lg:h-[80vh]
                object-cover
                opacity-90
              "
              priority
              quality={100}
            />

            <div className="absolute inset-0 bg-black/35" />

            {/* PLAY BUTTON */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <button
                className="
                  group
                  flex items-center justify-center
                  w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24
                  rounded-full
                  bg-white/10
                  backdrop-blur-md
                  border border-white/15
                  transition-all duration-300
                  hover:scale-110
                  hover:bg-white/15
                "
              >
                <Play
                  className="
                    w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10
                    text-white
                    fill-white
                    ml-1
                    transition-transform duration-300
                    group-hover:scale-110
                  "
                />
              </button>
            </div>
          </div>
        </AnimatedBorder>
      </div>
    </section>
  );
};

export default Video;