import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ChatSettings from "@/models/ChatSettings";

export async function GET() {
  try {
    await connectDB();

    let settings = await ChatSettings.findOne().lean();
    if (!settings) {
      const created = await ChatSettings.create({});
      settings = created.toObject();
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("GET /api/chat-settings error:", error);
    return NextResponse.json(
      { message: "Failed to fetch chat settings" },
      { status: 500 }
    );
  }
}