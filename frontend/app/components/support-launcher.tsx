"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import ChatWidget from "@/app/components/chat/chat-widget"; // or wherever it lives

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348105001284";
const DEFAULT_MESSAGE = "Hi! I’m interested in your products and would like to place an order.";

export default function SupportLauncher() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    DEFAULT_MESSAGE
  )}`;

  return (
    <>
      {/* Expanded options */}
      {menuOpen && !chatOpen && (
        <div className="fixed bottom-24 right-5 z-[280] flex flex-col items-end gap-3 sm:bottom-28 sm:right-6">
          {/* AI Chat */}
          <button
            type="button"
            onClick={() => {
              setChatOpen(true);
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 rounded-full bg-white py-2 pl-4 pr-2 shadow-lg border border-black/10 transition hover:scale-[1.02]"
          >
            <span className="text-sm font-medium text-black">Chat with us</span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FD3F92] text-white">
              <MessageCircle size={20} />
            </span>
          </button>

          {/* WhatsApp */}
          <Link
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-full bg-white py-2 pl-4 pr-2 shadow-lg border border-black/10 transition hover:scale-[1.02]"
          >
            <span className="text-sm font-medium text-black">WhatsApp</span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white">
              <FaWhatsapp size={22} />
            </span>
          </Link>
        </div>
      )}

      {/* Main launcher button */}
      {!chatOpen && (
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close support menu" : "Open support menu"}
          className="fixed bottom-5 right-5 z-[280] flex h-14 w-14 items-center justify-center rounded-full bg-[#FD3F92] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
        >
          {menuOpen ? <X size={22} /> : <MessageCircle size={22} />}
        </button>
      )}

      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
}