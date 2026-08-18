import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { contactEmailTemplate } from "@/lib/email-templates/contact-email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const subject = String(body?.subject ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const receiver =
      process.env.CONTACT_RECEIVER_EMAIL || "lbanksluxuryhairs@gmail.com";

    const { error } = await resend.emails.send({
      from: "Lois Banks Beauty <onboarding@resend.dev>",
      to: receiver,
      replyTo: email,
      subject: `New Enquiry: ${subject}`,
      html: contactEmailTemplate({ name, email, subject, message }),
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("POST /api/contact error:", error);

    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 },
    );
  }
}