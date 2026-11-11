"use client";

import * as React from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Country, State } from "country-state-city";

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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

import type { ShippingRate } from "@/types";
import {
  createShippingRate,
  updateShippingRate,
  type ShippingRatePayload,
} from "@/actions/admin/shipping-rates.action";

interface ShippingRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rate?: ShippingRate | null;
}

export function ShippingRateDialog({
  open,
  onOpenChange,
  rate,
}: ShippingRateDialogProps) {
  const isEditing = !!rate;
  const queryClient = useQueryClient();

  const [country, setCountry] = React.useState("");
  const [countryName, setCountryName] = React.useState("");
  const [state, setState] = React.useState<string | null>(null);
  const [stateCode, setStateCode] = React.useState<string | null>(null);
  const [area, setArea] = React.useState("");
  const [fee, setFee] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [formError, setFormError] = React.useState<string | null>(null);

  const countries = React.useMemo(() => Country.getAllCountries(), []);
  const states = React.useMemo(
    () => (country ? State.getStatesOfCountry(country) : []),
    [country]
  );

  const createMutation = useMutation({
    mutationFn: createShippingRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success("Shipping rate created");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create shipping rate"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ShippingRatePayload) =>
      updateShippingRate(rate!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success("Shipping rate updated");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update shipping rate"
      );
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  React.useEffect(() => {
    if (!open) return;

    if (rate) {
      setCountry(rate.country);
      setCountryName(rate.countryName);
      setState(rate.state || null);
      setStateCode(rate.stateCode || null);
      setArea(rate.area || "");
      setFee(String(rate.fee));
      setIsActive(rate.isActive);
    } else {
      setCountry("");
      setCountryName("");
      setState(null);
      setStateCode(null);
      setArea("");
      setFee("");
      setIsActive(true);
    }

    setFormError(null);
  }, [open, rate]);

  const handleCountryChange = (isoCode: string) => {
    const selected = countries.find((c) => c.isoCode === isoCode);
    setCountry(isoCode);
    setCountryName(selected?.name || "");
    setState(null);
    setStateCode(null);
    setArea("");
  };

  const handleStateChange = (value: string) => {
    if (value === "none") {
      setState(null);
      setStateCode(null);
      setArea("");
      return;
    }

    const selected = states.find((s) => s.isoCode === value);
    setState(selected?.name || null);
    setStateCode(value);
    setArea("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!country) {
      setFormError("Please select a country");
      return;
    }

    if (area.trim() && !state) {
      setFormError("Select a state before adding an area");
      return;
    }

    if (fee === "" || Number(fee) < 0) {
      setFormError("Please enter a valid fee");
      return;
    }

    const payload: ShippingRatePayload = {
      country,
      countryName,
      state,
      stateCode,
      area: state ? area.trim() || null : null,
      fee: Number(fee),
      isActive,
    };

    try {
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
          : "Something went wrong while saving"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isSaving) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit shipping rate" : "Add shipping rate"}
          </DialogTitle>
        </DialogHeader>

        <form id="shipping-rate-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Country */}
          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={country} onValueChange={handleCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {countries.map((c) => (
                  <SelectItem key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State (optional) */}
          <div className="space-y-2">
            <Label>State / Region (optional)</Label>
            <Select
              value={stateCode || "none"}
              onValueChange={handleStateChange}
              disabled={!country}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state (optional)" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="none">No specific state (Country-wide)</SelectItem>
                {states.map((s) => (
                  <SelectItem key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Leave empty to set a fee for the entire country
            </p>
          </div>

          {/* Area (optional, only once a state is picked) */}
          {state && (
            <div className="space-y-2">
              <Label htmlFor="area">Area within {state} (optional)</Label>
              <Input
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Lagos Island, Lagos Mainland"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for one fee covering all of {state}. Fill this in
                when a state has different fees for different areas — add one
                rate per area, each with its own fee. Once any area rate
                exists for a state, customers must pick an area to see a fee.
              </p>
            </div>
          )}

          {/* Fee */}
          <div className="space-y-2">
            <Label htmlFor="fee">Delivery Fee</Label>
            <Input
              id="fee"
              type="number"
              min="0"
              step="0.01"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          {/* Active */}
          <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
            <div className="space-y-0.5">
              <Label>Active</Label>
              <p className="text-xs text-muted-foreground">
                {isActive
                  ? "Customers can use this rate"
                  : "This rate is hidden from customers"}
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {formError && (
            <p className="text-sm text-destructive">{formError}</p>
          )}
        </form>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="submit" form="shipping-rate-form" disabled={isSaving}>
            {isSaving && <Loader2Icon className="size-4 animate-spin" />}
            {isSaving
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Add rate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}