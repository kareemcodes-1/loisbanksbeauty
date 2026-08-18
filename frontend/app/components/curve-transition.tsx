"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const curve = (
  initialPath: string,
  targetPath: string
): Variants => ({
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

const translate: Variants = {
  initial: {
    top: "-300px",
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
    top: "-300px",

    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

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

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (!mounted || !dimensions.width || !dimensions.height) {
    return null;
  }

  const initialPath = `
    M0 300
    Q${dimensions.width / 2} 0 ${dimensions.width} 300
    L${dimensions.width} ${dimensions.height + 300}
    Q${dimensions.width / 2} ${dimensions.height + 600} 0 ${
      dimensions.height + 300
    }
    L0 0
  `;

  const targetPath = `
    M0 300
    Q${dimensions.width / 2} 0 ${dimensions.width} 300
    L${dimensions.width} ${dimensions.height}
    Q${dimensions.width / 2} ${dimensions.height} 0 ${dimensions.height}
    L0 0
  `;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      >
        <motion.svg
          className="fixed left-0 top-0 h-[calc(100vh+600px)] w-screen"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height + 600}`}
          preserveAspectRatio="none"
          variants={translate}
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