import type { Metadata } from "next";
// @ts-ignore
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
  title: "LoisBanks Beauty — Web Design & Development",
  description:
    "LoisBanks Beauty is a web design and development agency that creates beautiful, functional websites for businesses of all sizes. We specialize in creating custom websites that are tailored to your brand and your goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased bg-[#fff] text-black">
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
        {/* <CTA /> */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}