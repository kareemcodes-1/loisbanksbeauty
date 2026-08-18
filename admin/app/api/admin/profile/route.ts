import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust path if needed
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id)
      .select("name email phone role createdAt")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/profile error:", error);
    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { name, email, phone } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existing = await User.findOne({
      email: email.trim().toLowerCase(),
      _id: { $ne: session.user.id },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 409 }
      );
    }

    const updated = await User.findByIdAndUpdate(
      session.user.id,
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || "",
      },
      { new: true, runValidators: true }
    ).select("name email phone role createdAt");

    if (!updated) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/admin/profile error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.id;

    // Delete the admin account
    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Optional: cascade delete (uncomment & expand later if needed)
    // await Promise.all([
    //   Product.deleteMany({ createdBy: userId }),
    //   Collection.deleteMany({ createdBy: userId }),
    //   Discount.deleteMany({ createdBy: userId }),
    //   // etc.
    // ]);

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/admin/profile error:", error);
    return NextResponse.json(
      { message: "Failed to delete account" },
      { status: 500 }
    );
  }
}