import type { Metadata } from "next";
import Testimonials from "@/app/components/testimonials";


export const metadata: Metadata = {
  title: "Shop Luxury Human Hair Wigs, Athleisure & Beauty Essentials",
  description:
    "Shop luxury human hair wigs, athleisure wear and beauty essentials. Premium quality, flawless textures and effortless glam — affordable luxury delivered worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <>
        {children}
        <Testimonials />
        </>
  );
}
