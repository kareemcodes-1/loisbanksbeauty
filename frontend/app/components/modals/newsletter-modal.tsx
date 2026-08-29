"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import gsap from "gsap";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "lb-newsletter-dismissed";

export default function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // ignore
    }

    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);


  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "popup" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
      }

      toast.success(data.message || "You're on the list! Watch your inbox.");
      setEmail("");
      dismiss();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) dismiss();
        else setOpen(true);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="top-[60%] gap-0 overflow-hidden border-none p-0 sm:max-w-[42rem] md:max-w-[52rem] gap-0 overflow-hidden border-none p-0
    sm:max-w-[42rem] md:max-w-[52rem]
    data-[state=open]:animate-in data-[state=open]:fade-in-0
    data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4
    data-[state=closed]:animate-out data-[state=closed]:fade-out-0
    data-[state=closed]:zoom-out-95
    duration-300"
      >
        <DialogTitle className="sr-only">Subscribe to newsletter</DialogTitle>

        <div
          className="relative flex flex-col md:flex-row"
        >
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60 md:bg-white/20 md:hover:bg-white/30"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.75} />
          </button>

          <div className="relative hidden min-h-[24rem] w-full overflow-hidden md:block md:w-1/2">
            <Image
              src="/login.jpg"
              alt="LoisBanks Beauty"
              fill
              sizes="(max-width: 768px) 0px, 50vw"
              className="object-cover object-center"
            />
          </div>

          <div className="flex w-full flex-col justify-center gap-5 bg-[#FD3F92] px-5 py-10 text-white sm:gap-6 sm:px-8 sm:py-12 md:w-1/2">
            <h2 className="heading-2">Don&apos;t Miss What&apos;s Next</h2>

            <p className="max-w-[22rem] text-[0.9rem] leading-relaxed text-white/90 sm:text-[0.95rem]">
              Sign up for early access to new drops, restocks, and
              subscriber-only discounts.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-[22rem] flex-col gap-4"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 rounded-full border-white/30 bg-white/10 px-5 text-[0.9rem] text-white placeholder:text-white/60 focus-visible:border-white focus-visible:ring-white/30"
              />

              <div className="flex w-full max-w-[22rem] flex-col gap-3 sm:flex-row sm:items-center">
  <Button
    type="submit"
    disabled={loading}
    className="h-12 w-full flex-1 cursor-pointer rounded-full bg-white px-8 py-3 text-[0.8rem] font-medium uppercase tracking-wide text-black hover:bg-black hover:text-white disabled:opacity-60 sm:px-6"
  >
    {loading ? "Subscribing..." : "Subscribe"}
  </Button>

  <Button
    type="button"
    variant="outline"
    onClick={dismiss}
    className="h-12 w-full flex-1 cursor-pointer rounded-full border-white/50 bg-transparent px-8 py-3 text-[0.8rem] font-medium uppercase tracking-wide text-white hover:bg-white/15 hover:text-white sm:px-6"
  >
    No thanks
  </Button>
</div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}