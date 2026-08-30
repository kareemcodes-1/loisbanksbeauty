import type { Metadata } from "next";
import FAQ from "@/app/components/faq";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with LoisBanks Beauty. Questions about luxury human hair wigs, orders, consultations or delivery? We're here to help — reach out today.",
};

export default function ContactLayout({
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