"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import React from "react";

const FAQ = () => {
  return (
    <section className="w-full px-[1.5rem] md:px-[3rem] py-[5rem] min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[900px] flex flex-col items-center justify-center gap-12">

        {/* Heading */}
        <div className="flex flex-col items-center justify-center w-full gap-3">

          {/* Subtext */}
          <span className="md:text-[1.4rem] text-[#caa11b]">
            Questions?
          </span>

          {/* Heading */}
          <h2 className="text-[2rem] md:text-[3.5rem] lg:text-[4rem] text-black leading-[120%] text-center max-w-[800px]">
            We’ve Got Answers For You
          </h2>

        </div>

        {/* Accordion */}
        <div className="w-full max-w-[800px]">
          <Accordion type="single" collapsible className="w-full space-y-[.5rem]">

            <AccordionItem value="item-1" className="border border-black/10 shadow-sm rounded-2xl px-5 py-2">
              <AccordionTrigger className="text-left md:text-[1rem] text-black hover:text-[#FD3F92] transition geist-font uppercase">
                Is the hair 100% virgin human hair?
              </AccordionTrigger>
              <AccordionContent className="text-black/70 text-[.85rem] sm:text-[.9rem]">
                Yes. All our wigs are made from 100% virgin human hair with no synthetic blends, ensuring a natural look and long-lasting quality.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-black/10 shadow-sm rounded-2xl px-5 py-2">
              <AccordionTrigger className="text-left md:text-[1rem] text-black hover:text-[#FD3F92] transition geist-font uppercase">
                Do you ship worldwide?
              </AccordionTrigger>
              <AccordionContent className="text-black/70 text-[.85rem] sm:text-[.9rem]">
                Yes. We offer worldwide shipping and deliver to most countries. Shipping times and costs may vary depending on your location.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-black/10 shadow-sm rounded-2xl px-5 py-2">
              <AccordionTrigger className="text-left md:text-[1rem] text-black hover:text-[#FD3F92] transition geist-font uppercase">
                How long do the wigs last?
              </AccordionTrigger>
              <AccordionContent className="text-black/70 text-[.85rem] sm:text-[.9rem]">
                With proper care, our wigs can last 12 months or longer. Longevity depends on maintenance, styling frequency, and care routine.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-black/10 shadow-sm rounded-2xl px-5 py-2">
              <AccordionTrigger className="text-left md:text-[1rem] text-black hover:text-[#FD3F92] transition geist-font uppercase">
                Do you accept returns or exchanges?
              </AccordionTrigger>
              <AccordionContent className="text-black/70 text-[.85rem] sm:text-[.9rem]">
                Yes. We accept returns on unused wigs in their original condition within the specified return period. Please check our returns policy for full details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-black/10 shadow-sm rounded-2xl px-5 py-2">
              <AccordionTrigger className="text-left md:text-[1rem] text-black hover:text-[#FD3F92] transition geist-font uppercase">
                Do you accept returns or exchanges?
              </AccordionTrigger>
              <AccordionContent className="text-black/70 text-[.85rem] sm:text-[.9rem]">
                Yes. We accept returns on unused wigs in their original condition within the specified return period. Please check our returns policy for full details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-black/10 shadow-sm rounded-2xl px-5 py-2">
              <AccordionTrigger className="text-left md:text-[1rem] text-black hover:text-[#FD3F92] transition geist-font uppercase">
                Do you accept returns or exchanges?
              </AccordionTrigger>
              <AccordionContent className="text-black/70 text-[.85rem] sm:text-[.9rem]">
                Yes. We accept returns on unused wigs in their original condition within the specified return period. Please check our returns policy for full details.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

      </div>
    </section>
  );
};

export default FAQ;