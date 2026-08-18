
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/actions/order.actions";
import OrderDetails from "../components/order-details";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Order Details",
    description: "View the full details of your order.",
  };
}

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;

  const { order, error } = await getOrderById(id);

  if (error === "Unauthorized") {
    redirect("/login?callbackUrl=/orders");
  }

  if (error === "Order not found" || !order) {
    notFound();
  }

  return (
    <div className="min-h-screen px-6 pb-24 pt-[9rem] lg:px-[3rem]">
      <div className="mx-auto max-w-[72rem]">
        <OrderDetails order={order} />
      </div>
    </div>
  );
}