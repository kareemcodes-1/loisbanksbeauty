import { Button, Heading, Section, Text, Link } from "@react-email/components";
import EmailLayout from "./email-layout";

type Props = {
  name: string;
  orderReference: string;
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://loisbanksbeauty.com";

// Store details
const STORE_ADDRESS =
  "33a Sedona Mall, Opp Monty Suites, Adebayo Doherty Street, Lekki Phase 1, Lagos";
const STORE_HOURS = "Monday – Saturday | 9:00 AM – 6:00 PM";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=33a+Sedona+Mall+Adebayo+Doherty+Street+Lekki+Phase+1+Lagos";

export default function OrderReadyForPickupEmail({
  name,
  orderReference,
}: Props) {
  return (
    <EmailLayout preview={`Your order #${orderReference} is ready for pickup`}>
      <Text className="m-0 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#FD3F92]">
        Ready for Pickup
      </Text>

      <Heading className="mt-3 mb-0 text-center text-[24px] font-medium leading-tight text-black">
        Good news — your order is ready!
      </Heading>

      <Text className="mt-4 mb-0 text-center text-[15px] leading-relaxed text-black/60">
        Hi {name}, your order <strong>#{orderReference}</strong> is now ready
        for pickup at our store.
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

      {/* Store Details */}
      <Section className="mt-8 rounded-2xl border border-black/5 px-5 py-5">
        <Text className="m-0 text-[13px] font-medium uppercase tracking-[0.08em] text-black/50">
          Pickup Location
        </Text>

        <Text className="mt-3 mb-0 text-[14px] leading-relaxed text-black">
          {STORE_ADDRESS}
        </Text>

        <Text className="mt-3 mb-0 text-[14px] text-black/60">
          <strong>Opening Hours:</strong> {STORE_HOURS}
        </Text>

        <Text className="mt-4 mb-0">
          <Link
            href={MAPS_URL}
            className="text-[14px] font-medium text-[#FD3F92] underline"
          >
            View on Google Maps
          </Link>
        </Text>
      </Section>

      <Text className="mt-8 mb-0 text-center text-[14px] leading-relaxed text-black/60">
        Please bring a valid ID when collecting your order. We look forward to
        seeing you!
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