import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import Testimonials from "../components/testimonials";

export const metadata = {
  title: "About — SitesByKareem",
  description:
    "Learn about my background, approach, and why I do what I do. I’m passionate about helping businesses grow with high-converting websites built for performance, trust, and growth.",
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