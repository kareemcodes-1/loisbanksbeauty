"use client";

import Link from "next/link";
import { useState } from "react";

type Hovered = number | "cta" | null;

export default function Navbar() {
  const [hovered, setHovered] = useState<Hovered>(null);
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/works", label: "Works" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <style>{`
        @keyframes linkFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .menu-link {
          opacity: 0;
          animation: linkFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <header className="fixed top-[2rem] md:top-[5rem] left-0 right-0 z-50 flex justify-center px-4 md:px-8">
        <nav
          className="w-full max-w-[700px] border border-[#ffffff1a]
                     bg-white/20 backdrop-blur-[8px] rounded-[2rem]
                     px-5 md:px-6 overflow-hidden
                     transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          {/* TOP ROW — always visible */}
          <div className="flex items-center justify-between py-[.8rem]">
            <Link href="/" className="logo text-[1.2rem] font-semibold text-white">
              sitesbykareem
            </Link>

            {/* DESKTOP LINKS */}
            <ul className="hidden md:flex items-center gap-8 list-none">
              {links.map((link, index) => {
                const isActive = hovered === index;
                const isDimmed = hovered !== null && hovered !== index;
                return (
                  <li
                    key={link.href}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <Link
                      href={link.href}
                      className={`text-[1rem] font-medium transition
                        ${isActive ? "text-white" : isDimmed ? "text-white/30" : "text-white"}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li
                onMouseEnter={() => setHovered("cta")}
                onMouseLeave={() => setHovered(null)}
              >
                <Link
                  href="https://wa.link/11epdm"
                  target="_blank"
                  className="text-[1rem] font-semibold px-4 py-2 rounded-full bg-white text-black"
                >
                  Start a Project
                </Link>
              </li>
            </ul>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="md:hidden text-white flex flex-col cursor-pointer justify-center gap-[5px] w-6 h-6"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className={`block w-5 h-[1.5px] bg-white rounded-full origin-center transition-all duration-300 ${open ? "rotate-45 translate-y-[3.5px]" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-white rounded-full origin-center transition-all duration-300 ${open ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
            </button>
          </div>

          {/* DROPDOWN — clipped by overflow-hidden on the nav */}
          <div
            className={`md:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${open ? "max-h-[300px] pb-4" : "max-h-0"}`}
          >
            <div className="flex flex-col border-t border-white/10 pt-3">
              {links.map((link, i) => (
                <div
                  key={link.href}
                  className={`menu-link border-b border-white/10 ${!open ? "animation: none" : ""}`}
                  style={{ animationDelay: `${0.06 + i * 0.06}s` }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-[1.4rem] font-semibold text-white tracking-tight hover:opacity-60 transition-opacity duration-150"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
              <div
                className="menu-link"
                style={{ animationDelay: `${0.06 + links.length * 0.06}s` }}
              >
                <Link
                  href="https://wa.link/11epdm"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block py-3 text-[1.4rem] font-semibold text-white tracking-tight hover:opacity-60 transition-opacity duration-150"
                >
                  Start a Project ↗
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}