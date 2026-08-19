// components/chat/chat-widget.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MessageCircle, X } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { useCartStore } from "@/store/cart";
import ChatMessages from "./chat-messages";
import ChatInput from "./chat-input";
import { usePathname } from "next/navigation";

type ChatProduct = {
    id: string;
    name: string;
    slug: string;
    price: number;
    image?: string | null;
    inStock?: boolean;
    sizes?: string[];
    media?: any[];
};

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    products?: ChatProduct[];
};

const SUGGESTIONS = [
    "What products are available?",
    "Any discounts right now?",
    "How long is delivery?",
    "Show my orders",
];

export default function ChatWidget() {
    const { data: session, status } = useSession();
    const addItem = useCartStore((s) => s.addItem);
    const pathname = usePathname();

    const userName = session?.user?.name?.trim() || null;
    const displayName = userName?.split(" ")[0] || "Unknown";

    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
    setOpen(false);
  }, [pathname]);

    // Wait for session, then set welcome or load history
    useEffect(() => {
        if (status === "loading") return;

        const init = async () => {
            // Logged in → try history first
            if (status === "authenticated" && session?.user?.id) {
                try {
                    const res = await fetch("/api/chat/history");
                    const data = await res.json();

                    if (data.messages?.length) {
                        setMessages(data.messages);
                    } else {
                        setMessages([
                            {
                                id: "welcome",
                                role: "assistant",
                                content: `Hi ${displayName} 👋 Welcome back to LoisBanks Beauty. I’m here to help you find what you need, discover something new, and make shopping a little easier. ✨`,
                            },
                        ]);
                    }
                } catch (error) {
                    console.error("Failed to load chat history:", error);
                    setMessages([
                        {
                            id: "welcome",
                            role: "assistant",
                            content: `Hi ${displayName} 👋 Welcome back to LoisBanks Beauty. I’m here to help you find what you need, discover something new, and make shopping a little easier. ✨`,
                        },
                    ]);
                } finally {
                    setReady(true);
                }
                return;
            }

            // Guest
            setMessages([
                {
                    id: "welcome",
                    role: "assistant",
                    content: `Hi 👋 Welcome to LoisBanks Beauty. I’m here to help you find what you need, discover something new, and make shopping a little easier. ✨`,
                },
            ]);
            setReady(true);
        };

        init();
    }, [status, session?.user?.id, displayName]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: text.trim(),
        };

        const nextMessages = [...messages, userMessage];
        setMessages(nextMessages);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: nextMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const data = await res.json();

            // Handle add-to-cart actions
            if (Array.isArray(data.actions)) {
                for (const action of data.actions) {
                    if (action?.type === "add_to_cart" && action.product) {
                        const product = action.product;

                        addItem(
                            {
                                _id: product.productId,
                                name: product.name,
                                slug: product.slug,
                                price: product.price,
                                media: product.media || [],
                            } as any,
                            1,
                            product.size ?? null
                        );
                    }
                }
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: data.message || "Sorry, I couldn’t respond right now.",
                    products: data.products || [],
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: "Something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating button */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="fixed bottom-6 right-6 z-[400] flex h-14 w-14 items-center justify-center rounded-full bg-[#FD3F92] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                aria-label="Open chat"
            >
                {open ? <X size={22} /> : <MessageCircle size={22} />}
            </button>

            {/* Chat panel */}
            {open && (
                <div className="fixed bottom-24 right-6 z-[400] flex h-[min(34rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-black/5 bg-[#FD3F92] px-4 py-3 text-white">
                        <div className="flex items-center gap-3">
                            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white/15">
                                <Image
                                    src="/small-logo.jpeg"
                                    alt="LoisBanks Beauty"
                                    fill
                                    quality={75}
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium">LoisBanks Beauty</p>
                                <p className="text-xs text-white/80">Sales assistant</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-full p-1 hover:bg-white/10"
                            aria-label="Close chat"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {!ready ? (
                        <div className="flex flex-1 items-center justify-center text-sm text-black/40">
                            Loading...
                        </div>
                    ) : (
                        <>
                            <ChatMessages
                                messages={messages}
                                loading={loading}
                                userName={displayName}
                            />

                            {/* Suggestion chips */}
                            {messages.length <= 2 && !loading && (
                                <div className="flex flex-wrap gap-2 border-t border-black/5 px-3 py-2">
                                    {SUGGESTIONS.map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() => sendMessage(suggestion)}
                                            className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1.5 text-[11px] text-black/70 transition hover:border-[#FD3F92]/30 hover:bg-[#FD3F92]/5 hover:text-[#FD3F92]"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <ChatInput onSend={sendMessage} disabled={loading} />
                        </>
                    )}
                </div>
            )}
        </>
    );
}