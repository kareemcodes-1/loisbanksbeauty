
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";

const isStrongPassword = (password: string) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword
        : "";

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    const emailUpdates =
      typeof body.emailUpdates === "boolean"
        ? body.emailUpdates
        : false;

    // ==========================================
    // Basic validation
    // ==========================================

    if (!name || name.length < 2) {
      return NextResponse.json(
        {
          message: "Name must be at least 2 characters.",
        },
        { status: 400 },
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        {
          message: "Please enter a valid email.",
        },
        { status: 400 },
      );
    }

    if (!phone || phone.length < 7) {
      return NextResponse.json(
        {
          message: "Please enter a valid phone number.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    // ==========================================
    // Get current user
    // ==========================================

    const user = await User.findById(session.user.id).select(
      "+password name email phone",
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 },
      );
    }

    const previousEmail = user.email;

    // ==========================================
    // Email uniqueness
    // ==========================================

    if (email !== previousEmail) {
      const taken = await User.exists({
        email,
        _id: { $ne: user._id },
      });

      if (taken) {
        return NextResponse.json(
          {
            message: "That email is already in use.",
          },
          { status: 409 },
        );
      }
    }

    // ==========================================
    // Password change
    // ==========================================

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          {
            message: "Current password is required.",
          },
          { status: 400 },
        );
      }

      const matches = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!matches) {
        return NextResponse.json(
          {
            message: "Current password is incorrect.",
          },
          { status: 400 },
        );
      }

      if (!isStrongPassword(newPassword)) {
        return NextResponse.json(
          {
            message:
              "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and symbol.",
          },
          { status: 400 },
        );
      }

      user.password = await bcrypt.hash(
        newPassword,
        12,
      );
    }

    // ==========================================
    // Update user
    // ==========================================

    user.name = name;
    user.email = email;
    user.phone = phone;

    await user.save();

    // ==========================================
    // Email subscription
    // ==========================================

    if (emailUpdates) {
      // Subscribe the current/new email.
      await Subscriber.findOneAndUpdate(
        { email },
        {
          $set: {
            email,
            isActive: true,
          },
          $setOnInsert: {
            source: "profile",
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );

      // If the user changed their email,
      // deactivate the old subscription.
      if (previousEmail !== email) {
        await Subscriber.findOneAndUpdate(
          { email: previousEmail },
          {
            $set: {
              isActive: false,
            },
          },
        );
      }
    } else {
      // User unchecked "Get email updates".
      await Subscriber.findOneAndUpdate(
        { email },
        {
          $set: {
            isActive: false,
          },
        },
      );

      // If they changed their email, also deactivate
      // any subscription attached to the old email.
      if (previousEmail !== email) {
        await Subscriber.findOneAndUpdate(
          { email: previousEmail },
          {
            $set: {
              isActive: false,
            },
          },
        );
      }
    }

    // ==========================================
    // Response
    // ==========================================

    return NextResponse.json({
      message: "Profile updated.",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailUpdates,
      },
    });
  } catch (error) {
    console.error("PATCH /api/profile", error);

    return NextResponse.json(
      {
        message: "Failed to update profile.",
      },
      { status: 500 },
    );
  }
}

