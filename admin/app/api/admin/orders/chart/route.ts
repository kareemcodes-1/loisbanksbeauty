import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const range = searchParams.get("range") || "3months";

    const now = new Date();
    const startDate = new Date(now);

    if (range === "7days") {
      startDate.setDate(now.getDate() - 6);
    } else if (range === "30days") {
      startDate.setDate(now.getDate() - 29);
    } else {
      startDate.setMonth(now.getMonth() - 2);
      startDate.setDate(1);
    }

    startDate.setHours(0, 0, 0, 0);

    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: now,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          orders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const orderMap = new Map(
      orders.map((item) => [
        item._id,
        item.orders,
      ])
    );

    const result = [];

    const currentDate = new Date(startDate);

    while (currentDate <= now) {
      const date = currentDate.toISOString().split("T")[0];

      result.push({
        date,
        orders: orderMap.get(date) ?? 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Order chart error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch order chart data",
      },
      {
        status: 500,
      }
    );
  }
}