import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import "@/models/Product";

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function isValidObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const user = await User.findById(id)
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Don't expose admin accounts via this endpoint
    if (user.role === "admin") {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const orders = await Order.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(
      {
        ...user,
        orderCount: orders.length,
        orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/users/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT — Update user
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await request.json();

    const {
      name,
      email,
      password,
      phone,
      role,
      addresses,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      updateData.email = email.toLowerCase().trim();
    }

    if (phone !== undefined) {
      updateData.phone = phone;
    }

    if (role !== undefined) {
      updateData.role = role;
    }

    if (addresses !== undefined) {
      updateData.addresses = addresses;
    }

    // Only hash password when a new password is provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
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
  } catch (error: any) {
    console.error("PUT /api/users/[id] error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: "A user with this email already exists",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to update user",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE — Delete user
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const user = await User.findByIdAndDelete(id);

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

    return NextResponse.json(
      {
        message: "User deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete user",
      },
      {
        status: 500,
      }
    );
  }
}