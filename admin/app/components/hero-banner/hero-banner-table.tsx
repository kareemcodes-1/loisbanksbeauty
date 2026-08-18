"use client";

import * as React from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getHeroBanner,
  deleteHeroBanner,
} from "@/actions/admin/hero-banner.actions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  PencilIcon,
  Trash2Icon,
  ImageIcon,
  Loader2Icon,
  PlusIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import type { HeroBanner } from "@/types";
import { EmptyState } from "@/app/components/empty-state";

interface HeroBannersTableProps {
  onEdit?: (heroBanner: HeroBanner) => void;
  onCreate?: () => void;
}

export function HeroBannersTable({
  onEdit,
  onCreate,
}: HeroBannersTableProps) {
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const { data: banner, isLoading, isError } = useQuery({
    queryKey: ["hero-banner"],
    queryFn: getHeroBanner,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHeroBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["hero-banner"],
      });

      setDeleteOpen(false);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Media</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Button</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-12 w-20 rounded-md" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-56" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="ml-auto size-8 rounded-md" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-sm text-destructive">
            Failed to load hero banner.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!banner) {
    return (
      <EmptyState
        icon={<ImageIcon />}
        title="No hero banner yet"
        description="Create a hero banner to showcase on the homepage."
        action={
          <Button onClick={onCreate}>
            <PlusIcon />
            Create Hero Banner
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Media</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Button</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  {/* Media */}
                  <TableCell>
                    <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {banner.mediaType === "video" ? (
                        <video
                          src={banner.media}
                          muted
                          className="size-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={banner.media}
                          alt={banner.title}
                          className="size-full object-cover"
                        />
                      )}

                      <Badge
                        variant="secondary"
                        className="absolute bottom-0.5 left-0.5 px-1 py-0 text-[9px] capitalize"
                      >
                        {banner.mediaType}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Title */}
                  <TableCell>
                    <div className="max-w-[180px]">
                      <p className="truncate font-medium">
                        {banner.title}
                      </p>
                    </div>
                  </TableCell>

                  {/* Description */}
                  <TableCell>
                    <div className="max-w-[280px]">
                      <p className="truncate text-sm text-muted-foreground">
                        {banner.description}
                      </p>
                    </div>
                  </TableCell>

                  {/* Button text */}
                  <TableCell>
                    <span className="text-sm">
                      {banner.buttonText}
                    </span>
                  </TableCell>

                  {/* Button link */}
                  <TableCell>
                    <span className="block max-w-[200px] truncate font-mono text-xs text-muted-foreground">
                      {banner.buttonLink}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontalIcon />

                            <span className="sr-only">
                              Open actions
                            </span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onEdit?.(banner)}
                          >
                            <PencilIcon />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeleteOpen(true)}
                          >
                            <Trash2Icon />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete hero banner?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete the current hero
              banner. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}