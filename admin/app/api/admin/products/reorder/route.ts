import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const orderedIds: unknown = body?.orderedIds;

    if (
      !Array.isArray(orderedIds) ||
      orderedIds.length === 0 ||
      orderedIds.some(
        (id) => typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)
      ) ||
      new Set(orderedIds).size !== orderedIds.length
    ) {
      return NextResponse.json(
        { message: "Invalid product list." },
        { status: 400 }
      );
    }

    await connectDB();

    await Product.bulkWrite(
      (orderedIds as string[]).map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order: index } },
        },
      }))
    );

    return NextResponse.json({ message: "Order saved" }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/admin/products/reorder error:", error);
    return NextResponse.json(
      { message: "Failed to save order" },
      { status: 500 }
    );
  }
}