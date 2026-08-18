"use client";

import { PageHeader } from "@/app/components/page-header";
import { ReviewsTable } from "@/app/components/reviews/reviews-table";

export default function ReviewsPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <PageHeader
          title="Reviews"
          description="Moderate product reviews. Approve, hide, or delete customer feedback."
        />

        <ReviewsTable />
      </div>
    </main>
  );
}