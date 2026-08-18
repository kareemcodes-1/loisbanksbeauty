import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs"; // or whatever you use

import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const currentPassword =
      typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword =
      typeof body.newPassword === "string" ? body.newPassword : "";

    if (!name || name.length < 2) {
      return NextResponse.json(
        { message: "Name must be at least 2 characters." },
        { status: 400 },
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Please enter a valid email." },
        { status: 400 },
      );
    }

    if (!phone || phone.length < 7) {
      return NextResponse.json(
        { message: "Please enter a valid phone number." },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id).select(
      "+password name email phone",
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Email uniqueness
    if (email !== user.email) {
      const taken = await User.exists({
        email,
        _id: { $ne: user._id },
      });
      if (taken) {
        return NextResponse.json(
          { message: "That email is already in use." },
          { status: 409 },
        );
      }
    }

    // Password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: "Current password is required." },
          { status: 400 },
        );
      }

      const matches = await bcrypt.compare(currentPassword, user.password);
      if (!matches) {
        return NextResponse.json(
          { message: "Current password is incorrect." },
          { status: 400 },
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { message: "New password must be at least 8 characters." },
          { status: 400 },
        );
      }

      user.password = await bcrypt.hash(newPassword, 12);
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    await user.save();

    return NextResponse.json({
      message: "Profile updated.",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("PATCH /api/profile", error);
    return NextResponse.json(
      { message: "Failed to update profile." },
      { status: 500 },
    );
  }
}