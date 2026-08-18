import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email/send";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // Always same response (no email enumeration)
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account with that email exists, a reset link has been sent.",
        },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    try {
      await sendPasswordResetEmail(
        user.email,
        user.name || "there",
        resetUrl
      );
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Still return generic success
    }

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, a reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}