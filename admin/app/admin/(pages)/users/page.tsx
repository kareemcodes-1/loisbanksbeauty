"use client";

import { PageHeader } from "@/app/components/page-header";
import { UsersTable } from "@/app/components/users/users-table";

export default function UsersPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <PageHeader
          title="Users"
          description="View customers who have signed up on your store."
        />

        <UsersTable />
      </div>
    </main>
  );
}