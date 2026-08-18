// app/checkout/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your shipping and payment details to complete your purchase safely and securely.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
