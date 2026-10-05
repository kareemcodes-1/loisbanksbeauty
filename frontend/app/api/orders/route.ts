import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Discount from "@/models/Discount";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getShippingFee } from "@/lib/shipping";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const orders = await Order.find({
      userId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      contact,
      delivery,
      shippingMethod,
      selectedAddressId,
      items,
      paymentMethod,
    } = body;

    if (!contact?.email || !contact?.phone) {
      return NextResponse.json(
        { message: "Contact details are required." },
        { status: 400 }
      );
    }

    if (
      !delivery?.firstName ||
      !delivery?.lastName ||
      !delivery?.address ||
      !delivery?.city ||
      !delivery?.state ||
      !delivery?.postalCode ||
      !delivery?.country
    ) {
      return NextResponse.json(
        { message: "Complete delivery information is required." },
        { status: 400 }
      );
    }

    if (!["pickup", "delivery"].includes(shippingMethod)) {
      return NextResponse.json(
        { message: "Invalid shipping method." },
        { status: 400 }
      );
    }

    if (paymentMethod !== "bank_transfer") {
      return NextResponse.json(
        { message: "Bank transfer is the only available payment method." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Your cart is empty." },
        { status: 400 }
      );
    }

    await connectDB();

    // Extract and filter valid product IDs
    const productIds = items
      .map((item: { productId?: string; _id?: string }) => item.productId || item._id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    if (productIds.length === 0) {
      return NextResponse.json(
        { message: "No valid products found in cart." },
        { status: 400 }
      );
    }

    const products = await Product.find({
      _id: { $in: productIds },
    }).lean();

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { message: "One or more products in your cart are no longer available." },
        { status: 400 }
      );
    }

    const now = new Date();

// Active discounts that include any of these products
const activeDiscounts = await Discount.find({
  isActive: true,
  startsAt: { $lte: now },
  expiresAt: { $gte: now },
  productIds: { $in: productIds },
}).lean();

const orderItems = [];

for (const cartItem of items) {
  const productId = cartItem.productId || cartItem._id;

  if (!productId) {
    return NextResponse.json(
      { message: "A product in your cart is missing an ID." },
      { status: 400 }
    );
  }

  const product = products.find(
    (item) => item._id.toString() === productId.toString()
  );

  if (!product) {
    return NextResponse.json(
      { message: "A product in your cart could not be found." },
      { status: 400 }
    );
  }

  if (!product.inStock) {
    return NextResponse.json(
      { message: `${product.name} is currently out of stock.` },
      { status: 400 }
    );
  }

  const quantity = Number(cartItem.quantity);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return NextResponse.json(
      { message: `Invalid quantity for ${product.name}.` },
      { status: 400 }
    );
  }

  if (
    cartItem.size &&
    Array.isArray(product.sizes) &&
    product.sizes.length > 0 &&
    !product.sizes.includes(cartItem.size)
  ) {
    return NextResponse.json(
      { message: `Invalid size selected for ${product.name}.` },
      { status: 400 }
    );
  }

  const originalPrice = product.price;

  // Find best active discount for this product (if any)
  const productDiscounts = activeDiscounts.filter((d) =>
    (d.productIds || []).some(
      (id: any) => id.toString() === product._id.toString()
    )
  );

  let finalPrice = originalPrice;
  let discountSnapshot: {
    title: string | null;
    discountType: "percentage" | "fixed";
    discountValue: number;
  } | null = null;

  if (productDiscounts.length > 0) {
    // Use the discount that gives the lowest final price
    let bestPrice = originalPrice;
    let bestDiscount = productDiscounts[0];

    for (const d of productDiscounts) {
      let discounted = originalPrice;

      if (d.discountType === "percentage") {
        discounted = originalPrice - (originalPrice * d.discountValue) / 100;
      } else {
        discounted = originalPrice - d.discountValue;
      }

      discounted = Math.max(0, discounted);

      if (discounted < bestPrice) {
        bestPrice = discounted;
        bestDiscount = d;
      }
    }

    finalPrice = bestPrice;
    discountSnapshot = {
      title: bestDiscount.title ?? null,
      discountType: bestDiscount.discountType,
      discountValue: bestDiscount.discountValue,
    };
  }

  orderItems.push({
    productId: product._id,
    name: product.name,
    media: product.media || [],
    price: finalPrice,           // what customer pays
    originalPrice,               // full price
    discount: discountSnapshot,  // null if no discount
    quantity,
    size: cartItem.size || null,
  });
}

    const subtotal = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const shippingFee = getShippingFee(shippingMethod, delivery.country);
    const tax = 0;
    const totalAmount = subtotal + shippingFee + tax;

    const order = await Order.create({
      userId: session.user.id,
      items: orderItems,
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
        paymentMethod: "bank_transfer",
        paymentStatus: "pending",
        transactionReference: null,
        customerNotifiedAt: null,
        paidAt: null,
      },
      orderStatus: "pending",
      shippingMethod,
      trackingNumber: null,
      subtotal,
      shippingFee,
      tax,
      totalAmount,
    });

    void selectedAddressId; // keep for future address-saving logic

    return NextResponse.json(
      {
        message: "Order created successfully.",
        orderId: order._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);

    return NextResponse.json(
      { message: "Failed to create order." },
      { status: 500 }
    );
  }
}