import EmailLayout, {
  EmailButton,
  EmailEyebrow,
  EmailHeading,
  EmailText,
} from "./email-layout";

type Props = {
  name: string;
  orderReference: string;
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://loisbanksbeauty.com";

export default function OrderOutForDeliveryEmail({
  name,
  orderReference,
}: Props) {
  return (
    <EmailLayout
      preview={`Your order #${orderReference} is out for delivery`}
    >
      <EmailEyebrow>Out for delivery</EmailEyebrow>
      <EmailHeading>Your order is on its way</EmailHeading>

      <EmailText center>
        Hi {name}, your order <strong>#{orderReference}</strong> is out for
        delivery and should arrive soon. Please keep your phone nearby in case
        the delivery agent needs to reach you.
      </EmailText>

      <EmailText center>
        We&apos;ll let you know once it has been delivered.
      </EmailText>

      <EmailButton href={`${APP_URL}/orders`}>View order</EmailButton>
    </EmailLayout>
  );
}