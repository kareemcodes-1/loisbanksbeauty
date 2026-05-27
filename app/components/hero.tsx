"use client";

import Link from "next/link";
import { useRef } from "react";
import Stats from "./stats";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center
             justify-center text-center
             px-4  md:px-12 lg:px-[3rem]
             pt-[8rem]  md:pt-40 lg:pt-[12rem]
             pb-16"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* ── Availability badge ── */}
        <div className="mb-10 flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 will-change-transform">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-white/80 tracking-[0.1em] uppercase">
            Available for new projects
          </span>
        </div>

        <h1 className="relative text-white mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-white">
          Websites That Actually
          <br />
          Get <span className="text-white/65">You Clients</span>
        </h1>

        <p
          className="text-sm sm:text-base md:text-lg lg:text-[1.2rem]
                   text-gray-400
                   max-w-[480px]
                   leading-[1.7]
                   mb-11"
        >
          I help businesses stand out with a website that looks good, loads fast,
          and actually brings in clients
        </p>

        {/* ── CTAs ── */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-[1.5rem] w-full sm:w-auto">
          <Link
            href="https://wa.link/11epdm"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Let's Talk
          </Link>

          <Link href="/works" className="btn-secondary">
            See My Works
          </Link>
        </div>
      </div>

      <div className="mt-12 md:mt-20">
        <Stats />
      </div>
    </section>
  );
}