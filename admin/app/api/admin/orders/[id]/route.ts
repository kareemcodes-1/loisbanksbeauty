import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order, { OrderStatus } from "@/models/Order";
import "@/models/User";
import "@/models/Product";

import {
  sendOrderConfirmedEmail,
  sendOrderShippedEmail,
  sendOrderOutForDeliveryEmail,
  sendOrderReadyForPickupEmail,
  sendOrderDeliveredEmail,
} from "@/lib/email/send";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

const validOrderStatuses: OrderStatus[] = [
  "processing",
  "confirmed",
  "shipped",
  "out_for_delivery",
  "ready_for_pickup",
  "delivered",
  "cancelled",
];

const validPaymentStatuses = ["pending", "paid", "failed", "refunded"] as const;

function isValidObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 },
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 },
      );
    }

    const order = await Order.findById(id)
      .populate("userId", "name email phone")
      .populate("items.productId", "name slug")
      .lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 },
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const { orderStatus, paymentStatus, channel, paidAt, trackingNumber } =
      body;

    const updateData: Record<string, unknown> = {};

    if (orderStatus !== undefined) {
      if (!validOrderStatuses.includes(orderStatus)) {
        return NextResponse.json(
          { message: "Invalid order status" },
          { status: 400 },
        );
      }

      updateData.orderStatus = orderStatus;
    }

    if (paymentStatus !== undefined) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json(
          { message: "Invalid payment status" },
          { status: 400 },
        );
      }

      updateData["paymentInfo.paymentStatus"] = paymentStatus;
    }

    if (channel !== undefined) {
      updateData["paymentInfo.channel"] = channel;
    }

    if (paidAt !== undefined) {
      updateData["paymentInfo.paidAt"] = paidAt;
    }

    if (trackingNumber !== undefined) {
      updateData.trackingNumber =
        trackingNumber === null || trackingNumber === ""
          ? null
          : String(trackingNumber).trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields provided for update" },
        { status: 400 },
      );
    }

    // Previous status (only send email when status actually changes)
    const previousOrder = await Order.findById(id).select("orderStatus").lean();

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    )
      .populate("userId", "name email phone")
      .populate("items.productId", "name slug")
      .lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // --- Emails (never block the API response) ---
    const statusChanged =
      orderStatus !== undefined &&
      previousOrder &&
      previousOrder.orderStatus !== orderStatus;

      console.log("=== ORDER STATUS UPDATE ===");
console.log("Order ID:", id);
console.log("Previous status:", previousOrder?.orderStatus);
console.log("New status:", orderStatus);
console.log("Status changed:", statusChanged);
console.log("User:", order.userId);
console.log("User email:", (order.userId as { email?: string })?.email);
console.log("User name:", (order.userId as { name?: string })?.name);
console.log("============================");

    if (statusChanged) {
  console.log(">>> ENTERED STATUS EMAIL BLOCK");

  const user = order.userId as {
    name?: string;
    email?: string;
  } | null;

  const email = user?.email;
  const name = user?.name ?? "there";
  const orderReference = String(order._id).slice(-8).toUpperCase();

  console.log(">>> EMAIL:", email);
  console.log(">>> ORDER STATUS:", orderStatus);

  if (email) {
    console.log(">>> ABOUT TO SEND CONFIRMED EMAIL");

    try {
      if (orderStatus === "confirmed") {
        console.log(">>> CALLING sendOrderConfirmedEmail");

        await sendOrderConfirmedEmail(email, name, {
          orderReference,
          items: order.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.media?.[0]?.url,
            size: item.size,
          })),
          subtotal: order.subtotal,
          shippingFee: order.shippingFee,
          tax: order.tax,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentInfo.channel ?? "Paystack",
          shippingMethod: order.shippingMethod,
        });

        console.log(">>> CONFIRMED EMAIL SENT");
      }
    } catch (emailError) {
      console.error("Order status email failed:", emailError);
    }
  } else {
    console.log(">>> NO EMAIL FOUND");
  }
}

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 },
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 },
      );
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to delete order" },
      { status: 500 },
    );
  }
}
