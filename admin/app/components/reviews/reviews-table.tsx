"use client";

import * as React from "react";

import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getReviews,
  updateReviewApproval,
  deleteReview,
} from "@/actions/admin/review.actions";

import {
  columnVisibilityFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  MoreHorizontalIcon,
  CheckIcon,
  EyeOffIcon,
  Trash2Icon,
  StarIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  MessageSquareIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/app/components/empty-state";

import type { Review } from "@/types";

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

import toast from "react-hot-toast";

interface ReviewsTableProps {}

const features = tableFeatures({
  columnVisibilityFeature,
});

const columnHelper = createColumnHelper<typeof features, Review>();

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getProductName(productId: Review["productId"]) {
  if (!productId) return "—";
  if (typeof productId === "string") return productId;
  return productId.name;
}

function getUserName(userId: Review["userId"]) {
  if (!userId) return "—";
  if (typeof userId === "string") return userId;
  return userId.name;
}

function ReviewsTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:max-w-sm" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="ml-auto size-8 rounded-md" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ReviewsTable({}: ReviewsTableProps) {
  const queryClient = useQueryClient();

  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [status, setStatus] = React.useState<"all" | "approved" | "pending">("all");

  const [reviewToDelete, setReviewToDelete] =
    React.useState<Review | null>(null);

  const limit = 10;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [
      "reviews",
      { page, limit, search: debouncedSearch, sortBy, sortOrder, status },
    ],
    queryFn: () =>
      getReviews({
        page,
        limit,
        search: debouncedSearch,
        sortBy,
        sortOrder,
        status,
      }),
    placeholderData: keepPreviousData,
  });

  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination;

  const approvalMutation = useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      updateReviewApproval(id, isApproved),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success(
        variables.isApproved ? "Review approved" : "Review hidden"
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update review"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setReviewToDelete(null);
      toast.success("Review deleted");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete review"
      );
    },
  });

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    setSortBy(field);
    setSortOrder(order as "asc" | "desc");
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as "all" | "approved" | "pending");
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!reviewToDelete) return;
    deleteMutation.mutate(reviewToDelete._id);
  };

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        /* Product */
        columnHelper.display({
          id: "product",
          header: "Product",
          cell: ({ row }) => (
            <div className="min-w-[140px]">
              <p className="truncate font-medium">
                {getProductName(row.original.productId)}
              </p>
            </div>
          ),
        }),

        /* Customer */
        columnHelper.display({
          id: "customer",
          header: "Customer",
          cell: ({ row }) => (
            <div className="min-w-[120px]">
              <p className="truncate text-sm">
                {getUserName(row.original.userId)}
              </p>
              {row.original.isVerifiedPurchase && (
                <Badge
                  variant="outline"
                  className="mt-1 border-green-200 bg-green-50 text-[10px] text-green-700"
                >
                  Verified
                </Badge>
              )}
            </div>
          ),
        }),

        /* Rating */
        columnHelper.accessor("rating", {
          header: "Rating",
          cell: ({ row }) => (
            <div className="flex items-center gap-1">
              <StarIcon className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="tabular-nums font-medium">
                {row.original.rating}
              </span>
            </div>
          ),
        }),

        /* Review content */
        columnHelper.display({
          id: "content",
          header: "Review",
          cell: ({ row }) => {
            const r = row.original;
            return (
              <div className="min-w-[220px] max-w-[320px]">
                {r.title && (
                  <p className="truncate text-sm font-medium">{r.title}</p>
                )}
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {r.comment}
                </p>
              </div>
            );
          },
        }),

        /* Status */
        columnHelper.display({
          id: "status",
          header: "Status",
          cell: ({ row }) => {
            const approved = row.original.isApproved;
            return (
              <Badge
                className={
                  approved
                    ? "border-green-200 bg-green-100 text-green-700 hover:bg-green-100"
                    : "border-yellow-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                }
              >
                {approved ? "Approved" : "Pending"}
              </Badge>
            );
          },
        }),

        /* Date */
        columnHelper.accessor("createdAt", {
          header: "Date",
          cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
              {formatDate(row.original.createdAt)}
            </span>
          ),
        }),

        /* Actions */
        columnHelper.display({
          id: "actions",
          header: "",
          cell: ({ row }) => {
            const review = row.original;
            const isPending = approvalMutation.isPending;

            return (
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      disabled={isPending}
                    >
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open review actions</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    {review.isApproved ? (
                      <DropdownMenuItem
                        onClick={() =>
                          approvalMutation.mutate({
                            id: review._id,
                            isApproved: false,
                          })
                        }
                      >
                        <EyeOffIcon />
                        Hide review
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() =>
                          approvalMutation.mutate({
                            id: review._id,
                            isApproved: true,
                          })
                        }
                      >
                        <CheckIcon />
                        Approve review
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setReviewToDelete(review)}
                    >
                      <Trash2Icon />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          },
        }),
      ]),
    [approvalMutation]
  );

  const table = useTable({
    features,
    data: reviews,
    columns,
  });

  if (isLoading) {
    return <ReviewsTableSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center p-6">
          <p className="text-sm text-destructive">Failed to load reviews.</p>
        </CardContent>
      </Card>
    );
  }

  if (!pagination?.total && !debouncedSearch && status === "all") {
    return (
      <EmptyState
        icon={<MessageSquareIcon />}
        title="No reviews yet"
        description="Customer reviews will appear here once they start leaving feedback on products."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest</SelectItem>
              <SelectItem value="createdAt-asc">Oldest</SelectItem>
              <SelectItem value="rating-desc">Highest rating</SelectItem>
              <SelectItem value="rating-asc">Lowest rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={isFetching ? "opacity-60" : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          <table.FlexRender cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center"
                    >
                      No reviews found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {pagination ? (
                <>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {reviews.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {pagination.total}
                  </span>{" "}
                  reviews
                </>
              ) : (
                "No reviews"
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="mr-2 text-sm text-muted-foreground">
                Page {pagination?.page ?? page} of{" "}
                {pagination?.totalPages ?? 1}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={isFetching || !pagination?.hasPreviousPage}
                onClick={() => setPage((c) => c - 1)}
              >
                <ChevronLeftIcon />
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={isFetching || !pagination?.hasNextPage}
                onClick={() => setPage((c) => c + 1)}
              >
                Next
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!reviewToDelete}
        onOpenChange={(open) => {
          if (!open) setReviewToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete review?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this review
              {reviewToDelete && (
                <>
                  {" "}
                  from{" "}
                  <span className="font-medium text-foreground">
                    {getProductName(reviewToDelete.productId)}
                  </span>
                </>
              )}
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmDelete}
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
    </div>
  );
}