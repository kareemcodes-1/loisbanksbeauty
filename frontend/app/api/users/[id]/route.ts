import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    const user = await User.findById(id)
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch user",
      },
      {
        status: 500,
      }
    );
  }
}