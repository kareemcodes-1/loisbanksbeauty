import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pending Reviews",
  description: "See which of your purchases are ready for a review, and track reviews you've already submitted.",
};

export default function PendingReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}