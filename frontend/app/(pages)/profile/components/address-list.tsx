"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import type { ProfileAddress } from "@/actions/profile.actions";
import AddressSheet from "./address-sheet";
import EmptyState from "@/app/components/empty-state";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  addresses: ProfileAddress[];
};

export default function AddressList({ addresses: initial }: Props) {
  const router = useRouter();

  const [addresses, setAddresses] = useState(initial);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<ProfileAddress | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setSheetOpen(true);
  };

  const openEdit = (address: ProfileAddress) => {
    setEditing(address);
    setSheetOpen(true);
  };

  const openDelete = (id: string) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/profile/addresses/${deletingId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete address.");
        return;
      }

      setAddresses((prev) => prev.filter((a) => a._id !== deletingId));

      setDeleteOpen(false);
      setDeletingId(null);

      toast.success("Address deleted.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSaved = (address: ProfileAddress, mode: "create" | "edit") => {
    if (mode === "create") {
      setAddresses((prev) => {
        const next = address.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev;

        return [...next, address];
      });
    } else {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a._id === address._id) return address;

          return address.isDefault ? { ...a, isDefault: false } : a;
        }),
      );
    }

    router.refresh();
  };

  return (
    <section className="w-full min-w-0 rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-medium tracking-tight sm:text-lg">
            Shipping addresses
          </h2>

          <p className="mt-1 text-xs text-black/45">
            Manage your delivery details.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-black/15 px-3 text-xs font-medium transition-colors hover:border-black hover:bg-black hover:text-white sm:px-4"
        >
          <Plus size={15} strokeWidth={1.8} />
          Add address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-black/10 bg-neutral-50/60 px-3 py-6 sm:min-h-[200px] sm:px-5">
          <div className="w-full max-w-sm">
            <EmptyState
              icon={MapPin}
              message="No addresses yet."
              buttonText="Add address"
              onButtonClick={openCreate}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {addresses.map((addr) => (
            <article
              key={addr._id}
              className="group min-w-0 rounded-xl border border-black/10 bg-white p-3.5 transition-colors hover:border-black/20 sm:p-4"
            >
              {/* Name and actions */}
              <div className="flex min-w-0 items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="break-words text-sm font-medium text-black">
                      {addr.firstName} {addr.lastName}
                    </h3>

                    {addr.isDefault && (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-[#FD3F92]/10 px-2 py-0.5 text-[10px] font-medium text-[#FD3F92]">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="-mr-1 -mt-1 flex shrink-0 items-center">
                  <button
                    type="button"
                    onClick={() => openEdit(addr)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-black/45 transition-colors hover:bg-black/5 hover:text-black"
                    aria-label={`Edit address for ${addr.firstName} ${addr.lastName}`}
                  >
                    <Pencil size={14} strokeWidth={1.7} />
                  </button>

                  <button
                    type="button"
                    onClick={() => openDelete(addr._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-black/45 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete address for ${addr.firstName} ${addr.lastName}`}
                  >
                    <Trash2 size={14} strokeWidth={1.7} />
                  </button>
                </div>
              </div>

              {/* Address details */}
              <div className="mt-3 border-t border-black/[0.06] pt-3">
                <p className="break-words text-[13px] leading-5 text-black/65">
                  {addr.address}
                  {addr.apartment ? `, ${addr.apartment}` : ""}
                </p>

                <p className="mt-0.5 break-words text-[13px] leading-5 text-black/50">
                  {[addr.city, addr.state, addr.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                <p className="mt-0.5 text-[13px] leading-5 text-black/50">
                  {addr.country}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      <AddressSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        address={editing}
        onSaved={handleSaved}
      />

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="w-[calc(100%-2rem)] rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete address?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This address will be permanently
              removed from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="rounded-full">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

