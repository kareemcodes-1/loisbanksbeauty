"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  X,
  User,
  Package,
  Ticket,
  Star,
  LogOut,
  LocateFixed,
  Store,
  Info,
  Mail,
  ChevronDown,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

import { CURRENCIES, flagUrl } from "@/lib/currency";
import { useCurrencyStore } from "@/store/currency";

interface MenuModalProps {
  openMenuModal: boolean;
  setOpenMenuModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const links = [
  { label: "Shop", href: "/shop", icon: Store },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
];

const MenuModal = ({ openMenuModal, setOpenMenuModal }: MenuModalProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const currency = useCurrencyStore((s) => s.currency);
  const isAuto = useCurrencyStore((s) => s.isAuto);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  const setAutoLocation = useCurrencyStore((s) => s.setAutoLocation);
  const active = CURRENCIES.find((c) => c.code === currency);

  const [currencyOpen, setCurrencyOpen] = useState(false);

  const go = (href: string) => {
    setOpenMenuModal(false);
    router.push(href);
  };

  return (
    <Sheet open={openMenuModal} onOpenChange={setOpenMenuModal}>
      <SheetContent
        side="right"
        className="z-[350] flex h-full w-full max-w-full flex-col gap-0 border-l border-black/10 bg-white p-0 sm:max-w-[24rem] [&>button]:hidden"
      >
        {/* Header */}
        <SheetHeader className="flex shrink-0 flex-row items-center justify-between space-y-0 border-b border-dashed border-[#FD3F92]/40 px-5 py-4 sm:px-6">
          <SheetTitle className="heading-3 text-left">Menu</SheetTitle>

          <SheetClose asChild>
            <button
              type="button"
              aria-label="Close menu"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-dashed border-[#FD3F92]/40 transition-colors duration-300 hover:bg-[#FD3F92] hover:text-white sm:h-10 sm:w-10"
            >
              <X size={18} strokeWidth={1.5} className="sm:size-5" />
            </button>
          </SheetClose>
        </SheetHeader>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {/* Nav links */}
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => go(link.href)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5"
              >
                <link.icon size={16} strokeWidth={1.8} className="text-black/50" />
                {link.label}
              </button>
            ))}
          </div>

          {/* Currency */}
          <div className="mt-2 border-t border-black/10 pt-2">
            <button
              type="button"
              onClick={() => setCurrencyOpen((prev) => !prev)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5"
            >
              {isAuto ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/5">
                  <LocateFixed size={13} strokeWidth={2} className="text-black/60" />
                </span>
              ) : (
                <Image
                  src={flagUrl(active?.countryCode ?? "us", 40)}
                  alt={active?.code ?? "USD"}
                  width={20}
                  height={14}
                  className="h-[14px] w-5 shrink-0 rounded-[2px] object-cover shadow-sm"
                />
              )}

              <span className="flex-1">
                Currency
                <span className="ml-2 text-black/40">
                  {isAuto ? "Auto" : currency}
                </span>
              </span>

              <ChevronDown
                size={16}
                strokeWidth={1.8}
                className={`shrink-0 text-black/40 transition-transform duration-200 ${
                  currencyOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {currencyOpen && (
              <div className="mt-1 flex flex-col gap-1 pl-2">
                <button
                  type="button"
                  onClick={() => void setAutoLocation()}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    isAuto ? "bg-[#FD3F92]/10 text-[#FD3F92]" : "hover:bg-black/5"
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/5">
                    <LocateFixed size={13} strokeWidth={2} className="text-black/60" />
                  </span>
                  Auto location
                </button>

                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.code)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      !isAuto && currency === c.code
                        ? "bg-[#FD3F92]/10 text-[#FD3F92]"
                        : "hover:bg-black/5"
                    }`}
                  >
                    <Image
                      src={flagUrl(c.countryCode, 40)}
                      alt={c.code}
                      width={20}
                      height={14}
                      className="h-[14px] w-5 shrink-0 rounded-[2px] object-cover shadow-sm"
                    />
                    <span className="flex-1 truncate">{c.label}</span>
                    <span className="shrink-0 text-[0.7rem] uppercase tracking-wide text-black/40">
                      {c.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account */}
          <div className="mt-2 border-t border-black/10 pt-2">
            {session?.user ? (
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => go("/profile")}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5"
                >
                  <User size={16} strokeWidth={1.8} className="text-black/50" />
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => go("/orders")}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5"
                >
                  <Package size={16} strokeWidth={1.8} className="text-black/50" />
                  Orders
                </button>
                <button
                  type="button"
                  onClick={() => go("/coupons")}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5"
                >
                  <Ticket size={16} strokeWidth={1.8} className="text-black/50" />
                  Coupons
                </button>
                <button
                  type="button"
                  onClick={() => go("/reviews/pending")}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5"
                >
                  <Star size={16} strokeWidth={1.8} className="text-black/50" />
                  Pending Reviews
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpenMenuModal(false);
                    signOut();
                  }}
                  className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut size={16} strokeWidth={1.8} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => go("/login")}
                  className="btn-primary w-full"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuModal;