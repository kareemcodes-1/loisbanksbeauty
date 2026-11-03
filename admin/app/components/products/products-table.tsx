"use client";

import * as React from "react";

import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProducts,
  deleteProduct,
  reorderProducts,
} from "@/actions/admin/product.actions";

import {
  columnVisibilityFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import toast from "react-hot-toast";

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
  PackageIcon,
  StarIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  GripVerticalIcon,
  ArrowUpDownIcon,
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

import Image from "next/image";

import type { Product } from "@/types";

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

import { priceFormatter } from "@/lib/priceFormatter";

interface ProductsTableProps {
  onEdit?: (product: Product) => void;
}

const features = tableFeatures({
  columnVisibilityFeature,
});

const columnHelper =
  createColumnHelper<typeof features, Product>();

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getAvailabilityStatus(product: Product) {
  if (product.inStock) {
    return {
      label: "In stock",
      className:
        "border-green-200 bg-green-100 text-green-700 hover:bg-green-100",
    };
  }

  return {
    label: "Out of stock",
    className:
      "border-red-200 bg-red-100 text-red-700 hover:bg-red-100",
  };
}

function ProductsTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Search & Sort */}
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
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                {Array.from({ length: 8 }).map(
                  (_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex min-w-[220px] items-center gap-3">
                          <Skeleton className="size-11 rounded-md" />

                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="ml-auto size-8 rounded-md" />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/*
 * One draggable row (used in reorder mode)
 */
function SortableProductRow({
  product,
  position,
}: {
  product: Product;
  position: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id });

  // Move vertically only, never stretch
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, x: 0, scaleX: 1, scaleY: 1 } : null
    ),
    transition,
  };

  const image = product.media?.find((item) => item.type === "image");
  const status = getAvailabilityStatus(product);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 border-b bg-background px-2 py-3 last:border-b-0 sm:gap-3 sm:px-4 ${
        isDragging ? "relative z-10 shadow-lg ring-2 ring-primary/30" : ""
      }`}
    >
      {/* Only the grip starts a drag, so the page still scrolls on phones */}
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={`Drag ${product.name}`}
        className="flex size-10 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing"
      >
        <GripVerticalIcon className="size-5" />
      </button>

      <span className="w-6 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
        {position}
      </span>

      <div className="relative size-11 shrink-0 overflow-hidden rounded-md border bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="44px"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <PackageIcon className="size-5 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {priceFormatter(product.price)}
        </p>
      </div>

      <Badge className={`hidden shrink-0 sm:inline-flex ${status.className}`}>
        {status.label}
      </Badge>
    </li>
  );
}

export function ProductsTable({
  onEdit,
}: ProductsTableProps) {
  const queryClient = useQueryClient();

  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] =
    React.useState("");

  const [page, setPage] = React.useState(1);

  // Default to the same order customers see in the shop
  const [sortBy, setSortBy] =
    React.useState("order");

  const [sortOrder, setSortOrder] =
    React.useState<"asc" | "desc">("asc");

  const [productToDelete, setProductToDelete] =
    React.useState<Product | null>(null);

  // Reorder mode
  const [reorderMode, setReorderMode] = React.useState(false);
  const [reorderItems, setReorderItems] = React.useState<Product[]>([]);
  const [initialIds, setInitialIds] = React.useState<string[]>([]);
  const hydrated = React.useRef(false);

  const limit = 10;

  /*
   * Debounce search
   */
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  /*
   * Fetch products
   */
  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: [
      "products",
      {
        page,
        limit,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      },
    ],

    queryFn: () =>
      getProducts({
        page,
        limit,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      }),

    placeholderData: keepPreviousData,
  });

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  /*
   * Fetch ALL products, only while reorder mode is on
   */
  const {
    data: reorderData,
    isLoading: reorderLoading,
    isError: reorderError,
  } = useQuery({
    queryKey: ["products-reorder"],
    queryFn: () =>
      getProducts({
        page: 1,
        limit: 1000,
        search: "",
        sortBy: "order",
        sortOrder: "asc",
      }),
    enabled: reorderMode,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (reorderMode && reorderData?.products && !hydrated.current) {
      hydrated.current = true;
      setReorderItems(reorderData.products);
      setInitialIds(reorderData.products.map((item: Product) => item._id));
    }
  }, [reorderMode, reorderData]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const startReorder = () => {
    // Always start from fresh data
    queryClient.removeQueries({ queryKey: ["products-reorder"] });
    hydrated.current = false;
    setReorderItems([]);
    setInitialIds([]);
    setReorderMode(true);
  };

  const exitReorder = () => {
    setReorderMode(false);
    setReorderItems([]);
    hydrated.current = false;
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    setReorderItems((current) => {
      const from = current.findIndex((item) => item._id === active.id);
      const to = current.findIndex((item) => item._id === over.id);

      return from === -1 || to === -1 ? current : arrayMove(current, from, to);
    });
  };

  const hasOrderChanges =
    reorderItems.length > 0 &&
    reorderItems.some((item, index) => item._id !== initialIds[index]);

  const saveOrderMutation = useMutation({
    mutationFn: () => reorderProducts(reorderItems.map((item) => item._id)),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product order saved");
      exitReorder();
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to save order"
      );
    },
  });

  /*
   * Delete mutation
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      setProductToDelete(null);
    },
  });

  /*
   * Reset to page 1 when sorting changes
   */
  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");

    setSortBy(field);
    setSortOrder(order as "asc" | "desc");
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;

    deleteMutation.mutate(productToDelete._id);
  };

  /*
   * Table columns
   */
  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        /* Product */
        columnHelper.accessor("name", {
          header: "Product",

          cell: ({ row }) => {
            const product = row.original;

            const image = product.media?.find(
              (item) => item.type === "image"
            );

            return (
              <div className="flex min-w-[220px] items-center gap-3">
                <div className="relative size-11 shrink-0 overflow-hidden rounded-md border bg-muted">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <PackageIcon className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {product.name}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {product.slug}
                  </p>
                </div>
              </div>
            );
          },
        }),

        /* Price */
        columnHelper.accessor("price", {
          header: "Price",

          cell: ({ row }) => (
            <span className="font-medium tabular-nums">
              {priceFormatter(row.original.price)}
            </span>
          ),
        }),

        /* Availability */
        columnHelper.display({
          id: "availability",

          header: "Availability",

          cell: ({ row }) => {
            const status =
              getAvailabilityStatus(row.original);

            return (
              <Badge className={status.className}>
                {status.label}
              </Badge>
            );
          },
        }),

        /* Rating */
        columnHelper.display({
          id: "rating",

          header: "Rating",

          cell: ({ row }) => {
            const product = row.original;

            return (
              <div className="flex items-center gap-1.5">
                <StarIcon className="size-4 fill-yellow-400 text-yellow-400" />

                <span className="tabular-nums">
                  {product.averageRating.toFixed(1)}
                </span>

                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>
            );
          },
        }),

        /* Created */
        columnHelper.accessor("createdAt", {
          header: "Created",

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
            const product = row.original;

            return (
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
                        Open product actions
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        onEdit?.(product)
                      }
                    >
                      <PencilIcon />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() =>
                        setProductToDelete(product)
                      }
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
    data: products,
    columns,
  });

  /*
   * Initial loading
   */
  if (isLoading) {
    return <ProductsTableSkeleton />;
  }

  /*
   * Error
   */
  if (isError) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center p-6">
          <p className="text-sm text-destructive">
            Failed to load products.
          </p>
        </CardContent>
      </Card>
    );
  }

  /*
   * Empty state
   */
  if (!pagination?.total && !debouncedSearch) {
    return (
      <EmptyState
        icon={<PackageIcon />}
        title="No products yet"
        description="Create your first product to start managing your store inventory."
        action={
          <Button>
            <PackageIcon />
            Create Product
          </Button>
        }
      />
    );
  }

  /*
   * Reorder mode: drag products into the order customers will see
   */
  if (reorderMode) {
    const isSavingOrder = saveOrderMutation.isPending;
    const stillLoading = reorderLoading || (!hydrated.current && !reorderError);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Drag the{" "}
            <GripVerticalIcon className="-mt-0.5 inline size-4 align-middle" />{" "}
            handle to move a product. The first product is the first one
            customers see in the shop.
          </p>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={exitReorder}
              disabled={isSavingOrder}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={() => saveOrderMutation.mutate()}
              disabled={!hasOrderChanges || isSavingOrder}
              className="flex-1 sm:flex-none"
            >
              {isSavingOrder && (
                <Loader2Icon className="size-4 animate-spin" />
              )}
              {isSavingOrder ? "Saving..." : "Save order"}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {stillLoading ? (
              <div className="space-y-px">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-[4.5rem] w-full rounded-none" />
                ))}
              </div>
            ) : reorderError ? (
              <p className="py-10 text-center text-sm text-destructive">
                Failed to load products.
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={reorderItems.map((item) => item._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ul>
                    {reorderItems.map((item, index) => (
                      <SortableProductRow
                        key={item._id}
                        product={item}
                        position={index + 1}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products..."
            className="pl-9"
          />
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort products" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="order-asc">
                Shop display order
              </SelectItem>

              <SelectItem value="createdAt-desc">
                Newest
              </SelectItem>

              <SelectItem value="createdAt-asc">
                Oldest
              </SelectItem>

              <SelectItem value="name-asc">
                Name A-Z
              </SelectItem>

              <SelectItem value="name-desc">
                Name Z-A
              </SelectItem>

              <SelectItem value="price-asc">
                Price: Low to High
              </SelectItem>

              <SelectItem value="price-desc">
                Price: High to Low
              </SelectItem>

              <SelectItem value="averageRating-desc">
                Rating: Highest
              </SelectItem>

              <SelectItem value="averageRating-asc">
                Rating: Lowest
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            onClick={startReorder}
            className="w-full sm:w-auto"
          >
            <ArrowUpDownIcon />
            Reorder
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table
                  .getHeaderGroups()
                  .map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(
                        (header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : (
                                  <table.FlexRender
                                    header={header}
                                  />
                                )}
                          </TableHead>
                        )
                      )}
                    </TableRow>
                  ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table
                    .getRowModel()
                    .rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className={
                          isFetching
                            ? "opacity-60"
                            : undefined
                        }
                      >
                        {row
                          .getVisibleCells()
                          .map((cell) => (
                            <TableCell key={cell.id}>
                              <table.FlexRender
                                cell={cell}
                              />
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
                      No products found.
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
                    {products.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {pagination.total}
                  </span>{" "}
                  products
                </>
              ) : (
                "No products"
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
                disabled={
                  isFetching ||
                  !pagination?.hasPreviousPage
                }
                onClick={() =>
                  setPage(
                    (current) => current - 1
                  )
                }
              >
                <ChevronLeftIcon />
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  isFetching ||
                  !pagination?.hasNextPage
                }
                onClick={() =>
                  setPage(
                    (current) => current + 1
                  )
                }
              >
                Next
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setProductToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete product?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {productToDelete?.name}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
            >
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