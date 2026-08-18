// app/checkout/callback/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

type Props = {
  searchParams: Promise<{ reference?: string }>;
};

export default async function CheckoutCallbackPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { reference } = await searchParams;

  if (!reference) {
    redirect("/checkout?error=missing_reference");
  }

  await connectDB();

  // 1. Verify with Paystack
  const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const verifyData = await verifyRes.json();

  if (!verifyData.status || verifyData.data.status !== "success") {
    redirect("/checkout?error=payment_failed");
  }

  const { metadata, amount, channel, paid_at } = verifyData.data;
  const orderId = metadata?.orderId;

  if (!orderId) {
    redirect("/checkout?error=invalid_order");
  }

  // 2. Find the pending order
  const order = await Order.findById(orderId);
  if (!order || order.userId.toString() !== session.user.id) {
    redirect("/checkout?error=order_not_found");
  }

  // Already processed?
  if (order.paymentInfo.paymentStatus === "paid") {
    redirect(`/checkout/success?orderId=${order._id}`);
  }

  // 3. Update order to paid
  order.paymentInfo = {
    transactionId: reference,
    gateway: "paystack",
    paymentStatus: "paid",
    channel: channel || null,
    paidAt: paid_at ? new Date(paid_at) : new Date(),
  };
  order.orderStatus = "processing";
  await order.save();

  // 4. Save address to user if it was a new address
  const selectedAddressId = metadata?.selectedAddressId;

  if (selectedAddressId === "new") {
    const user = await User.findById(session.user.id);
    if (user) {
      // Set all existing addresses to non-default
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });

      user.addresses.push({
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        address: order.shippingAddress.address,
        apartment: order.shippingAddress.apartment || "",
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country,
        isDefault: true,
      });

      await user.save();
    }
  }

  // 5. Redirect to success page
  redirect(`/checkout/success?orderId=${order._id}`);
}