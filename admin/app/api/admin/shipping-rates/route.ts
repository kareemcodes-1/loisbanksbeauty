import { NextRequest, NextResponse } from "next/server";
import { SortOrder } from "mongoose";

import connectDB from "@/lib/mongodb";
import ShippingRate from "@/models/ShippingRate";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 10);
    const search = searchParams.get("search")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "countryName";
    const sortOrder: SortOrder =
      searchParams.get("sortOrder") === "desc" ? -1 : 1;

    const allowedSortFields = [
      "countryName",
      "state",
      "fee",
      "createdAt",
      "updatedAt",
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "countryName";

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    // Search by country name or state
    if (search) {
      filter.$or = [
        { countryName: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    }

    const sort: Record<string, SortOrder> = {
      [safeSortBy]: sortOrder,
    };

    const [rates, total] = await Promise.all([
      ShippingRate.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      ShippingRate.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json(
      {
        rates,
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
    console.error("GET /api/admin/shipping-rates error:", error);

    return NextResponse.json(
      { message: "Failed to fetch shipping rates" },
      { status: 500 }
    );
  }
}

// CREATE new shipping rate
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      country,
      countryName,
      state,
      stateCode,
      area,
      fee,
      isActive = true,
    } = body;

    if (!country || !countryName || fee === undefined || fee === null) {
      return NextResponse.json(
        { message: "Country, country name, and fee are required" },
        { status: 400 }
      );
    }

    const normalizedCountry = country.trim().toUpperCase();
    const normalizedState = state?.trim() || null;
    const normalizedArea = normalizedState
      ? area?.trim() || null
      : null;

    // Check for an existing rate with the same country, state, and area
    const exists = await ShippingRate.findOne({
      country: normalizedCountry,
      state: normalizedState,
      area: normalizedArea,
    });

    if (exists) {
      return NextResponse.json(
        {
          message: normalizedArea
            ? `A shipping rate for ${normalizedArea}, ${normalizedState}, ${countryName} already exists`
            : normalizedState
              ? `A shipping rate for ${normalizedState}, ${countryName} already exists`
              : `A country-wide shipping rate for ${countryName} already exists`,
        },
        { status: 400 }
      );
    }

    const newRate = await ShippingRate.create({
      country: normalizedCountry,
      countryName: countryName.trim(),
      state: normalizedState,
      stateCode: stateCode?.trim() || null,
      area: normalizedArea,
      fee,
      isActive,
    });

    return NextResponse.json(
      {
        message: "Shipping rate created successfully",
        data: newRate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create shipping rate error:", error);

    return NextResponse.json(
      { message: "Failed to create shipping rate" },
      { status: 500 }
    );
  }
}