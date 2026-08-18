import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Discount from "@/models/Discount";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const discount = await Discount.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!discount) {
      return NextResponse.json(
        { message: "Discount not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(discount, { status: 200 });
  } catch (error) {
    console.error("PUT /api/admin/discounts/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update discount" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const discount = await Discount.findByIdAndDelete(id);

    if (!discount) {
      return NextResponse.json(
        { message: "Discount not found" },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/admin/discounts/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete discount" },
      { status: 500 }
    );
  }
}