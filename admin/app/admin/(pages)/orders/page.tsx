"use client";

import * as React from "react";

import { PageHeader } from "@/app/components/page-header";
import { OrdersTable } from "@/app/components/orders/orders-table";
import { OrderStatusDialog } from "@/app/components/orders/order-dialog";

import type { Order } from "@/types";

export default function OrdersPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingOrder, setEditingOrder] =
    React.useState<Order | null>(null);

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setDialogOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingOrder(null);
  };

  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <PageHeader
          title="Orders"
          description="View and manage customer orders."
        />

        <OrdersTable onEdit={handleEdit} />

        <OrderStatusDialog
          open={dialogOpen}
          onOpenChange={handleOpenChange}
          order={editingOrder}
        />
      </div>
    </main>
  );
}