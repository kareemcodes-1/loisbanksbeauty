"use client";

import BlurText from "@/components/animations/blur-text";
import Badge from "@/components/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do we get started?",
    answer:
      "We start with a quick call to understand your business and what you need. From there, you share any content, images, or branding you have — and if you don't have any, I'll help you figure it out.",
  },
  {
    question: "How long does a website project take?",
    answer:
      "Basic websites are done in 2–3 weeks. Larger projects like e-commerce or custom platforms usually take 4–6 weeks depending on the scope.",
  },
  {
    question: "Do you only work with specific industries?",
    answer:
      "No. I work with all kinds of businesses — startups, local businesses, personal brands, restaurants, e-commerce stores, and more.",
  },
  {
    question: "What does it cost to work with you?",
    answer:
      "Pricing depends on what you need. Simple websites cost less, more complex ones with custom features cost more. Check the pricing page for starting prices or just reach out and we'll figure it out.",
  },
  {
    question: "Can you redesign my existing website?",
    answer:
      "Yes. If your website feels outdated, slow, or isn't bringing in clients, I can rebuild it into something that actually works.",
  },
  {
    question: "Do you offer ongoing maintenance after launch?",
    answer:
      "Yes. The first month after launch is free. After that, we can set up a maintenance plan depending on what your website needs.",
  },
];

export default function FAQ() {
  return (
    <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-0">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[60%] h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f97316]/10 blur-3xl" />
      </div>

      <div className="flex items-center justify-center flex-col mx-auto max-w-5xl">
        <Badge text="FAQs" />

        {/* Heading */}
        <div className="flex items-center justify-center w-full flex-col gap-4 mb-12 md:mb-14">
          <div className="flex flex-col items-center text-center">
            <BlurText
              text="Questions you might"
              delay={50}
              animateBy="words"
              direction="bottom"
              className="text-white overflow-hidden"
            />
            <BlurText
              text="already have"
              delay={50}
              animateBy="words"
              direction="bottom"
              stepDuration={0.4}
              className="text-white/70 overflow-hidden"
            />
          </div>

          <p className="text-[1rem] md:text-[1.2rem] text-gray-400 max-w-[480px] leading-[1.7] text-center">
            If you've got questions before reaching out, chances are they're answered right here.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="w-full space-y-4">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="
                  overflow-hidden
                  rounded-2xl sm:rounded-3xl
                  border border-white/10
                  bg-white/[0.03]
                  px-4 sm:px-6
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:border-white/20
                "
              >
                <AccordionTrigger
                  className="
                    py-5 sm:py-6
                    text-left
                    text-[1rem] sm:text-[1.2rem]
                    font-medium
                    text-white
                    hover:no-underline
                  "
                >
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent
                  className="
                    pb-5 sm:pb-6
                    pr-4 sm:pr-10
                    text-sm sm:text-base
                    text-gray-400
                    leading-[1.7]
                  "
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}