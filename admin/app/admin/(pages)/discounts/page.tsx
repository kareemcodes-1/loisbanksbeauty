"use client";

import * as React from "react";

import { PageHeader } from "@/app/components/page-header";
import { DiscountsTable } from "@/app/components/discounts/discounts-table";
import { DiscountDialog } from "@/app/components/discounts/discount-dialog";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

import type { Discount } from "@/types";

export default function DiscountsPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingDiscount, setEditingDiscount] =
    React.useState<Discount | null>(null);

  const handleCreate = () => {
    setEditingDiscount(null);
    setDialogOpen(true);
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setDialogOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingDiscount(null);
    }
  };

  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <PageHeader
          title="Discounts"
          description="Create and manage product discounts."
          action={
            <Button size="lg" onClick={handleCreate}>
              <PlusIcon />
              Create Discount
            </Button>
          }
        />

        <DiscountsTable onEdit={handleEdit} />

        <DiscountDialog
          open={dialogOpen}
          onOpenChange={handleOpenChange}
          discount={editingDiscount}
        />
      </div>
    </main>
  );
}