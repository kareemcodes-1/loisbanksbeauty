// components/chat/chat-messages.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import ChatProductCard from "./chat-product-card";

type ChatProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
  inStock?: boolean;
  sizes?: string[];
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: ChatProduct[];
};

type Props = {
  messages: Message[];
  loading: boolean;
  userName: string;
};

export default function ChatMessages({
  messages,
  loading,
  userName,
}: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const userAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    userName || "Unknown"
  )}&backgroundColor=fd3f92&textColor=ffffff`;

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
      {messages.map((message) => {
        const isUser = message.role === "user";

        return (
          <div key={message.id} className="space-y-2">
            <div
              className={`flex items-end gap-2.5 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-black/5 bg-white">
                  <Image
                    src="/small-logo.jpeg"
                    alt="LoisBanks"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "bg-[#FD3F92] text-white"
                    : "bg-neutral-100 text-black"
                }`}
              >
                {isUser ? (
                  message.content
                ) : (
                  <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-p:leading-relaxed prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-strong:font-semibold prose-strong:text-black prose-a:text-[#FD3F92] prose-headings:my-2 prose-headings:text-black">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Product cards under assistant message */}
            {!isUser && message.products && message.products.length > 0 && (
              <div className="ml-10 flex gap-2.5 overflow-x-auto pb-1 pr-2">
                {message.products.map((product) => (
                  <ChatProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {loading && (
        <div className="flex items-end gap-2.5">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-black/5 bg-white">
            <Image
              src="/small-logo.jpeg"
              alt="LoisBanks"
              fill
              className="object-cover"
            />
          </div>
          <div className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-black/40">
            Typing...
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}