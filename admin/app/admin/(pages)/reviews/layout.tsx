import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews | Admin",
  description:
    "Manage customer reviews, ratings, and review approvals.",
};

export default function ReviewsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}