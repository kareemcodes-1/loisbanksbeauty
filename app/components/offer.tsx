import BlurText from "@/components/animations/blur-text";
import Badge from "@/components/badge";
import {
  Globe,
  TrendingUp,
  Users,
  ShieldCheck,
  Clock,
  BarChart2,
} from "lucide-react";

const offers = [
  {
    icon: Globe,
    title: "A website that actually converts",
    description:
      "Not just a pretty site, a website built to turn visitors into actual paying clients.",
  },
  {
    icon: TrendingUp,
    title: "SEO so people can find you",
    description:
      "I make sure your website shows up when people search for what you offer on Google.",
  },
  {
    icon: ShieldCheck,
    title: "Branding that feels like you",
    description:
      "Your website will look and feel like a proper business. consistent, clean, and trustworthy.",
  },
  {
    icon: Clock,
    title: "Fast and accessible website",
    description:
      "Slow websites lose customers. I make sure yours loads fast and works for everyone.",
  },
  {
    icon: Users,
    title: "Copywriting and content",
    description:
      "I write the words, headlines, and structure that actually make people want to stay and buy, including sourcing images if you don't have them.",
  },
  {
    icon: BarChart2,
    title: "Automations and sales tools",
    description:
      "From contact forms to AI sales agents, I add simple systems that keep your business running even when you're not.",
  },
];

export default function OffersSection() {
  return (
    <section className="section-spacing px-4 sm:px-6 lg:px-0">
      <div className="flex items-center justify-center w-full flex-col">
        <Badge text="Offer" />

        {/* Header */}
        <div className="flex items-center justify-center w-full flex-col gap-4 mb-12 md:mb-14">
          <div className="flex flex-col items-center text-center">
            <BlurText
              text="Here's how we fix"
              delay={50}
              animateBy="words"
              direction="bottom"
              className="text-white overflow-hidden"
            />
            <BlurText
              text="all of that"
              delay={50}
              animateBy="words"
              direction="bottom"
              stepDuration={0.4}
              className="text-white/70 overflow-hidden"
            />
          </div>

          <p className="text-[1rem] md:text-[1.2rem] text-gray-400 max-w-[480px] leading-[1.7] text-center">
            Everything here is built to solve a real problem your business has,
            not just to look good.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {offers.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="relative overflow-hidden bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 sm:p-7 md:p-8 transition-all duration-300 hover:border-orange-400/30 group"
              style={{
                background:
                  "radial-gradient(80% 60% at 50% 100%, rgba(249,115,22,0.12), #0d0d0d 100%)",
              }}
            >
              {/* Icon box */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 sm:mb-8 transition-colors duration-300">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              </div>

              {/* Title */}
              <h3 className="text-white !text-[1.3rem] sm:!text-[1.6rem] md:!text-[2rem] mb-3 leading-tight">
                {title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-[0.9rem] sm:text-[1rem] leading-[1.7]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}