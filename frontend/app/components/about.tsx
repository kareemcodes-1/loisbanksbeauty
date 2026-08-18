"use client";

import FadeContent from "@/components/animations/fade-content";
import { SplitLines } from "@/components/animations/SplitLines";
import Link from "next/link";

const About = () => {
  return (
    <section className="w-full bg-[#111111] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:gap-8 lg:gap-12">
        <FadeContent blur={true} duration={0.5} initialOpacity={0}>
              <span className="subtitle">About LoisBanks Beauty</span>
          </FadeContent>

        <SplitLines
                      tag="h1"
                      text="LoisBanks Beauty is a luxury destination for premium hair and beauty,
          created with a passion for helping women feel confident, elegant, and
          effortlessly beautiful."
                      className="heading-1 max-w-[min(56rem,100%)] text-balance text-white"
                      duration={1}
                      stagger={0.025}
                      yPercent={100}
                      rootMargin="-100px"
                      ease="power4.out"
                    />

        <Link
          href="/about"
          className="btn-outline w-full max-w-[11rem] sm:w-fit lg:w-[10rem]"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default About;