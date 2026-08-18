import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const result = await Order.aggregate([
      {
        $match: {
          "paymentInfo.paymentStatus": "paid",
          orderStatus: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    return NextResponse.json({
      totalRevenue: result[0]?.totalRevenue || 0,
    });
  } catch (error) {
    console.error("GET /api/admin/orders/revenue error:", error);

    return NextResponse.json(
      { message: "Failed to fetch total revenue" },
      { status: 500 }
    );
  }
}