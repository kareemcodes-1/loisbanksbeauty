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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { ImagePlusIcon, Loader2Icon, XIcon } from "lucide-react";

import type { HeroBanner } from "@/types";
import {
  createHeroBanner,
  updateHeroBanner,
  type HeroBannerPayload,
} from "@/actions/admin/hero-banner.actions";
import toast from "react-hot-toast";

interface HeroBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heroBanner?: HeroBanner | null;
}

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

  const resourceType = file.type.startsWith("video") ? "video" : "image";

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload media to Cloudinary");
  }

  const data = await response.json();

  return {
    url: data.secure_url as string,
    type: resourceType,
  };
}

export function HeroBannerDialog({
  open,
  onOpenChange,
  heroBanner,
}: HeroBannerDialogProps) {
  const isEditing = !!heroBanner;
  const queryClient = useQueryClient();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [buttonText, setButtonText] = React.useState("");
  const [buttonLink, setButtonLink] = React.useState("");
  const [mediaType, setMediaType] = React.useState<"image" | "video">("image");

  const [existingMedia, setExistingMedia] = React.useState<string | null>(null);
  const [newMediaFile, setNewMediaFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const [isUploading, setIsUploading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: createHeroBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-banner"] });
      toast.success("Hero banner created");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create hero banner"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateHeroBanner, // no id needed
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-banner"] });
      toast.success("Hero banner updated");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update hero banner"
      );
    },
  });

  const isSaving =
    createMutation.isPending || updateMutation.isPending;
  const isBusy = isUploading || isSaving;

  React.useEffect(() => {
    if (!open) return;

    if (heroBanner) {
      setTitle(heroBanner.title);
      setDescription(heroBanner.description);
      setButtonText(heroBanner.buttonText);
      setButtonLink(heroBanner.buttonLink);
      setMediaType(heroBanner.mediaType);
      setExistingMedia(heroBanner.media);
      setNewMediaFile(null);
      setPreviewUrl(null);
    } else {
      setTitle("");
      setDescription("");
      setButtonText("");
      setButtonLink("");
      setMediaType("image");
      setExistingMedia(null);
      setNewMediaFile(null);
      setPreviewUrl(null);
    }

    setFormError(null);
  }, [open, heroBanner]);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelected = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const type = file.type.startsWith("video") ? "video" : "image";

    setNewMediaFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMediaType(type);
    setExistingMedia(null);

    event.target.value = "";
  };

  const handleRemoveMedia = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setNewMediaFile(null);
    setPreviewUrl(null);
    setExistingMedia(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!existingMedia && !newMediaFile) {
      setFormError("Please upload an image or video for the banner.");
      return;
    }

    setIsUploading(true);

    try {
      let mediaUrl = existingMedia;
      let finalMediaType = mediaType;

      if (newMediaFile) {
        const uploaded = await uploadToCloudinary(newMediaFile);
        mediaUrl = uploaded.url;
        finalMediaType = uploaded.type;
      }

      setIsUploading(false);

      const payload: HeroBannerPayload = {
        title,
        description,
        media: mediaUrl!,
        mediaType: finalMediaType,
        buttonText,
        buttonLink,
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
          : "Something went wrong while saving this hero banner."
      );
    }
  };

  const displayMedia = previewUrl || existingMedia;

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
            {isEditing ? "Edit hero banner" : "Create hero banner"}
          </DialogTitle>
        </DialogHeader>

        <form
          id="hero-banner-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto px-6 py-6"
        >
          {/* Media */}
          <div className="space-y-2">
            <Label>Media (Image or Video)</Label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileSelected}
            />

            {displayMedia ? (
              <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
                {mediaType === "video" ? (
                  <video
                    src={displayMedia}
                    muted
                    controls
                    className="size-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayMedia}
                    alt=""
                    className="size-full object-cover"
                  />
                )}

                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  disabled={isBusy}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black disabled:pointer-events-none"
                >
                  <XIcon className="size-4" />
                  <span className="sr-only">Remove media</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed py-10 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/30 disabled:pointer-events-none disabled:opacity-60"
              >
                <ImagePlusIcon className="size-5" />
                <span>Click to upload image or video</span>
              </button>
            )}

            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Banner title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..."
              className="min-h-24 resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonText">Button text</Label>
            <Input
              id="buttonText"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Shop Now"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonLink">Button link</Label>
            <Input
              id="buttonLink"
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="/collections/summer"
              required
            />
          </div>
        </form>

        <DialogFooter className="shrink-0 items-center gap-2 border-t px-6 pb-[1.5rem] sm:gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isBusy}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="hero-banner-form"
            size="lg"
            disabled={isBusy}
          >
            {isBusy && <Loader2Icon className="size-4 animate-spin" />}
            {isUploading
              ? "Uploading..."
              : isSaving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create banner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}