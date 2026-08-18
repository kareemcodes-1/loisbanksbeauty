import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const orders = await Order.find({
      userId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}