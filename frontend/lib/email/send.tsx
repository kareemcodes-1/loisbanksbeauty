import "server-only";

import { render } from "@react-email/render";
import { sendEmail } from "./zeptomail";

import WelcomeEmail from "@/app/components/emails/welcome";
import PasswordResetEmail from "@/app/components/emails/password-reset";
import OrderConfirmedEmail from "@/app/components/emails/order-confirmed";
import OrderShippedEmail from "@/app/components/emails/order-shipped";
import OrderReadyForPickupEmail from "@/app/components/emails/order-ready-for-pickup-email";
import OrderDeliveredEmail from "@/app/components/emails/order-delivered-email";
import NewProductEmail from "@/app/components/emails/new-product";
import NewDiscountEmail from "@/app/components/emails/new-discount";
import ContactEnquiryEmail from "@/app/components/emails/contact-enquiry";

export async function sendWelcomeEmail(to: string, name: string) {
  const html = await render(<WelcomeEmail name={name} />);
  await sendEmail({
    to,
    subject: "Welcome to LoisBanks Beauty",
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

export async function sendOrderConfirmedEmail(
  to: string,
  name: string,
  orderReference: string
) {
  const html = await render(
    <OrderConfirmedEmail name={name} orderReference={orderReference} />
  );
  await sendEmail({
    to,
    subject: `Order confirmed #${orderReference}`,
    html,
  });
}

export async function sendOrderShippedEmail(
  to: string,
  name: string,
  orderReference: string,
  trackingUrl?: string
) {
  const html = await render(
    <OrderShippedEmail
      name={name}
      orderReference={orderReference}
      trackingUrl={trackingUrl}
    />
  );
  await sendEmail({
    to,
    subject: `Your order #${orderReference} has shipped`,
    html,
  });
}

export async function sendOrderReadyForPickupEmail(
  to: string,
  name: string,
  orderReference: string
) {
  const html = await render(
    <OrderReadyForPickupEmail name={name} orderReference={orderReference} />
  );
  await sendEmail({
    to,
    subject: `Order #${orderReference} is ready for pickup`,
    html,
  });
}

export async function sendOrderDeliveredEmail(
  to: string,
  name: string,
  orderReference: string
) {
  const html = await render(
    <OrderDeliveredEmail name={name} orderReference={orderReference} />
  );
  await sendEmail({
    to,
    subject: `Order #${orderReference} delivered`,
    html,
  });
}

export async function sendNewProductEmail(
  to: string,
  props: {
    productName: string;
    productImage?: string;
    productSlug: string;
    price: string;
  }
) {
  const html = await render(<NewProductEmail {...props} />);
  await sendEmail({
    to,
    subject: `New drop: ${props.productName}`,
    html,
  });
}

export async function sendNewDiscountEmail(
  to: string,
  props: {
    title: string;
    description: string;
    discountLabel: string;
    expiresAt?: string;
  }
) {
  const html = await render(<NewDiscountEmail {...props} />);
  await sendEmail({
    to,
    subject: `${props.discountLabel} — ${props.title}`,
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
    process.env.CONTACT_RECEIVER_EMAIL || "lbanksluxuryhairs@gmail.com";

  await sendEmail({
    to: receiver,
    subject: `New enquiry: ${props.subject}`,
    html,
    replyTo: props.email,
    // If your sendEmail supports reply-to, pass props.email here
  });
}