import { NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmailVerificationEmail } from "@/lib/email/send";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Unable to send verification code." },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified." },
        { status: 400 }
      );
    }

    // Generate a 6-digit verification code
    const code = crypto
      .randomInt(100000, 1000000)
      .toString();

    // Code expires in 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.emailVerificationCode = code;
    user.emailVerificationCodeExpires = expiresAt;
    user.emailVerificationAttempts = 0;

    await user.save();

    await sendEmailVerificationEmail(
      user.email,
      user.name,
      code
    );

    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send verification error:", error);

    return NextResponse.json(
      {
        message: "Failed to send verification code.",
      },
      { status: 500 }
    );
  }
}