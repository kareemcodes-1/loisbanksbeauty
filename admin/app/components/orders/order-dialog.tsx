"use client";

import * as React from "react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2Icon } from "lucide-react";

import type { Order } from "@/types";
import {
  updateOrder,
  type OrderStatus,
  type UpdateOrderPayload,
} from "@/actions/admin/order.actions";
import toast from "react-hot-toast";

interface OrderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order | null;
}

const ALL_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "processing", label: "Processing" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "ready_for_pickup", label: "Ready for pickup" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function getStatusesForShippingMethod(
  shippingMethod?: string | null
) {
  if (shippingMethod === "pickup") {
    // No "shipped" for store pickup
    return ALL_STATUSES.filter((s) => s.value !== "shipped");
  }

  if (shippingMethod === "delivery") {
    // No "ready_for_pickup" for door delivery
    return ALL_STATUSES.filter(
      (s) => s.value !== "ready_for_pickup"
    );
  }

  // Fallback if missing on old orders
  return ALL_STATUSES;
}

export function OrderStatusDialog({
  open,
  onOpenChange,
  order,
}: OrderStatusDialogProps) {
  const queryClient = useQueryClient();

  const [orderStatus, setOrderStatus] =
    React.useState<OrderStatus>("processing");
  const [trackingNumber, setTrackingNumber] = React.useState("");

  const availableStatuses = React.useMemo(
    () => getStatusesForShippingMethod(order?.shippingMethod),
    [order?.shippingMethod]
  );

  const updateMutation = useMutation({
    mutationFn: (data: UpdateOrderPayload) =>
      updateOrder(order!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      toast.success("Order updated");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update order"
      );
    },
  });

  React.useEffect(() => {
    if (!open || !order) return;

    const allowed = getStatusesForShippingMethod(
      order.shippingMethod
    ).map((s) => s.value);

    // If current status isn't valid for this shipping method, fall back
    const nextStatus = allowed.includes(order.orderStatus)
      ? order.orderStatus
      : "processing";

    setOrderStatus(nextStatus);
    setTrackingNumber(order.trackingNumber ?? "");
  }, [open, order]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!order) return;

    updateMutation.mutate({
      orderStatus,
      trackingNumber: trackingNumber.trim() || null,
    });
  };

  const isBusy = updateMutation.isPending;
  const isDelivery = order?.shippingMethod === "delivery";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isBusy) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update order</DialogTitle>
        </DialogHeader>

        <form
          id="order-status-form"
          onSubmit={handleSubmit}
          className="space-y-5 py-2"
        >
          <div className="space-y-2">
            <Label>Order status</Label>
            <Select
              value={orderStatus}
              onValueChange={(value) =>
                setOrderStatus(value as OrderStatus)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {order?.shippingMethod === "pickup"
                ? "Pickup order — statuses include ready for pickup."
                : order?.shippingMethod === "delivery"
                  ? "Delivery order — statuses include shipped."
                  : "Select a status for this order."}
            </p>
          </div>

          {/* Tracking mainly for delivery */}
          {isDelivery && (
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">
                Tracking number
              </Label>
              <Input
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) =>
                  setTrackingNumber(e.target.value)
                }
                placeholder="e.g. TRK-123456789"
              />
              <p className="text-xs text-muted-foreground">
                Optional. Shown to the customer for tracking.
              </p>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="order-status-form"
            disabled={isBusy}
          >
            {isBusy && (
              <Loader2Icon className="size-4 animate-spin" />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}