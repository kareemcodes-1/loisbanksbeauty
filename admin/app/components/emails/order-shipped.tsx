import { Button, Heading, Section, Text } from "@react-email/components";
import EmailLayout from "./email-layout";

type Props = {
  name: string;
  orderReference: string;
  trackingUrl?: string;
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://loisbanksbeauty.com";

export default function OrderShippedEmail({
  name,
  orderReference,
  trackingUrl,
}: Props) {
  return (
    <EmailLayout preview={`Your order #${orderReference} has been shipped`}>
      <Text className="m-0 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#FD3F92]">
        Shipped
      </Text>

      <Heading className="mt-3 mb-0 text-center text-[24px] font-medium leading-tight text-black">
        Your order is on the way
      </Heading>

      <Text className="mt-4 mb-0 text-center text-[15px] leading-relaxed text-black/60">
        Hi {name}, good news — your order <strong>#{orderReference}</strong> has
        been shipped and is on its way to your delivery address.
      </Text>

      <Section className="mt-8 rounded-2xl bg-[#fafafa] px-5 py-4 text-center">
        <Text className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-black/40">
          Order Reference
        </Text>
        <Text className="mt-1 mb-0 font-mono text-[15px] font-medium tracking-wide text-black">
          {orderReference}
        </Text>
      </Section>

      <Text className="mt-8 mb-0 text-center text-[15px] leading-relaxed text-black/60">
        We will notify you once your package has been delivered. Thank you for
        shopping with LoisBanks Beauty.
      </Text>

      <Section className="mt-8 text-center">
        {trackingUrl ? (
          <Button
            href={trackingUrl}
            className="rounded-full bg-[#FD3F92] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-white no-underline"
          >
            Track Package
          </Button>
        ) : (
          <Button
            href={`${APP_URL}/orders`}
            className="rounded-full bg-[#FD3F92] px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-white no-underline"
          >
            View Order
          </Button>
        )}
      </Section>
    </EmailLayout>
  );
}