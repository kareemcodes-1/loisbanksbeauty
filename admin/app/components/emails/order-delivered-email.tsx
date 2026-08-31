import { Button, Heading, Section, Text } from "@react-email/components";
import EmailLayout from "./email-layout";

type Props = {
  name: string;
  orderReference: string;
  shippingMethod: "pickup" | "delivery";
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://loisbanksbeauty.com";

export default function OrderDeliveredEmail({
  name,
  orderReference,
  shippingMethod,
}: Props) {
  return (
    <EmailLayout preview={`Your order #${orderReference} is complete`}>
      <Text className="m-0 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#FD3F92]">
        Completed
      </Text>

      <Heading className="mt-3 mb-0 text-center text-[24px] font-medium leading-tight text-black">
        Your order is complete
      </Heading>

      <Text className="mt-4 mb-0 text-center text-[15px] leading-relaxed text-black/60">
        Hi {name}, your order <strong>#{orderReference}</strong> has been
        {shippingMethod === "pickup"
          ? " successfully collected from our store."
          : " successfully delivered to you."}
      </Text>

      <Text className="mt-5 mb-0 text-center text-[15px] leading-relaxed text-black/60">
        Thank you for shopping with LoisBanks Beauty. We hope you love it.
      </Text>

      <Section className="mt-8 rounded-2xl bg-[#fafafa] px-5 py-4 text-center">
        <Text className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-black/40">
          Order Reference
        </Text>
        <Text className="mt-1 mb-0 font-mono text-[15px] font-medium tracking-wide text-black">
          {orderReference}
        </Text>
      </Section>

      <Text className="mt-8 mb-0 text-center text-[14px] leading-relaxed text-black/60">
        We’d love to hear what you think. Leave a quick review when you can.
      </Text>

      <Section className="mt-6 text-center">
        <Button
          href={`${APP_URL}/reviews/pending`}
          className="rounded-full bg-[#FD3F92] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-white no-underline"
        >
          Leave a Review
        </Button>
      </Section>

      <Section className="mt-4 text-center">
        <Button
          href={`${APP_URL}/orders`}
          className="rounded-full border border-black/15 bg-white px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-black no-underline"
        >
          View Order
        </Button>
      </Section>
    </EmailLayout>
  );
}