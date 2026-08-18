import type { Metadata } from "next";
import Testimonials from "@/app/components/testimonials";


export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our full collection of premium hair and beauty products.",
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
