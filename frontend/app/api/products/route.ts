import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Discount from "@/models/Discount";
import "@/models/Collection";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 10);

    const skip = (page - 1) * limit;

    const featuredParam = searchParams.get("featured");
    const collectionsParam = searchParams.get("collections");
    const availabilityParam = searchParams.get("availability");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const sortParam = searchParams.get("sort");

    const filter: Record<string, unknown> = {};

    // Featured
    if (featuredParam === "true") {
      filter.featured = true;
    }

    // Collections
    if (collectionsParam) {
      const collectionIds = collectionsParam
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      if (collectionIds.length > 0) {
        filter.collectionId = { $in: collectionIds };
      }
    }

    // Availability
    if (availabilityParam) {
      const availability = availabilityParam
        .split(",")
        .map((value) => value.trim());

      const hasInStock = availability.includes("in-stock");
      const hasOutOfStock = availability.includes("out-of-stock");

      if (hasInStock && !hasOutOfStock) {
        filter.inStock = true;
      }

      if (hasOutOfStock && !hasInStock) {
        filter.inStock = false;
      }

      // If both are selected, don't filter by availability.
    }

    // Price
    const minPrice = Number(minPriceParam);
    const maxPrice = Number(maxPriceParam);

    if (
      minPriceParam !== null &&
      maxPriceParam !== null &&
      !Number.isNaN(minPrice) &&
      !Number.isNaN(maxPrice)
    ) {
      filter.price = {
        $gte: minPrice,
        $lte: maxPrice,
      };
    } else if (minPriceParam !== null && !Number.isNaN(minPrice)) {
      filter.price = {
        $gte: minPrice,
      };
    } else if (maxPriceParam !== null && !Number.isNaN(maxPrice)) {
      filter.price = {
        $lte: maxPrice,
      };
    }

    // Sorting
    let sort: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    if (sortParam === "price-asc") {
      sort = {
        price: 1,
      };
    }

    if (sortParam === "price-desc") {
      sort = {
        price: -1,
      };
    }

    const now = new Date();

    const [products, total, activeDiscounts, priceStats] =
      await Promise.all([
        Product.find(filter)
          .populate("collectionId")
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),

        Product.countDocuments(filter),

        Discount.find({
          isActive: true,
          startsAt: { $lte: now },
          expiresAt: { $gte: now },
        }).lean(),

        // Price range for the entire catalogue,
        // not just the current page.
        Product.aggregate([
          {
            $group: {
              _id: null,
              min: { $min: "$price" },
              max: { $max: "$price" },
            },
          },
        ]),
      ]);

    const globalMinPrice = priceStats[0]?.min ?? 0;
    const globalMaxPrice = priceStats[0]?.max ?? 0;

    // Build map: productId → discount
    const discountMap = new Map<
      string,
      {
        discountType: "percentage" | "fixed";
        discountValue: number;
        title: string;
      }
    >();

    for (const discount of activeDiscounts) {
      for (const productId of discount.productIds) {
        const id = productId.toString();

        if (!discountMap.has(id)) {
          discountMap.set(id, {
            discountType: discount.discountType,
            discountValue: discount.discountValue,
            title: discount.title,
          });
        }
      }
    }

    const productsWithDiscount = products.map((product) => ({
      ...product,
      discount: discountMap.get(product._id.toString()) || null,
    }));

    return NextResponse.json(
      {
        products: productsWithDiscount,

        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },

        priceRange: {
          min: globalMinPrice,
          max: globalMaxPrice,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}