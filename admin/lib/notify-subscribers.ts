import "server-only";

import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import {
  sendNewProductEmail,
  sendNewDiscountEmail,
} from "@/lib/email/send";

type ActiveSubscriber = {
  email: string;
  unsubscribeToken: string;
};

/** Active newsletter subscribers only */
export async function getActiveSubscribers(): Promise<ActiveSubscriber[]> {
  await connectDB();

  const subscribers = await Subscriber.find({ isActive: true })
    .select("email unsubscribeToken")
    .lean();

  return subscribers.map((s) => ({
    email: s.email,
    unsubscribeToken: s.unsubscribeToken,
  }));
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
  originalPrice?: string;
  discountLabel?: string;
  description?: string;
}) {
  const subscribers = await getActiveSubscribers();

  if (subscribers.length === 0) return;

  for (const subscriber of subscribers) {
    try {
      await sendNewProductEmail(subscriber.email, {
        ...props,
        unsubscribeToken: subscriber.unsubscribeToken,
      });
    } catch (error) {
      console.error(
        `New product email failed for ${subscriber.email}:`,
        error
      );
    }
  }
}

/**
 * Notify all active subscribers about a new discount.
 */
export async function notifySubscribersNewDiscount(props: {
  title: string;
  description?: string;
  discountLabel: string;
  expiresAt?: string;
  productCount?: number;
}) {
  const subscribers = await getActiveSubscribers();

  if (subscribers.length === 0) return;

  for (const subscriber of subscribers) {
    try {
      await sendNewDiscountEmail(subscriber.email, {
        ...props,
        unsubscribeToken: subscriber.unsubscribeToken,
      });
    } catch (error) {
      console.error(
        `New discount email failed for ${subscriber.email}:`,
        error
      );
    }
  }
}