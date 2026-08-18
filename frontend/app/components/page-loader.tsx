// components/page-loader.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#fafafa]">
      {/* Soft brand glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FD3F92]/10 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-16 w-16 overflow-hidden rounded-full"
        >
          <Image
            src="/small-logo.jpeg"
            alt="LoisBanks Beauty"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        {/* Brand name */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-black/50"
        >
          LoisBanks Beauty
        </motion.p>

        {/* Elegant line loader */}
        <div className="relative h-[2px] w-28 overflow-hidden rounded-full bg-black/5">
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-[#FD3F92]"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              repeat: Infinity,
              duration: 1.1,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
}