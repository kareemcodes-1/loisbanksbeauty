import { Button, Heading, Section, Text } from "@react-email/components";
import EmailLayout from "./email-layout";

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
      <Text className="m-0 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#FD3F92]">
        Out for Delivery
      </Text>

      <Heading className="mt-3 mb-0 text-center text-[24px] font-medium leading-tight text-black">
        Your order is out for delivery
      </Heading>

      <Text className="mt-4 mb-0 text-center text-[15px] leading-relaxed text-black/60">
        Hi {name}, your order <strong>#{orderReference}</strong> is now out for
        delivery and is on its way to you.
      </Text>

      <Text className="mt-5 mb-0 text-center text-[15px] leading-relaxed text-black/60">
        Please keep your phone available in case the delivery agent needs to
        contact you.
      </Text>

      {/* Order Reference */}
      <Section className="mt-8 rounded-2xl bg-[#fafafa] px-5 py-4 text-center">
        <Text className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-black/40">
          Order Reference
        </Text>

        <Text className="mt-1 mb-0 font-mono text-[15px] font-medium tracking-wide text-black">
          {orderReference}
        </Text>
      </Section>

      <Text className="mt-8 mb-0 text-center text-[14px] leading-relaxed text-black/60">
        Your order should arrive soon. We’ll let you know once your order has
        been successfully delivered.
      </Text>

      <Section className="mt-8 text-center">
        <Button
          href={`${APP_URL}/orders`}
          className="rounded-full bg-[#FD3F92] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-white no-underline"
        >
          View Order
        </Button>
      </Section>
    </EmailLayout>
  );
}