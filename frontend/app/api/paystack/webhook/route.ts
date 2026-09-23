import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      console.error("PAYSTACK_SECRET_KEY is missing");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get the raw request body BEFORE parsing JSON
    const rawBody = await request.text();

    // Paystack sends this signature with every webhook
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        { message: "Missing Paystack signature" },
        { status: 401 }
      );
    }

    // Verify that the request actually came from Paystack
    const expectedSignature = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    const signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(signature, "utf8"),
      Buffer.from(expectedSignature, "utf8")
    );

    if (!signaturesMatch) {
      console.error("Invalid Paystack webhook signature");

      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);

    // console.log("=== PAYSTACK WEBHOOK ===");
    // console.log("Event:", event.event);
    // console.log("Reference:", event.data?.reference);
    // console.log("Status:", event.data?.status);
    // console.log("========================");

    // We only care about successful payments
    if (event.event !== "charge.success") {
      return NextResponse.json(
        { received: true },
        { status: 200 }
      );
    }

    const transaction = event.data;

    if (!transaction?.reference) {
      console.error("Paystack webhook missing transaction reference");

      return NextResponse.json(
        { message: "Missing transaction reference" },
        { status: 400 }
      );
    }

    if (transaction.status !== "success") {
      return NextResponse.json(
        { received: true },
        { status: 200 }
      );
    }

    const orderId = transaction.metadata?.orderId;

    if (!orderId) {
      console.error(
        "Paystack webhook missing orderId in metadata",
        transaction.reference
      );

      return NextResponse.json(
        { message: "Missing order ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findById(orderId);

    if (!order) {
      console.error(
        "Order not found for Paystack webhook:",
        orderId
      );

      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Idempotency:
    // Paystack can send the same webhook more than once.
    // Don't process an already-paid order again.
    if (order.paymentInfo.paymentStatus === "paid") {
      console.log(
        "Order already paid, ignoring duplicate webhook:",
        order._id.toString()
      );

      return NextResponse.json(
        { received: true },
        { status: 200 }
      );
    }

    // Update payment information
    order.paymentInfo = {
      transactionId: transaction.reference,
      gateway: "paystack",
      paymentStatus: "paid",
      channel: transaction.channel || null,
      paidAt: transaction.paid_at
        ? new Date(transaction.paid_at)
        : new Date(),
    };

    // Payment is received, but the business still needs to process the order
    order.orderStatus = "processing";

    await order.save();

    console.log(
      "Payment confirmed through Paystack webhook:",
      order._id.toString()
    );

    return NextResponse.json(
      { received: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Paystack webhook error:", error);

    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}