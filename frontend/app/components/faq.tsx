"use client";

import FadeContent from "@/components/animations/fade-content";
import { SplitLines } from "@/components/animations/SplitLines";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Are your wigs made from 100% human hair?",
    answer:
      "Yes. All of our wigs are made from 100% premium human hair for a natural appearance and long-lasting quality.",
  },
  {
    question: "Do you ship nationwide and internationally?",
    answer:
      "Yes, we ship across Nigeria and internationally. Please check our list of supported countries or contact us to confirm if we currently deliver to your location.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major payment methods supported by Paystack, including debit and credit cards, bank transfers, USSD, bank payments, mobile money, and more.",
  },
  {
    question: "How long will my order take to arrive?",
    answer:
      "Orders are processed within 24–48 hours after payment is confirmed. Once your order has been shipped, you'll receive a tracking number, and delivery time will depend on your location.",
  },
  {
    question: "Can I return or exchange an item?",
    answer:
      "We do not offer refunds or returns. However, eligible items may be exchanged if they are unused and in their original condition. Refunds are only considered in rare cases where the issue is due to an error on our part. Please read our Return & Exchange Policy for full details.",
  },
  {
    question: "How can I track my order?",
    answer:
      "After your payment has been confirmed and your order has been shipped, we'll send you a tracking number so you can monitor your delivery every step of the way.",
  },
];

const FAQ = () => {
  return (
    <section className="section-spacing w-full">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 sm:gap-10 lg:gap-14">
        <div className="flex w-full flex-col items-center gap-3 text-center sm:gap-4">
           <FadeContent blur={true} duration={0.5} initialOpacity={0}>
              <span className="subtitle">Questions?</span>
          </FadeContent>

           <SplitLines
                                        tag="h2"
                                        text="We&apos;ve Got Answers For You"
                                        className="heading-1 max-w-[min(50rem,100%)] text-balance overflow-hidden"
                                        duration={1}
                                        stagger={0.025}
                                        yPercent={100}
                                        rootMargin="-100px"
                                        ease="power4.out"
                                      />
        </div>

        <div className="w-full max-w-4xl">
          <Accordion type="single" collapsible className="space-y-2.5 sm:space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-black/10 bg-white px-3.5 py-1.5 shadow-sm sm:rounded-2xl sm:px-5 sm:py-2 md:px-6"
              >
                <AccordionTrigger className="py-3 text-left font-geist text-[0.8rem] font-medium uppercase leading-snug transition-colors hover:text-[#FD3F92] sm:py-4 sm:text-[0.9rem] md:text-[1rem]">
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className="pr-2 pb-3 font-geist text-[0.875rem] leading-6 text-black/70 sm:pr-6 sm:pb-4 sm:text-[0.925rem] sm:leading-7">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;