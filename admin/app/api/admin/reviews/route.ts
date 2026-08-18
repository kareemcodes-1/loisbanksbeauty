import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import "@/models/Product";
import "@/models/User";
import { SortOrder } from "mongoose";

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
    const status = searchParams.get("status") || "all"; // all | approved | pending

    const allowedSortFields = [
      "createdAt",
      "rating",
      "isApproved",
      "isVerifiedPurchase",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    // Status filter
    if (status === "approved") {
      filter.isApproved = true;
    } else if (status === "pending") {
      filter.isApproved = false;
    }

    // Search (title, comment)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } },
      ];
    }

    const sort: Record<string, SortOrder> = {
      [safeSortBy]: sortOrder,
    };

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("productId", "name slug")
        .populate("userId", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json(
      {
        reviews,
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
    console.error("GET /api/admin/reviews error:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}