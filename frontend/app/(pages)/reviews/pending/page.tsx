// app/reviews/pending/page.tsx
import { redirect } from "next/navigation";
import { getPendingReviews } from "@/actions/review.actions";
import PendingReviewsList from "./components/pending-reviews-list";

export default async function PendingReviewsPage() {
  const { items, error } = await getPendingReviews();

  if (error === "Unauthorized") {
    redirect("/login?callbackUrl=/reviews/pending");
  }

  return (
    <div className="min-h-screen px-6 pb-24 pt-[9rem] lg:px-[3rem]">
      <div className="mx-auto mb-8 max-w-[60rem] text-center sm:mb-10 lg:mb-12">
        <span className="subtitle">Reviews</span>
        <h1 className="heading-1 mt-3">Pending Reviews</h1>
        <p className="mx-auto mt-3 max-w-[22rem] text-sm text-black/50 sm:max-w-[28rem]">
          Products you’ve received that still need a review, or reviews waiting
          for approval.
        </p>
      </div>

      <div className="mx-auto max-w-[72rem]">
        <PendingReviewsList initialItems={items} />
      </div>
    </div>
  );
}