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

import {
  ImagePlusIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";

import type { Product } from "@/types";
import { getCollections } from "@/actions/admin/collection.actions";
import {
  createProduct,
  updateProduct,
  type ProductPayload,
} from "@/actions/admin/product.actions";
import toast from "react-hot-toast";
import { generateSlug } from "@/lib/slug-generator";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

/**
 * A media item in the uploader.
 * - "existing" items already live on Cloudinary.
 * - "new" items are local files picked by the user.
 */
type MediaItem =
  | {
      id: string;
      kind: "existing";
      url: string;
      type: "image" | "video";
    }
  | {
      id: string;
      kind: "new";
      file: File;
      previewUrl: string;
      type: "image" | "video";
    };

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(
  file: File
): Promise<{ url: string; type: "image" | "video" }> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const isVideo = file.type.startsWith("video");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${
      isVideo ? "video" : "image"
    }/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error?.message || "Failed to upload file to Cloudinary"
    );
  }

  const data = await response.json();
  let url = data.secure_url as string;

  if (isVideo) {
    // 1. Add the MP4 transformation
    url = url.replace("/upload/", "/upload/f_mp4,q_auto/");

    // 2. Force the extension to .mp4 (this is the key part)
    url = url.replace(/\.(mov|MOV|webm|avi|mkv)$/i, ".mp4");
  }

  return {
    url,
    type: isVideo ? "video" : "image",
  };
}
function createId() {
  return Math.random().toString(36).slice(2);
}

