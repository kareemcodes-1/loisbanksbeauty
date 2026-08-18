// components/chat/chat-input.tsx
"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Props = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-black/5 p-3"
    >
      <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask about products, stock, shipping..."
          disabled={disabled}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-black/30"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FD3F92] text-white transition disabled:opacity-40"
          aria-label="Send message"
        >
          <Send size={14} />
        </button>
      </div>
    </form>
  );
}