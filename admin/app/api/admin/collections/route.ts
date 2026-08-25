import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";
import { SortOrder } from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );

    const limit = Math.max(
      1,
      Number(searchParams.get("limit")) || 10
    );

    const search = searchParams.get("search")?.trim() || "";

    const sortBy = searchParams.get("sortBy") || "createdAt";

    const sortOrder: SortOrder =
      searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const allowedSortFields = [
      "name",
      "createdAt",
      "order",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          slug: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const sort: Record<string, SortOrder> = {
      [safeSortBy]: sortOrder,
    };

    const [collections, total] = await Promise.all([
      Collection.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Collection.countDocuments(filter),
    ]);

    const totalPages = Math.max(
      1,
      Math.ceil(total / limit)
    );

    return NextResponse.json(
      {
        collections,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/admin/collections error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch collections",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const collection = await Collection.create({
      ...body,
      featured: body.featured ?? false,
    });

    return NextResponse.json(collection, {
      status: 201,
    });
  } catch (error: any) {
    console.error(
      "POST /api/admin/collections error:",
      error
    );

    if (error.code === 11000) {
      return NextResponse.json(
        {
          message:
            "A collection with this slug already exists",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create collection",
      },
      {
        status: 500,
      }
    );
  }
}