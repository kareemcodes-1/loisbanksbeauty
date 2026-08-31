import "server-only";

import { render } from "@react-email/render";
import { sendEmail } from "./zeptomail";

import WelcomeEmail from "@/app/components/emails/welcome";
import PasswordResetEmail from "@/app/components/emails/password-reset";
import ContactEnquiryEmail from "@/app/components/emails/contact-enquiry";
import EmailVerificationEmail from "@/app/components/emails/email-verification";

export async function sendWelcomeEmail(to: string, name: string) {
  const html = await render(<WelcomeEmail name={name} />);
  await sendEmail({
    to,
    subject: "Welcome to LoisBanks Beauty",
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
    process.env.CONTACT_RECEIVER_EMAIL || "lbanksluxuryhairs@gmail.com";

  await sendEmail({
    to: receiver,
    subject: `New enquiry: ${props.subject}`,
    html,
    replyTo: props.email,
    // If your sendEmail supports reply-to, pass props.email here
  });
}