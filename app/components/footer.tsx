'use client';

import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  useEffect(() => {
    gsap.set(".footer", { yPercent: -50 });

    const uncover = gsap.timeline({ paused: true });
    uncover.to(".footer", { yPercent: 0, ease: "none" });

    ScrollTrigger.create({
      trigger: ".scroll-trigger",
      start: "bottom bottom",
      end: "+=50%",
      animation: uncover,
      scrub: true,
    });
  }, []);

  return (
    <>
      <div className="section scroll-trigger"></div>

      <div className="overflow-hidden relative bg-black w-full">
        <footer className="footer bg-black text-white px-5 py-20 md:py-28 sm:px-8 md:px-[3rem] mt-10 sm:mt-12 md:mt-[5rem]">

          {/* Dashed top border */}
          <div className="border-t border-dashed border-pink-500/40 mb-16" />

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4">

            {/* Col 1 — Brand */}
            <div className="flex flex-col gap-6 md:pr-10">
              <Link href="/">
                <img
                  src="/favicon.jpeg"
                  className="w-[4rem] h-[4rem] rounded-full object-cover"
                  alt=""
                />
              </Link>

              <p className="text-white/60 leading-relaxed max-w-xs">
                Premium luxury hair extensions crafted for confidence, beauty and timeless elegance.
              </p>

              <div className="flex gap-3 mt-2">
                <Link href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500 transition">
                  <FaFacebook size={16} />
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500 transition">
                  <FaInstagram size={16} />
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500 transition">
                  <FaTwitter size={16} />
                </Link>
              </div>
            </div>

            {/* Col 2 — Quick Links */}
            <div className="flex flex-col gap-5 md:px-10 md:border-l border-dashed border-pink-500/40 mt-10 md:mt-0">
              <h4 className="text-white font-medium tracking-widest text-[1rem] uppercase">Quick Links</h4>
              <div className="flex flex-col gap-4 text-white/60">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <Link href="/about" className="hover:text-white transition">About Us</Link>
                <Link href="/shop" className="hover:text-white transition">Shop</Link>
                <Link href="/contact" className="hover:text-white transition">Contact Us</Link>
              </div>
            </div>

            {/* Col 3 — Get in Touch */}
            <div className="flex flex-col gap-5 md:px-10 md:border-l border-dashed border-pink-500/40 mt-10 md:mt-0">
              <h4 className="text-white font-medium tracking-widest text-[1rem] uppercase">Get in Touch</h4>
              <div className="flex flex-col gap-5 text-white/60">
                <div className="flex flex-col gap-1">
                  <p className="text-white font-medium text-sm">Email</p>
                  <Link href="mailto:hello@loisbanksbeauty.com" className="hover:text-white transition">
                    hello@loisbanksbeauty.com
                  </Link>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-white font-medium text-sm">WhatsApp</p>
                  <Link href="#" className="hover:text-white transition">Chat with us</Link>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-white font-medium text-sm">Hours</p>
                  <p>Mon – Fri | 9 AM – 6 PM</p>
                </div>
              </div>
            </div>

            {/* Col 4 — Visit Us */}
            <div className="flex flex-col gap-5 md:px-10 md:border-l border-dashed border-pink-500/40 mt-10 md:mt-0">
              <h4 className="text-white font-medium tracking-widest text-[1rem] uppercase">Visit Us</h4>
              <div className="flex flex-col gap-2 text-white/60">
                <p className="text-white font-medium text-sm">Address</p>
                <p className="leading-relaxed">
                  123 Hair Street,<br />
                  Lagos, Nigeria
                </p>
              </div>
            </div>

          </div>

          {/* Dashed bottom border */}
          <div className="border-t border-dashed border-pink-500/40 mt-16" />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between gap-6 pt-10 text-white/50 text-sm">
            <p>© 2026 Loisbanks Beauty. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            </div>
          </div>

        </footer>
      </div>
    </>
  );
};

export default Footer;