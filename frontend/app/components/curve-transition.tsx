"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const curve = (initialPath: string, targetPath: string): Variants => ({
  initial: {
    d: initialPath,
  },
  enter: {
    d: targetPath,
    transition: {
      duration: 0.75,
      delay: 0.35,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    d: initialPath,
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
});

const translate = (offset: number): Variants => ({
  initial: {
    top: `-${offset}px`,
  },
  enter: {
    top: "-100vh",
    transition: {
      duration: 0.75,
      delay: 0.35,
      ease: [0.76, 0, 0.24, 1],
    },
    transitionEnd: {
      top: "100vh",
    },
  },
  exit: {
    top: `-${offset}px`,
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
});

export default function RouteTransition() {
  const pathname = usePathname();

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

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

  // Smaller curve on mobile, fuller on desktop
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
          variants={translate(curveDepth)}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <motion.path
            fill="#FD3F92"
            variants={curve(initialPath, targetPath)}
            initial="initial"
            animate="enter"
            exit="exit"
          />
        </motion.svg>
      </motion.div>
    </AnimatePresence>
  );
}