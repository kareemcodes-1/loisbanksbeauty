// lib/send-emails.ts
import { resend, FROM_EMAIL } from "./email";
import WelcomeEmail from "@/app/components/emails/welcome";
import OrderConfirmationEmail from "@/app/components/emails/order-confirmation";
import NewProductEmail from "@/app/components/emails/new-product";
import OrderReceivedEmail from "@/app/components/emails/order-received";

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Welcome to LoisBanks Beauty ✨",
    react: WelcomeEmail({ name }),
  });
}

export async function sendOrderConfirmationEmail({
  to,
  name,
  orderReference,
  items,
  totalAmount,
  shippingAddress,
}: {
  to: string;
  name: string;
  orderReference: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Order confirmed · ${orderReference}`,
    react: OrderConfirmationEmail({
      name,
      orderReference,
      items,
      totalAmount,
      shippingAddress,
    }),
  });
}

export async function sendNewProductEmail({
  to,
  productName,
  productImage,
  productSlug,
  price,
}: {
  to: string;
  productName: string;
  productImage?: string;
  productSlug: string;
  price: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `New drop: ${productName}`,
    react: NewProductEmail({
      productName,
      productImage,
      productSlug,
      price,
    }),
  });
}

export async function sendOrderReceivedEmail({
  to,
  name,
  orderReference,
  items,
  totalAmount,
}: {
  to: string;
  name: string;
  orderReference: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Order received · ${orderReference}`,
    react: OrderReceivedEmail({
      name,
      orderReference,
      items,
      totalAmount,
    }),
  });
}