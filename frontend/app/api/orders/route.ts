import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Discount from "@/models/Discount";
import ShippingRate from "@/models/ShippingRate";
import User from "@/models/User";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createBachsCheckoutSession } from "@/lib/bachs";
import { calculateCharges } from "@/lib/charges";
import type { CurrencyCode } from "@/lib/currency";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({
      userId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders error:", error);

    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Session is optional: guests can order too.
    // userId is stored only when the customer is logged in.
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;

    const body = await request.json();

    const {
      contact,
      delivery,
      shippingMethod,
      selectedAddressId,
      selectedShippingRateId,
      items,
      currency: rawCurrency,
    } = body;

    const currency = (
      typeof rawCurrency === "string" ? rawCurrency.toUpperCase() : "NGN"
    ) as CurrencyCode;

    if (!contact?.email || !contact?.phone) {
      return NextResponse.json(
        { message: "Contact details are required." },
        { status: 400 }
      );
    }

    // Normalized so guest orders can be linked to an account by email later
    const contactEmail = String(contact.email).trim().toLowerCase();
    const contactPhone = String(contact.phone).trim();

    if (!/^\S+@\S+\.\S+$/.test(contactEmail)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
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

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Your cart is empty." },
        { status: 400 }
      );
    }

    await connectDB();

    const productIds = items.map(
      (item: { productId?: string; _id?: string }) =>
        item.productId || item._id
    );

    if (
      productIds.some(
        (id: unknown) =>
          typeof id !== "string" ||
          !mongoose.Types.ObjectId.isValid(id)
      )
    ) {
      return NextResponse.json(
        { message: "One or more product IDs are invalid." },
        { status: 400 }
      );
    }

    const uniqueProductIds = [...new Set(productIds as string[])];

    const products = await Product.find({
      _id: { $in: uniqueProductIds },
    }).lean();

    if (products.length !== uniqueProductIds.length) {
      return NextResponse.json(
        {
          message:
            "One or more products in your cart are no longer available.",
        },
        { status: 400 }
      );
    }

    const now = new Date();

    const activeDiscounts = await Discount.find({
      isActive: true,
      startsAt: { $lte: now },
      expiresAt: { $gte: now },
      productIds: { $in: uniqueProductIds },
    }).lean();

    const orderItems = [];

    for (const cartItem of items) {
      const productId = cartItem.productId || cartItem._id;

      const product = products.find(
        (item) => item._id.toString() === productId
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

      const productDiscounts = activeDiscounts.filter((discount) =>
        (discount.productIds || []).some(
          (id: mongoose.Types.ObjectId) =>
            id.toString() === product._id.toString()
        )
      );

      let finalPrice = originalPrice;

      let discountSnapshot: {
        title: string | null;
        discountType: "percentage" | "fixed";
        discountValue: number;
      } | null = null;

      if (productDiscounts.length > 0) {
        let bestPrice = originalPrice;
        let bestDiscount = productDiscounts[0];

        for (const discount of productDiscounts) {
          let discounted = originalPrice;

          if (discount.discountType === "percentage") {
            discounted =
              originalPrice -
              (originalPrice * discount.discountValue) / 100;
          } else {
            discounted = originalPrice - discount.discountValue;
          }

          discounted = Math.max(0, discounted);

          if (discounted < bestPrice) {
            bestPrice = discounted;
            bestDiscount = discount;
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
        price: finalPrice,
        originalPrice,
        discount: discountSnapshot,
        quantity,
        size: cartItem.size || null,
      });
    }

    const subtotal = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    let shippingFee = 0;

    if (shippingMethod === "delivery") {
      if (
        typeof selectedShippingRateId !== "string" ||
        !mongoose.Types.ObjectId.isValid(selectedShippingRateId)
      ) {
        return NextResponse.json(
          { message: "Please select a valid shipping rate." },
          { status: 400 }
        );
      }

      const shippingRate = await ShippingRate.findOne({
        _id: selectedShippingRateId,
        isActive: true,
        country: delivery.country.trim().toUpperCase(),
      }).lean();

      if (!shippingRate) {
        return NextResponse.json(
          {
            message:
              "The selected shipping rate is unavailable for your country.",
          },
          { status: 400 }
        );
      }

      const normalize = (value?: string | null) =>
        value?.trim().toLowerCase() ?? "";

      if (shippingRate.state || shippingRate.stateCode) {
        const selectedState = normalize(delivery.state);

        const matchesState =
          normalize(shippingRate.state) === selectedState ||
          normalize(shippingRate.stateCode) === selectedState;

        if (!matchesState) {
          return NextResponse.json(
            {
              message:
                "The selected shipping rate does not match your delivery state.",
            },
            { status: 400 }
          );
        }
      }

      shippingFee = shippingRate.fee;
    }

    // Tax and subcharge are calculated on the server so the browser can't change them
    const { tax, subcharge, total: totalAmount } = calculateCharges(
      subtotal,
      shippingFee
    );

    const order = await Order.create({
      userId, // null for guests
      contactEmail,
      contactPhone,
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
        paymentProvider: "bachs",
        paymentChannel: null,
        paymentChannelLabel: null,
        paymentStatus: "pending",
        transactionReference: null,
        bachsCheckoutId: null,
        paymentMethodDetails: null,
        amountPaid: null,
        currencyPaid: null,
        paidAt: null,
      },
      orderStatus: "pending",
      shippingMethod,
      trackingNumber: null,
      adminNote: null,
      subtotal,
      shippingFee,
      tax,
      subcharge,
      totalAmount,
    });

    void selectedAddressId;

    if (userId) {
      try {
        await User.updateOne(
          { _id: userId, "addresses.0": { $exists: false } },
          {
            $push: {
              addresses: {
                firstName: delivery.firstName,
                lastName: delivery.lastName,
                address: delivery.address,
                apartment: delivery.apartment || "",
                city: delivery.city,
                state: delivery.state,
                postalCode: delivery.postalCode,
                country: delivery.country,
                isDefault: true,
              },
            },
          }
        );

        // Also remember their phone number if the account has none,
        // since checkout pre-fills it
        await User.updateOne(
          {
            _id: userId,
            $or: [{ phone: { $exists: false } }, { phone: null }, { phone: "" }],
          },
          { $set: { phone: contactPhone } }
        );
      } catch (saveError) {
        console.error("Failed to save default address:", saveError);
      }
    }

    const orderId = order._id.toString();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      console.error("NEXT_PUBLIC_APP_URL is not set");

      return NextResponse.json(
        {
          message: "Order created but payment could not be started.",
          orderId,
        },
        { status: 502 }
      );
    }

    try {
      const bachsSession = await createBachsCheckoutSession({
        amount: totalAmount, // NGN total including tax and subcharge
        currency, // from storefront → drives Bachs pricing
        orderId,
        customer: {
          email: contactEmail,
          name: `${delivery.firstName} ${delivery.lastName}`,
          phone: contactPhone,
        },
        successUrl: `${appUrl}/checkout/success?orderId=${orderId}`,
        cancelUrl: `${appUrl}/checkout?cancelled=1`,
      });

      order.paymentInfo.bachsCheckoutId = bachsSession.checkout_id;
      await order.save();

      return NextResponse.json(
        {
          message: "Order created successfully.",
          orderId,
          checkoutUrl: bachsSession.checkout_url,
        },
        { status: 201 }
      );
    } catch (bachsError) {
      console.error("Bachs checkout session failed:", bachsError);

      return NextResponse.json(
        {
          message:
            "Order created but payment could not be started. Please try again.",
          orderId,
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("POST /api/orders error:", error);

    return NextResponse.json(
      { message: "Failed to create order." },
      { status: 500 }
    );
  }
}