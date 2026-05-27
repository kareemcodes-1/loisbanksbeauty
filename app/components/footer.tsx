"use client";

import Link from "next/link";
import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="section-spacing w-full overflow-hidden mt-24 sm:mt-32"
      style={{
        background:
          "radial-gradient(circle at bottom, rgba(249,115,22,0.18), #0d0d0d 60%)",
      }}
    >
      {/* ── Main Grid ── */}
      <div
        className="
          w-full
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-10 lg:gap-[4rem]
          px-5 sm:px-8 md:px-14
          py-12 sm:py-14
          text-sm text-white/55
        "
      >
        {/* Col 1 */}
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="logo text-[1.35rem] sm:text-[1.5rem] font-semibold text-white"
          >
            sitesbykareem
          </Link>

          <p className="text-[1rem] sm:text-[1.1rem] leading-[1.8] text-white/70 max-w-[320px]">
            Premium website development for high-end service businesses.
            Strategy. Design. Conversion.
          </p>

          {/* Socials */}
          <div className="flex items-center flex-wrap gap-3">
            {[
              {
                icon: FaInstagram,
                href: "https://instagram.com/code.bykareem",
              },
              {
                icon: FaFacebook,
                href: "https://facebook.com",
              },
              {
                icon: FaTwitter,
                href: "https://twitter.com",
              },
              {
                icon: FaLinkedin,
                href: "https://linkedin.com",
              },
            ].map((social, i) => {
              const Icon = social.icon;

              return (
                <Link
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-11 h-11 sm:w-12 sm:h-12
                    bg-[#1a1a1a]
                    border border-white/10
                    rounded-xl
                    flex items-center justify-center
                    transition-all duration-300
                    hover:border-orange-400/30
                    hover:text-orange-400
                  "
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Col 2 */}
        <div className="flex flex-col gap-5">
          <h3 className="!text-[1rem] sm:!text-[1.1rem] text-white uppercase tracking-wide">
            Navigation
          </h3>

          <div className="flex flex-col gap-3">
            {[
              { title: "Home", href: "/" },
              { title: "Work", href: "/works" },
              { title: "About", href: "/about" },
              { title: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="
                  hover:text-orange-400
                  text-[1rem] sm:text-[1.05rem]
                  transition-colors
                  w-fit
                "
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Col 3 */}
        <div className="flex flex-col gap-5">
          <h3 className="!text-[1rem] sm:!text-[1.1rem] text-white uppercase tracking-wide">
            Contact
          </h3>

          <div className="flex flex-col gap-3">
            {[
              {
                title: "+2349016990307",
                href: "tel:+2349016990307",
              },
              {
                title: "realkareembrai222@gmail.com",
                href: "mailto:realkareembrai222@gmail.com",
              },
              {
                title: "WhatsApp",
                href: "https://wa.link/11epdm",
              },
            ].map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="
                  hover:text-orange-400
                  text-[1rem] sm:text-[1.05rem]
                  transition-colors
                  w-fit
                  break-all sm:break-normal
                "
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Col 4 */}
        <div className="flex flex-col gap-5">
          <h3 className="!text-[1rem] sm:!text-[1.1rem] text-white uppercase tracking-wide">
            Get Started
          </h3>

          <div className="flex flex-col gap-4 w-full sm:max-w-[260px]">
            <Link
              href="https://wa.link/11epdm"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-center"
            >
              Let's Talk
            </Link>

            <Link
              href="/works"
              className="btn-secondary w-full text-center"
            >
              See My Works
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="
          border-t border-white/10
          mt-6 sm:mt-10
          px-5 sm:px-8 md:px-14
          py-6
          flex flex-col lg:flex-row
          items-center justify-between
          gap-5
          text-white/45
          text-sm
        "
      >
        <p className="text-[0.95rem] sm:text-[1rem] text-center lg:text-left">
          © 2026 sitesbykareem. All rights reserved.
        </p>

        <div className="flex items-center flex-wrap justify-center gap-5">
          <Link
            href="/privacy-policy"
            className="hover:text-orange-400 transition-colors text-[0.95rem] sm:text-[1rem]"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="hover:text-orange-400 transition-colors text-[0.95rem] sm:text-[1rem]"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;