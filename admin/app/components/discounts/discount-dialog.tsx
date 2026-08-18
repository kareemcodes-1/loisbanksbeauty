"use client";

import * as React from "react";

import {
  useMutation,
  useQuery,
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
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2Icon } from "lucide-react";

import type { Discount } from "@/types";
import {
  createDiscount,
  updateDiscount,
  type DiscountPayload,
} from "@/actions/admin/discount.actions";
import { getProducts } from "@/actions/admin/product.actions";
import toast from "react-hot-toast";

interface DiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discount?: Discount | null;
}

export function DiscountDialog({
  open,
  onOpenChange,
  discount,
}: DiscountDialogProps) {
  const isEditing = !!discount;
  const queryClient = useQueryClient();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [discountType, setDiscountType] =
    React.useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = React.useState("");
  const [productIds, setProductIds] = React.useState<string[]>([]);
  const [minimumAmount, setMinimumAmount] = React.useState("0");
  const [maxDiscount, setMaxDiscount] = React.useState("0");
  const [startsAt, setStartsAt] = React.useState("");
  const [expiresAt, setExpiresAt] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Load products for the multi-select
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products-for-discount"],
    queryFn: () => getProducts({ limit: 100, sortBy: "name", sortOrder: "asc" }),
  });

  const products = productsData?.products ?? [];

  const createMutation = useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast.success("Discount created");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create discount"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: DiscountPayload) =>
      updateDiscount(discount!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      toast.success("Discount updated");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update discount"
      );
    },
  });

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  React.useEffect(() => {
    if (!open) return;

    if (discount) {
      setTitle(discount.title);
      setDescription(discount.description);
      setDiscountType(discount.discountType);
      setDiscountValue(String(discount.discountValue));
      setMinimumAmount(String(discount.minimumAmount ?? 0));
      setMaxDiscount(String(discount.maxDiscount ?? 0));
      setIsActive(discount.isActive);

      // handle both populated and plain string ids
      const ids = (discount.productIds ?? []).map((p) =>
        typeof p === "string" ? p : p._id
      );
      setProductIds(ids);

      const formatForInput = (date: string | Date) => {
        const d = new Date(date);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
      };

      setStartsAt(formatForInput(discount.startsAt));
      setExpiresAt(formatForInput(discount.expiresAt));
    } else {
      setTitle("");
      setDescription("");
      setDiscountType("percentage");
      setDiscountValue("");
      setProductIds([]);
      setMinimumAmount("0");
      setMaxDiscount("0");
      setStartsAt("");
      setExpiresAt("");
      setIsActive(true);
    }

    setFormError(null);
  }, [open, discount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    try {
      const payload: DiscountPayload = {
        title: title.trim(),
        description: description.trim(),
        discountType,
        discountValue: Number(discountValue),
        productIds,
        minimumAmount: Number(minimumAmount) || 0,
        maxDiscount: Number(maxDiscount) || 0,
        startsAt: new Date(startsAt).toISOString(),
        expiresAt: new Date(expiresAt).toISOString(),
        isActive,
      };

      if (isEditing) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }

      onOpenChange(false);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving this discount."
      );
    }
  };

  const toggleProduct = (id: string) => {
    setProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isSaving) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-md">
        <DialogHeader className="shrink-0 border-b px-6 py-5">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {isEditing ? "Edit discount" : "Create discount"}
          </DialogTitle>
        </DialogHeader>

        <form
          id="discount-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto px-6 py-6"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Sale"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this discount..."
              className="min-h-24 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={discountType}
                onValueChange={(v) =>
                  setDiscountType(v as "percentage" | "fixed")
                }
              >
                <SelectTrigger id="discountType" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                {discountType === "percentage" ? "Percentage" : "Amount"}
              </Label>
              <Input
                id="discountValue"
                type="number"
                min="0"
                step={discountType === "percentage" ? "1" : "0.01"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percentage" ? "20" : "10.00"}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimumAmount">Minimum Amount</Label>
              <Input
                id="minimumAmount"
                type="number"
                min="0"
                step="0.01"
                value={minimumAmount}
                onChange={(e) => setMinimumAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Max Discount</Label>
              <Input
                id="maxDiscount"
                type="number"
                min="0"
                step="0.01"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
              />
            </div>
          </div>

          {/* Products multi-select */}
          <div className="space-y-2">
            <Label>Products</Label>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-3">
              {isLoadingProducts ? (
                <p className="text-sm text-muted-foreground">Loading products...</p>
              ) : products.length === 0 ? (
                <p className="text-sm text-muted-foreground">No products found</p>
              ) : (
                products.map((product) => (
                  <label
                    key={product._id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      checked={productIds.includes(product._id)}
                      onChange={() => toggleProduct(product._id)}
                      className="size-4 accent-primary"
                    />
                    <span className="text-sm">{product.name}</span>
                  </label>
                ))
              )}
            </div>
            {productIds.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {productIds.length} product(s) selected
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startsAt">Starts At</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expires At</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
            <Label>Active</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {formError && (
            <p className="text-sm text-destructive">{formError}</p>
          )}
        </form>

        <DialogFooter className="shrink-0 items-center gap-2 border-t px-6 pb-[1.5rem] sm:gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="discount-form"
            size="lg"
            disabled={isSaving}
          >
            {isSaving && <Loader2Icon className="size-4 animate-spin" />}
            {isSaving
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create discount"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}