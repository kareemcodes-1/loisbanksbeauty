"use client";

import AnimatedBorder from "@/components/animated-border";
import BlurText from "@/components/animations/blur-text";
import Badge from "@/components/badge";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { projects } from "../data";

export default function SelectedWorks() {
  return (
    <section className="section-spacing mx-auto relative overflow-hidden w-full px-4 sm:px-6 lg:px-0">
      <Badge text="Results" />

      {/* Header */}
      <div className="flex items-center justify-center w-full flex-col gap-4 mb-16 md:mb-20">
        <div className="flex flex-col items-center text-center">
          <BlurText
            text="What my clients got after"
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

        <p className="text-[1rem] md:text-[1.2rem] text-gray-400 max-w-[480px] leading-[1.7] text-center">
          Every project on here solved something that was actually hurting the
          business.
        </p>
      </div>

      {/* Project rows */}
      <div className="flex flex-col gap-[2rem] md:gap-[3rem]">
        {projects.map((project, index) => (
          <ProjectRow
            key={project.id}
            project={project}
            isLast={index === projects.length - 1}
          />
        ))}
      </div>

      <div className="flex justify-center mt-[3rem]">
        <Link href="/works" className="btn-primary">
          View More
        </Link>
      </div>
    </section>
  );
}

function ProjectRow({
  project,
}: {
  project: (typeof projects)[number];
  isLast: boolean;
}) {
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

  const content = (
    <div className="flex flex-col justify-between h-full py-8 md:py-14 px-4 md:px-10">
      {/* top row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-[0.7rem] sm:text-[0.75rem] font-medium text-[#9CA3AF] uppercase tracking-[0.12em]">
          {project.id}
        </span>

        <span className="w-6 h-px bg-[#9CA3AF]/40" />

        <span className="text-[0.7rem] sm:text-[0.75rem] font-medium text-[#9CA3AF] uppercase tracking-[0.12em]">
          {project.client}
        </span>

        <span className="ml-auto text-[0.7rem] sm:text-[0.75rem] text-[#9CA3AF]/60 tracking-wide">
          {project.period}
        </span>
      </div>

      {/* title + desc */}
      <div className="flex-1 flex flex-col justify-center gap-4 md:gap-5">
        <h2 className="text-white text-[2.2rem] sm:text-[3rem]  md:text-[4rem] tracking-[-0.03em]">
          {project.title}
        </h2>

        <p className="text-[0.85rem] sm:text-[0.95rem] text-[#9CA3AF] leading-[1.7] max-w-[420px]">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[0.6rem] sm:text-[0.65rem] font-normal tracking-[0.08em] uppercase
                         text-white/70 bg-[#ffffff1a] border border-[#ffffff1a]
                         rounded-full px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* metrics */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start sm:items-end justify-between mt-8">
        <div className="flex gap-8 sm:gap-10">
          {project.metrics.map((m, i) => (
            <div key={i}>
              <p className="text-white text-[1.6rem] sm:text-[2rem] md:text-[2.2rem] tracking-[-0.04em] leading-none">
                {m.value}
              </p>

              <p className="text-[0.75rem] sm:text-[0.8rem] text-[#9CA3AF] mt-1 leading-[1.4] whitespace-pre-line">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <AnimatedBorder
      className="h-full"
      innerClassName="shadow-[0_0_120px_rgba(246,58,34,0.08)]"
    >
      <Link
        href={project.href}
        target="_blank"
        ref={wrapperRef}
        onMouseMove={handleMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="relative grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[1.5rem] md:rounded-[2rem] bg-[#1111118c] border border-[#1f1f1f] overflow-hidden"
      >
        {/* hover cursor */}
        <div
          className="hidden md:flex absolute top-0 left-0 pointer-events-none z-50 transition-opacity duration-200"
          style={{
            opacity: visible ? 1 : 0,
            transform: `translate(${position.x - 52}px, ${
              position.y - 52
            }px)`,
          }}
        >
          <div
            className="w-[104px] h-[104px] rounded-full flex items-center justify-center"
            style={{
              background: "rgba(234, 190, 145, 0.45)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.28)",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <span className="text-white text-[0.78rem] font-medium tracking-[0.08em] uppercase">
              View
            </span>
          </div>
        </div>

        {project.imageLeft ? (
          <>
            <div className="p-3 sm:p-4 md:p-0">
              <div className="relative w-full h-[240px] sm:h-[320px] md:h-full min-h-[260px] md:min-h-[380px] overflow-hidden rounded-2xl">
                <Image
                  src={project.image}
                  alt={project.client}
                  fill
                  className="object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
                  quality={100}
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>

            <div>{content}</div>
          </>
        ) : (
          <>
            <div>{content}</div>

            <div className="p-3 sm:p-4 md:p-0">
              <div className="relative w-full h-[240px] sm:h-[320px] md:h-full min-h-[260px] md:min-h-[380px] overflow-hidden rounded-2xl">
                <Image
                  src={project.image}
                  alt={project.client}
                  fill
                  className="object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
                  quality={100}
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          </>
        )}
      </Link>
    </AnimatedBorder>
  );
}