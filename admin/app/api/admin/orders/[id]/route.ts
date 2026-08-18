import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order, { OrderStatus } from "@/models/Order";
import "@/models/User";
import "@/models/Product";

import {
  sendOrderConfirmedEmail,
  sendOrderShippedEmail,
  sendOrderReadyForPickupEmail,
  sendOrderDeliveredEmail } from "@/lib/email/send"

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

const validOrderStatuses: OrderStatus[] = [
  "processing",
  "confirmed",
  "shipped",
  "ready_for_pickup",
  "delivered",
  "cancelled",
];

const validPaymentStatuses = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

function isValidObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id)
      .populate("userId", "name email phone")
      .populate("items.productId", "name slug")
      .lean();

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      orderStatus,
      paymentStatus,
      channel,
      paidAt,
      trackingNumber,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (orderStatus !== undefined) {
      if (!validOrderStatuses.includes(orderStatus)) {
        return NextResponse.json(
          { message: "Invalid order status" },
          { status: 400 }
        );
      }
      updateData.orderStatus = orderStatus;
    }

    if (paymentStatus !== undefined) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json(
          { message: "Invalid payment status" },
          { status: 400 }
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
        { status: 400 }
      );
    }

    // Previous status (only email when status actually changes)
    const previousOrder = await Order.findById(id)
      .select("orderStatus")
      .lean();

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("userId", "name email phone")
      .populate("items.productId", "name slug")
      .lean();

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // --- Emails (never block the API response) ---
    const statusChanged =
      orderStatus !== undefined &&
      previousOrder &&
      previousOrder.orderStatus !== orderStatus;

    if (statusChanged) {
      const user = order.userId as {
        name?: string;
        email?: string;
      } | null;

      const email = user?.email;
      const name = user?.name ?? "there";
      const orderReference = String(order._id).slice(-8).toUpperCase();

      if (email) {
        try {
          if (orderStatus === "confirmed") {
            await sendOrderConfirmedEmail(email, name, orderReference);
          }

          if (orderStatus === "shipped") {
            const trackingUrl = order.trackingNumber
              ? undefined // or build a carrier URL if you have one
              : undefined;

            await sendOrderShippedEmail(
              email,
              name,
              orderReference,
              trackingUrl
            );
          }

          if (orderStatus === "ready_for_pickup") {
            await sendOrderReadyForPickupEmail(
              email,
              name,
              orderReference
            );
          }

          if (orderStatus === "delivered") {
            await sendOrderDeliveredEmail(email, name, orderReference);
          }
        } catch (emailError) {
          console.error("Order status email failed:", emailError);
        }
      }
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to delete order" },
      { status: 500 }
    );
  }
}