"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Curve() {
  const pathname = usePathname();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const resize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  if (!mounted || !dimensions.width || !dimensions.height) {
    return null;
  }

  const { width, height } = dimensions;
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
    L0 0
  `;

  const targetPath = `
    M0 ${curveDepth}
    Q${width / 2} 0 ${width} ${curveDepth}
    L${width} ${height}
    Q${width / 2} ${height} 0 ${height}
    L0 0
  `;

  // Start fully on screen (covering), then slide up off screen
  const slide: Variants = {
    initial: {
      top: 0,
    },
    enter: {
      top: "-100vh",
      transition: {
        duration: 0.8,
        delay: 0.15,
        ease: EASE,
      },
    },
  };

  const pathVariants: Variants = {
    initial: {
      d: initialPath,
    },
    enter: {
      d: targetPath,
      transition: {
        duration: 0.8,
        delay: 0.15,
        ease: EASE,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      >
        <motion.svg
          className="fixed left-0 top-0 w-screen"
          style={{ height: `calc(100vh + ${extra}px)` }}
          viewBox={`0 0 ${width} ${height + extra}`}
          preserveAspectRatio="none"
          variants={slide}
          initial="initial"
          animate="enter"
        >
          <motion.path
            fill="#FD3F92"
            variants={pathVariants}
            initial="initial"
            animate="enter"
          />
        </motion.svg>
      </motion.div>
    </AnimatePresence>
  );
}