// product.collectionId can either be a string or a populated object.
function resolveCollectionId(
  collectionId: Product["collectionId"]
) {
  if (!collectionId) return "";

  if (typeof collectionId === "string") {
    return collectionId;
  }

  return String(
    (collectionId as { _id: string })._id ?? ""
  );
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
}: ProductDialogProps) {
  const isEditing = !!product;

  const queryClient = useQueryClient();

  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [collectionId, setCollectionId] = React.useState("");

  const [inStock, setInStock] = React.useState(true);

  const [featured, setFeatured] = React.useState(false);

  const [sizes, setSizes] = React.useState<string[]>([]);
  const [sizeInput, setSizeInput] = React.useState("");

  const [media, setMedia] = React.useState<MediaItem[]>([]);

  const [isUploading, setIsUploading] =
    React.useState(false);

  const [formError, setFormError] = React.useState<
    string | null
  >(null);

  const {
    data,
    isLoading: isLoadingCollections,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: () => getCollections(),
  });

  const collections = data?.collections ?? [];

  const createMutation = useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Product created");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create product"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductPayload) =>
      updateProduct(product!._id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Product updated");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update product"
      );
    },
  });

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  const fileInputRef =
    React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) return;

    if (product) {
      setName(product.name);
      setSlug(product.slug);
      setDescription(product.description);
      setPrice(String(product.price));

      setCollectionId(
        resolveCollectionId(product.collectionId)
      );

      setInStock(product.inStock);

      setSizes(product.sizes ?? []);
      setSizeInput("");

      setFeatured(product.featured);

      setMedia(
        (product.media ?? []).map((item) => ({
          id: createId(),
          kind: "existing" as const,
          url: item.url,
          type: item.type,
        }))
      );
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setPrice("");
      setCollectionId("");

      setInStock(true);

      setSizes([]);
      setSizeInput("");

      setFeatured(false);

      setMedia([]);
    }

    setFormError(null);
  }, [open, product]);

  // Revoke local object URLs so we don't leak memory.
  React.useEffect(() => {
    return () => {
      media.forEach((item) => {
        if (item.kind === "new") {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleFilesSelected = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    const newItems: MediaItem[] = Array.from(files).map(
      (file) => ({
        id: createId(),
        kind: "new" as const,
        file,
        previewUrl: URL.createObjectURL(file),
        type: file.type.startsWith("video")
          ? ("video" as const)
          : ("image" as const),
      })
    );

    setMedia((current) => [
      ...current,
      ...newItems,
    ]);

    event.target.value = "";
  };

  const handleRemoveMedia = (id: string) => {
    setMedia((current) => {
      const item = current.find((m) => m.id === id);

      if (item?.kind === "new") {
        URL.revokeObjectURL(item.previewUrl);
      }

      return current.filter((m) => m.id !== id);
    });
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setFormError(null);
    setIsUploading(true);

    try {
      // Existing media is already on Cloudinary.
      // New media gets uploaded when the form is submitted.
      const uploadedMedia = await Promise.all(
        media.map(async (item) => {
          if (item.kind === "existing") {
            return {
              url: item.url,
              type: item.type,
            };
          }

          return uploadToCloudinary(item.file);
        })
      );

      setIsUploading(false);

      const payload: ProductPayload = {
        name,
        slug,
        description,
        price: Number(price),
        collectionId,

        featured,
        inStock,

        sizes,

        media: uploadedMedia,
      };

      if (isEditing) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }

      onOpenChange(false);
    } catch (error) {
      setIsUploading(false);

      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving this product."
      );
    }
  };

  const handleAddSize = () => {
    const value = sizeInput.trim();

    if (!value) return;

    // Avoid duplicates (case-insensitive).
    if (
      sizes.some(
        (s) =>
          s.toLowerCase() === value.toLowerCase()
      )
    ) {
      setSizeInput("");
      return;
    }

    setSizes((prev) => [...prev, value]);
    setSizeInput("");
  };

  const handleRemoveSize = (size: string) => {
    setSizes((prev) =>
      prev.filter((s) => s !== size)
    );
  };

  const isBusy = isUploading || isSaving;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isBusy) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-md">
        <DialogHeader className="shrink-0 border-b px-6 py-5">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {isEditing
              ? "Edit product"
              : "Create product"}
          </DialogTitle>
        </DialogHeader>

        <form
          id="product-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto px-6 py-6"
        >
          {/* Media */}
          <div className="space-y-2">
            <Label>Media</Label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFilesSelected}
            />

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={isBusy}
              className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed py-6 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/30 disabled:pointer-events-none disabled:opacity-60"
            >
              <ImagePlusIcon className="size-5" />

              <span>
                Click to upload images or videos
              </span>
            </button>

            {media.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {media.map((item) => {
                  const src =
                    item.kind === "existing"
                      ? item.url
                      : item.previewUrl;

                  return (
                    <div
                      key={item.id}
                      className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                    >
                      {item.type === "video" ? (
                        <video
                          src={src}
                          muted
                          className="size-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={src}
                          alt=""
                          className="size-full object-cover"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveMedia(item.id)
                        }
                        disabled={isBusy}
                        className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black disabled:pointer-events-none"
                      >
                        <XIcon className="size-3.5" />

                        <span className="sr-only">
                          Remove file
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {formError && (
              <p className="text-sm text-destructive">
                {formError}
              </p>
            )}
          </div>

          {/* Product name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Product name
            </Label>

            <Input
              id="name"
              value={name}
              onChange={(event) => {
  const value = event.target.value;
  setName(value);
  setSlug(generateSlug(value));
}}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug
            </Label>

            <Input
  id="slug"
  value={slug}
  onChange={(event) => setSlug(event.target.value)}
  placeholder="product-slug"
  required
  className="font-mono text-sm"
/>
          </div>

          {/* Collection */}
          <div className="space-y-2">
            <Label htmlFor="collection">
              Collection
            </Label>

            <Select
              value={collectionId}
              onValueChange={setCollectionId}
            >
              <SelectTrigger
                id="collection"
                className="w-full"
              >
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>

              <SelectContent>
                {isLoadingCollections ? (
                  <SelectItem
                    value="loading"
                    disabled
                  >
                    Loading collections...
                  </SelectItem>
                ) : collections.length > 0 ? (
                  collections.map((collection) => (
                    <SelectItem
                      key={collection._id}
                      value={String(collection._id)}
                    >
                      {collection.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    value="empty"
                    disabled
                  >
                    No collections found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>

            <Textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Describe your product..."
              className="min-h-28 resize-none"
              required
            />
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label htmlFor="size-input">
              Sizes
            </Label>

            <p className="text-xs text-muted-foreground">
              Optional. Add sizes for wigs, wears,
              etc. Leave empty if the product has no
              sizes.
            </p>

            <div className="flex gap-2">
              <Input
                id="size-input"
                value={sizeInput}
                onChange={(e) =>
                  setSizeInput(e.target.value)
                }
                placeholder={'e.g. S, M, L or 12", 14"'}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSize();
                  }
                }}
                disabled={isBusy}
              />

              <Button
                type="button"
                variant="outline"
                onClick={handleAddSize}
                disabled={
                  isBusy || !sizeInput.trim()
                }
              >
                Add
              </Button>
            </div>

            {sizes.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {sizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-sm"
                  >
                    {size}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveSize(size)
                      }
                      disabled={isBusy}
                      className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none"
                      aria-label={`Remove size ${size}`}
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">
              Price
            </Label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                &#8358;
              </span>

              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                placeholder="0.00"
                required
                className="pl-6"
              />
            </div>
          </div>

          {/* In Stock */}
          <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
            <div className="space-y-0.5">
              <Label>In stock</Label>

              <p className="text-xs text-muted-foreground">
                Turn this off when the product is
                unavailable.
              </p>
            </div>

            <Switch
              checked={inStock}
              onCheckedChange={setInStock}
              disabled={isBusy}
            />
          </div>

          {/* Featured */}
          <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
            <Label>
              Featured product
            </Label>

            <Switch
              checked={featured}
              onCheckedChange={setFeatured}
              disabled={isBusy}
            />
          </div>
        </form>

        <DialogFooter className="flex-col-reverse gap-2 p-[1rem] sm:flex-row sm:justify-end lg:p-[1rem]">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            disabled={isBusy}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="product-form"
            className="w-full sm:w-auto"
            size="lg"
            disabled={isBusy}
          >
            {isBusy && (
              <Loader2Icon className="size-4 animate-spin" />
            )}

            {isUploading
              ? "Uploading..."
              : isSaving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}