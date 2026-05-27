import type { Metadata } from "next";
import FAQ from "../components/faq";

export const metadata = {
  title: "Contact — SitesByKareem",
  description:
    "Get in touch with me to discuss your project, ask questions, or just say hello. I’m here to help you create a high-converting website that drives results and grows your business.",
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