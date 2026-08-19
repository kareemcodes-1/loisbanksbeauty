import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discounts | Admin",
  description:
    "Manage discounts, and promotional offers.",
};

export default function DiscountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}