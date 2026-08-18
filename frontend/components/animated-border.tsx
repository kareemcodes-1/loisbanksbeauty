"use client";

import { ReactNode } from "react";

interface AnimatedBorderProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

const AnimatedBorder = ({
  children,
  className = "",
  innerClassName = "",
}: AnimatedBorderProps) => {
  return (
    <>
      <div className={`relative rounded-[2rem] p-[1.5px] ${className}`}>
        {/* Animated conic border */}
        <div
          className="absolute inset-0 rounded-[2rem]"
          style={{
            background:
              "conic-gradient(from var(--angle), transparent 70%, rgba(120,40,20,0.4) 83%, rgba(180,80,40,0.55) 90%, rgba(220,120,80,0.35) 95%, transparent 100%)",
            animation: "spin-border 4s linear infinite",
          }}
        />

        {/* Inner mask */}
        <div className="absolute inset-[1.5px] rounded-[calc(2rem-1.5px)] bg-[#080808] z-[1]" />

        {/* Content */}
        <div
          className={`
            relative z-[2]
            overflow-hidden
            rounded-[calc(2rem-1.5px)]
            bg-[#080808]
            ${innerClassName}
          `}
        >
          {children}
        </div>
      </div>

      <style jsx>{`
        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes spin-border {
          to {
            --angle: 360deg;
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedBorder;