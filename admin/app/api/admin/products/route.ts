import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Collection";
import { SortOrder } from "mongoose";
import { notifySubscribersNewProduct } from "@/lib/notify-subscribers";
import { priceFormatter } from "@/lib/priceFormatter";
import { ensureProductOrder } from "@/lib/product-order";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // One-time numbering of products that don't have a display order yet
    await ensureProductOrder();

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

    const sortBy = searchParams.get("sortBy") || "order";

    const sortOrder: SortOrder =
      searchParams.get("sortOrder") === "desc" ? -1 : 1;

    const allowedSortFields = [
      "name",
      "price",
      "averageRating",
      "reviewCount",
      "createdAt",
      "order",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "order";

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

    // Keep a stable order when two products share the same value
    if (safeSortBy === "order") {
      sort.createdAt = -1;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("collectionId")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(filter),
    ]);

    const totalPages = Math.max(
      1,
      Math.ceil(total / limit)
    );

    return NextResponse.json(
      {
        products,
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
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch products",
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

    // New products go to the top of the shop
    await ensureProductOrder();

    const first = await Product.findOne()
      .sort({ order: 1 })
      .select("order")
      .lean();

    const product = await Product.create({
      ...body,
      order: (first?.order ?? 0) - 1,
    });

    // Notify active subscribers (non-blocking)
    try {
      const image =
        product.media?.find(
          (item: { type: string; url: string }) =>
            item.type === "image"
        )?.url ?? undefined;

      void notifySubscribersNewProduct({
        productName: product.name,
        productImage: image,
        productSlug: product.slug,
        price: priceFormatter(Number(product.price)),
        description: product.description,
      });
    } catch (emailError) {
      console.error(
        "Failed to queue new product emails:",
        emailError
      );
    }

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error: any) {
    console.error("POST /api/products error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: "A product with this slug already exists",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create product",
      },
      {
        status: 500,
      }
    );
  }
}