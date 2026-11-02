// app/checkout/success/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { withCallback } from "@/lib/auth-redirect";
import ClearCart from "../clear-cart";

type Props = {
  searchParams: Promise<{ orderId?: string }>;
};

// j***n@gmail.com style, so the full email isn't shown to anyone holding the link
function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  const visible = name.length <= 2 ? name[0] : `${name[0]}***${name[name.length - 1]}`;
  return `${visible}@${domain}`;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  // Session is optional: guests land here too
  const session = await getServerSession(authOptions);

  const { orderId } = await searchParams;
  if (!orderId) redirect("/shop");

  await connectDB();

  const order = await Order.findById(orderId).lean();
  if (!order) redirect("/shop");

  // An order that belongs to an account can only be seen by that account
  if (order.userId && order.userId.toString() !== session?.user?.id) {
    redirect("/shop");
  }

  // Logged in, and either linked to them or placed with their email
  const isOwner =
    !!session?.user?.id &&
    ((!!order.userId && order.userId.toString() === session.user.id) ||
      (!!order.contactEmail &&
        !!session.user.email &&
        order.contactEmail === session.user.email.toLowerCase()));

  const reference =
    order.paymentInfo?.transactionReference ||
    order._id.toString().slice(-8).toUpperCase();

  const isPaid = order.paymentInfo?.paymentStatus === "paid";

  return (
    <div className="min-h-screen px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-[3rem] lg:pb-24 lg:pt-[9rem]">
      <ClearCart />

      <div className="mx-auto max-w-[32rem] text-center">
        <div className="mb-6 flex justify-center sm:mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FD3F92]/10 sm:h-20 sm:w-20">
            <svg
              className="h-8 w-8 text-[#FD3F92] sm:h-10 sm:w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
        </div>

        <span className="subtitle">
          {isPaid ? "Payment successful" : "Thank you"}
        </span>

        <h1 className="heading-2 mt-3">
          {isPaid ? "Order received" : "Payment received"}
        </h1>

        <p className="mx-auto mt-4 max-w-[22rem] text-sm leading-relaxed text-black/60 sm:max-w-[28rem]">
          {isPaid
            ? "Your payment was successful. We're processing your order and will update it within 24–48 hours."
            : "Your payment is being confirmed. Once verified, we'll process your order within 24–48 hours."}
        </p>

        <p className="mt-6 text-sm text-black/50">
          Order reference:{" "}
          <span className="break-all font-medium text-black">{reference}</span>
        </p>

        {/* Guest prompt: orders can only be viewed from an account */}
        {!isOwner && (
          <div className="mx-auto mt-8 max-w-[26rem] rounded-2xl border border-dashed border-[#FD3F92]/40 px-4 py-5 text-left sm:px-6">
            <p className="text-sm font-medium text-black">
              Want to track this order?
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-black/60 sm:text-sm">
              Create an account
              {order.contactEmail ? (
                <>
                  {" "}
                  with{" "}
                  <span className="break-all font-medium text-black">
                    {maskEmail(order.contactEmail)}
                  </span>
                </>
              ) : null}{" "}
              and this order will appear in your order history, where you can
              follow its status.
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href={withCallback("/register", "/orders")}
                className="btn-primary w-full sm:w-auto"
              >
                Create account
              </Link>
              <Link
                href={withCallback("/login", "/orders")}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-black/10 px-6 text-sm font-medium transition hover:bg-black/5 sm:w-auto"
              >
                Log in
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center">
          <Link href="/shop" className="btn-primary w-full sm:w-auto">
            Continue shopping
          </Link>

          {isOwner && (
            <Link
              href="/orders"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-black/10 px-6 text-sm font-medium transition hover:bg-black/5 sm:w-auto"
            >
              View orders
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}