import "server-only";

import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import {
  sendNewProductEmail,
  sendNewDiscountEmail,
} from "@/lib/email/send";

/** Active newsletter subscribers only */
export async function getActiveSubscriberEmails(): Promise<string[]> {
  await connectDB();

  const subscribers = await Subscriber.find({ isActive: true })
    .select("email")
    .lean();

  return subscribers.map((s) => s.email);
}

/**
 * Notify all active subscribers about a new product.
 * Failures are logged; they should not break product creation.
 */
export async function notifySubscribersNewProduct(props: {
  productName: string;
  productImage?: string;
  productSlug: string;
  price: string;
}) {
  const emails = await getActiveSubscriberEmails();

  if (emails.length === 0) return;

  // Sequential is safer for rate limits; switch to batches later if needed
  for (const email of emails) {
    try {
      await sendNewProductEmail(email, props);
    } catch (error) {
      console.error(`New product email failed for ${email}:`, error);
    }
  }
}

/**
 * Notify all active subscribers about a new discount.
 */
export async function notifySubscribersNewDiscount(props: {
  title: string;
  description: string;
  discountLabel: string;
  expiresAt?: string;
}) {
  const emails = await getActiveSubscriberEmails();

  if (emails.length === 0) return;

  for (const email of emails) {
    try {
      await sendNewDiscountEmail(email, props);
    } catch (error) {
      console.error(`New discount email failed for ${email}:`, error);
    }
  }
}