import FadeContent from "@/components/animations/fade-content";
import { SplitLines } from "@/components/animations/SplitLines";
import {
  Gem,
  Globe,
  BadgeDollarSign,
  ShieldCheck,
  Sparkles,
  Headset,
} from "lucide-react";

const offers = [
  {
    icon: Gem,
    title: "Premium Quality",
    description:
      "Every wig, beauty essential, and fashion piece is carefully selected to meet high standards of quality and durability.",
  },
  {
    icon: Globe,
    title: "Worldwide Shipping",
    description:
      "We deliver safely to customers across Nigeria and around the world with reliable shipping partners.",
  },
  {
    icon: BadgeDollarSign,
    title: "Affordable Luxury",
    description:
      "Experience premium beauty products at fair prices without compromising on quality or style.",
  },
  {
    icon: ShieldCheck,
    title: "Global Standard",
    description:
      "Built on genuine customer satisfaction, authentic products, and dependable service you can rely on.",
  },
  {
    icon: Sparkles,
    title: "Everything in One Place",
    description:
      "From luxury wigs and beauty essentials to stylish fashion pieces, shop everything you need in one destination.",
  },
  {
    icon: Headset,
    title: "Exceptional Customer Care",
    description:
      "Our team is always available to guide you, answer your questions, and ensure a smooth shopping experience.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-spacing w-full bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:gap-10 lg:gap-14">
        <div className="flex flex-col items-center gap-3 text-center sm:gap-4">

           <FadeContent blur={true} duration={0.5} initialOpacity={0}>
              <span className="subtitle">Why Us</span>
            </FadeContent>

            <SplitLines
              tag="h2"
              text="Why Choose LoisBanks Beauty"
              className="heading-1 mx-auto max-w-[min(44rem,100%)] text-black"
              duration={1}
              stagger={0.025}
              yPercent={100}
              rootMargin="-100px"
              ease="power4.out"
            />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {offers.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:gap-5 sm:rounded-[1.5rem] sm:p-7 lg:p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FD3F92] sm:h-14 sm:w-14">
                  <Icon className="text-white" size={20} />
                </div>

                <div className="flex flex-col gap-2 sm:gap-3">
                  <h3 className="text-[1.15rem] text-black sm:text-[1.45rem]">
                    {item.title}
                  </h3>
                  <p className="paragraph text-black/75">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}