"use client";

import BlurText from "@/components/animations/blur-text";
import Badge from "@/components/badge";

const steps = [
  {
    number: "01",
    title: "Discovery Call",
    description:
      "We get on a call and I learn about your business, what you do, who you serve, and what you actually need. No assumptions.",
    align: "right",
  },
  {
    number: "02",
    title: "Market Research",
    description:
      "I look at what your competitors are doing online and figure out how to make your business stand out from all of them.",
    align: "left",
  },
  {
    number: "03",
    title: "Design & Development",
    description:
      "I build your website fast, clean, and built to convert. Every section has a purpose, nothing is just there to look good.",
    align: "right",
  },
  {
    number: "04",
    title: "Review & Refinement",
    description:
      "You review everything and give feedback. We go back and forth until it feels right and you're happy with it.",
    align: "left",
  },
  {
    number: "05",
    title: "Launch & Support",
    description:
      "We go live and I don't just disappear. I'm still around after launch to make sure everything is running the way it should.",
    align: "right",
  },
];

export default function Process() {
  return (
    <section className="section-spacing px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col items-center w-full">
        <Badge text="Process" />

        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-12 md:mb-14 text-center">
          <div className="flex flex-col items-center text-center">
            <BlurText
              text="How we work"
              delay={50}
              animateBy="words"
              direction="bottom"
              className="text-white overflow-hidden"
            />
            <BlurText
              text="step-by-step"
              delay={50}
              animateBy="words"
              direction="bottom"
              stepDuration={0.4}
              className="text-white/70 overflow-hidden"
            />
          </div>

          <p className="text-[1rem] md:text-[1.2rem] text-gray-400 max-w-[480px] leading-[1.7] text-center">
            A clear, collaborative process - so you always know what's happening
            and why.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative flex flex-col items-center w-full max-w-2xl">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#1f1f1f] z-[-1]" />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative z-10 w-full flex flex-col items-center mb-4 last:mb-0"
            >
              {/* Card */}
              <div
                className={`
                  relative z-[100]
                  rounded-2xl
                  p-6 sm:p-7 md:p-8
                  w-[92%] sm:w-[85%]
                  transition-all duration-300
                  hover:border-orange-400/30
                  bg-[#111111]
                  border border-[#1f1f1f]
                  group
                  ${step.align === "right" ? "self-end" : "self-start"}
                `}
                style={{
                  background:
                    "radial-gradient(80% 60% at 50% 100%, rgba(249,115,22,0.12), #0d0d0d 100%)",
                }}
              >
                {/* Number */}
                <p className="text-white/90 text-2xl sm:text-3xl md:text-4xl font-bold font-mono mb-3 md:mb-4">
                  {step.number}
                </p>

                {/* Title */}
                <h3 className="text-white !text-[1.3rem] sm:!text-[1.6rem] md:!text-[2rem] mb-3 leading-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-[0.9rem] sm:text-[1rem] leading-[1.7]">
                  {step.description}
                </p>
              </div>

              {/* Connector dot */}
              {i < steps.length - 1 && (
                <div className="w-2.5 h-2.5 rounded-full bg-orange-400/40 my-4 z-20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}