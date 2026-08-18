
"use client";

import * as React from "react";

import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { getDiscounts, deleteDiscount } from "@/actions/admin/discount.actions";

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
  PencilIcon,
  Trash2Icon,
  PercentIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
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

import type { Discount } from "@/types";

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

interface DiscountsTableProps {
  onEdit?: (discount: Discount) => void;
}

const features = tableFeatures({
  columnVisibilityFeature,
});

const columnHelper = createColumnHelper<typeof features, Discount>();

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDiscount(discount: Discount) {
  if (discount.discountType === "percentage") {
    return `${discount.discountValue}%`;
  }
  return `$${discount.discountValue.toLocaleString("en-US")}`;
}

function getStatus(discount: Discount) {
  const now = new Date();
  const starts = new Date(discount.startsAt);
  const expires = new Date(discount.expiresAt);

  if (!discount.isActive) {
    return {
      label: "Inactive",
      className: "border-border bg-muted text-muted-foreground",
    };
  }

  if (expires < now) {
    return {
      label: "Expired",
      className: "border-red-200 bg-red-100 text-red-700 hover:bg-red-100",
    };
  }

  if (starts > now) {
    return {
      label: "Scheduled",
      className: "border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-100",
    };
  }

  return {
    label: "Active",
    className: "border-green-200 bg-green-100 text-green-700 hover:bg-green-100",
  };
}

function DiscountsTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:max-w-sm" />
        <Skeleton className="h-10 w-full sm:w-[200px]" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Discount</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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

export function DiscountsTable({ onEdit }: DiscountsTableProps) {
  const queryClient = useQueryClient();

  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const [discountToDelete, setDiscountToDelete] =
    React.useState<Discount | null>(null);

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
      "discounts",
      { page, limit, search: debouncedSearch, sortBy, sortOrder },
    ],
    queryFn: () =>
      getDiscounts({
        page,
        limit,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      }),
    placeholderData: keepPreviousData,
  });

  const discounts = data?.discounts ?? [];
  const pagination = data?.pagination;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDiscount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      setDiscountToDelete(null);
    },
  });

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    setSortBy(field);
    setSortOrder(order as "asc" | "desc");
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!discountToDelete) return;
    deleteMutation.mutate(discountToDelete._id);
  };

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("title", {
          header: "Discount",
          cell: ({ row }) => {
            const discount = row.original;
            return (
              <div className="min-w-[180px]">
                <p className="truncate font-medium">{discount.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {discount.description}
                </p>
              </div>
            );
          },
        }),

        columnHelper.display({
          id: "value",
          header: "Value",
          cell: ({ row }) => (
            <span className="font-medium tabular-nums">
              {formatDiscount(row.original)}
            </span>
          ),
        }),

        columnHelper.display({
          id: "products",
          header: "Products",
          cell: ({ row }) => {
            const count = row.original.productIds?.length ?? 0;
            return (
              <span className="tabular-nums">
                {count} {count === 1 ? "product" : "products"}
              </span>
            );
          },
        }),

        columnHelper.display({
          id: "status",
          header: "Status",
          cell: ({ row }) => {
            const status = getStatus(row.original);
            return (
              <Badge className={status.className}>{status.label}</Badge>
            );
          },
        }),

        columnHelper.accessor("expiresAt", {
          header: "Expires",
          cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
              {formatDate(row.original.expiresAt)}
            </span>
          ),
        }),

        columnHelper.display({
          id: "actions",
          header: "",
          cell: ({ row }) => {
            const discount = row.original;
            return (
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open discount actions</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(discount)}>
                      <PencilIcon />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDiscountToDelete(discount)}
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
    [onEdit]
  );

  const table = useTable({
    features,
    data: discounts,
    columns,
  });

  if (isLoading) {
    return <DiscountsTableSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center p-6">
          <p className="text-sm text-destructive">Failed to load discounts.</p>
        </CardContent>
      </Card>
    );
  }

  if (!pagination?.total && !debouncedSearch) {
    return (
      <EmptyState
        icon={<PercentIcon />}
        title="No discounts yet"
        description="Create your first discount to offer special prices on products."
        action={
          <Button>
            <PercentIcon />
            Create Discount
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discounts..."
            className="pl-9"
          />
        </div>

        <Select
          value={`${sortBy}-${sortOrder}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort discounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest</SelectItem>
            <SelectItem value="createdAt-asc">Oldest</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
            <SelectItem value="discountValue-desc">Highest Value</SelectItem>
            <SelectItem value="discountValue-asc">Lowest Value</SelectItem>
            <SelectItem value="expiresAt-asc">Expiring Soon</SelectItem>
            <SelectItem value="expiresAt-desc">Expiring Later</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
                      No discounts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {pagination ? (
                <>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {discounts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {pagination.total}
                  </span>{" "}
                  discounts
                </>
              ) : (
                "No discounts"
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

      <AlertDialog
        open={!!discountToDelete}
        onOpenChange={(open) => {
          if (!open) setDiscountToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete discount?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {discountToDelete?.title}
              </span>
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