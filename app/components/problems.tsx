import BlurText from "@/components/animations/blur-text";
import Badge from "@/components/badge";
import {
  Globe,
  TrendingDown,
  Users,
  ShieldOff,
  Clock,
  BarChart2,
} from "lucide-react";

const problems = [
  {
    icon: Globe,
    title: "Nobody can find you online",
    description:
      "If you're not showing up on Google, that customer is going straight to someone who is.",
  },
  {
    icon: TrendingDown,
    title: "No consistent clients",
    description:
      "You're relying on referrals and word of mouth — some months are good, some are dead.",
  },
  {
    icon: Users,
    title: "People don't trust you",
    description:
      "Before anyone calls or buys, they look you up. If there's nothing to find, most won't bother.",
  },
  {
    icon: ShieldOff,
    title: "Losing customers to competitors",
    description:
      "While you're offline, competitors with websites are already getting the customers that should be yours.",
  },
  {
    icon: Clock,
    title: "No way to generate leads 24/7",
    description:
      "Without a website, nothing is working for you when you're busy, sleeping, or unavailable.",
  },
  {
    icon: BarChart2,
    title: "No online presence at all",
    description:
      "No website, no Google listing, no proof you exist — that's customers walking away before they even reach you.",
  },
];

export default function ProblemsSection() {
  return (
    <section className="section-spacing relative px-4 sm:px-6 lg:px-0">
      <div className="flex items-center justify-center w-full flex-col">
        <Badge text="Problems" />

        {/* Header */}
        <div className="flex items-center justify-center w-full flex-col gap-4 mb-12 md:mb-14">
          <div className="flex flex-col items-center text-center">
            <BlurText
              text="If your business is dealing"
              delay={50}
              animateBy="words"
              direction="bottom"
              className="text-white overflow-hidden"
            />
            <BlurText
              text="with any of these"
              delay={50}
              animateBy="words"
              direction="bottom"
              stepDuration={0.4}
              className="text-white/70 overflow-hidden"
            />
          </div>

          <p className="text-[1rem] md:text-[1.2rem] text-gray-400 max-w-[480px] leading-[1.7] text-center">
            Most businesses are losing customers online without even knowing it
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {problems.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 sm:p-7 md:p-8 hover:border-rose-400/30 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-[#7c5cfc]/10 transition-colors duration-300">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
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