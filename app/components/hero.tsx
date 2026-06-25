"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitLines } from "../../components/animations/SplitLines";

const slides = ["/hero.jpg", "/hero.jpg", "/hero.jpg"];

const SLIDE_INTERVAL = 8000;

export default function Hero() {
  const [active, setActive] = useState(0);
  const isAnimating = useRef(false);

  const clipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Refs for the orange progress fill inside each indicator
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressTweens = useRef<(gsap.core.Tween | null)[]>([]);

  const revealSlide = (index: number) => {
    const clip = clipRefs.current[index];
    const img = imgRefs.current[index];
    const wrapper = slideWrapperRefs.current[index];
    if (!clip || !img || !wrapper) return;

    gsap.set(wrapper, { zIndex: 10 });
    gsap.set(clip, { clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(img, { yPercent: -10 });

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        slideWrapperRefs.current.forEach((w, i) => {
          if (w && i !== index) gsap.set(w, { zIndex: 0 });
        });
      },
    });

    tl.to(clip, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.2,
      ease: "power4.inOut",
    }).to(img, {
      yPercent: 0,
      duration: 1.2,
      ease: "power4.inOut",
    }, "<");
  };

  // Kick off progress animation for the active indicator
  const startProgress = (index: number) => {
    // Kill any running tweens
    progressTweens.current.forEach((t) => t?.kill());

    progressRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === index) {
        // Reset to 0 width then animate to 100% over SLIDE_INTERVAL
        gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
        progressTweens.current[i] = gsap.to(el, {
          scaleX: 1,
          duration: SLIDE_INTERVAL / 1000,
          ease: "none",
        });
      } else {
        // Non-active: collapse to 0
        gsap.set(el, { scaleX: 0 });
      }
    });
  };

  useEffect(() => {
    revealSlide(0);
    startProgress(0);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const next = (active + 1) % slides.length;
      handleSlideChange(next);
    }, SLIDE_INTERVAL);
    return () => clearInterval(t);
  }, [active]);

  const handleSlideChange = (next: number) => {
    if (next === active || isAnimating.current) return;
    isAnimating.current = true;
    setActive(next);
    revealSlide(next);
    startProgress(next);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">

      {/* ── SLIDES ── */}
      {slides.map((src, i) => (
        <div
          key={i}
          ref={(el) => { slideWrapperRefs.current[i] = el; }}
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        >
          <div
            ref={(el) => { clipRefs.current[i] = el; }}
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              clipPath: "inset(100% 0% 0% 0%)",
            }}
          >
            <div
              ref={(el) => { imgRefs.current[i] = el; }}
              style={{
                position: "absolute",
                inset: "-10% 0 0 0",
                backgroundImage: `url('${src}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
        </div>
      ))}

      <div className="absolute inset-0 z-[100] bg-black/30" />

      <div className="absolute inset-0 z-[150] bottom-[-10rem] w-full flex flex-col items-start justify-center px-[1rem] md:px-12 gap-[2rem] text-left">

        <SplitLines
          text='Where Beauty Meets Luxury'
          tag="h1"
          className="overflow-hidden text-[2.5rem] md:text-[5rem] text-white leading-[1.2] w-full max-w-[50%]"
          duration={1}
          stagger={0.1}
          ease="power3.out"
          yPercent={150}
          threshold={0.1}
          rootMargin="0px"
        />

        <p className="text-white/90 text-[1rem] md:text-[1.1rem] leading-[1.8] max-w-[500px]">
          Shop high-quality wigs, beauty essentials, and premium lifestyle pieces curated for your everyday glow.
        </p>

        <div
          className="overflow-hidden inline-block"
        >
          <Link
            href="/shop"
            className=" bg-[#FD3F92] text-white uppercase px-[3rem] py-[1.1rem] inline-block rounded-full text-sm font-medium tracking-wide hover:bg-[#E63281] hover:text-white transition transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* ── PAGINATION ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1001] flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleSlideChange(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="relative overflow-hidden rounded-full bg-white/30 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{
              height: "3px",
              width: active === i ? "52px" : "24px",
            }}
          >
            {/* Orange progress fill */}
            <div
              ref={(el) => { progressRefs.current[i] = el; }}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#fff",
                transformOrigin: "left center",
                transform: "scaleX(0)",
              }}
            />
          </button>
        ))}
      </div>

    </section>
  );
}