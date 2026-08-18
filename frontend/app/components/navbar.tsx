"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import CartModal from "./modals/cart-modal";
import SearchModal from "./modals/search-modal";
import MenuModal from "./modals/menu-modal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import {
  User,
  Menu,
  Search,
  ShoppingCart,
  Package,
  Ticket,
  Star,
  LogOut,
  ChevronDown,
  LocateFixed,
} from "lucide-react";

import { CURRENCIES, flagUrl, type CurrencyCode } from "@/lib/currency";
import { useCurrencyStore } from "@/store/currency";


const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  const [openCartModal, setOpenCartModal] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openMenuModal, setOpenMenuModal] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const currency = useCurrencyStore((s) => s.currency);
const isAuto = useCurrencyStore((s) => s.isAuto);
const setCurrency = useCurrencyStore((s) => s.setCurrency);
const setAutoLocation = useCurrencyStore((s) => s.setAutoLocation);
const active = CURRENCIES.find((c) => c.code === currency);

useEffect(() => {
  const hasPreference =
    typeof window !== "undefined" &&
    localStorage.getItem("currency-preference");

  if (!hasPreference) {
    void setAutoLocation();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMenuModal ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [openMenuModal]);

  const links = [
    {
      label: "Shop",
      href: "/shop",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ];

  return (
    <>
      <header
        className={`fixed left-4 right-4 top-4 z-[300] transition-all duration-500 lg:left-6 lg:right-6 ${
          scrolled ? "translate-y-0" : ""
        }`}
      >
        <nav className="flex h-[4.4rem] items-center justify-between rounded-full border border-black/10 bg-white px-3 shadow-sm backdrop-blur-md sm:h-[4.7rem] sm:px-4 lg:h-[5rem] lg:px-6">
          <Link
            href="/"
            className="relative block h-[34px] w-[105px] sm:h-[38px] sm:w-[115px] lg:h-[50px] lg:w-[150px]"
          >
            <Image
              src="/logo.jpeg"
              alt="Logo"
              fill
              priority
              quality={100}
              className="object-cover"
            />
          </Link>

          {/* Navigation Links */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.85rem] font-medium uppercase tracking-wide text-black transition-colors duration-300 hover:text-[#FD3F92]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Currency */}
{/* Currency */}
<div className="hidden lg:block">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        className="group flex h-11 items-center gap-2 rounded-full border border-black/15 bg-transparent px-3 transition-all duration-300 hover:border-[#FD3F92] hover:bg-[#FD3F92]/10"
      >
        {isAuto ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/5">
            <LocateFixed size={13} strokeWidth={2} className="text-black/60" />
          </span>
        ) : (
          <Image
            src={flagUrl(active?.countryCode ?? "us", 40)}
            alt={active?.code ?? "USD"}
            quality={75}
            width={20}
            height={14}
            className="h-[14px] w-5 rounded-[2px] object-cover shadow-sm"
          />
        )}

        <span className="text-[0.75rem] font-medium uppercase tracking-wide text-black">
          {isAuto ? "AUTO" : currency}
        </span>

        <ChevronDown
          size={14}
          strokeWidth={1.8}
          className="text-black/40 transition-colors group-hover:text-[#FD3F92]"
        />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      sideOffset={16}
      className="w-56 rounded-2xl border border-black/10 p-1.5 shadow-lg"
    >
      <DropdownMenuItem
        onClick={() => void setAutoLocation()}
        className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-[0.875rem] font-medium"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/5">
          <LocateFixed size={13} strokeWidth={2} className="text-black/60" />
        </span>
        Auto location
      </DropdownMenuItem>

      <DropdownMenuSeparator className="my-1.5" />

      {CURRENCIES.map((c) => (
        <DropdownMenuItem
          key={c.code}
          onClick={() => setCurrency(c.code)}
          className={`cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-[0.875rem] font-medium ${
            !isAuto && currency === c.code
              ? "bg-[#FD3F92]/10 text-[#FD3F92]"
              : ""
          }`}
        >
          <img
            src={flagUrl(c.countryCode, 40)}
            alt={c.code}
            width={20}
            height={14}
            className="h-[14px] w-5 shrink-0 rounded-[2px] object-cover shadow-sm"
          />
          <span className="flex-1">{c.label}</span>
          <span className="text-[0.7rem] uppercase tracking-wide text-black/40">
            {c.code}
          </span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
</div>

            {/* Search */}
            <button
              type="button"
              onClick={() => setOpenSearchModal(true)}
              aria-label="Search"
              className="group hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-transparent transition-all duration-300 hover:border-[#FD3F92] hover:bg-[#FD3F92]/10 lg:flex"
            >
              <Search
                size={20}
                strokeWidth={1.8}
                className="transition-colors duration-300 group-hover:text-[#FD3F92]"
              />
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setOpenCartModal(true)}
              aria-label="Open cart"
              className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-transparent transition-all duration-300 hover:border-[#FD3F92] hover:bg-[#FD3F92]/10 sm:h-11 sm:w-11"
            >
              <ShoppingCart
                size={19}
                strokeWidth={1.8}
                className="transition-colors duration-300 group-hover:text-[#FD3F92] sm:hidden"
              />
              <ShoppingCart
                size={20}
                strokeWidth={1.8}
                className="hidden transition-colors duration-300 group-hover:text-[#FD3F92] sm:block"
              />

              {/* Cart Count */}
              {/* We can connect this to Zustand next */}
            </button>

            {/* Profile */}
            {session?.user ? (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        aria-label="Open profile menu"
        className="group hidden h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-transparent transition-all duration-300 hover:border-[#FD3F92] hover:bg-[#FD3F92]/10 lg:flex"
      >
        <User
          size={20}
          strokeWidth={1.8}
          className="transition-colors duration-300 group-hover:text-[#FD3F92]"
        />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="center"
      sideOffset={20}
      className="w-56 rounded-xl p-1.5"
    >
      <DropdownMenuItem
        onClick={() => router.push("/profile")}
        className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-[0.9rem] font-medium"
      >
        <User size={16} strokeWidth={1.8} className="text-black/50" />
        Profile
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => router.push("/orders")}
        className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-[0.9rem] font-medium"
      >
        <Package size={16} strokeWidth={1.8} className="text-black/50" />
        Orders
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => router.push("/reviews/pending")}
        className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-[0.9rem] font-medium"
      >
        <Star size={16} strokeWidth={1.8} className="text-black/50" />
        Pending Reviews
      </DropdownMenuItem>

      <DropdownMenuSeparator className="my-1.5" />

      <DropdownMenuItem
        onClick={() => signOut()}
        className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-[0.9rem] font-medium text-red-600 focus:text-red-600"
      >
        <LogOut size={16} strokeWidth={1.8} />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
) : (
           <button
                type="button"
                onClick={() => router.push("/login")}
                aria-label="Login"
                className="group hidden h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-transparent transition-all duration-300 hover:border-[#FD3F92] hover:bg-[#FD3F92]/10 lg:flex"
              >
                <User
                  size={20}
                  strokeWidth={1.8}
                  className="transition-colors duration-300 group-hover:text-[#FD3F92]"
                />
              </button>
            )}

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => setOpenMenuModal((prev) => !prev)}
              aria-label="Toggle menu"
              className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-transparent transition-all duration-300 hover:border-[#FD3F92] hover:bg-[#FD3F92]/10 sm:h-11 sm:w-11 lg:hidden"
            >
              <Menu
                size={20}
                strokeWidth={1.8}
                className="transition-colors duration-300 group-hover:text-[#FD3F92] sm:hidden"
              />
              <Menu
                size={21}
                strokeWidth={1.8}
                className="hidden transition-colors duration-300 group-hover:text-[#FD3F92] sm:block"
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Cart Modal */}
      {openCartModal && (
        <CartModal
          openCartModal={openCartModal}
          setOpenCartModal={setOpenCartModal}
        />
      )}

      {openSearchModal && (
        <SearchModal
          openSearchModal={openSearchModal}
          setOpenSearchModal={setOpenSearchModal}
        />
      )}

       {openMenuModal && (
        <MenuModal
          openMenuModal={openMenuModal}
          setOpenMenuModal={setOpenMenuModal}
        />
      )}
    </>
  );
};

export default Navbar;