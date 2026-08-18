"use client";

import Link from "next/link";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { FaEnvelope, FaInstagram, FaPhone } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  useGSAP(
    () => {
      if (!footerRef.current || !triggerRef.current) return;

      const footer = footerRef.current;
      const trigger = triggerRef.current;

      // Make sure the footer always starts from the correct position
      gsap.set(footer, {
        yPercent: -50,
      });

      const uncover = gsap.timeline({
        paused: true,
      });

      uncover.to(footer, {
        yPercent: 0,
        ease: "none",
      });

      const scrollTrigger = ScrollTrigger.create({
        trigger,
        start: "bottom bottom",
        end: "+=50%",
        animation: uncover,
        scrub: true,
      });

      // Recalculate positions after navigation/layout changes
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        scrollTrigger.kill();
        uncover.kill();

        // Remove any transform left behind by the animation
        gsap.set(footer, {
          clearProps: "transform",
        });
      };
    },
    {
      dependencies: [pathname],
      scope: footerRef,
      revertOnUpdate: true,
    }
  );

  return (
    <>
      {/* Footer scroll trigger */}
      <div ref={triggerRef} className="section" />

      {/* Footer */}
      <div className="relative w-full overflow-hidden bg-black">
        <footer
          ref={footerRef}
          className="bg-black px-5 pb-8 pt-12 text-white sm:px-8 sm:pt-16 md:px-12 md:pb-8 md:pt-28 lg:px-[3rem]"
        >
          <div className="mb-10 border-t border-dashed border-pink-500/40 sm:mb-14 md:mb-16" />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 lg:gap-0">
            {/* Brand */}
            <div className="flex flex-col gap-5 sm:gap-6 lg:pr-10">
              <Link href="/" className="w-fit">
                <img
                  src="/favicon.jpeg"
                  className="h-14 w-14 rounded-full object-cover sm:h-16 sm:w-16"
                  alt="LoisBanks Beauty"
                />
              </Link>

              <p className="max-w-xs text-[0.9rem] leading-relaxed text-white/60 sm:text-base">
                Premium luxury hair extensions crafted for confidence, beauty
                and timeless elegance.
              </p>

              <div className="mt-1 flex gap-3">
                <Link
                  href="mailto:lbanksluxuryhairs@gmail.com"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#FD3F92] sm:h-11 sm:w-11"
                  aria-label="Email"
                >
                  <FaEnvelope size={15} />
                </Link>

                <Link
                  href="tel:+2348105001284"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#FD3F92] sm:h-11 sm:w-11"
                  aria-label="Phone"
                >
                  <FaPhone size={15} />
                </Link>

                <Link
                  href="https://www.instagram.com/loisbanks_hair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#FD3F92] sm:h-11 sm:w-11"
                  aria-label="Instagram"
                >
                  <FaInstagram size={15} />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-4 border-dashed border-pink-500/40 sm:gap-5 lg:border-l lg:px-10">
              <h4 className="text-[1.05rem] font-medium text-white sm:text-[1.2rem]">
                Quick Links
              </h4>

              <div className="flex flex-col gap-3 text-[0.9rem] text-white/60 sm:gap-4 sm:text-base">
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>

                <Link href="/shop" className="transition hover:text-white">
                  Shop
                </Link>

                <Link href="/about" className="transition hover:text-white">
                  About Us
                </Link>

                <Link href="/contact" className="transition hover:text-white">
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Get in Touch */}
            <div className="flex flex-col gap-4 border-dashed border-pink-500/40 sm:gap-5 lg:border-l lg:px-10">
              <h4 className="text-[1.05rem] font-medium text-white sm:text-[1.2rem]">
                Get in Touch
              </h4>

              <div className="flex flex-col gap-4 text-[0.9rem] text-white/60 sm:gap-5 sm:text-base">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-white">Email</p>

                  <Link
                    href="mailto:lbanksluxuryhairs@gmail.com"
                    className="break-all transition hover:text-white"
                  >
                    lbanksluxuryhairs@gmail.com
                  </Link>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-white">WhatsApp</p>

                  <Link
                    href="https://wa.me/2348105001284"
                    className="transition hover:text-white"
                  >
                    Chat with us
                  </Link>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-white">Hours</p>

                  <p>Mon – Sat | 9 AM – 6 PM</p>
                </div>
              </div>
            </div>

            {/* Visit Us */}
            <div className="flex flex-col gap-4 border-dashed border-pink-500/40 sm:gap-5 lg:border-l lg:px-10">
              <h4 className="text-[1.05rem] font-medium text-white sm:text-[1.2rem]">
                Visit Us
              </h4>

              <div className="flex flex-col gap-2 text-[0.9rem] text-white/60 sm:text-base">
                <p className="text-sm font-medium text-white">Address</p>

                <p className="max-w-xs leading-relaxed">
                  33a Sedona mall, opp Monty suites, Adebayo Doherty street,
                  Lekki Phase 1
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-dashed border-pink-500/40 sm:mt-14 md:mt-16" />

          <div className="flex flex-col gap-4 pt-6 text-sm text-white/50 sm:pt-8 md:flex-row md:items-center md:justify-between md:gap-6 md:pt-10">
            <p>© 2026 LoisBanks Beauty. All rights reserved.</p>

            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Link
                href="/refund-policy"
                className="transition hover:text-white"
              >
                Refund Policy
              </Link>

              <Link
                href="/shipping-policy"
                className="transition hover:text-white"
              >
                Shipping Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;