import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import {
  verifyBachsWebhook,
  mapBachsPaymentChannel,
} from "@/lib/bachs";
import { sendOrderReceivedEmail } from "@/lib/email/send";
import { CURRENCIES } from "@/lib/currency";

export async function POST(request: Request) {
  const rawBody = await request.text();

  const secret = process.env.BACHS_WEBHOOK_SECRET;

  if (!secret || secret === "whsec_xxxxx") {
    console.error("BACHS_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { message: "Webhook not configured" },
      { status: 500 }
    );
  }

  const valid = verifyBachsWebhook({
    rawBody,
    signatureHeader: request.headers.get("x-bachs-signature"),
    signatureV2Header: request.headers.get("x-bachs-signature-v2"),
    timestampHeader: request.headers.get("x-bachs-timestamp"),
    secret,
  });

  if (!valid) {
    return NextResponse.json(
      { message: "Invalid signature" },
      { status: 401 }
    );
  }

  let event: {
    id: string;
    type: string;
    data?: {
      checkout_id?: string | null;
      reference?: string | null;
      charge_id?: string | null;
      status?: string;
      amount?: string | null;
      currency?: string | null;
      // Corridor name: CARD, USD_CARD, NGN_BANK_TRANSFER, etc.
      payment_method?: string | null;
      payment_method_details?: {
        type?: string;
        [key: string]: unknown;
      } | null;
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  try {
    await connectDB();

    if (event.type === "collection.succeeded") {
      const data = event.data;
      const checkoutId = data?.checkout_id ?? null;
      const reference = data?.reference ?? null;
      const chargeId = data?.charge_id ?? null;
      const details = data?.payment_method_details ?? null;

      // Prefer payment_method (CARD / USD_CARD / NGN_BANK_TRANSFER)
      // then fall back to payment_method_details.type (bank_transfer, etc.)
      const rawMethod =
        data?.payment_method || details?.type || null;

      let { channel, label } = mapBachsPaymentChannel(rawMethod);

      // Optional fallback: fetch payment if still unknown
      if (channel === "unknown" && chargeId) {
        try {
          const base =
            process.env.BACHS_API_BASE || "https://sandbox-api.bachs.io";
          const res = await fetch(`${base}/v1/payments/${chargeId}`, {
            headers: {
              Authorization: `Bearer ${process.env.BACHS_SECRET_KEY}`,
            },
          });

          if (res.ok) {
            const payment = await res.json();
            const fromPayment =
              payment.payment_method ||
              payment.payment_method_details?.type ||
              null;
            const mapped = mapBachsPaymentChannel(fromPayment);
            channel = mapped.channel;
            label = mapped.label;
          }
        } catch (fetchError) {
          console.error("Bachs payment fetch failed:", fetchError);
        }
      }

      const order =
        (reference && (await Order.findById(reference))) ||
        (checkoutId &&
          (await Order.findOne({
            "paymentInfo.bachsCheckoutId": checkoutId,
          })));

      if (!order) {
        console.warn("Bachs webhook: order not found", {
          reference,
          checkoutId,
          eventId: event.id,
        });
        return NextResponse.json({ received: true });
      }

      // Already processed: skip, so the customer never gets a duplicate email
      if (order.paymentInfo.paymentStatus === "paid") {
        return NextResponse.json({ received: true });
      }

      order.paymentInfo.paymentStatus = "paid";
      order.paymentInfo.paidAt = new Date();
      order.paymentInfo.paymentChannel = channel;
      order.paymentInfo.paymentChannelLabel = label;
      order.paymentInfo.paymentMethodDetails = details;
      order.paymentInfo.amountPaid = data?.amount ?? null;
      order.paymentInfo.currencyPaid = data?.currency ?? null;

      if (chargeId) {
        order.paymentInfo.transactionReference = chargeId;
      }

      // orderStatus stays pending — admin confirms later
      await order.save();

      // ==========================================
      // Email the customer: "we received your order"
      // Never let an email problem fail the webhook,
      // or Bachs will keep retrying it.
      // ==========================================
      try {
        if (order.contactEmail) {
          // Show prices in the currency they paid in, if we support it
          const paidCurrency = CURRENCIES.find(
            (c) =>
              c.code === order.paymentInfo.currencyPaid?.toUpperCase()
          )?.code;

          await sendOrderReceivedEmail({
            to: order.contactEmail,
            orderId: order._id.toString(),
            reference: order.paymentInfo.transactionReference,
            customerName: order.shippingAddress.firstName,
            items: order.items.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              size: item.size,
            })),
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentInfo.paymentChannelLabel,
            currency: paidCurrency,
            isGuest: !order.userId,
          });
        }
      } catch (emailError) {
        console.error("Failed to send order received email:", emailError);
      }
    }

    if (event.type === "collection.failed") {
      const checkoutId = event.data?.checkout_id ?? null;
      const reference = event.data?.reference ?? null;

      const order =
        (reference && (await Order.findById(reference))) ||
        (checkoutId &&
          (await Order.findOne({
            "paymentInfo.bachsCheckoutId": checkoutId,
          })));

      if (order && order.paymentInfo.paymentStatus === "pending") {
        order.paymentInfo.paymentStatus = "failed";
        await order.save();
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Bachs webhook error:", error);
    return NextResponse.json(
      { message: "Webhook handler failed" },
      { status: 500 }
    );
  }
}