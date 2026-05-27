import AnimatedBorder from "@/components/animated-border";
import {
    Award,
    Clock,
    Sparkle,
    Users,
} from "lucide-react";
import Image from "next/image";

const features = [
    {
        icon: Clock,
        title: "4+ Years",
        description: "building websites that actually work for businesses",
    },
    {
        icon: Users,
        title: "50+ Happy Clients",
        description: "businesses that now show up online and get consistent clients",
    },
    {
        icon: Award,
        title: "Award-Winning Designs",
        description: "recognized for building websites that look good and convert",
    },
    {
        icon: Sparkle,
        title: "Real Results",
        description: "every website I build is measured by what it does, not just how it looks",
    },
];

const AboutMe = () => {
    return (
        <section className="section-spacing flex flex-col justify-center px-4 lg:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-10 md:gap-[3rem] items-start">

                {/* IMAGE */}
                <AnimatedBorder
                    className="w-full h-full"
                    innerClassName="shadow-[0_0_120px_rgba(246,58,34,0.08)]"
                >
                    <div className="relative w-full h-[420px] md:h-[750px] rounded-2xl overflow-hidden">
                        <Image
                            src="/kareem.png"
                            alt="kareem"
                            width={800}
                            height={1000}
                            quality={100}
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                </AnimatedBorder>

                {/* CONTENT */}
                <div className="text-left max-w-2xl w-full">
                    <p className="mt-4 md:mt-6 text-gray-400 text-[1rem] md:text-[1.2rem] leading-[1.7]">
                        I'm Kareem Braimoh, a web developer with over 4 years of experience.
                        I help businesses get found online, build trust, and turn their
                        website into something that actually brings in clients.
                    </p>

                    {/* FEATURES */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 md:mt-[2rem]">
                        {features.map(({ icon: Icon, title, description }) => (
                            <div
                                key={title}
                                className="
                  relative overflow-hidden
                  bg-[#111111]
                  border border-[#1f1f1f]
                  rounded-2xl
                  p-5 sm:p-6 md:p-8
                  transition-all duration-300
                  hover:border-orange-400/30
                  group
                "
                                style={{
                                    background:
                                        "radial-gradient(80% 60% at 50% 100%, rgba(249,115,22,0.12), #0d0d0d 100%)",
                                }}
                            >
                                {/* Icon box */}
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-5 sm:mb-8 transition-colors duration-300">
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                                </div>

                                {/* Text */}
                                <h3 className="text-white !text-[1.2rem] mb-2 sm:mb-3">
                                    {title}
                                </h3>

                                <p className="text-gray-400 text-[1rem] md:text-[1.2rem]">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutMe;