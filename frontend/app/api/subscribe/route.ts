import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 409 }
        );
      }

      // Reactivate if they previously unsubscribed
      existing.isActive = true;
      await existing.save();

      return NextResponse.json(
        { message: "Welcome back! You're subscribed again." },
        { status: 200 }
      );
    }

    // Create new subscriber
    await Subscriber.create({
      email,
      source: body.source || "cta",
    });

    return NextResponse.json(
      { message: "Successfully subscribed" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/subscribe error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}