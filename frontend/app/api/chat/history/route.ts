// app/api/chat/history/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust if needed

import connectDB from "@/lib/mongodb";
import ChatConversation from "@/models/ChatConversation";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Guests have no saved history
    if (!session?.user?.id) {
      return NextResponse.json({ messages: [] });
    }

    await connectDB();

    const conversation = await ChatConversation.findOne({
      userId: session.user.id,
    })
      .select("messages")
      .lean();

    const messages =
      conversation?.messages?.map((m: any) => ({
        id: m._id?.toString() || crypto.randomUUID(),
        role: m.role as "user" | "assistant",
        content: m.content as string,
      })) || [];

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Chat history error:", error);
    return NextResponse.json({ messages: [] });
  }
}