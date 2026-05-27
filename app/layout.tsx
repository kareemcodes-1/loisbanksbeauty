import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import CTA from "./components/cta";
import Footer from "./components/footer";
import Navbar from "./components/navbar";

export const metadata = {
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
    <html lang="en">
      <body
        className={` antialiased bg-[#0c0909] text-white`}
      >
                <svg className="pointer-events-none absolute cursor-none"><filter id="grainy"><feTurbulence type="turbulence" baseFrequency="0.5"></feTurbulence><feColorMatrix type="saturate" values="0"></feColorMatrix></filter></svg>
        <Navbar />
        {children}
        <CTA />
        <Footer />
      </body>
    </html>
  );
}