"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import { getUsers } from "@/actions/admin/user.actions";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon,
  EyeIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EmptyState } from "@/app/components/empty-state";
import type { UserWithStats } from "@/actions/admin/user.actions";

const features = tableFeatures({
  columnVisibilityFeature,
});

const columnHelper =
  createColumnHelper<typeof features, UserWithStats>();

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function UsersTableSkeleton() {
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
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-10 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto size-8 rounded-md" />
                    </TableCell>
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

export function UsersTable() {
  const router = useRouter();

  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [sortOrder, setSortOrder] =
    React.useState<"asc" | "desc">("desc");

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
      "users",
      {
        page,
        limit,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      },
    ],
    queryFn: () =>
      getUsers({
        page,
        limit,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      }),
    placeholderData: keepPreviousData,
  });

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    setSortBy(field);
    setSortOrder(order as "asc" | "desc");
    setPage(1);
  };

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("name", {
          header: "User",
          cell: ({ row }) => {
            const user = row.original;
            return (
              <div className="min-w-[180px]">
                <p className="truncate font-medium">
                  {user.name || "—"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            );
          },
        }),

        columnHelper.display({
          id: "phone",
          header: "Phone",
          cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
              {row.original.phone || "—"}
            </span>
          ),
        }),

        columnHelper.accessor("orderCount", {
          header: "Orders",
          cell: ({ row }) => {
            const count = row.original.orderCount;
            return (
              <Badge
                variant="secondary"
                className="tabular-nums"
              >
                {count}
              </Badge>
            );
          },
        }),

        columnHelper.accessor("createdAt", {
          header: "Joined",
          cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
              {formatDate(row.original.createdAt)}
            </span>
          ),
        }),

        columnHelper.display({
          id: "actions",
          header: "",
          cell: ({ row }) => {
            const user = row.original;

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
                        Open user actions
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `/admin/users/${user._id}`
                        )
                      }
                    >
                      <EyeIcon />
                      View details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          },
        }),
      ]),
    [router]
  );

  const table = useTable({
    features,
    data: users,
    columns,
  });

  if (isLoading) return <UsersTableSkeleton />;

  if (isError) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center p-6">
          <p className="text-sm text-destructive">
            Failed to load users.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!pagination?.total && !debouncedSearch) {
    return (
      <EmptyState
        icon={<UsersIcon />}
        title="No users yet"
        description="Users will appear here once they sign up on your store."
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
            placeholder="Search users..."
            className="pl-9"
          />
        </div>

        <Select
          value={`${sortBy}-${sortOrder}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort users" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest</SelectItem>
            <SelectItem value="createdAt-asc">Oldest</SelectItem>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
            <SelectItem value="email-asc">Email A-Z</SelectItem>
            <SelectItem value="email-desc">Email Z-A</SelectItem>
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
                      className={
                        isFetching ? "opacity-60" : undefined
                      }
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
                      No users found.
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
                    {users.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {pagination.total}
                  </span>{" "}
                  users
                </>
              ) : (
                "No users"
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
                  isFetching || !pagination?.hasPreviousPage
                }
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
    </div>
  );
}