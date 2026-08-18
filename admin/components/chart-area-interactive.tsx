"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

import {
  type OrderChartData,
  type OrderChartRange,
} from "@/actions/admin/order-chart.actions";

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  initialData: OrderChartData[];
}

export function ChartAreaInteractive({
  initialData,
}: ChartAreaInteractiveProps) {
  const [range, setRange] =
    React.useState<OrderChartRange>("3months");

  const [data, setData] =
    React.useState<OrderChartData[]>(initialData);

  const [loading, setLoading] = React.useState(false);

  const handleRangeChange = async (
    value: OrderChartRange
  ) => {
    if (!value || value === range) return;

    setRange(value);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/orders/chart?range=${value}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch order chart data"
        );
      }

      const result: OrderChartData[] =
        await response.json();

      setData(result);
    } catch (error) {
      console.error(
        "Failed to load order chart:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Total Orders</CardTitle>

          <CardDescription>
            Order activity over time
          </CardDescription>
        </div>

        <ToggleGroup
          type="single"
          value={range}
          onValueChange={(value) =>
            handleRangeChange(
              value as OrderChartRange
            )
          }
          variant="outline"
          className="w-fit"
        >
          <ToggleGroupItem value="3months">
            Last 3 months
          </ToggleGroupItem>

          <ToggleGroupItem value="30days">
            Last 30 days
          </ToggleGroupItem>

          <ToggleGroupItem value="7days">
            Last 7 days
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(
                  `${value}T00:00:00`
                );

                return date.toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                );
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(
                      `${value}T00:00:00`
                    ).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    );
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="orders"
              type="natural"
              fill="var(--color-orders)"
              fillOpacity={0.4}
              stroke="var(--color-orders)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>

        {loading && (
          <div className="mt-2 text-center text-sm text-muted-foreground">
            Updating chart...
          </div>
        )}
      </CardContent>
    </Card>
  );
}