import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";

export async function GET() {
  try {
    await connectDB();

    const collections = await Collection.find({
      featured: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(collections, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/collections error:", error);

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