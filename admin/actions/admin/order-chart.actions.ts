export type OrderChartRange =
  | "3months"
  | "30days"
  | "7days";

export interface OrderChartData {
  date: string;
  orders: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getOrderChart(
  range: OrderChartRange = "3months"
): Promise<OrderChartData[]> {
  const response = await fetch(
    `${API_URL}/api/admin/orders/chart?range=${range}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch order chart data");
  }

  return response.json();
}