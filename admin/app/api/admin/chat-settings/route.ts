import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust path
import connectDB from "@/lib/mongodb";
import ChatSettings from "@/models/ChatSettings";

async function getOrCreateSettings() {
  let settings = await ChatSettings.findOne();
  if (!settings) {
    settings = await ChatSettings.create({});
  }
  return settings;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const settings = await getOrCreateSettings();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/chat-settings error:", error);
    return NextResponse.json(
      { message: "Failed to fetch chat settings" },
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

    const settings = await getOrCreateSettings();

    settings.brandName = body.brandName?.trim() ?? settings.brandName;
    settings.about = body.about?.trim() ?? "";
    settings.owner = body.owner?.trim() ?? "";
    settings.yearsActive = body.yearsActive?.trim() ?? "";
    settings.email = body.email?.trim() ?? "";
    settings.phone = body.phone?.trim() ?? "";
    settings.whatsapp = body.whatsapp?.trim() ?? "";
    settings.storeLocation = body.storeLocation?.trim() ?? "";
    settings.howToOrder = body.howToOrder?.trim() ?? "";
    settings.adminInstructions = body.adminInstructions?.trim() ?? "";

    if (Array.isArray(body.faqs)) {
      settings.faqs = body.faqs
        .filter(
          (f: { question?: string; answer?: string }) =>
            f.question?.trim() && f.answer?.trim()
        )
        .map((f: { question: string; answer: string }) => ({
          question: f.question.trim(),
          answer: f.answer.trim(),
        }));
    }

    await settings.save();

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("PUT /api/admin/chat-settings error:", error);
    return NextResponse.json(
      { message: "Failed to update chat settings" },
      { status: 500 }
    );
  }
}