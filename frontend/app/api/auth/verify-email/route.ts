import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();

    const code = String(body?.code ?? "").trim();

    if (!email || !code) {
      return NextResponse.json(
        {
          message:
            "Email and verification code are required.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          message:
            "Verification code must be 6 digits.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email }).select(
      "+emailVerificationCode +emailVerificationCodeExpires +emailVerificationAttempts"
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        {
          message: "Email is already verified.",
        },
        { status: 400 }
      );
    }

    if (
      !user.emailVerificationCode ||
      !user.emailVerificationCodeExpires
    ) {
      return NextResponse.json(
        {
          message:
            "No active verification code. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Check expiration
    if (user.emailVerificationCodeExpires < new Date()) {
      user.emailVerificationCode = undefined;
      user.emailVerificationCodeExpires = undefined;
      user.emailVerificationAttempts = 0;

      await user.save();

      return NextResponse.json(
        {
          message:
            "Verification code has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Check verification attempts
    const attempts = user.emailVerificationAttempts ?? 0;

    if (attempts >= 5) {
      return NextResponse.json(
        {
          message:
            "Too many incorrect attempts. Please request a new code.",
        },
        { status: 429 }
      );
    }

    // Check code
    if (user.emailVerificationCode !== code) {
      user.emailVerificationAttempts = attempts + 1;

      await user.save();

      const remainingAttempts =
        5 - (attempts + 1);

      return NextResponse.json(
        {
          message:
            remainingAttempts > 0
              ? `Invalid verification code. ${remainingAttempts} attempt${
                  remainingAttempts === 1 ? "" : "s"
                } remaining.`
              : "Invalid verification code. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Verification successful
    user.emailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationCodeExpires = undefined;
    user.emailVerificationAttempts = 0;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify email error:", error);

    return NextResponse.json(
      {
        message: "Failed to verify email.",
      },
      { status: 500 }
    );
  }
}