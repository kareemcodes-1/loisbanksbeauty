"use client";

import BlurText from "@/components/animations/blur-text";
import Badge from "@/components/badge";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { projects } from "@/app/data";

export default function SelectedWorks() {
  return (
    <section className="section-spacing min-h-screen mx-auto relative overflow-hidden w-full mt-[6rem] lg:mt-[8rem] px-4 sm:px-6 lg:px-0">
      <Badge text="Our Work" />

      {/* Header */}
      <div className="flex items-center justify-center w-full flex-col gap-4 mb-12 md:mb-20">
        <div className="flex flex-col items-center text-center">
          <BlurText
            text="Projects I've built and the"
            delay={50}
            animateBy="words"
            direction="bottom"
            className="text-white overflow-hidden"
          />
          <BlurText
            text="results they delivered"
            delay={50}
            animateBy="words"
            direction="bottom"
            stepDuration={0.4}
            className="text-white/70 overflow-hidden"
          />
        </div>

        <p className="text-[1rem] md:text-[1.2rem] text-gray-400 max-w-[480px] leading-[1.7] text-center">
          These aren't just websites, each one solved something that was holding a business back.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-[2rem]">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

/* ───────────── CARD ───────────── */

function ProjectCard({ project }: any) {
  const wrapperRef = useRef<HTMLAnchorElement | null>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();

    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Link
      href={project.href}
      ref={wrapperRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="
        relative flex flex-col
        rounded-2xl md:rounded-[2rem]
        bg-[#1111118c]
        border border-[#1f1f1f]
        overflow-hidden
        min-h-[420px] sm:min-h-[480px] md:min-h-[520px]
        h-full
      "
    >
      {/* IMAGE */}
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] overflow-hidden">
        <Image
          src={project.image}
          alt={project.client}
          fill
          className="object-cover transition-transform duration-500 ease-out hover:scale-[1.05]"
          quality={100}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* HOVER VIEW */}
      <div
        className="hidden md:flex absolute top-0 left-0 pointer-events-none z-50 transition-opacity duration-200"
        style={{
          opacity: visible ? 1 : 0,
          transform: `translate(${position.x - 52}px, ${position.y - 52}px)`,
        }}
      >
        <div className="w-[90px] h-[90px] md:w-[104px] md:h-[104px] rounded-full flex items-center justify-center bg-[rgba(234,190,145,0.45)] backdrop-blur-[14px] border border-white/30">
          <span className="text-white text-[0.7rem] md:text-[0.78rem] font-medium uppercase tracking-[0.08em]">
            View
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col justify-between flex-1 py-6 sm:py-8 md:py-14 px-5 sm:px-6 md:px-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <span className="text-[0.65rem] sm:text-[0.75rem] text-[#9CA3AF] uppercase tracking-[0.12em]">
            {project.id}
          </span>

          <span className="w-4 sm:w-6 h-px bg-[#9CA3AF]/40" />

          <span className="text-[0.65rem] sm:text-[0.75rem] text-[#9CA3AF] uppercase tracking-[0.12em]">
            {project.client}
          </span>

          <span className="ml-auto text-[0.6rem] sm:text-[0.75rem] text-[#9CA3AF]/60">
            {project.period}
          </span>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          <h3 className="text-white text-[1.6rem] sm:text-[2.2rem] md:!text-[3rem] tracking-[-0.03em]">
            {project.title}
          </h3>

          <p className="text-sm sm:text-[0.95rem] text-[#9CA3AF] leading-[1.7]">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-[0.6rem] sm:text-[0.65rem] uppercase text-white/70 bg-[#ffffff1a] border border-[#ffffff1a] rounded-full px-2 sm:px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between mt-6 sm:mt-8">
          <div className="flex gap-6 sm:gap-10">
            {project.metrics.map((m: any, i: number) => (
              <div key={i}>
                <p className="text-white text-[1.6rem] sm:text-[2.2rem] leading-none">
                  {m.value}
                </p>

                <p className="text-[0.7rem] sm:text-[0.8rem] text-[#9CA3AF] mt-1 whitespace-pre-line">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}