import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Exchange Policy",
  description:
    "Learn about our refund, return, and exchange policy for LoisBanks Beauty.",
};

export default function RefundPolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-white">
      {children}
    </main>
  );
}