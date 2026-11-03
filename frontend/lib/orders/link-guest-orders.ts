import mongoose from "mongoose";
import Order from "@/models/Order";

/**
 * Attach guest orders (userId = null) to a user, matched by the
 * email the order was placed with. Returns how many were linked.
 */
export async function linkGuestOrders(
  userId: string | mongoose.Types.ObjectId,
  email: string
) {
  const result = await Order.updateMany(
    { userId: null, contactEmail: email.toLowerCase().trim() },
    { $set: { userId } }
  );

  return result.modifiedCount;
}