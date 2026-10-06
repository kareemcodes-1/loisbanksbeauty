"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const EASE = [0.76, 0, 0.24, 1] as const;

type Run = { key: string; width: number; height: number };

export default function Curve() {
  const pathname = usePathname();
  const [run, setRun] = useState<Run | null>(null);

  // Measure ONCE per route change. No resize listener, so scrolling on
  // mobile (address bar show/hide) or resizing in DevTools can't retrigger it.
  useEffect(() => {
    setRun({
      key: pathname ?? "",
      width: window.innerWidth,
      height: Math.max(
        window.innerHeight,
        document.documentElement.clientHeight
      ),
    });
  }, [pathname]);

  if (!run) return null;

  const { key, width, height } = run;
  const isMobile = width < 768;
  const curveDepth = isMobile
    ? Math.round(Math.min(width * 0.28, 120))
    : Math.round(Math.min(width * 0.18, 300));
  const extra = curveDepth * 2;

  const initialPath = `
    M0 ${curveDepth}
    Q${width / 2} 0 ${width} ${curveDepth}
    L${width} ${height + curveDepth}
    Q${width / 2} ${height + extra} 0 ${height + curveDepth}
    Z
  `;

  const targetPath = `
    M0 ${curveDepth}
    Q${width / 2} 0 ${width} ${curveDepth}
    L${width} ${height}
    Q${width / 2} ${height} 0 ${height}
    Z
  `;

  const transition = { duration: 0.8, delay: 0.15, ease: EASE };

  // Pixel-based slide (same unit as the path), via transform
  const slide: Variants = {
    initial: { y: 0 },
    enter: { y: -height, transition },
  };

  const pathVariants: Variants = {
    initial: { d: initialPath },
    enter: { d: targetPath, transition },
  };

  return (
    <motion.div
      key={key}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      <motion.svg
        className="absolute left-0 top-0 block will-change-transform"
        style={{ width: "100%", height: height + extra }}
        viewBox={`0 0 ${width} ${height + extra}`}
        preserveAspectRatio="none"
        variants={slide}
        initial="initial"
        animate="enter"
        // Remove the overlay completely once it has slid away
        onAnimationComplete={() =>
          setRun((prev) => (prev?.key === key ? null : prev))
        }
      >
        {/* Inherits initial/animate from the svg */}
        <motion.path fill="#FD3F92" variants={pathVariants} />
      </motion.svg>
    </motion.div>
  );
}