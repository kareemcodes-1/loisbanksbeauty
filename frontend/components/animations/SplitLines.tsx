"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

export interface SplitLinesProps {
  tag?: keyof React.JSX.IntrinsicElements;
  text: string;
  className?: string;
  duration?: number;
  stagger?: number;
  ease?: string;
  yPercent?: number;
  threshold?: number;
  rootMargin?: string;
}

export const SplitLines: React.FC<SplitLinesProps> = ({
  tag: Tag = "p",
  text,
  className = "",
  duration = 1,
  stagger = 0.1,
  ease = "power3.out",
  yPercent = 100,
  threshold = 0.1,
  rootMargin = "0px 0px -100px 0px",
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const element = containerRef.current;
      if (!element) return;

      let outerSplit: SplitText | null = null;
      let innerSplit: SplitText | null = null;
      let observer: IntersectionObserver | null = null;
      let isMounted = true;

      const setupSplit = () => {
        // Component may have unmounted while waiting for fonts
        if (!isMounted || !containerRef.current) return;

        outerSplit = new SplitText(element, {
          type: "lines",
          linesClass: "split-outer",
        });

        innerSplit = new SplitText(outerSplit.lines, {
          type: "lines",
          linesClass: "split-inner",
        });

        gsap.set(outerSplit.lines, {
          overflow: "hidden",
        });

        gsap.set(innerSplit.lines, {
          yPercent,
        });

        const animateIn = () => {
          if (!innerSplit) return;

          gsap.to(innerSplit.lines, {
            yPercent: 0,
            duration,
            stagger,
            ease,
            overwrite: true,
          });
        };

        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;

            animateIn();

            // Only animate once during this component's lifetime
            observer?.disconnect();
            observer = null;
          },
          {
            threshold,
            rootMargin,
          }
        );

        observer.observe(element);
      };

      if (document.fonts?.status === "loaded") {
        setupSplit();
      } else {
        document.fonts?.ready.then(() => {
          setupSplit();
        });
      }

      return () => {
        isMounted = false;

        observer?.disconnect();

        if (innerSplit) {
          gsap.killTweensOf(innerSplit.lines);
          innerSplit.revert();
        }

        outerSplit?.revert();
      };
    },
    {
      scope: containerRef,
      dependencies: [
        text,
        duration,
        stagger,
        ease,
        yPercent,
        threshold,
        rootMargin,
      ],
    }
  );

  const Component = Tag as React.ElementType;

  return (
    <Component ref={containerRef} className={className}>
      {text}
    </Component>
  );
};