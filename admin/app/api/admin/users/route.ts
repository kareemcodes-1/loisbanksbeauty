import { NextRequest, NextResponse } from "next/server";
import { SortOrder, Types } from "mongoose";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 10);
    const search = searchParams.get("search")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder: SortOrder =
      searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const allowedSortFields = ["createdAt", "name", "email"];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
  role: "user", // only customers, never admins
};

if (search) {
  filter.$or = [
    { name: { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } },
    { phone: { $regex: search, $options: "i" } },
  ];
}
    const sort: Record<string, SortOrder> = {
      [safeSortBy]: sortOrder,
    };

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    // Order counts for these users
    const userIds = users.map((u) => u._id);

    const orderCounts = await Order.aggregate<{
      _id: Types.ObjectId;
      count: number;
    }>([
      {
        $match: {
          userId: { $in: userIds },
        },
      },
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map(
      orderCounts.map((row) => [String(row._id), row.count])
    );

    const usersWithStats = users.map((user) => ({
      ...user,
      orderCount: countMap.get(String(user._id)) ?? 0,
    }));

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json(
      {
        users: usersWithStats,
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
    console.error("GET /api/admin/users error:", error);

    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}