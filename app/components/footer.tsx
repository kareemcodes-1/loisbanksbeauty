"use client";

import { CarTaxiFront } from "lucide-react";
import Link from "next/link";
import React from "react";
import Marquee from "react-fast-marquee";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="section-spacing w-full overflow-hidden mt-24 sm:mt-32"
      style={{
        background:
          "radial-gradient(circle at bottom, rgba(249,115,22,0.18), #0d0d0d 60%)",
      }}
    >
      {/* ── 4-column link row ── */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-[4rem] px-4 sm:px-8 md:px-14 py-10 sm:py-14 text-sm text-white/55">

        {/* Col 1 — Contact */}
        <div className="flex flex-col gap-[1rem]">
          <Link href="/" className="logo text-[1.5rem] font-semibold text-white">
            sitesbykareem
          </Link>

          <div className="flex flex-col gap-[.7rem]">
            <p className="text-[1.2rem]">Premium website development for high-end service businesses. Strategy. Design. Conversion.</p>
          </div>

          <div className="flex items-center gap-[1rem]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-[#7c5cfc]/10 transition-colors duration-300">
              <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 hover:text-orange-400" />
            </div>

            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-[#7c5cfc]/10 transition-colors duration-300">
              <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 hover:text-orange-400" />
            </div>

            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-[#7c5cfc]/10 transition-colors duration-300">
              <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5 hover:text-orange-400" />
            </div>

            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-[#7c5cfc]/10 transition-colors duration-300">
              <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5 hover:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Col 2 — Nav */}
        <div className="flex flex-col gap-[1rem]">
          <h3 className="!text-[1.2rem] text-white uppercase">Navigation</h3>
          <div className="flex flex-col gap-2">
            {[
              { title: "Home", href: "/" },
              { title: "Work", href: "/works" },
              { title: "About", href: "/about" },
              { title: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-orange-400 text-[1.1rem] transition-colors w-fit"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Col 3 — Socials */}
        {/* <div className="flex flex-col gap-2">
          {[
            { title: "Instagram", href: "https://www.instagram.com/code.bykareem" },
            { title: "Tiktok", href: "https://www.tiktok.com/@codebykareem" },
            { title: "Linkedin", href: "https://linkedin.com" },
          ].map((s) => (
            <Link
              key={s.title}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition-colors w-fit capitalize"
            >
              {s.title}
            </Link>
          ))}
        </div> */}

        <div className="flex flex-col gap-[1rem]">
          <h3 className="!text-[1.2rem] text-white uppercase">Contact</h3>
          <div className="flex flex-col gap-2">
            {[
              { title: "+2349016990307", href: "tel:+2349016990307" },
              { title: "realkareembrai222@gmail.com", href: "mailto:realkareembrai222@gmail.com" },
              { title: "Whatsapp", href: "https://wa.link/11epdm" },
            ].map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-orange-400 text-[1.1rem] transition-colors w-fit"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Col 4 — Legal */}
        <div className="flex flex-col gap-[1rem]">
          <h3 className="!text-[1.2rem] text-white uppercase">Get Started</h3>
          <div className="flex flex-col gap-[1rem]  !w-full">
            <Link
              href="https://wa.link/11epdm"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Let's Talk
            </Link>

            <Link href="/works" className="btn-secondary">
              See My Works
            </Link>
          </div>
        </div>
      </div>

      {/* ── Giant full-width name ── */}
      {/* <div className="w-full overflow-hidden select-none mt-10 sm:mt-14">
        <p
          className="
            font-black
            text-[18vw] md:text-[20vw]
        
            !leading-[1]
            uppercase
            text-white/[0.06]
            whitespace-nowrap
          "
        >
        </p>
      </div> */}

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-10 sm:mt-14 px-4 sm:px-8 md:px-14 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/45 text-sm">
        <p className="text-[1.1rem]">© 2026 sitesbykareem. All rights reserved.</p>

        <div className="flex items-center gap-6">
          <Link
            href="/privacy-policy"
            className="hover:text-orange-400 transition-colors text-[1.1rem]"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="hover:text-orange-400 transition-colors text-[1.1rem]"
          >
            Terms of Service
          </Link>
        </div>
      </div>


    </footer>
  );
};

export default Footer;