import { NextRequest, NextResponse } from "next/server";
import { SortOrder } from "mongoose";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import "@/models/User";
import "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 10);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder: SortOrder =
      searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const allowedSortFields = [
      "createdAt",
      "totalAmount",
      "orderStatus",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    // Status filter
    if (status) {
      filter.orderStatus = status;
    }

    // Search (order id, customer name fields, tracking number)
    if (search) {
      filter.$or = [
        { "shippingAddress.firstName": { $regex: search, $options: "i" } },
        { "shippingAddress.lastName": { $regex: search, $options: "i" } },
        { "shippingAddress.city": { $regex: search, $options: "i" } },
        { trackingNumber: { $regex: search, $options: "i" } },
        // partial match on ObjectId string
        ...(search.length >= 4
          ? [{ $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: search, options: "i" } } }]
          : []),
      ];
    }

    const sort: Record<string, SortOrder> = {
      [safeSortBy]: sortOrder,
    };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("userId", "name email phone")
        .populate("items.productId", "name slug")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Order.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json(
      {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);

    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}