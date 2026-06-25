'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { User, Menu, Search, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openCartModal, setOpenCartModal] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openMenuModal, setOpenMenuModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMenuModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [openMenuModal]);

  const links = [
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
  className={`fixed top-4 left-4 right-4 lg:left-6 lg:right-6 z-[300] transition-all duration-500 ${
    scrolled ? 'translate-y-0' : ''
  }`}
>
  <nav
    className={`relative flex items-center justify-between w-full bg-white rounded-full px-6 lg:px-8 py-4 border border-[#EDEAE6] shadow-sm`}
  >

          {/* Logo */}
        <Link href="/" className="relative block w-[120px] h-[40px] lg:w-[150px] lg:h-[50px]">
  <Image
    src="/logo.jpeg"
    alt="Logo"
    fill
    priority
    quality={100}
    className="object-cover"
  />
</Link>

          {/* Nav links — absolutely centered */}
          <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-[1rem] font-medium uppercase text-black hover:text-pink-400 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side — icons + pill CTA */}
          <div className="flex items-center gap-[1.5rem]">
            <button
              onClick={() => setOpenSearchModal(true)}
              className="hidden lg:block text-black hover:text-pink-400 transition cursor-pointer"
            >
              <Search strokeWidth={2} size={25} />
            </button>

            <button
              onClick={() => setOpenCartModal(true)}
              className="text-black hover:text-pink-400 transition cursor-pointer"
            >
              <ShoppingCart strokeWidth={2} size={25} />
            </button>

            <Link
              href="/profile"
              className="hidden lg:block text-black hover:text-pink-400 transition"
            >
              <User strokeWidth={2} size={25} />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpenMenuModal((prev) => !prev)}
              className="block lg:hidden text-black transition cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu strokeWidth={2} size={24} />
            </button>
          </div>

        </nav>
      </header>
    </>
  );
};

export default Navbar;