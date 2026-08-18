import type { Metadata } from "next";
import FAQ from "@/app/components/faq";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with LoisBanks Beauty. Reach out about orders, wig consultations, or any questions — we're here to help.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    {children}
    <FAQ />
    </>
  );
}