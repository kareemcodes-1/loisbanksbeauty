"use client";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { priceFormatter } from "@/lib/priceFormatter";

import {
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
  BanknoteIcon,
} from "lucide-react";

interface SectionCardsProps {
  totalProducts?: number;
  totalOrders?: number;
  totalUsers?: number;
  revenue?: number;
}

export function SectionCards({
  totalProducts = 0,
  totalOrders = 0,
  totalUsers = 0,
  revenue = 0,
}: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {/* Revenue */}
      <Card>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
            {priceFormatter(revenue)}
          </CardTitle>

          <CardAction>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 sm:size-11">
              <BanknoteIcon className="size-5 text-primary sm:size-6" />
            </div>
          </CardAction>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 font-medium">
            Total revenue generated
          </div>

          <div className="text-muted-foreground">
            From completed orders
          </div>
        </CardFooter>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardDescription>Total Products</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
            {totalProducts.toLocaleString()}
          </CardTitle>

          <CardAction>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 sm:size-11">
              <PackageIcon className="size-5 text-primary sm:size-6" />
            </div>
          </CardAction>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 font-medium">
            Products in your store
          </div>

          <div className="text-muted-foreground">
            Active products
          </div>
        </CardFooter>
      </Card>

      {/* Orders */}
      <Card>
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
            {totalOrders.toLocaleString()}
          </CardTitle>

          <CardAction>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 sm:size-11">
              <ShoppingCartIcon className="size-5 text-primary sm:size-6" />
            </div>
          </CardAction>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 font-medium">
            Orders placed
          </div>

          <div className="text-muted-foreground">
            All orders on the store
          </div>
        </CardFooter>
      </Card>

      {/* Users */}
      <Card>
        <CardHeader>
          <CardDescription>Total Users</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
            {totalUsers.toLocaleString()}
          </CardTitle>

          <CardAction>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 sm:size-11">
              <UsersIcon className="size-5 text-primary sm:size-6" />
            </div>
          </CardAction>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 font-medium">
            Registered customers
          </div>

          <div className="text-muted-foreground">
            Total accounts on the store
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}