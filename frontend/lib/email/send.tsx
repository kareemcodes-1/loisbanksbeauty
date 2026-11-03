import "server-only";

import { render } from "@react-email/render";
import { sendEmail } from "./zeptomail";
import type { CurrencyCode } from "@/lib/currency";
import WelcomeEmail from "@/app/components/emails/welcome";
import PasswordResetEmail from "@/app/components/emails/password-reset";
import ContactEnquiryEmail from "@/app/components/emails/contact-enquiry";
import EmailVerificationEmail from "@/app/components/emails/email-verification";

import NewOrderEmail from "@/app/components/emails/new-order";
import { priceFormatter } from "../priceFormatter";
import OrderReceivedEmail from "@/app/components/emails/order-received";

export async function sendWelcomeEmail(to: string, name: string) {
  const html = await render(<WelcomeEmail name={name} />);
  await sendEmail({
    to,
    subject: "Welcome to LoisBanks Beauty",
    html,
  });
}

export async function sendOrderReceivedEmail(props: {
  to: string;
  orderId: string;
  reference?: string | null;
  customerName: string; // first name
  items: {
    name: string;
    price: number;
    quantity: number;
    size?: string | null;
  }[];
  totalAmount: number;
  paymentMethod?: string | null;
  currency?: CurrencyCode;
  isGuest: boolean;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  // Same reference the customer sees on the success page
  const reference =
    props.reference || props.orderId.slice(-8).toUpperCase();

  const html = await render(
    <OrderReceivedEmail
      reference={reference}
      customerName={props.customerName}
      customerEmail={props.to}
      items={props.items}
      totalAmount={props.totalAmount}
      paymentMethod={props.paymentMethod}
      currency={props.currency}
      isGuest={props.isGuest}
      ordersUrl={`${appUrl}/orders`}
      registerUrl={`${appUrl}/register?callbackUrl=${encodeURIComponent("/orders")}`}
    />
  );

  await sendEmail({
    to: props.to,
    subject: `We received your order #${reference}`,
    html,
  });
}

export async function sendEmailVerificationEmail(
  to: string,
  name: string,
  code: string
) {
  const html = await render(
    <EmailVerificationEmail
      name={name}
      code={code}
    />
  );

  await sendEmail({
    to,
    subject: `${code} is your LoisBanks Beauty verification code`,
    html,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  const html = await render(
    <PasswordResetEmail name={name} resetUrl={resetUrl} />
  );
  await sendEmail({
    to,
    subject: "Reset your LoisBanks Beauty password",
    html,
  });
}


export async function sendContactEnquiryEmail(props: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const html = await render(
    <ContactEnquiryEmail
      name={props.name}
      email={props.email}
      subject={props.subject}
      message={props.message}
    />
  );

  const receiver =
    process.env.ADMIN_EMAIL || "lbanksluxuryhairs@gmail.com";

  await sendEmail({
    to: receiver,
    subject: `New enquiry: ${props.subject}`,
    html,
    replyTo: props.email,
    // If your sendEmail supports reply-to, pass props.email here
  });
}

export async function sendNewOrderEmail(props: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    size?: string | null;
  }[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentChannel?: string | null;
  shippingMethod: "pickup" | "delivery";
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}) {
  const html = await render(
    <NewOrderEmail {...props} />
  );

  const receiver =
    process.env.ADMIN_EMAIL ||
    "lbanksluxuryhairs@gmail.com";

  await sendEmail({
    to: receiver,
    subject: `New order #${props.orderId} — ${priceFormatter(props.totalAmount)}`,
    html,
  });
}