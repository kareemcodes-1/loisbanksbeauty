// app/api/paystack/initialize/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrency } from "@/lib/currency";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      contact,
      delivery,
      shippingMethod,
      shippingFee,
      selectedAddressId,
      items,
      subtotal,
      totalAmount,
      currency = "NGN",
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    if (!contact?.email || !delivery?.firstName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    if (!shippingMethod || !["pickup", "delivery"].includes(shippingMethod)) {
      return NextResponse.json(
        { message: "Shipping method is required" },
        { status: 400 },
      );
    }

    const pendingOrder = await Order.create({
      userId: session.user.id,
      items: items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        media: item.media || [],
        price: item.price,
        quantity: item.quantity,
        size: item.size ?? null,
      })),
      shippingAddress: {
        firstName: delivery.firstName,
        lastName: delivery.lastName,
        address: delivery.address,
        apartment: delivery.apartment || "",
        city: delivery.city,
        state: delivery.state,
        postalCode: delivery.postalCode,
        country: delivery.country,
      },
      paymentInfo: {
        transactionId: "pending",
        gateway: "paystack",
        paymentStatus: "pending",
        channel: null,
        paidAt: null,
      },
      orderStatus: "processing",
      shippingMethod, // ← required
      subtotal,
      shippingFee: shippingMethod === "delivery" ? shippingFee || 0 : 0,
      tax: 0,
      totalAmount,
    });

    // Currency conversion
    const { rateFromNgn, code } = getCurrency(currency);
    const totalInSelectedCurrency = totalAmount * rateFromNgn;
    const multiplier = code === "KWD" ? 1000 : 100;
    const amountForPaystack = Math.round(totalInSelectedCurrency * multiplier);

    // Call Paystack
    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: contact.email,
          amount: amountForPaystack,
          currency: code,
          reference: `LB-${pendingOrder._id}-${Date.now()}`,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/callback`,
          metadata: {
            orderId: pendingOrder._id.toString(),
            userId: session.user.id,
            selectedAddressId,
            custom_fields: [
              {
                display_name: "Order ID",
                variable_name: "order_id",
                value: pendingOrder._id.toString(),
              },
            ],
          },
        }),
      },
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      await Order.findByIdAndDelete(pendingOrder._id);
      return NextResponse.json(
        { message: paystackData.message || "Failed to initialize payment" },
        { status: 400 },
      );
    }

    // Save Paystack reference
    pendingOrder.paymentInfo.transactionId = paystackData.data.reference;
    await pendingOrder.save();

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference,
    });
  } catch (error) {
    console.error("Paystack initialize error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
