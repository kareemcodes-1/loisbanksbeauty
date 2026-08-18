import { NextResponse } from "next/server";
import HeroBanner from "@/models/HeroBanner";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const heroBanner = await HeroBanner.findOne().lean();

    if (!heroBanner) {
      return NextResponse.json(
        { message: "Hero banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(heroBanner, { status: 200 });
  } catch (error) {
    console.error("GET /api/hero-banner error:", error);

    return NextResponse.json(
      { message: "Failed to fetch hero banner" },
      { status: 500 }
    );
  }
}