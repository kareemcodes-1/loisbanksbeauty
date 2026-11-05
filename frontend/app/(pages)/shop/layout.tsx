import type { Metadata } from "next";
import Testimonials from "@/app/components/testimonials";


export const metadata: Metadata = {
  title: "Shop Luxury Hair, Beauty Essentials & Athleisure",
  description:
    "Shop premium human hair wigs, beauty essentials and athleisure wear curated for women. Based in Lekki, Lagos, delivering worldwide.",
  alternates: { canonical: "/shop" },
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
