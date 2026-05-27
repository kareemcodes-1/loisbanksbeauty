import type { Metadata } from "next";
import "./globals.css";

import { Geist } from "next/font/google";

import CTA from "./components/cta";
import Footer from "./components/footer";
import Navbar from "./components/navbar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SitesByKareem — High-Converting Websites",
  description:
    "I help businesses scale with high-converting websites built for performance, trust, and growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased bg-[#0c0909] text-white">
        <svg className="pointer-events-none absolute cursor-none">
          <filter id="grainy">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.5"
            />
            <feColorMatrix
              type="saturate"
              values="0"
            />
          </filter>
        </svg>

        <Navbar />
        {children}
        <CTA />
        <Footer />
      </body>
    </html>
  );
}